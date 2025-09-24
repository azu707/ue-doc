# Create Points Sphere

- **日本語名**: ポイント球体を作成
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCreatePointsSphereSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreatePointsSphere.h:38`

## 概要

球体のサーフェス上にポイントを生成します<br><span style='color:gray'>(Generate points on the surface of a sphere.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SphereGeneration` | `EPCGSphereGeneration` | `EPCGSphereGeneration::Geodesic` | 球面上の点を生成する手法を選択します（ジオデシック分割、緯度経度グリッド、ランダム、ポアソンなど）。 |
| `CoordinateSpace` | `EPCGCoordinateSpace` | `EPCGCoordinateSpace::World` | ポイント生成に用いる座標系（ワールド／ローカルなど）を指定します。 |
| `PointOrientation` | `EPCGSpherePointOrientation` | `EPCGSpherePointOrientation::Radial` | 生成したポイントの向きを決定します。法線方向・中心方向・無指定から選択します。 |
| `Origin` | `FVector` | `FVector::ZeroVector` | 球の中心位置。ここを基準に半径や角度が解釈されます。 |
| `Radius` | `double` | `100.0` | 球面の半径（cm）。 |
| `GeodesicSubdivisions` | `int32` | `2` | ジオデシックモード時の分割回数。値を増やすほど細かくなり計算コストも増加します。 |
| `Theta` | `double` | `12` | Angle モードでの緯度方向セグメント角度（度）。値を小さくすると緯線数が増えます。 |
| `Phi` | `double` | `12` | Angle モードでの経度方向セグメント角度（度）。値を小さくすると経線数が増えます。 |
| `LatitudinalSegments` | `int32` | `15` | Segments モードで生成する緯線の本数。ここから必要な角度が自動算出されます。 |
| `LongitudinalSegments` | `int32` | `30` | Segments モードで生成する経線の本数。ここから必要な角度が自動算出されます。 |
| `SampleCount` | `int32` | `100` | Random／Poisson モードで生成候補とするサンプル数。多いほど分布が密になります。 |
| `PoissonDistance` | `double` | `100.0` | Poisson サンプリングで維持する最小距離（cm）。ポイント間隔の下限を定義します。 |
| `PoissonMaxAttempts` | `int32` | `32` | Poisson サンプリングが新しい配置を探す試行回数の上限。大きいほど密度が上がります。 |
| `LatitudinalStartAngle` | `double` | `-90.0` | 球面を生成する緯度の開始角度（度）。-90 で南極から開始します。 |
| `LatitudinalEndAngle` | `double` | `90.0` | 球面を生成する緯度の終了角度（度）。90 で北極までカバーします。 |
| `LongitudinalStartAngle` | `double` | `-180.0` | 球面を生成する経度の開始角度（度）。 |
| `LongitudinalEndAngle` | `double` | `180.0` | 球面を生成する経度の終了角度（度）。 |
| `Jitter` | `double` | `0.0` | Angle／Segments モードでセグメント角度に与えるランダム揺らぎ量。0〜0.5 の範囲で調整します。 |
| `PointSteepness` | `float` | `0.5f` | 出力ポイントの密度勾配。0 なら緩やかな減衰、1 なら境界が鋭い影響になります。 |
| `bCullPointsOutsideVolume` | `bool` | `false` | 入力にボリュームがある場合、その外側に出たポイントをカリングします。 |
