# Get Execution Context Info ノード

## 概要

Get Execution Context Infoノードは、PCGグラフの実行コンテキストに関する情報（エディタ実行か、ランタイム実行か、パーティション化されているかなど）を取得し、boolean値としてアトリビュートセットに出力します。このノードを使用することで、実行環境に応じた条件分岐や動作の変更が可能になります。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetExecutionContext.h`

**カテゴリ**: Generic (汎用)

**キャッシュ**: 不可（実行コンテキストは動的に変化するため）

## 機能詳細

このノードは以下の実行コンテキスト情報を取得できます:

1. **エディタ/ランタイム判定**: エディタ環境か実行時環境かを判別
2. **オリジナル/ローカル判定**: パーティション化の状態を確認
3. **パーティション化判定**: コンポーネントがパーティション化されているかを確認
4. **ランタイム生成判定**: ランタイム生成モードかを判別
5. **サーバー判定**: デディケイテッドサーバー上で実行されているかを確認
6. **権限判定**: ネットワーク権限を持っているかを確認

## プロパティ

### UPCGGetExecutionContextSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **Mode** | EPCGGetExecutionContextMode | IsRuntime | 取得する情報の種類 |

#### EPCGGetExecutionContextMode 列挙型

| 値 | 説明 |
|----|------|
| **IsEditor** | エディタ内（PIEではない）での実行かどうかを返す |
| **IsRuntime** | ランタイム環境（PIEまたはビルド済みゲーム）での実行かどうかを返す |
| **IsOriginal** | 実行コンテキストがオリジナル（パーティション化されていない）かどうかを返す |
| **IsLocal** | 実行コンテキストがパーティション化されているかどうかを返す |
| **IsPartitioned** | 実行コンテキストがオリジナルでありパーティション化されているかどうかを返す |
| **IsRuntimeGeneration** | ランタイム生成を行っているかどうかを返す |
| **IsDedicatedServer** | デディケイテッドサーバー上で実行されているかどうかを返す |
| **HasAuthority** | ネットワーク権限を持って実行されているかどうかを返す |

### ピン設定

#### 入力ピン
- なし（入力データを必要としない）

#### 出力ピン
- **Out**: `EPCGDataType::Param` - boolean値を含むパラメータデータ（アトリビュート名: "Info"）

### UI設定

- **HasFlippedTitleLines**: true（ノードタイトルの表示が反転）
- **AdditionalTitleInformation**: 選択されたモードを表示（例: "Get IsRuntime"）

## 使用例

### エディタ/ランタイム分岐

```
[Get Execution Context Info: IsRuntime]
            ↓
      [Branch Node]
      ↙        ↘
Runtime用    Editor用
高速処理    デバッグ表示
```

### パーティション化の確認

```cpp
// Mode: IsPartitioned
// 出力: パーティション化されている場合 true、それ以外 false

// 用途例:
// - パーティション化されている場合のみ特定の最適化を適用
// - ローカルコンポーネントで異なる処理を実行
```

### マルチプレイヤー対応

```
[Get Execution Context Info: HasAuthority]
            ↓
      [Branch Node]
      ↙        ↘
Authority:    Client:
スポーン処理   視覚効果のみ
```

### デディケイテッドサーバー判定

```cpp
// Mode: IsDedicatedServer
// 出力: デディケイテッドサーバーの場合 true

