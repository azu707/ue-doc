# Filter Attribute Elements

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGAttributeFilteringSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeFilter.h:65`

## 概要

属性値の比較条件でデータを残すか除外するかを判定します。<br><span style='color:gray'>(Keeps or discards data according to attribute comparison rules.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operator` | `EPCGAttributeFilterOperator` | `EPCGAttributeFilterOperator::Greater` | 属性値との比較演算（Greater/Less/Equal 等）。 |
| `TargetAttribute` | `FPCGAttributePropertyInputSelector` | なし | フィルタ対象となる属性。<br><span style='color:gray'>(Target property/attribute related properties)</span> |
| `bUseConstantThreshold` | `bool` | `false` | 閾値を属性ではなく定数値で指定するか。<br><span style='color:gray'>(Threshold property/attribute/constant related properties)</span> |
| `ThresholdAttribute` | `FPCGAttributePropertyInputSelector` | なし | 比較対象となる属性または値。 |
| `bUseSpatialQuery` | `bool` | `true` | 閾値データがポイントの場合、空間的に近い値をサンプリングします（Spatial データでは常に true）。<br><span style='color:gray'>(This value is now false by default...) *</span> |
| `AttributeTypes` | `FPCGMetadataTypesConstantStruct` | なし | 閾値比較時に許可する属性型。 |
| `bWarnOnDataMissingAttribute` | `bool` | `true` | 入力またはフィルタデータに必要な属性が無い場合に警告を出すか。 |
