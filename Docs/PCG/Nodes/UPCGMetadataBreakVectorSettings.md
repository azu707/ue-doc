# Break Vector Attribute

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataBreakVectorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBreakVector.h:18`

## 概要

ベクトル属性を XYZ の個別成分に分離します。<br><span style='color:gray'>(Splits vector attributes into X, Y, and Z components.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 分解対象のベクトル属性。各成分を個別属性に書き出します。 |