// 用途例:
// - サーバーでは視覚効果を省略
// - クライアントでのみ詳細なメッシュを生成
```

## 実装の詳細

### ExecuteInternal メソッド

```cpp
bool FPCGGetExecutionContextElement::ExecuteInternal(FPCGContext* Context) const
{
    const EPCGGetExecutionContextMode Mode = Settings->Mode;

    const IPCGGraphExecutionSource* ExecutionSource = Context->ExecutionSource.Get();
    const UPCGComponent* SourceComponent = Cast<UPCGComponent>(ExecutionSource);
    const UWorld* SupportingWorld = ExecutionSource ?
        ExecutionSource->GetExecutionState().GetWorld() : nullptr;

    bool Value = false;

    switch (Mode)
    {
    case EPCGGetExecutionContextMode::IsEditor:
    case EPCGGetExecutionContextMode::IsRuntime:
        {
            const bool bIsRuntime = (SupportingWorld && SupportingWorld->IsGameWorld()) ||
                                   PCGHelpers::IsRuntimeGeneration(ExecutionSource);
            Value = (bIsRuntime == (Mode == EPCGGetExecutionContextMode::IsRuntime));
        }
        break;

    case EPCGGetExecutionContextMode::IsOriginal:
    case EPCGGetExecutionContextMode::IsLocal:
        Value = SourceComponent &&
                (SourceComponent->IsLocalComponent() == (Mode == EPCGGetExecutionContextMode::IsLocal));
        break;

    case EPCGGetExecutionContextMode::IsPartitioned:
        Value = SourceComponent && SourceComponent->IsPartitioned();
        break;

    case EPCGGetExecutionContextMode::IsRuntimeGeneration:
        Value = PCGHelpers::IsRuntimeGeneration(ExecutionSource);
        break;

    case EPCGGetExecutionContextMode::IsDedicatedServer:
        Value = SupportingWorld && SupportingWorld->IsNetMode(NM_DedicatedServer);
        break;

    case EPCGGetExecutionContextMode::HasAuthority:
        Value = ExecutionSource && ExecutionSource->GetExecutionState().HasAuthority();
        break;
    }

    // boolean型のアトリビュートとして出力
    FPCGMetadataAttribute<bool>* Attribute = ParamData->Metadata->CreateAttribute<bool>(
        "Info", Value, /*bAllowInterpolation=*/false, /*bOverrideParent=*/false);

    return true;
}
```

### 判定ロジック

| モード | 判定条件 | 用途 |
|-------|---------|------|
| IsEditor | ゲームワールドでない & ランタイム生成でない | エディタ専用機能の有効化 |
| IsRuntime | ゲームワールドまたはランタイム生成 | ランタイム最適化の適用 |
| IsOriginal | ローカルコンポーネントでない | オリジナルコンポーネント専用処理 |
| IsLocal | ローカルコンポーネント | パーティション化されたコンポーネント処理 |
| IsPartitioned | パーティション化設定が有効 | パーティション対応処理の有効化 |
| IsRuntimeGeneration | ランタイム生成モード | 動的生成時の特別な処理 |
| IsDedicatedServer | デディケイテッドサーバーモード | サーバー専用/クライアント専用処理 |
| HasAuthority | ネットワーク権限あり | サーバー側の処理実行判定 |

## パフォーマンス考慮事項

### 最適化のポイント

1. **軽量クエリ**: 実行コンテキストの情報取得は非常に高速
2. **キャッシュ不可**: 実行環境により結果が変わるため、キャッシュは無効
3. **条件分岐に最適**: Branch/Selectノードとの組み合わせで効率的な処理分岐が可能

### パフォーマンスへの影響

- **処理時間**: 最小限（O(1)クエリ）
- **メモリ使用**: 非常に少ない（boolean値1つ）

### ベストプラクティス

1. **早期分岐**: グラフの早い段階で実行環境を判定し、不要な処理をスキップ
2. **適切なモード選択**: 目的に応じた適切なモードを使用
3. **組み合わせ使用**: 複数の条件を組み合わせる場合は、Boolean Opノードを使用

## 関連ノード

- **Get Loop Index**: ループのインデックス情報を取得
- **Get Subgraph Depth**: サブグラフの深度情報を取得
- **Branch**: boolean値に基づく条件分岐
- **Boolean Select**: boolean値に基づくデータ選択
- **Quality Branch/Select**: 実行時品質レベルに基づく分岐

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **キャッシュ不可**: このノードの結果はキャッシュされないため、毎回実行されます
2. **実行環境依存**: 結果は実行環境によって変わるため、テスト時は注意が必要
3. **ネットワーク考慮**: マルチプレイヤーゲームでは HasAuthority や IsDedicatedServer を適切に使用
4. **PIEとスタンドアロン**: PIE（Play In Editor）とスタンドアロンゲームで結果が異なる場合があります

## トラブルシューティング

### よくある問題

**問題**: エディタで IsRuntime が false になる
- **解決策**: これは正常です。PIEで実行すると true になります

**問題**: パーティション化の判定が期待と異なる
- **解決策**: PCGコンポーネントのパーティション設定を確認してください

**問題**: マルチプレイヤーで HasAuthority が想定外の結果
- **解決策**: サーバー/クライアントの実行箇所を確認し、ネットワークロールを検証

## 実用例

### エディタでのデバッグ表示

```
[Get Execution Context Info: IsEditor]
            ↓
      [Branch Node]
      ↙        ↘
Editor:      Runtime:
Debug表示    通常処理
```

### パフォーマンス最適化

```
[Get Execution Context Info: IsRuntimeGeneration]
            ↓
      [Branch Node]
      ↙        ↘
Runtime:         Editor:
簡略化メッシュ   詳細メッシュ
```

### ネットワークゲーム対応

```
[Get Execution Context Info: HasAuthority]
            ↓
      [Branch Node]
      ↙        ↘
Authority:       Client:
アクター生成     プロキシ表示のみ
```
