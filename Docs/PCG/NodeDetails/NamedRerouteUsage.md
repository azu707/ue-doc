# Named Reroute Usage

## 概要

**Named Reroute Usage**ノードは、名前付きリルート宣言（Named Reroute Declaration）ノードで定義されたデータを参照するノードです。グラフ内の離れた場所にあるデータソースから、配線なしでデータを取得できます。

カテゴリ: Reroute
クラス名: `UPCGNamedRerouteUsageSettings`
エレメント: `FPCGRerouteElement`

## 機能詳細

Named Reroute Usage ノードは、対応する Declaration ノードが提供するデータを受け取り、それを出力します。グラフエディタでの長距離配線を避け、視覚的な複雑さを軽減します。

### 主な特徴

- 名前付きリルート宣言からデータを参照
- 長距離配線の回避
- 同じ宣言から複数の Usage ノードを作成可能
- 動的ピン（Declaration のデータ型に適応）
- カリング不可（エラー検出のため）

## プロパティ

### Declaration
- **型**: `TObjectPtr<const UPCGNamedRerouteDeclarationSettings>`
- **デフォルト値**: `nullptr`
- **カテゴリ**: Settings
- **説明**: 参照する Named Reroute Declaration ノードへのポインタ。グラフコンパイル時に自動的に設定されます。

## 入力ピン

### InvisiblePin (内部ピン)
- **型**: 動的
- **説明**: このノードには視覚的な入力ピンはありません。代わりに、Declaration ノードへの内部参照を使用します。

**注**: 実装上は `PCGNamedRerouteConstants::InvisiblePinLabel` という名前の見えないピンが存在しますが、エディタには表示されません。

## 出力ピン

### Output (動的)
- **型**: 動的（Declaration のデータ型と同じ）
- **説明**: 参照している Declaration ノードからのデータを出力します。

## 使用例

### 基本的な使用方法

```
// データソース:
[LandscapeData] → [Named Reroute Declaration: "Terrain"]

// グラフの別の場所:
[Named Reroute Usage: "Terrain"] → [HeightFilter]
[Named Reroute Usage: "Terrain"] → [SlopeAnalyzer]
[Named Reroute Usage: "Terrain"] → [TerrainSampler]
```

### サブグラフでの使用

```
// メイングラフ:
[GetActorData] → [Named Reroute Declaration: "ActorBounds"]

// サブグラフ内:
[Named Reroute Usage: "ActorBounds"] → [BoundsFilter]
```

### グローバル設定の配布

```
// 設定セクション:
[GetGraphParameter: "Density"] → [Named Reroute Declaration: "GlobalDensity"]

// 複数の処理チェーンで:
[Named Reroute Usage: "GlobalDensity"] → [TreeSpawner]
[Named Reroute Usage: "GlobalDensity"] → [RockSpawner]
[Named Reroute Usage: "GlobalDensity"] → [GrassSpawner]
```

## 実装の詳細

### 入力ピンプロパティ

`InputPinProperties()` メソッドは、見えないピンを定義します:

```cpp
TArray<FPCGPinProperties> UPCGNamedRerouteUsageSettings::InputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;
    FPCGPinProperties& PinProperty = PinProperties.Emplace_GetRef(
        PCGNamedRerouteConstants::InvisiblePinLabel);
    // ピンは存在するが視覚的には表示されない
    return PinProperties;
}
```

### カリング動作

`CanCullTaskIfUnwired()` が false を返すため、このノードは配線されていない場合でもカリングされません。これは、対応する Declaration ノードが見つからない場合にエラーを出力するためです。

コメントには「非常に直感的ではない」と記載されていますが、これはエラー検出のための重要な設計です:

```cpp
/** Very counter-intuitive but reroute nodes are normally culled by other means,
    if they aren't we want to make sure they log errors. */
virtual bool CanCullTaskIfUnwired() const { return false; }
```

### 現在のピンタイプの取得

`GetCurrentPinTypes()` メソッドは、参照している Declaration ノードのピンタイプを返します:

