# Combine Points

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGCombinePointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCombinePoints.h:13`

## 概要

単一の境界範囲を共有するために各ポイントを結合します<br><span style='color:gray'>(Combines each point to share a singular bound extent.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bCenterPivot` | `bool` | `true` | 結合した境界の中心にポイント中心をリセットします。`FPCGPoint::ResetPointCenter` を呼び出し、ローカル座標 `(0.5, 0.5, 0.5)` に揃えます。 |
| `bUseFirstPointTransform` | `bool` | `true` | 最初の入力ポイントのトランスフォームを採用します。`false` の場合は下記 `PointTransform` が適用されます。 |
| `PointTransform` | `FTransform` | 単位変換 | `bUseFirstPointTransform == false` のとき、出力ポイントのトランスフォームとして使用されます。境界をこの変換に合わせて再計算します。 |

## 実装メモ

- `ExecuteInternal` では入力ごとに 0 番目のポイントから境界を算出し、すべてのポイントのローカル境界を集約して 1 つの `FBox` にまとめます。<br><span style='color:gray'>(The executor samples the first point of each input, then merges every local bound into a single `FBox`.)</span>
- 出力は入力ごとに 1 ポイントのみ生成され、密度やメタデータは `InitializeFromDataWithParams` で元データを継承しつつ空間情報のみ再構築されます。<br><span style='color:gray'>(For each tagged input a single point is emitted, inheriting metadata while rebuilding spatial data.)</span>
- `bCenterPivot` を無効にすると、結合後の境界サイズだけが変わり位置は元のローカル中心を保持します。<br><span style='color:gray'>(Disabling `bCenterPivot` preserves the original offset inside the new extents.)</span>
