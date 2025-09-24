# Attribute Remove Duplicates

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeRemoveDuplicatesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeRemoveDuplicates.h:12`

## 概要

重複する属性値を削除して一意な値のみ残します。<br><span style='color:gray'>(Removes duplicate attribute values, keeping only unique entries.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `AttributeSelectors` | `TArray<FPCGAttributePropertyInputSelector>` | `{ FPCGAttributePropertyInputSelector() }` | 重複判定に使用する属性群。複数指定すると複合キーとして扱います。 |
| `AttributeNamesToRemoveDuplicates` | `FString` | なし | レガシーの文字列表現。指定した属性について、最初のエントリのみ残して重複を削除します。 |
