# Blur

- **日本語名**: ブラー
- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGBlurSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGBlurElement.h:29`

## 概要

ポイントデータにぼかし処理を適用し、空間的に平滑化します。<br><span style='color:gray'>(Applies a blur kernel to smooth spatial point data.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | ブラー対象となる数値属性。ポイント属性・メタデータいずれも指定可能です。 |
| `OutputTarget` | `FPCGAttributePropertyOutputSelector` | なし | 結果を書き込む属性。入力と同じ属性を指定すれば上書きになります。 |
| `NumIterations` | `int` | `1` | ブラーを反復する回数。反復ごとに結果がより滑らかになります。 |
| `SearchDistance` | `double` | `1000.0` | 近傍として検索する半径。0 以上で指定します。 |
| `BlurMode` | `EPCGBlurElementMode` | `Constant` | 重み計算方式。一定、線形減衰、ガウス分布を選択可能。 |
| `bUseCustomStandardDeviation` | `bool` | `false` | `BlurMode == Gaussian` のとき標準偏差を手動指定します。デフォルトは `SearchDistance / 3`。 |
| `CustomStandardDeviation` | `double` | `1.0` | `bUseCustomStandardDeviation` が有効な場合に使用する標準偏差。 |

## 実装メモ

- 近傍探索にはポイントデータの空間インデックスが利用され、検索距離内のポイント値を集めて重み付き平均を計算します。<br><span style='color:gray'>(Neighborhood values are collected within the radius and blended by the selected kernel.)</span>
- `NumIterations` > 1 の場合はワーキングバッファを交互に使い、前回の結果にさらにブラーを適用します。<br><span style='color:gray'>(Two working buffers ping-pong the attribute values for iterative smoothing.)</span>
- ガウスモードではデフォルトで距離 3σ に相当するよう標準偏差が計算され、`bUseCustomStandardDeviation` によって任意指定も可能です。<br><span style='color:gray'>(Gaussian weights default to σ = SearchDistance/3 unless overridden.)</span>
