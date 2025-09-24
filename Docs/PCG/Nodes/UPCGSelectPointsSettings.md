# Select Points

- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGSelectPointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSelectPoints.h:9`

## 概要

入力ポイントの安定したランダムなサブセットを選択します<br><span style='color:gray'>(Selects a stable random subset of the input points.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Ratio` | `float` | `0.1f` | 保持するポイントの割合。0.1 は 10% を意味します。 |
| `bKeepZeroDensityPoints` | `bool` | `false` | 密度 0 のポイントを削除せず残すか。 |
