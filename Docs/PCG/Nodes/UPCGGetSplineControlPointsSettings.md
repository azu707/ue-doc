# Get Spline Control Points

- **日本語名**: スプライン制御点を取得
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGGetSplineControlPointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetSplineControlPoints.h:10`

## 概要

スプラインから制御点をポイント データとして抽出します<br><span style='color:gray'>(Extracts the control points from the spline(s) as point data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ArriveTangentAttributeName` | `FName` | `PCGSplineSamplerConstants::ArriveTangentAttributeName` | 抽出した制御点の到達タンジェントを格納する属性名。 |
| `LeaveTangentAttributeName` | `FName` | `PCGSplineSamplerConstants::LeaveTangentAttributeName` | 制御点の離脱タンジェントを格納する属性名。 |
