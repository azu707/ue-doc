# Proxy (Indirection) ノード

## 概要

Proxy (Indirection)ノードは、別の設定オブジェクトを動的に実行する間接実行ノードです。ネイティブエレメント、ブループリントエレメント、または任意の設定オブジェクトを指定でき、そのピン構成を継承して実行時に処理を切り替えることができます。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGIndirectionElement.h`
**カテゴリ**: Generic (汎用)
**キャッシュ**: 不可（動的な実行のため）

## 機能詳細

1. **動的実行**: 実行時に別の設定オブジェクトを実行
2. **ピン継承**: 指定された設定のピン構成を継承
3. **オーバーライド**: 設定をオーバーライドパラメータで上書き可能
4. **3つのモード**: ネイティブエレメント、ブループリントエレメント、カスタム設定
5. **動的トラッキング**: 依存関係の動的な追跡をサポート
6. **GPU対応**: GPU常駐データをサポート

## プロパティ

### UPCGIndirectionSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **ProxyInterfaceMode** | EPCGProxyInterfaceMode | BySettings | ピン構成の定義方法 |
| **SettingsClass** | TSubclassOf\<UPCGSettings\> | nullptr | ByNativeElement時の設定クラス |
| **BlueprintElementClass** | TSubclassOf\<UPCGBlueprintElement\> | nullptr | ByBlueprintElement時のBPクラス |
| **Settings** | UPCGSettings* | nullptr | 実行する設定オブジェクト |
| **bTagOutputsBasedOnOutputPins** | bool | true | 出力ピンに基づいてタグ付けするか |

### EPCGProxyInterfaceMode 列挙型

| 値 | 説明 |
|----|------|
| **ByNativeElement** | ネイティブエレメントを選択してピンを定義 |
| **ByBlueprintElement** | カスタムブループリントエレメントを選択してピンを定義 |
| **BySettings** | ユーザー定義設定がピンを定義 |

### ピン設定

- **入力/出力ピン**: 選択されたモードと設定により動的に決定
- 設定が無効な場合はデフォルトの入出力ピンを使用

### UI設定

- **HasFlippedTitleLines**: true
- **AdditionalTitleInformation**: 選択された設定/エレメントの名前を表示

## 使用例

### ネイティブエレメントの動的実行

```
[Data Input]
    ↓
[Proxy: ByNativeElement]
- SettingsClass: UPCGDensityFilterSettings
- Settings: カスタムパラメータ
    ↓
[Density Filter実行]
```

### ブループリントエレメントの実行

```
[Point Data]
    ↓
[Proxy: ByBlueprintElement]
- BlueprintElementClass: BP_CustomProcessing
- Settings: 実行時にオーバーライド
    ↓
[BP処理実行]
```

### 条件付き処理の切り替え

```
[Branch]
  ↙        ↘
Proxy:     Proxy:
Settings A  Settings B
(高品質)   (低品質)
```

### 設定のオーバーライド例

```cpp
// 基本設定を定義
UPCGDensityFilterSettings* BaseSettings = ...;

// Proxyノードでオーバーライド
// Settings パラメータをオーバーライドピンで接続
// 実行時に異なるパラメータで実行可能
```

## 実装の詳細

### FPCGIndirectionContext

```cpp
struct FPCGIndirectionContext : public FPCGContext
{
    FPCGElementPtr InnerElement;      // 内部エレメント
    FPCGContext* InnerContext;        // 内部コンテキスト
    bool bShouldActAsPassthrough;     // パススルーモード
    TObjectPtr<UPCGSettings> InnerSettings; // 内部設定
};
```

### ExecuteInternal 概要

```cpp
bool FPCGIndirectionElement::ExecuteInternal(FPCGContext* InContext) const
{
    FPCGIndirectionContext* Context = static_cast<FPCGIndirectionContext*>(InContext);

    // 1. 内部設定とエレメントの準備（PrepareDataInternal）
    // 2. 内部コンテキストのセットアップ
    // 3. 内部エレメントの実行
    // 4. 結果の転送

    if (Context->bShouldActAsPassthrough)
    {
        // パススルー: 入力をそのまま出力
        Context->OutputData = Context->InputData;
        return true;
    }

    // 内部エレメントの実行
    if (Context->InnerElement && Context->InnerContext)
    {
        bool bExecutionComplete = Context->InnerElement->Execute(Context->InnerContext);

        if (bExecutionComplete)
        {
            // 結果を外部コンテキストに転送
            Context->OutputData = Context->InnerContext->OutputData;
            return true;
        }
    }

    return false; // 継続実行
}
```

### ピン解決ロジック

```cpp
TArray<FPCGPinProperties> UPCGIndirectionSettings::InputPinProperties() const
{
    switch (ProxyInterfaceMode)
    {
    case ByNativeElement:
        // SettingsClassのデフォルトオブジェクトからピンを取得
        return SettingsClass->GetDefaultObject()->DefaultInputPinProperties();

    case ByBlueprintElement:
        // BlueprintElementClassのデフォルトオブジェクトからピンを取得
        return BlueprintElementClass->GetDefaultObject()->GetInputPins();

    case BySettings:
        // Settingsオブジェクトから直接ピンを取得
        return Settings->DefaultInputPinProperties();
    }
}
```

## パフォーマンス考慮事項

### 最適化のポイント

1. **オーバーヘッド**: 間接実行による小さなオーバーヘッドあり
2. **キャッシュ不可**: 動的な性質上、キャッシュ不可
3. **GPU対応**: 内部エレメントがサポートしていればGPU処理可能

### パフォーマンスへの影響

- **処理時間**: 内部エレメントの処理時間 + 小さなオーバーヘッド
- **メモリ使用**: 内部コンテキストとエレメントの追加メモリ

### ベストプラクティス

1. **適切な使用**: 実行時の動的な処理切り替えが必要な場合のみ使用
2. **静的な場合**: 処理が固定の場合は直接ノードを使用
3. **設定の管理**: オーバーライド可能な設定を適切に構造化

## 関連ノード

- **Branch/Select**: 条件に基づくデータの分岐
- **Execute Blueprint**: ブループリントの実行
- **Subgraph**: サブグラフの実行
- **Loop**: ループ処理

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **キャッシュ不可**: 結果はキャッシュされないため、頻繁に実行される場合は注意
2. **カリング**: `CanCullTaskIfUnwired` が false（安全なデフォルト）
3. **メインスレッド**: 内部エレメントの要件に依存
4. **動的トラッキング**: 設定がオーバーライドピンで提供される場合、動的に依存関係を追跡

## トラブルシューティング

**問題**: "Missing Asset" と表示される
**解決策**: ProxyInterfaceModeに応じて、SettingsClass、BlueprintElementClass、または Settings を正しく設定

**問題**: ピンが表示されない
**解決策**: 選択した設定/クラスが有効で、適切なピン定義を持っているか確認

**問題**: 実行されない
**解決策**: Settings が nullptr でないか、パススルーモードになっていないか確認

## 実用例

### 品質レベルに応じた処理切り替え

```
[Get Quality Level]
    ↓
[Branch]
  ↙        ↓        ↘
Low      Medium    High
Proxy:   Proxy:    Proxy:
Simple  Standard  Detailed
```

### データ型に応じた処理

```
[Get Data Type]
    ↓
[Switch]
  ↙   ↓   ↘
Points Spline Surface
Proxy:  Proxy:  Proxy:
PointOp SplineOp SurfaceOp
```

### プリセット管理

```
[Load Preset Data]
    ↓
[Proxy: BySettings]
- Settings: 実行時にロードされたプリセット
    ↓
[プリセットに基づく処理実行]
```
