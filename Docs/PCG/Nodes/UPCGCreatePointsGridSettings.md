# Create Points Grid

- **日本語名**: ポイントグリッドを作成
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCreatePointsGridSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreatePointsGrid.h:27`

## 概要

ポイントの 2D または 3D グリッドを作成します<br><span style='color:gray'>(Creates a 2D or 3D grid of points.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `GridExtents` | `FVector` | `FVector(500.0, 500.0, 50.0)` | グリッド全体のサイズ（中心からの半径）を各軸で指定します。 |
| `CellSize` | `FVector` | `FVector(100.0, 100.0, 100.0)` | 各セルの寸法。小さいほどポイント数が増え、密度の高いサンプリングになります。 |
| `PointSteepness` | `float` | `0.5f` | 各ポイントが表す密度の硬さを制御します。0 で滑らか、1 で境界が鋭い影響になります。 |
| `CoordinateSpace` | `EPCGCoordinateSpace` | `EPCGCoordinateSpace::World` | ポイント生成に用いる座標系（ワールド／ローカルなど）を選択します。 |
| `bSetPointsBounds` | `bool` | `true` | ポイントの境界ボックスサイズを 50cm に固定します。`false` では 1cm になります。 |
| `bCullPointsOutsideVolume` | `bool` | `false` | 参照ボリュームがある場合に外側へ出たポイントを破棄します。 |
| `PointPosition` | `EPCGPointPosition` | `EPCGPointPosition::CellCenter` | セル中心にポイントを置くか、各セルの角に複製するかを選択します。 |
