# Spatial Noise

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGSpatialNoiseSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpatialNoise.h:58`

## 概要

空間ノイズを評価して密度や属性にランダム変調を加えます。<br><span style='color:gray'>(Applies spatial noise to modulate density or attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `PCGSpatialNoiseMode` | `PCGSpatialNoiseMode::Perlin2D` | 使用するノイズ手法（Perlin、Voronoi など）を選択します。 |
| `EdgeMask2DMode` | `PCGSpatialNoiseMask2DMode` | `PCGSpatialNoiseMask2DMode::Perlin` | 2D エッジマスクの生成方法。 |
| `Iterations` | `int32` | `4` | フラクタルノイズの反復回数。増やすと細部が追加されます。 |
| `bTiling` | `bool` | `false` | `true` で境界サイズに沿ったタイル状ノイズを生成します。 |
| `Brightness` | `float` | `0.0` | ノイズ値の明るさオフセット。 |
| `Contrast` | `float` | `1.0` | ノイズコントラスト（スケーリング）。 |
| `ValueTarget` | `FPCGAttributePropertyOutputNoSourceSelector` | なし | ノイズ値を書き込む出力属性名。None の場合は密度へ適用します。 |
| `RandomOffset` | `FVector` | `FVector(100000.0)` | ノイズ空間に加えるランダムオフセット。 |
| `Transform` | `FTransform` | `FTransform::Identity` | ノイズ計算前にポイントへ適用する変換。 |
| `VoronoiCellRandomness` | `double` | `1.0` | Voronoi ノイズのランダム性。1 に近いほどランダム、0 に近いほど格子状になります。 |
| `VoronoiCellIDTarget` | `FPCGAttributePropertyOutputNoSourceSelector` | なし | Voronoi セル ID を出力する属性名。 |
| `bVoronoiOrientSamplesToCellEdge` | `bool` | `false` | セル境界へ向くようにポイントの向きを調整します。 |
| `TiledVoronoiResolution` | `int32` | `8` | タイリングされた Voronoi のセル解像度。 |
| `TiledVoronoiEdgeBlendCellCount` | `int32` | `2` | エッジブレンドに使用するセル数。 |
| `EdgeBlendDistance` | `float` | `1.0` | エッジブレンドを開始する距離。 |
| `EdgeBlendCurveOffset` | `float` | `1.0` | ブレンド曲線の中心位置を調整します。 |
| `EdgeBlendCurveIntensity` | `float` | `1.0` | ブレンド曲線の強度。値を大きくすると減衰が急になります。 |
