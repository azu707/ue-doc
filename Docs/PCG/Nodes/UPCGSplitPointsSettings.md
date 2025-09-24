# Split Points

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGSplitPointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSplitPoints.h:20`

## 概要

各入力ポイントを 2 つの別のポイントに分割し、その位置とカットの軸に基づいて境界を設定します<br><span style='color:gray'>(Splits each input point into two separate points and sets bounds based on the position and axis of the cut.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SplitPosition` | `float` | `0.5` | 0〜1 の範囲で境界をどこで分割するかを指定します。0 に近いほど下側、1 に近いほど上側に偏ります。 |
| `SplitAxis` | `EPCGSplitAxis` | `Z` | 分割軸。X/Y/Z から選択し、指定軸方向に境界を切ります。 |

## 実装メモ

- 出力は「Before Split」「After Split」の 2 ピンに分かれ、入力ポイントごとに 2 スロットの境界を再構成します。<br><span style='color:gray'>(Each input point yields two outputs tagged before/after the split plane.)</span>
- `SplitPosition` は `FMath::Clamp` で 0〜1 に制限され、境界最小値から最大値への線形補間でスプリット面を計算します。<br><span style='color:gray'>(The split location is computed by lerping between bounds min/max.)</span>
- メタデータやその他のネイティブプロパティは必要に応じてコピーされ、境界最小／最大のみを更新するため元の属性は維持されます。<br><span style='color:gray'>(All other properties are copied; only bounds min/max are mutated per half.)</span>
