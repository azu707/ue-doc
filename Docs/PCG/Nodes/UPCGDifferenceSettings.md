# Difference

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGDifferenceSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDifferenceElement.h:16`

## 概要

ソース データからターゲットの差分データを空間的に減算し、2 つの差分を出力します<br><span style='color:gray'>(Spatially subtracts the target difference data from the source data, outputing the difference of the two.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `DensityFunction` | `EPCGDifferenceDensityFunction` | `EPCGDifferenceDensityFunction::Minimum` | 差分結果の密度を再計算するときに使用する合成関数。最小値・最大値などから選択して密度の混ざり方を制御します。<br><span style='color:gray'>(The density function to use when recalculating the density after the operation.)</span> |
| `Mode` | `EPCGDifferenceMode` | `EPCGDifferenceMode::Inferred` | 出力データを連続データとして扱うか、離散ポイントに変換するかを決定します。`Continuous`/`Discrete`/`Inferred` のいずれかを選択します。<br><span style='color:gray'>(Describes how the difference operation will treat the output data.)</span> |
| `bDiffMetadata` | `bool` | `true` | メタデータに対しても差分演算を適用します。`false` にするとジオメトリのみ差分を計算します。 |
| `bKeepZeroDensityPoints` | `bool` | `false` | `true` の場合、密度 0 になったポイントを自動削除せずに残します。<br><span style='color:gray'>(If enabled, the output will not automatically filter out points with zero density.)</span> |
