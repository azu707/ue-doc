# Point Neighborhood

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGPointNeighborhoodSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointNeighborhood.h:19`

## 概要

隣接ポイントからの平均密度、色、位置などの量を計算します<br><span style='color:gray'>(Computes quantities from nearby neighbor points, such as average density, color, and position.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SearchDistance` | `double` | `500.0` | 近傍探索の半径（cm）。この距離以内のポイントを対象に平均値などを算出します。 |
| `bSetDistanceToAttribute` | `bool` | `false` | 正規化前の距離をカスタム属性として書き出します。 |
| `DistanceAttribute` | `FName` | `TEXT("Distance")` | 距離を書き込む属性名。`bSetDistanceToAttribute` 有効時のみ使用します。 |
| `bSetAveragePositionToAttribute` | `bool` | `false` | 近傍ポイントの平均位置を属性に保存します。 |
| `AveragePositionAttribute` | `FName` | `TEXT("AvgPosition")` | 平均位置を出力する属性名。 |
| `SetDensity` | `EPCGPointNeighborhoodDensityMode` | `EPCGPointNeighborhoodDensityMode::None` | 出力密度へ適用するモード（距離に応じた正規化や平均密度など）を選択します。 |
| `bSetAveragePosition` | `bool` | `false` | 平均位置をポイントのトランスフォームに反映します。 |
| `bSetAverageColor` | `bool` | `false` | 近傍から求めたカラーをポイントカラーに書き込みます。 |
| `bWeightedAverage` | `bool` | `false` | 境界サイズを重みとして平均化を行います。 |
