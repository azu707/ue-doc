# Add Tags

- **日本語名**: タグを追加
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGAddTagSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAddTag.h:12`

## 概要

指定されたタグを出力データに適用します<br><span style='color:gray'>(Applies the specified tags on the output data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `TagsToAdd` | `FString` | なし | 追加するタグのカンマ区切りリスト。 |
| `Prefix` | `FString` | なし | すべてのタグに付与するプレフィックス。 |
| `Suffix` | `FString` | なし | すべてのタグに付与するサフィックス。 |
| `bIgnoreTagValueParsing` | `bool` | `false` | タグを `キー:値` として解釈せず文字列として扱います。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | 空白もタグの区切りとして扱うか。 |
