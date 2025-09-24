# Make Transform Attribute

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataMakeTransformSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMakeTransform.h:17`

## 概要

位置・回転・スケール入力から Transform 属性を構築します。<br><span style='color:gray'>(Creates a transform attribute from translation, rotation, and scale.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | Transform の位置成分として使用する属性。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 回転成分の属性。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | スケール成分の属性。 |
