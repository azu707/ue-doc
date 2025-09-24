# Attribute Boolean Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataBooleanSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBooleanOpElement.h:18`

## 概要

ブール属性間で論理演算を行い、結果を属性として出力します。<br><span style='color:gray'>(Performs boolean logic between attributes and outputs the result.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataBooleanOperation` | `EPCGMetadataBooleanOperation::And` | ブール属性同士に適用する論理演算（AND/OR/XOR/NOT）を選択します。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 第一入力となる属性。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二入力となる属性。単項演算では使用されません。 |
