# Delete Attributes

- **日本語名**: 属性を削除
- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGDeleteAttributesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDeleteAttributesElement.h:22`

## 概要

指定した属性をメタデータから削除、またはリスト以外を一括除去します。<br><span style='color:gray'>(Deletes specific metadata attributes or keeps only those listed.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGAttributeFilterOperation` | `EPCGAttributeFilterOperation::KeepSelectedAttributes` | 指定した属性を保持するのか削除するのかを切り替えます（新規ノードでは既定が DeleteSelected）。 |
| `Operator` | `EPCGStringMatchingOperator` | `EPCGStringMatchingOperator::Equal` | 属性名を比較する際のマッチング条件（等価、前方一致など）。 |
| `SelectedAttributes` | `FString` | なし | 対象属性名のカンマ区切りリスト。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | 属性名の区切りとして空白を解釈するか。 |
| `MetadataDomain` | `FName` | `PCGDataConstants::DefaultDomainName` | 操作対象のメタデータドメイン。 |
