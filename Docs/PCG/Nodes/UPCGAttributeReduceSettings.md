# Attribute Reduce

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeReduceSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeReduceElement.h:28`

## 概要

属性の集合に対して合計・平均などの集約値を計算します。<br><span style='color:gray'>(Computes aggregate statistics such as sum or average for attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 集約対象となる属性。 |
| `OutputAttributeName` | `FName` | `NAME_None` | 集計結果を書き込む属性名。空の場合は入力属性を上書きします。 |
| `Operation` | `EPCGAttributeReduceOperation` | `EPCGAttributeReduceOperation::Average` | 合計／平均／最大など、求める集計方法を選択します。 |
| `JoinDelimiter` | `FString` | `", "` | 文字列連結時に使用する区切り文字。 |
| `bMergeOutputAttributes` | `bool` | `false` | 集計結果を複数の属性セットに分けず、一つの属性セットで複数エントリとして出力します。<br><span style='color:gray'>(Option to merge all results into a single attribute set with multiple entries, instead of multiple attribute sets with a single value in them.)</span> |
