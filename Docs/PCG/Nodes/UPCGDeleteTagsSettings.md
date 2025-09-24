# Delete Tags

- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGDeleteTagsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDeleteTags.h:17`

## 概要

タグを検索・削除し、データ上のタグ構造を整理します。<br><span style='color:gray'>(Searches for tags on the data and removes them.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGTagFilterOperation` | `EPCGTagFilterOperation::DeleteSelectedTags` | 指定タグを削除するか、指定以外を残すかを切り替えます。 |
| `Operator` | `EPCGStringMatchingOperator` | `EPCGStringMatchingOperator::Equal` | タグ名の照合方法。 |
| `SelectedTags` | `FString` | なし | 操作対象のタグをカンマ区切りで列挙します。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | タグの区切りとして空白を扱うか。 |
