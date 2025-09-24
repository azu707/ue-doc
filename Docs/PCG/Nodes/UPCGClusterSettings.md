# Cluster

- **日本語名**: クラスタ
- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGClusterSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGClusterElement.h:23`

## 概要

クラスタ (カテゴリ) の希望数が指定されると、多様なクラスタリング手法の 1 つを使用して距離により各ポイントに最適なクラスタを見つけます<br><span style='color:gray'>(Given a desired number of clusters (categories), find the best fit cluster for each point by distance, using one of various clustering algorithms.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Algorithm` | `EPCGClusterAlgorithm` | `KMeans` | 使用するクラスタリング手法。K-means と Expectation-Maximization (Gaussian Mixture) から選択。 |
| `NumClusters` | `int32` | `3` | 生成するクラスタ数。各ポイントは最終的にこのいずれかへ割り当てられます。 |
| `ClusterAttribute` | `FPCGAttributePropertyOutputNoSourceSelector` | なし | ポイントにクラスタ ID を書き込む出力属性。 |
| `MaxIterations` | `int32` | `100` | 反復回数の上限。収束しない場合の打ち切り条件として使われます。 |
| `Tolerance` | `double` | `UE_DOUBLE_KINDA_SMALL_NUMBER` | `Algorithm == EM` 時の収束判定。連続する反復の対数尤度差がこの値以下になると停止します。 |
| `bOutputFinalCentroids` | `bool` | `false` | クラスタ中心（セントロイドまたはガウシアン）のポイントデータを追加出力します。 |
| `bOutputFinalCentroidElementCount` | `bool` | `false` | `bOutputFinalCentroids` 有効時、各センターに割り当てられた要素数を併せて出力します。 |
| `FinalCentroidElementCountAttribute` | `FPCGAttributePropertyOutputNoSourceSelector` | なし | セントロイド出力に割り当て数を書く属性。`bOutputFinalCentroidElementCount` 有効時のみ。 |

## 実装メモ

- K-Means はポイントの位置ベクトルを元にユークリッド距離でクラスタを更新し、EM はガウシアン分布を推定して確率的に割り当てを決めます。<br><span style='color:gray'>(K-means uses centroids; EM estimates a Gaussian mixture with log-likelihood convergence.)</span>
- 収束チェックは `MaxIterations` と `Tolerance` の両方を考慮し、上限に達するか許容誤差を下回るまで実行されます。<br><span style='color:gray'>(Iterations stop when either cap is hit or delta log-likelihood falls below tolerance.)</span>
- `bOutputFinalCentroids` を有効にするとセンター位置を別ピンで出力し、必要に応じて割り当て数をメタデータとして保存できます。<br><span style='color:gray'>(Optional centroid outputs help visualize cluster centers and population.)</span>
