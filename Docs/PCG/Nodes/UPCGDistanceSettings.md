# Distance

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGDistanceSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDistance.h:30`

## 概要

符号付「距離」属性を計算し、ソース データに付加します。ソース ポイントのそれぞれで、距離属性は最近接のターゲット ポイントとの間で計算されます<br><span style='color:gray'>(Calculates and appends a signed 'Distance' attribute to the source data. For each of the source points, a distance attribute will be calculated between it and the nearest target point.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bOutputToAttribute` | `bool` | `true` | 計算した距離（またはベクトル）を属性として書き出すかを切り替えます。<br><span style='color:gray'>(Output the distance or distance vector to an attribute.)</span> |
| `OutputAttribute` | `FPCGAttributePropertySelector` | `FPCGAttributePropertySelector::CreateAttributeSelector(PCGDistanceConstants::DefaultOutputAttributeName)` | 距離を書き込む先の属性名／ポイントプロパティを指定します。`bOutputToAttribute` が有効な場合のみ設定します。 |
| `bOutputDistanceVector` | `bool` | `false` | `true` にするとスカラー距離ではなく距離ベクトルを出力します。 |
| `bSetDensity` | `bool` | `false` | `true` にすると `MaximumDistance` を上限として 0〜1 に正規化した密度を同時に設定します。 |
| `MaximumDistance` | `double` | `20000.0` | 探索する最大距離（cm）。大きくすると計算範囲が広がりますがコストも増えます。 |
| `SourceShape` | `PCGDistanceShape` | `PCGDistanceShape::SphereBounds` | 距離計測時にソース側ポイントをどの形状として扱うか（球・AABB など）を選択します。 |
| `TargetShape` | `PCGDistanceShape` | `PCGDistanceShape::SphereBounds` | ターゲット側ポイントの評価形状を指定します。 |
| `bCheckSourceAgainstRespectiveTarget` | `bool` | `false` | `true` の場合、ソース n 個に対し n 個のターゲットを一対一で評価します（N:N）。通常は全ターゲットに対する最近距離を計算します。 |
