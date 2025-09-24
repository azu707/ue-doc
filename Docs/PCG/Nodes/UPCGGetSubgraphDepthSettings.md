# Get Subgraph Depth

- **日本語名**: サブグラフの深度を取得
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGGetSubgraphDepthSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetSubgraphDepth.h:18`

## 概要

このグラフの呼び出し深度を返します<br><span style='color:gray'>(Returns the call depth of this graph.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGSubgraphDepthMode` | `EPCGSubgraphDepthMode::Depth` | 返す深度情報のモード。 |
| `DistanceRelativeToUpstreamGraph` | `int` | `0` | 上流グラフへの相対距離。0 は現在のグラフ。 |
| `bQuietInvalidDepthQueries` | `bool` | `false` | 存在しない深度を参照した際の警告を抑制します。 |
