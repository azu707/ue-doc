# Data Attributes To Tags

- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGDataAttributesToTagsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGDataAttributesAndTags.h:37`

## 概要

データ属性とその値をタグにコピーします<br><span style='color:gray'>(Copy data attributes and their values to tags.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bDiscardNonParseableAttributeTypes` | `bool` | `true` | タグ化できない属性型（例: クォータニオン）を除外します。 |
| `bDiscardAttributeValue` | `bool` | `false` | 属性値をタグに含めず、名前のみタグ化します。 |
