# Attribute Bitwise Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataBitwiseSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBitwiseOpElement.h:18`

## 概要

整数属性にビット演算 (AND/OR/XOR) を適用します。<br><span style='color:gray'>(Applies bitwise operations (AND/OR/XOR) to integer attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataBitwiseOperation` | `EPCGMetadataBitwiseOperation::And` | 整数属性に適用するビット演算の種類（AND/OR/XOR/NOTなど）を指定します。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 演算の左辺として使用する属性またはポイントプロパティ。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 演算の右辺となる属性。単項演算を選んだ場合は無視されます。 |
