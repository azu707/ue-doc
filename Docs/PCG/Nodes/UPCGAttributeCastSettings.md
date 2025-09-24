# Attribute Cast

- **日本語名**: 属性キャスト
- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeCastSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGAttributeCast.h:15`

## 概要

属性のデータ型を別のメタデータ型にキャストし直します。<br><span style='color:gray'>(Recasts an attribute into a different metadata type.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 型変換を行う元の属性またはプロパティ。 |
| `OutputType` | `EPCGMetadataTypes` | `EPCGMetadataTypes::Float` | 出力するメタデータ型（Float、Int、String など）を指定します。 |
| `OutputTarget` | `FPCGAttributePropertyOutputSelector` | なし | 変換結果を書き込む属性。既存属性を上書きすることも新規作成も可能です。 |
