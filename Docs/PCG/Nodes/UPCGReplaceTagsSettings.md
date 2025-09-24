# Replace Tags

- **日本語名**: タグを置換
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGReplaceTagsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGReplaceTags.h:10`

## 概要

タグの検索・置換を行って、タグ名を一括更新します。<br><span style='color:gray'>(Finds tags and replaces them with new names.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SelectedTags` | `FString` | なし | 置換対象のタグ。 |
| `ReplacedTags` | `FString` | なし | 置換後のタグ。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | タグの区切りとして空白を扱うか。 |
