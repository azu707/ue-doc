# Apply Scale To Bounds

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGApplyScaleToBoundsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGApplyScaleToBounds.h:12`

## 概要

各点のスケールをその境界に適用し、スケールを再設定します<br><span style='color:gray'>(Applies the scale of each point to its bounds and resets the scale.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| なし | — | — | 設定可能なプロパティはありません。 |

## 実装メモ

- 各ポイントのスケールを境界に掛け合わせ、その後ポイントのスケールを `1` にリセットします。<br><span style='color:gray'>(The helper inflates bounds by the scale then zeroes out the transform scale.)</span>
- `PCGPointHelpers::ApplyScaleToBounds` は境界最小／最大とトランスフォームを同時に更新するため、後段ノードが正規化されたスケール前提で処理できます。<br><span style='color:gray'>(It ensures downstream nodes operate on normalized transforms while keeping the bounds accurate.)</span>
