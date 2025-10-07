# Named Reroute Declaration

## 概要

**Named Reroute Declaration**ノードは、名前付きリルートの宣言点を定義するノードです。このノードで宣言された名前付きリルートは、グラフ内の他の場所にある Named Reroute Usage ノードから参照できます。

カテゴリ: Reroute
クラス名: `UPCGNamedRerouteDeclarationSettings`
エレメント: `FPCGRerouteElement`

## 機能詳細

名前付きリルートは、グラフ内で離れた場所にあるノード間を接続するための高度なリルート機能です。Declaration（宣言）ノードでデータソースを定義し、Usage（使用）ノードでそのデータを参照します。これにより、長距離の配線を避け、グラフの可読性を大幅に向上させることができます。

### 主な特徴

- 名前付きリルートのソース定義
- グラフ内の任意の場所から参照可能
- ユーザーが編集可能なノードタイトル
- 動的ピン（データ型に適応）
- 複数のUsageノードから参照可能

## プロパティ

このノードには、基底クラス（`UPCGRerouteSettings`）から継承されたプロパティのみがあります。ノード名（タイトル）がリルートの識別子として機能します。

## 入力ピン

### Input (動的)
- **型**: 動的（任意のPCGデータ型）
- **説明**: 名前付きリルートとして提供するデータを受け取ります。

## 出力ピン

### InvisiblePin (内部ピン)
- **型**: 動的
- **説明**: このノードには視覚的な出力ピンはありません。代わりに、Named Reroute Usage ノードがこの宣言を参照します。

**注**: 実装上は `PCGNamedRerouteConstants::InvisiblePinLabel` という名前の見えないピンが存在しますが、エディタには表示されません。

## 使用例

### 基本的な使用方法

```
[DataSource] → [Named Reroute Declaration: "GlobalPoints"]

// グラフの別の場所で:
[Named Reroute Usage: "GlobalPoints"] → [Consumer1]
[Named Reroute Usage: "GlobalPoints"] → [Consumer2]
[Named Reroute Usage: "GlobalPoints"] → [Consumer3]
```

これにより、1つのデータソースを複数の離れた場所から参照できます。

### サブグラフとの組み合わせ

```
// メイングラフ:
[LandscapeData] → [Named Reroute Declaration: "TerrainData"]

// サブグラフ内:
[Named Reroute Usage: "TerrainData"] → [TerrainProcessor]
```

名前付きリルートはサブグラフをまたいで使用できるため、グローバルなデータソースとして機能します。

### 複雑なグラフの整理

```
// データ準備セクション:
[ComplexDataPreparation] → [Named Reroute Declaration: "PreparedData"]

// 数十ノード後...

// データ使用セクション:
[Named Reroute Usage: "PreparedData"] → [FinalProcessing]
```

## 実装の詳細

### エレメント実行

Named Reroute Declaration は、標準の Reroute ノードと同じ `FPCGRerouteElement` を使用します。実装は入力データを出力にパススルーするだけです。

### 出力ピンの特殊性

`OutputPinProperties()` メソッドは、通常のピンプロパティとは異なる方法でピンを定義します:

```cpp
TArray<FPCGPinProperties> UPCGNamedRerouteDeclarationSettings::OutputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;
    FPCGPinProperties& PinProperty = PinProperties.Emplace_GetRef(
        PCGNamedRerouteConstants::InvisiblePinLabel);
    // ピンは存在するが視覚的には表示されない
    return PinProperties;
}
```

### ノード変換

このノードは、標準の Reroute ノードからの変換をサポートします。`GetConversionInfo()` メソッドが変換オプションを提供します。

### ユーザー編集可能なタイトル

`CanUserEditTitle()` が true を返すため、ユーザーはノードタイトルを編集できます。このタイトルが名前付きリルートの識別子として使用されます。

## パフォーマンス考慮事項

1. **実行オーバーヘッド**: 標準のリルートノードと同じで、実質的なオーバーヘッドはありません
2. **参照解決**: Usage ノードが Declaration を参照する際、グラフコンパイル時に解決されるため、実行時のオーバーヘッドは最小限です
3. **メモリ効率**: データの参照のみを扱うため、メモリ効率的です

## エディタでの使用

### 名前の設定

1. Named Reroute Declaration ノードを配置
2. ノードを選択し、タイトルをダブルクリック
3. 識別しやすい名前を入力（例: "GlobalLandscapeData"）
4. 同じ名前で Named Reroute Usage ノードを作成

### ベストプラクティス

- **明確な命名**: データの内容が分かる名前を使用する
- **一貫性**: 類似のデータには類似の命名規則を使用する
- **ドキュメント化**: 複雑なグラフでは、リルートの目的をコメントノードで説明する

## Named Reroute Usage との関係

| 項目 | Declaration | Usage |
|------|-------------|-------|
| 役割 | データソースの定義 | データの参照 |
| 入力ピン | あり | なし（見えないピン） |
| 出力ピン | なし（見えないピン） | あり |
| タイトル編集 | 可能（識別子として使用） | 可能（参照先の選択） |
| 複数配置 | 同じ名前は1つのみ推奨 | 同じ名前を複数配置可能 |

## 関連ノード

- **Named Reroute Usage**: この宣言を参照するノード
- **Reroute (Named Base)**: 名前付きリルートの基底クラス
- **Reroute**: 標準のリルートノード

## 注意事項

- ノード名は一意である必要があります（同じグラフ内で重複すると混乱の原因になります）
- Usage ノードは対応する Declaration ノードが存在しない場合、エラーを出力します
- コンパイル時に Declaration と Usage の接続が解決されます
- グラフの循環参照を避けるために注意が必要です
- 実行依存ピンはありません (`HasExecutionDependencyPin` が false)

## 高度な使用法

### グローバルパラメータの配布

```
[GetGraphParameter: "Seed"] → [Named Reroute Declaration: "GlobalSeed"]

// グラフ全体で:
[Named Reroute Usage: "GlobalSeed"] → [RandomGenerator1]
[Named Reroute Usage: "GlobalSeed"] → [RandomGenerator2]
[Named Reroute Usage: "GlobalSeed"] → [RandomGenerator3]
```

これにより、1つのパラメータを変更するだけで、グラフ全体のシード値を更新できます。
