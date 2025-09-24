# Add Attribute

- **カテゴリ**: Param (パラメータ) — 9件
- **実装クラス**: `UPCGAddAttributeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateAttribute.h:20`

## 概要

入力データに指定した属性を追加し、定数や他データから値を設定します。<br><span style='color:gray'>(Adds a named attribute to incoming data, sourcing values from constants or other inputs.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 追加する元データ（属性セットやポイントプロパティ）を指定します。 |
| `OutputTarget` | `FPCGAttributePropertyOutputSelector` | なし | 新たに作成／上書きする属性名。 |
| `AttributeTypes` | `FPCGMetadataTypesConstantStruct` | なし | 出力するメタデータ型。複数指定で複製できます。 |
| `bCopyAllAttributes` | `bool` | `false` | 元データのすべての属性をコピーするか。 |
| `bCopyAllDomains` | `bool` | `false` | すべてのメタデータ ドメインをコピー対象に含めます。<br><span style='color:gray'>(If checked, it is copying all attributes from all domains...)</span> |
| `MetadataDomainsMapping` | `TMap<FName, FName>` | なし | ドメインをコピーする際のマッピング。空の場合は Default→Default。<br><span style='color:gray'>(When copying all attributes, a mapping can be specified...)</span> |
