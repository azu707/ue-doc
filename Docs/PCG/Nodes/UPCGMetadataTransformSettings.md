# Attribute Transform Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataTransformSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataTransformOpElement.h:31`

## 概要

Transform 属性に行列演算を適用し、新しい変換を算出します。<br><span style='color:gray'>(Applies matrix operations to transform attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataTransformOperation` | `EPCGMetadataTransformOperation::Compose` | Transform 属性同士をどう組み合わせるか（合成、差分、補間など）を選びます。 |
| `TransformLerpMode` | `EPCGTransformLerpMode` | `EPCGTransformLerpMode::QuatInterp` | 補間演算時に使用する回転補間方式（クォータニオン等）。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 第一入力 Transform。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二入力 Transform。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 三番目の入力 Transform。Lerp 等で使用します。 |
