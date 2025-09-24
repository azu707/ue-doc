# Sort Attributes

- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGSortAttributesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSortAttributes.h:20`

## 概要

属性に基づいてデータをソートします<br><span style='color:gray'>(Sorts data based on an attribute.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | ソート対象の属性。 |
| `SortMethod` | `EPCGSortMethod` | `EPCGSortMethod::Ascending` | 昇順／降順を切り替えます。 |
