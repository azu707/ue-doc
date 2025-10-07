# Wait Until Landscape Is Ready ノード

## 概要

Wait Until Landscape Is Readyノードは、シーン内のすべてのランドスケープの更新が完了するまで待機し、完了後にデータを下流に転送します。ランドスケープデータに依存する処理を確実に実行するために使用されます。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Landscape/PCGWaitLandscapeReady.h`
**カテゴリ**: Generic (汎用)
**キャッシュ**: 不可（ランドスケープの状態に依存）

## 機能詳細

1. **ランドスケープ検出**: シーン内のすべてのランドスケープを自動検出
2. **準備完了待機**: 各ランドスケープの `IsUpToDate()` をチェック
3. **非ブロッキング**: 他のタスクをブロックせずに待機
4. **データ転送**: ランドスケープ準備完了後、入力データを出力に転送
5. **キャンセル対応**: 中断された場合の適切な処理

## プロパティ

### UPCGWaitLandscapeReadySettings

このノードには設定可能なプロパティはありません。動作は完全に自動化されています。

### FPCGWaitLandscapeReadyElementContext

内部コンテキスト:

```cpp
struct FPCGWaitLandscapeReadyElementContext : public FPCGContext
{
    bool bLandscapeQueryDone = false;        // ランドスケープ検索完了フラグ
    bool bLandscapeReady = false;            // ランドスケープ準備完了フラグ
    TArray<TWeakObjectPtr<ALandscape>> Landscapes; // 検出されたランドスケープ
};
```

### ピン設定

#### 入力ピン
- **In** (動的): `EPCGDataType::Any` - 任意のデータ（必須）

#### 出力ピン
- **Out**: `EPCGDataType::Any` - 入力データをそのまま転送

## 使用例

### ランドスケープサンプリング前の待機

```
[任意のデータソース]
    ↓
[Wait Until Landscape Is Ready]
    ↓
[Get Landscape Data] → 確実にランドスケープが準備完了
```

### ランドスケープ依存処理の保証

```
[PCG Component Start]
    ↓
[Wait Until Landscape Is Ready]
    ↓
[Surface Sampler: ランドスケープ]
    ↓
[処理続行]
```

### 複数のランドスケープ依存処理

```
[Wait Until Landscape Is Ready]
    ↓
[Gather]
  ├→ [Get Landscape Data]
  ├→ [Sample Texture: ランドスケープテクスチャ]
  └→ [World Ray Hit: ランドスケープコリジョン]
```

## 実装の詳細

### ExecuteInternal メソッド

```cpp
bool FPCGWaitLandscapeReadyElement::ExecuteInternal(FPCGContext* InContext) const
{
    FPCGWaitLandscapeReadyElementContext* Context =
        static_cast<FPCGWaitLandscapeReadyElementContext*>(InContext);
    const UPCGWaitLandscapeReadySettings* Settings = Context->GetInputSettings<UPCGWaitLandscapeReadySettings>();

    // フェーズ1: ランドスケープの検出（初回のみ）
    if (!Context->bLandscapeQueryDone)
    {
        TRACE_CPUPROFILER_EVENT_SCOPE(LandscapeQuery);
        Context->bLandscapeQueryDone = true;

        // ワールド内のすべてのランドスケープを検索
        FPCGActorSelectorSettings ActorSelector;
        ActorSelector.ActorFilter = EPCGActorFilter::AllWorldActors;
        ActorSelector.ActorSelection = EPCGActorSelection::ByClass;
        ActorSelector.ActorSelectionClass = ALandscapeProxy::StaticClass();
        ActorSelector.bSelectMultiple = true;

        auto BoundsCheck = [](const AActor*) -> bool { return true; };
        auto SelfIgnoreCheck = [](const AActor*) -> bool { return true; };

        const UPCGComponent* SourceComponent = Cast<UPCGComponent>(Context->ExecutionSource.Get());
        TArray<AActor*> FoundLandscapeProxies = PCGActorSelector::FindActors(
            ActorSelector, SourceComponent, BoundsCheck, SelfIgnoreCheck);

        // ランドスケーププロキシからランドスケープアクターを取得
        for (AActor* Proxy : FoundLandscapeProxies)
        {
            if (ALandscapeProxy* LandscapeProxy = Cast<ALandscapeProxy>(Proxy))
            {
                TWeakObjectPtr<ALandscape> Landscape(LandscapeProxy->GetLandscapeActor());
                Context->Landscapes.AddUnique(Landscape);
            }
        }
    }

    // フェーズ2: ランドスケープの準備完了チェック
    if (!Context->bLandscapeReady)
    {
        TRACE_CPUPROFILER_EVENT_SCOPE(CheckingIfLandscapeAreReady);

        bool bAllLandscapesAreReady = true;
        for (const TWeakObjectPtr<ALandscape>& Landscape : Context->Landscapes)
        {
            if (Landscape.IsValid() && !Landscape->IsUpToDate())
            {
                // まだ準備完了していないランドスケープがある
                bAllLandscapesAreReady = false;
                break;
            }
        }

        if (bAllLandscapesAreReady)
        {
            Context->bLandscapeReady = true;
        }
    }

    // フェーズ3: 完了またはキャンセル処理
    if (Context->bLandscapeReady || Context->OutputData.bCancelExecution)
    {
        TRACE_CPUPROFILER_EVENT_SCOPE(FinalizeExecution);
        // 入力を出力に転送
        Context->OutputData = Context->InputData;
        return true;
    }

    // フェーズ4: 次フレームで再チェックをスケジュール
    Context->bIsPaused = true;

    Context->ScheduleGeneric(FPCGScheduleGenericParams(
        [ContextHandle = Context->GetOrCreateHandle()](FPCGContext*)
        {
            // 通常実行: コンテキストを再開
            FPCGContext::FSharedContext<FPCGWaitLandscapeReadyElementContext> SharedContext(ContextHandle);
            if (FPCGWaitLandscapeReadyElementContext* ContextPtr = SharedContext.Get())
            {
                ContextPtr->bIsPaused = false;
            }
            return true;
        },
        [ContextHandle = Context->GetOrCreateHandle()](FPCGContext*)
        {
            // 中断時: コンテキストを再開してキャンセル
            FPCGContext::FSharedContext<FPCGWaitLandscapeReadyElementContext> SharedContext(ContextHandle);
            if (FPCGWaitLandscapeReadyElementContext* ContextPtr = SharedContext.Get())
            {
                ContextPtr->bIsPaused = false;
                ContextPtr->OutputData.bCancelExecution = true;
            }
        },
        Context->ExecutionSource.Get(),
        {}));

    return false; // 継続実行
}
```

### 実行フロー

```
1. 初回実行: ランドスケープの検出
   └→ ALandscapeProxyをワールドから検索
   └→ 各プロキシからALandscapeを取得
   └→ リストに保存

