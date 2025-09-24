# Collapse Points

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGCollapsePointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCollapsePoints.h:39`

## 概要

すべてのポイントが検索距離よりも離れるまで、最も近い隣接したものでポイントを折りたたみます<br><span style='color:gray'>(Collapses points with their closest neighbors until all points are farther than the search distance.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `DistanceThreshold` | `double` | `100.0` | この距離を下回るポイント同士をマージします。最小値は 0.01。 |
| `Mode` | `EPCGCollapseMode` | `PairwiseClosest` | マージの選択戦略。ペアワイズ最近傍（推奨）か絶対最近傍（より高精度だが高コスト）を選択。 |
| `ComparisonMode` | `EPCGCollapseComparisonMode` | `Position` | 距離判定に使用する参照。位置のみ、バウンディングセンターなど。 |
| `VisitOrder` | `EPCGCollapseVisitOrder` | `Ordered` | `Mode == PairwiseClosest` のときの処理順。入力順、ランダム、属性最小／最大など。 |
| `VisitOrderAttribute` | `FPCGAttributePropertyInputSelector` | なし | VisitOrder が属性順のときにソートキーとして使用する属性。 |
| `bUseMergeWeightAttribute` | `bool` | `false` | マージ時の重みを属性から取得するかどうか。 |
| `MergeWeightAttribute` | `FPCGAttributePropertyInputSelector` | なし | マージ重みのための属性。`bUseMergeWeightAttribute` 有効時のみ。 |
| `AttributesToMerge` | `TArray<FPCGAttributePropertyOutputNoSourceSelector>` | 空 | マージ後のポイントへ書き戻す属性リスト。重みに応じた補間結果を出力します。 |

## 実装メモ

- `PairwiseClosest` モードはポイントを巡回しながらペアを形成するため安定かつ高速で、`AbsoluteClosest` は毎回全体から最も近い 2 点を選ぶため指数的にコストが増します。<br><span style='color:gray'>(Pairwise mode is linear-ish; absolute mode re-searches the octree for the global closest pair.)</span>
- `bUseMergeWeightAttribute` が有効な場合、各ポイントの重みを正規化して位置や属性の補間に利用します。指定がないと単純平均または最大重み属性に応じたスナップが行われます。<br><span style='color:gray'>(Weights control blended transforms and attribute interpolation; without weights the node defaults to equal contributions.)</span>
- 処理は内部オクツリーで近傍探索を行い、マージ後のポイントには元データを基にしたメタデータが再割り当てされます。`AttributesToMerge` により必要な属性だけを再計算できる点がパフォーマンス上のメリットです。<br><span style='color:gray'>(An octree accelerates searches; only listed attributes incur merge costs.)</span>
