# Attribute Reduce

## 概要
Attribute Reduceノードは、入力データのすべてのエントリ/ポイントから属性値を集約し、縮約演算（平均、最大、最小、合計、結合）を実行して、結果をParamDataとして出力します。

## 機能詳細
このノードは複数のポイントやエントリの属性値を1つまたは少数の値に縮約します。統計的な集計やデータの要約に使用されます。

### 主な機能
- **集計演算**: 平均、最大、最小、合計、文字列結合をサポート
- **ParamData出力**: 縮約結果をパラメータデータとして出力
- **複数入力の処理**: すべての入力データを処理して個別または統合された結果を出力
- **文字列結合**: 文字列属性を指定された区切り文字で結合可能

### 処理フロー
1. 入力データのすべてのエントリ/ポイントを取得
2. 指定された属性の値を読み取り
3. 縮約演算を適用（平均、最大、最小、合計、結合）
4. 結果をParamDataに書き込み
5. 出力として返す

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 縮約する入力属性またはプロパティを選択

### OutputAttributeName
- **型**: FName
- **デフォルト値**: NAME_None（空）
- **PCG_Overridable**: あり
- **説明**: 出力属性の名前を指定

### Operation
- **型**: EPCGAttributeReduceOperation（列挙型）
- **デフォルト値**: Average
- **PCG_Overridable**: あり
- **説明**: 実行する縮約演算のタイプを指定
- **選択肢**:
  - `Average`: 平均値を計算
  - `Max`: 最大値を取得
  - `Min`: 最小値を取得
  - `Sum`: 合計を計算
  - `Join`: 文字列を結合

### JoinDelimiter
- **型**: FString
- **デフォルト値**: ", " （カンマとスペース）
- **PCG_Overridable**: あり
- **表示条件**: `Operation == Join`
- **説明**: Join演算で使用する区切り文字

### bMergeOutputAttributes
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 有効にすると、すべての結果を複数のエントリを持つ単一の属性セットに統合します。無効の場合、各結果が単一の値を持つ個別の属性セットになります

## 使用例

### 平均密度の計算
```
// すべてのポイントの平均密度を計算
InputSource: Density
OutputAttributeName: AverageDensity
Operation: Average
bMergeOutputAttributes: false
結果: 平均密度値を含むParamDataが出力される
```

### 最大高度の取得
```
// 最大の高度値を取得
InputSource: Elevation
OutputAttributeName: MaxElevation
Operation: Max
結果: 最大高度値を含むParamDataが出力される
```

### 合計スコアの計算
```
// すべてのポイントのスコアを合計
InputSource: Score
OutputAttributeName: TotalScore
Operation: Sum
結果: 合計スコア値を含むParamDataが出力される
```

### 名前の結合
```
// すべての名前を区切り文字で結合
InputSource: Name
OutputAttributeName: CombinedNames
Operation: Join
JoinDelimiter: " | "
結果: "Name1 | Name2 | Name3"のような文字列を含むParamDataが出力される
```

### 複数入力の統合結果
```
// 複数の入力からの最小値を統合された属性セットに出力
InputSource: Value
OutputAttributeName: MinValue
Operation: Min
bMergeOutputAttributes: true
結果: 各入力の最小値が単一の属性セットの複数エントリとして出力される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGAttributeReduceElement`（`IPCGElement`を継承）

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` - 事前設定された演算タイプとして提供
- **実行ループモード**: 入力データに応じて変化（`ExecutionLoopMode()`で決定）
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### サポートされる型
- **Average, Max, Min, Sum**: 数値型（int32, int64, float, double）、ベクトル型
- **Join**: 文字列型
- **特殊ケース**: Quaternionの平均は簡易近似（正確な計算は固有値/固有ベクトルが必要で計算コストが高い）

### 出力形式
- **bMergeOutputAttributes = false**:
  - 各入力ごとに1つの属性セット（単一の値を持つ）を生成
  - 複数の入力がある場合、複数のParamDataが出力される

- **bMergeOutputAttributes = true**:
  - すべての結果を1つの属性セットに統合
  - 複数のエントリとして各結果を保持

### Quaternionの平均に関する注意
Quaternionの平均計算は簡易近似を使用しており、Quaternionが互いに近い値の場合のみ正確です。正確な平均計算には固有値/固有ベクトル法が必要ですが、計算コストが非常に高いため実装されていません。Quaternionは最後に正規化されます。

## 注意事項

1. **Quaternionの平均**: 簡易近似のため、Quaternionが大きく異なる場合は不正確な結果になる可能性があります
2. **空の入力**: 入力データが空の場合の動作を考慮してください
3. **型の互換性**: 選択した演算と属性の型が互換性があることを確認してください
4. **文字列結合**: Join演算は文字列型の属性にのみ使用できます
5. **出力の使い方**: ParamData出力は、他のノードのパラメータオーバーライドなどで使用されます

## 関連ノード
- **Get Attribute List**: 属性のリストを取得
- **Attribute Maths Op**: 数学演算
- **Point To Attribute Set**: ポイントデータを属性セットに変換
- **Get Attribute Set from Index**: インデックスから属性セットを取得

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeReduceElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGAttributeReduceElement.cpp`
