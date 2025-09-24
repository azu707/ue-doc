# Make Vector Attribute

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataMakeVectorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMakeVector.h:39`

## 概要

スカラー値をまとめてベクトル属性を構成します。<br><span style='color:gray'>(Combines scalar values into a vector attribute.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | ベクトルを構成する第一値。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二値。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 第三値。 |
| `InputSource4` | `FPCGAttributePropertyInputSelector` | なし | 四次元ベクトルを作る際の第四成分。 |
| `OutputType` | `EPCGMetadataTypes` | `EPCGMetadataTypes::Vector2` | 出力するベクトルの次元を指定します。 |
| `MakeVector3Op` | `EPCGMetadataMakeVector3` | `EPCGMetadataMakeVector3::ThreeValues` | Vector3 の構成方法（XYZ、XY + 密度など）を指定。 |
| `MakeVector4Op` | `EPCGMetadataMakeVector4` | `EPCGMetadataMakeVector4::FourValues` | Vector4 の構成パターン。 |