2. 準備完了チェック（毎フレーム）
   └→ 各ランドスケープの IsUpToDate() をチェック
   └→ すべて準備完了なら次へ
   └→ 未完了なら次フレームで再チェック

3. 完了処理
   └→ 入力データを出力に転送
   └→ 実行完了
```

## パフォーマンス考慮事項

### 最適化のポイント

1. **一度だけ検索**: ランドスケープの検索は初回のみ
2. **効率的なチェック**: `IsUpToDate()` は軽量なチェック
3. **非ブロッキング**: 他のPCGタスクをブロックしない

### パフォーマンスへの影響

- **初回実行**: ワールドアクター検索のコスト（中程度）
- **待機中**: 軽量なステータスチェックのみ
- **メモリ使用**: 最小限（ランドスケープへの弱参照のみ）

### ベストプラクティス

1. **適切な配置**: ランドスケープデータを使用する前に配置
2. **過度な使用を避ける**: 複数のブランチで重複して使用しない
3. **早期配置**: グラフの早い段階で待機を完了

## 関連ノード

- **Get Landscape Data**: ランドスケープデータの取得
- **Wait**: 汎用的な待機ノード
- **Get Actor Data**: アクターデータの取得
- **Surface Sampler**: サーフェスのサンプリング

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **メインスレッド実行**: `CanExecuteOnlyOnMainThread` が true
2. **キャッシュ不可**: ランドスケープの状態に依存するため、キャッシュ不可
3. **動的ピン**: 任意のデータを通過させることが可能
4. **ランドスケープなし**: ランドスケープが存在しない場合、即座に完了

## トラブルシューティング

**問題**: ランドスケープが見つからない
**解決策**: ワールドにランドスケープが配置されているか確認。ランドスケーププロキシではなくランドスケープアクターが必要

**問題**: 待機が終了しない
**解決策**: ランドスケープの更新が完了しているか確認。エディタでランドスケープの編集中は `IsUpToDate()` が false を返し続ける可能性があります

**問題**: パフォーマンスへの影響
**解決策**: このノードはグラフ内で一度だけ使用し、結果を下流の複数のノードで共有してください

## 実用例

### ランドスケープベースの植生配置

```
[PCG Component Init]
    ↓
[Wait Until Landscape Is Ready]
    ↓
[Get Landscape Data]
    ↓
[Density Filter: Slope < 30°]
    ↓
[Static Mesh Spawner: Trees]
```

### ランドスケープテクスチャのサンプリング

```
[Wait Until Landscape Is Ready]
    ↓
[Surface Sampler]
    ↓
[Get Texture Data: ランドスケープテクスチャ]
    ↓
[Density Remap: テクスチャ値に基づく]
```

### 複数のランドスケープ依存処理

```
[Wait Until Landscape Is Ready]
    ↓
[Gather] → 複数の処理に分岐
  ├→ [Get Landscape Data: 高度情報]
  ├→ [Get Texture Data: バイオームマップ]
  └→ [World Ray Hit: 地形コリジョン]
```

### ランタイム生成での使用

```
[Runtime: Landscape Modification]
    ↓
[Trigger PCG Refresh]
    ↓
[Wait Until Landscape Is Ready] → ランドスケープ更新完了まで待機
    ↓
[Update Procedural Content]
```

## ランドスケープの更新状態

ランドスケープが `IsUpToDate() == false` を返す状況:
- ランドスケープの編集中（スカルプト、ペイント）
- ランドスケープコンポーネントの再計算中
- LOD遷移の処理中
- マテリアルパラメータの更新中

すべての更新が完了すると `IsUpToDate() == true` を返し、このノードは実行を完了します。
