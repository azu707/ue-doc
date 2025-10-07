# Get Landscape Data

## 概要

Get Landscape Dataノードは、選択されたアクターからランドスケープデータのコレクションを構築するための専用ノードです。複数のランドスケーププロキシを単一のUPCGLandscapeDataとして統合し、高さ情報やレイヤーウェイトなどのランドスケープ属性を効率的にサンプリングできるようにします。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetLandscapeSettings`
**エレメント**: `FPCGGetLandscapeDataElement`
**基底クラス**: `UPCGDataFromActorSettings`

## 機能詳細

このノードは、ワールド内のランドスケープアクターを検索し、それらを単一の統合されたランドスケープデータとして扱います。主な特徴:

1. **複数ランドスケープの統合**: 複数のランドスケーププロキシを1つのデータとして管理
2. **高さ情報の取得**: ランドスケープの高さマップデータを取得
3. **レイヤーウェイトの取得**: ペイントレイヤーのウェイト情報を取得
4. **バウンド管理**: エディタでの最適化のための境界設定
5. **キャッシュ対応**: ランドスケープキャッシュを利用した効率的なアクセス

## プロパティ

### SamplingProperties (FPCGLandscapeDataProps)
ランドスケープデータのサンプリング設定を定義します。
- **型**: `FPCGLandscapeDataProps`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **ShowOnlyInnerProperties**: はい

#### FPCGLandscapeDataPropsの主要プロパティ:
- **bGetHeightOnly**: 高さ情報のみを取得（レイヤーウェイトをスキップ）
- **bGetLayerWeights**: レイヤーウェイト情報を取得

### bUnbounded (bool) [エディタ専用]
交差するランドスケープバウンドを使用してランドスケープキャッシュを準備するか、PCGコンポーネントのグリッドバウンドを使用するかを決定します。
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **エディタ専用**: はい

### 非推奨プロパティ

以下のプロパティは非推奨です（SamplingPropertiesに統合されました）:
- `bGetHeightOnly_DEPRECATED`
- `bGetLayerWeights_DEPRECATED`

## 使用例

### 例1: 全ワールドのランドスケープデータを取得（デフォルト設定）
```
Get Landscape Data (デフォルト設定):
  ActorSelector.ActorFilter = AllWorldActors
  ActorSelector.bMustOverlapSelf = true
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = ALandscapeProxy
  SamplingProperties.bGetHeightOnly = false
  SamplingProperties.bGetLayerWeights = true
```

### 例2: 高さ情報のみを取得（パフォーマンス最適化）
```
Get Landscape Data:
  SamplingProperties.bGetHeightOnly = true
  SamplingProperties.bGetLayerWeights = false
```

### 例3: 特定の領域のランドスケープを取得
```
Get Landscape Data:
  ActorSelector.bMustOverlapSelf = true
  bUnbounded = false
  → PCGコンポーネントのグリッドバウンド内のランドスケープのみを対象
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (Landscape)**: ランドスケープデータ
  - **型**: `EPCGDataType::Landscape`
  - **複数接続**: 可能
  - **複数データ**: 不可（統合された単一データ）

### データフィルター
```cpp
virtual EPCGDataType GetDataFilter() const override { return EPCGDataType::Landscape; }
```

### コンストラクタでの初期化

新しく配置されたノードには以下のデフォルト設定が適用されます:

```cpp
UPCGGetLandscapeSettings::UPCGGetLandscapeSettings()
{
    Mode = EPCGGetDataFromActorMode::ParseActorComponents;
    ActorSelector.bShowActorFilter = false;
    ActorSelector.bIncludeChildren = false;
    ActorSelector.bShowActorSelectionClass = false;
    ActorSelector.bSelectMultiple = true;
    ActorSelector.bShowSelectMultiple = false;

    // 新しいオブジェクトの場合
    ActorSelector.ActorFilter = EPCGActorFilter::AllWorldActors;
    ActorSelector.bMustOverlapSelf = true;
    ActorSelector.ActorSelection = EPCGActorSelection::ByClass;
    ActorSelector.ActorSelectionClass = ALandscapeProxy::StaticClass();
}
```

### ProcessActors の実装

FPCGGetLandscapeDataElementは、基底クラスと異なる処理を行います:

```cpp
void FPCGGetLandscapeDataElement::ProcessActors(
    FPCGContext* Context,
    const UPCGDataFromActorSettings* InSettings,
    const TArray<AActor*>& FoundActors,
    TArray<FPCGTaskId>& OutDynamicDependencies) const
{
    // 各アクターを個別に処理するのではなく、
    // すべてのランドスケーププロキシを収集して
    // 単一のUPCGLandscapeDataを作成

    TArray<TWeakObjectPtr<ALandscapeProxy>> Landscapes;
    FBox LandscapeBounds(EForceInit::ForceInit);

    // FoundActorsからランドスケープを収集
    // UPCGComponent::GetLandscapeDataと同様の処理を実行
}
```

### ランドスケープキャッシュとの連携

このノードは、PCGランドスケープキャッシュシステムと連携して動作します:

1. **キャッシュ準備**: ランドスケープデータの準備時にキャッシュをウォームアップ
2. **動的依存関係**: ランドスケープデータの読み込みが完了するまで待機
3. **バウンド最適化**: `bUnbounded`設定に基づいてキャッシュ範囲を最適化

### アクターセレクターのデフォルト動作

```cpp
virtual TSubclassOf<AActor> GetDefaultActorSelectorClass() const override
{
    return ALandscapeProxy::StaticClass();
}
```

### モード設定の非表示

```cpp
#if WITH_EDITOR
virtual bool DisplayModeSettings() const override { return false; }
#endif
```
このノードでは、常に`ParseActorComponents`モードを使用するため、モード選択UIは非表示になります。

### PostLoadでの移行処理

```cpp
void UPCGGetLandscapeSettings::PostLoad()
{
    Super::PostLoad();

#if WITH_EDITOR
    // 非推奨プロパティからの移行
    if (bGetHeightOnly_DEPRECATED)
    {
        SamplingProperties.bGetHeightOnly = bGetHeightOnly_DEPRECATED;
        bGetHeightOnly_DEPRECATED = false;
    }

    if (!bGetLayerWeights_DEPRECATED)
    {
        SamplingProperties.bGetLayerWeights = bGetLayerWeights_DEPRECATED;
        bGetLayerWeights_DEPRECATED = true;
    }
#endif
}
```

### パフォーマンス考慮事項

1. **レイヤーウェイトの取得**: 多くのペイントレイヤーがある場合、`bGetLayerWeights = false`に設定することでパフォーマンスが向上
2. **バウンド制限**: `bUnbounded = false`に設定すると、必要な領域のみのキャッシュを準備
3. **キャッシュの再利用**: 同じランドスケープを複数のPCGグラフで使用する場合、キャッシュが共有される

### 出力データ形式

出力される`UPCGLandscapeData`には以下の情報が含まれます:

- **Transform**: ランドスケープのワールド変換
- **Bounds**: 統合されたランドスケープのバウンド
- **Height Data**: 各ポイントの高さ情報
- **Layer Weights**: 各ペイントレイヤーのウェイト値（有効な場合）
- **Metadata**: ランドスケープ属性のメタデータ

## 関連ノード
- Get Actor Data (基底クラス)
- Wait Landscape Ready (ランドスケープの準備待機)
- Landscape Sampler (ランドスケープデータのサンプリング)
- Surface Sampler (サーフェスとしてのサンプリング)
