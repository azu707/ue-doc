# Elevation Isolines

- **日本語名**: エレベーション等値線
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGElevationIsolinesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGElevationIsolines.h:13`

## 概要

高さ情報から等高線を生成し、勾配に沿ったスプラインやポイントを出力します。<br><span style='color:gray'>(Generates isolines from elevation data and outputs splines/points along height bands.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ElevationStart` | `double` | `0.0` | 等高線の開始高度（cm）。<br><span style='color:gray'>(Minimum elevation of the isolines.)</span> |
| `ElevationEnd` | `double` | `1000.0` | 等高線の終了高度。<br><span style='color:gray'>(Maximum elevation of the isolines.)</span> |
| `ElevationIncrement` | `double` | `100.0` | 等高線の間隔（高度差）。<br><span style='color:gray'>(Increment elevation between each isolines.)</span> |
| `Resolution` | `double` | `100.0` | サーフェスを離散化するグリッドセルのサイズ（cm）。<br><span style='color:gray'>(Resolution of the grid for the discretization of the surface.)</span> |
| `bAddTagOnOutputForSameElevation` | `bool` | `false` | 同一高度の出力にタグ（整数）を付与してグルーピングします。 |
| `bProjectSurfaceNormal` | `bool` | `false` | Z 軸固定ではなく、元サーフェスの法線方向に投影された回転を使用します。 |
| `bOutputAsSpline` | `bool` | `false` | 等高線をポイントではなくスプラインとして出力します。 |
| `bLinearSpline` | `bool` | `false` | スプラインを直線補間にするかを切り替えます。 |
