# Filter Data By Tag

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGFilterByTagSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByTag.h:17`

## 概要

一部のタグがあるかどうかに応じて、コレクション内のデータをフィルタリングします<br><span style='color:gray'>(Filters data in the collection according to whether they have, or don't have, some tags)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGFilterByTagOperation` | `EPCGFilterByTagOperation::KeepTagged` | タグを持つデータを保持するか、反転するかを指定します。 |
| `Operator` | `EPCGStringMatchingOperator` | `EPCGStringMatchingOperator::Equal` | タグ名の一致方法。 |
| `SelectedTags` | `FString` | なし | 判定対象のタグをカンマ区切りで列挙します。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | タグ名の区切りとして空白を使用するか。 |
