# Filter Data By Attribute

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGFilterByAttributeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByAttribute.h:51`

## 概要

入力データに指定属性があるかどうかにより、またはデータ属性値に基づいてそのデータを分割します<br><span style='color:gray'>(Separates input data by whether they have the specified attribute or not, or on the data attribute value.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `FilterMode` | `EPCGFilterByAttributeMode` | `EPCGFilterByAttributeMode::FilterByExistence` | 属性の有無でフィルタするか、値比較を行うかを選択します。 |
| `Attribute` | `FName` | なし | チェック対象の属性名。カンマ区切りで複数指定できます。<br><span style='color:gray'>(Comma-separated list of attributes to look for)</span> |
| `MetadataDomain` | `FName` | `PCGDataConstants::DefaultDomainName` | チェックするメタデータドメイン。<br><span style='color:gray'>(Domain to target for filtering existence)</span> |
| `Operator` | `EPCGStringMatchingOperator` | `EPCGStringMatchingOperator::Equal` | 属性名の照合方法。 |
| `bIgnoreProperties` | `bool` | `false` | `$` で始まるプロパティ属性を無視するか。 |
| `FilterByValueMode` | `EPCGFilterByAttributeValueMode` | `EPCGFilterByAttributeValueMode::AnyOf` | 属性値によるフィルタリングのモード。 |
| `TargetAttribute` | `FPCGAttributePropertyInputSelector` | なし | 値比較に使用する属性。 |
| `FilterOperator` | `EPCGAttributeFilterOperator` | `EPCGAttributeFilterOperator::Greater` | 値比較時の演算。 |
| `Threshold` | `FPCGFilterByAttributeThresholdSettings` | なし | 閾値設定（属性、定数など）。 |
| `MinThreshold` | `FPCGFilterByAttributeThresholdSettingsRange` | なし | 範囲フィルタの下限。<br><span style='color:gray'>(Threshold property/attribute/constant related properties)</span> |
| `MaxThreshold` | `FPCGFilterByAttributeThresholdSettingsRange` | なし | 範囲フィルタの上限。 |
