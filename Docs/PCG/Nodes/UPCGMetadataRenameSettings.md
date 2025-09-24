# Attribute Rename

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataRenameSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataRenameElement.h:9`

## 概要

属性名をまとめて変更し、メタデータの命名を整理します。<br><span style='color:gray'>(Renames metadata attributes in bulk to tidy naming.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `AttributeToRename` | `FName` | `NAME_None` | 名前を変更したい既存属性。 |
| `NewAttributeName` | `FName` | `NAME_None` | 付け替える先の属性名。既存と重複する場合は上書きされます。 |
