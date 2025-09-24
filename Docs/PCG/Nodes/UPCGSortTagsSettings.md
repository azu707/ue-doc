# Sort Data By Tag Value

- **日本語名**: データをタグ値でソート
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGSortTagsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSortTags.h:15`

## 概要

データをタグ値 (「Tag:Value」形式のタグ) でソートします<br><span style='color:gray'>(Sorts data by tag value (i.e. with tags of the form Tag:Value))</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Tag` | `FName` | なし | `Tag:Value` 形式のタグ名。 |
| `SortMethod` | `EPCGSortMethod` | `EPCGSortMethod::Ascending` | タグ値を昇順／降順にソートします。 |
