# Density Filter

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGDensityFilterSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDensityFilter.h:9`

## 概要

密度のしきい値でポイントを通過させるか破棄するかを判定します。<br><span style='color:gray'>(Filters point data by density threshold.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `LowerBound` | `float` | `0.5f` | 密度がこの値以上のポイントを残します。 |
| `UpperBound` | `float` | `1.0f` | 密度がこの値以下のポイントを残します。 |
| `bInvertFilter` | `bool` | `false` | true にすると通過／除外が逆転します。 |
| `bKeepZeroDensityPoints` | `bool` | `false` | 密度 0 のポイントも除去せず残すか。 |
