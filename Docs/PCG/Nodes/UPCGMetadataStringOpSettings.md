# Attribute String Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataStringOpSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataStringOpElement.h:21`

## 概要

文字列属性に結合・分割・置換などの操作を行います。<br><span style='color:gray'>(Performs string operations such as concatenation or replace on string attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataStringOperation` | `EPCGMetadataStringOperation::Append` | 文字列結合・置換・分割などの操作種別。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 操作のベースとなる第一入力。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二入力。操作内容によって使用されます。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 第三入力。必要な操作で利用します。 |
