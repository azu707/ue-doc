# Filter Attribute Elements by Range

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGAttributeFilteringRangeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeFilter.h:144`

## 概要

属性の数値が指定レンジ内かどうかでデータをフィルタリングします。<br><span style='color:gray'>(Filters data based on whether attribute values fall inside a configured numeric range.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `TargetAttribute` | `FPCGAttributePropertyInputSelector` | なし | レンジ判定の対象となる属性。 |
| `MinThreshold` | `FPCGAttributeFilterThresholdSettings` | なし | 最小閾値の設定（属性参照・定数など）。<br><span style='color:gray'>(Threshold property/attribute/constant related properties)</span> |
| `MaxThreshold` | `FPCGAttributeFilterThresholdSettings` | なし | 最大閾値の設定。 |
| `bWarnOnDataMissingAttribute` | `bool` | `true` | 対象属性が存在しない場合に警告を出すか。 |
