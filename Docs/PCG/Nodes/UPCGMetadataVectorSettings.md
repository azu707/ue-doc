# Attribute Vector Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataVectorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataVectorOpElement.h:27`

## 概要

ベクトル属性にドット積・長さ計算などのベクトル演算を行います。<br><span style='color:gray'>(Performs vector math such as dot or length on vector attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataVectorOperation` | `EPCGMetadataVectorOperation::Cross` | ベクトル演算（加算、内積、外積など）の種類。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 第一入力ベクトル。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二入力ベクトル。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 三番目の入力。演算によって使用します。 |
