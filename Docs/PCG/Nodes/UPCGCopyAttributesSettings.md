# Copy Attributes

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGCopyAttributesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCopyAttributes.h:35`

## 概要

入力ソースから出力ターゲット属性にコピーします<br><span style='color:gray'>(Copy from the Input Source to Output Target attribute.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGCopyAttributesOperation` | `EPCGCopyAttributesOperation::CopyEachSourceToEachTargetRespectively` | 属性コピーのモード（直積、1 対 1、連結など）を指定します。 |
| `bCopyAllAttributes` | `bool` | `false` | すべての属性をコピー対象に含めます。 |
| `bCopyAllDomains` | `bool` | `false` | 全メタデータドメインをまとめてコピーするか。<br><span style='color:gray'>(If checked, it is copying all attributes from all domains, as long as the source domain is supported on the target data.)</span> |
| `MetadataDomainsMapping` | `TMap<FName, FName>` | なし | ドメインコピー時のマッピング。空なら Default→Default になります。 |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | コピー元の属性セット。 |
| `OutputTarget` | `FPCGAttributePropertyOutputSelector` | なし | コピー先の属性または属性セット。 |