```cpp
EPCGDataType UPCGNamedRerouteUsageSettings::GetCurrentPinTypes(const UPCGPin* InPin) const
{
    if (Declaration)
    {
        return Declaration->GetCurrentPinTypes(InPin);
    }
    return EPCGDataType::Any;
}
```

### 変換サポート

このノードは他のノードタイプへの変換をサポートしません:

```cpp
virtual TArray<FPCGPreconfiguredInfo> GetConversionInfo() const override { return {}; }
virtual bool ConvertNode(const FPCGPreconfiguredInfo& ConversionInfo) override { return false; }
```

## パフォーマンス考慮事項

1. **実行オーバーヘッド**: 標準のリルートノードと同じで、実質的なオーバーヘッドはありません
2. **コンパイル時解決**: Declaration への参照はグラフコンパイル時に解決されるため、実行時のオーバーヘッドは最小限
3. **データ参照**: 実際のデータはコピーされず、参照として扱われるため、メモリ効率的
4. **マルチスレッド対応**: メインスレッドに限定されず、マルチスレッド実行が可能

## エラー処理

### 対応する Declaration が見つからない場合

Usage ノードが参照する Declaration ノードが存在しない、または名前が一致しない場合、グラフコンパイル時またはエディタでエラーが表示されます。

### ノード削除時の動作

Declaration ノードが削除された場合、対応する Usage ノードは無効な参照を持つことになり、エラー状態になります。この場合、Usage ノードも削除するか、別の Declaration を参照するように更新する必要があります。

## エディタでの使用

### Usage ノードの作成

1. Named Reroute Usage ノードを配置
2. ノードを選択し、タイトルをダブルクリック
3. 参照したい Declaration ノードと同じ名前を入力
4. グラフがコンパイルされると、自動的に Declaration への参照が設定される

### デバッグ

- Usage ノードの `Declaration` プロパティを確認して、正しい Declaration ノードを参照しているかチェック
- Declaration ノードが削除または名前変更された場合、Usage ノードにエラーが表示される
- グラフのコンパイルエラーログで、リルート関連のエラーを確認

## Declaration との関係

| 項目 | Declaration | Usage |
|------|-------------|-------|
| データの流れ | 提供する | 受け取る |
| 入力ピン | あり（実データ） | なし（見えないピン） |
| 出力ピン | なし（見えないピン） | あり（実データ） |
| 配置数 | 同じ名前は1つ推奨 | 同じ名前を複数配置可能 |
| カリング | 標準 | カリング不可 |
| 変換 | サポート | 非サポート |

## 関連ノード

- **Named Reroute Declaration**: このノードが参照するデータソース
- **Reroute (Named Base)**: 名前付きリルートの基底クラス
- **Reroute**: 標準のリルートノード

## 注意事項

- Declaration ノードと同じ名前を使用する必要があります（大文字小文字も区別されます）
- Declaration ノードが存在しない場合、エラーが発生します
- 複数の Usage ノードが同じ Declaration を参照できます
- グラフの循環参照を避けるように注意してください
- 実行依存ピンはありません (`HasExecutionDependencyPin` が false)
- ユーザーはノードタイトルを編集できます (`CanUserEditTitle` が true)

## ベストプラクティス

### 命名規則の統一

```
// 推奨:
Declaration: "TerrainData"
Usage: "TerrainData"

// 非推奨:
Declaration: "terrain_data"
Usage: "TerrainData"  // 名前が一致しない
```

### 複数の Usage ノードの活用

```
[DataPreparation] → [Named Reroute Declaration: "ProcessedData"]

// 複数の処理パスで使用:
[Named Reroute Usage: "ProcessedData"] → [Path1]
[Named Reroute Usage: "ProcessedData"] → [Path2]
[Named Reroute Usage: "ProcessedData"] → [Path3]
```

### ドキュメント化

複雑なグラフでは、Named Reroute の目的をコメントノードで説明することを推奨します:

```
[Comment: "Global landscape data used across multiple processing chains"]
    ↓
[Named Reroute Declaration: "LandscapeData"]
```
