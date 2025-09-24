# Create Points

- **日本語名**: ポイントを作成
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCreatePointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreatePoints.h:22`

## 概要

指定されたポイントのリストからポイント データを作成します<br><span style='color:gray'>(Creates point data from a provided list of points.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PointsToCreate` | `TArray<FPCGPoint>` | なし | 生成したいポイントデータのリスト。位置・回転・スケール・属性を直接指定できます。 |
| `CoordinateSpace` | `EPCGCoordinateSpace` | `EPCGCoordinateSpace::World` | ポイントを定義する座標系（ワールド／ローカルなど）を選択します。 |
| `bCullPointsOutsideVolume` | `bool` | `false` | ボリューム入力がある場合、外側へ出たポイントを自動で破棄します。 |
