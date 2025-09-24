# Break Transform Attribute

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataBreakTransformSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBreakTransform.h:10`

## 概要

Transform 属性を位置・回転・スケール成分に分解します。<br><span style='color:gray'>(Breaks a transform attribute into translation, rotation, and scale components.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 分解対象の Transform 属性。位置・回転・スケール各属性に展開されます。 |
