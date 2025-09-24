# Cull Points Outside Actor Bounds

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCullPointsOutsideActorBoundsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCullPointsOutsideActorBounds.h:19`

## 概要

現在のアクタ境界の外側にあるポイントをカリングします<br><span style='color:gray'>(Culls points that lie outside the current actor bounds.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `BoundsExpansion` | `float` | `0.0` | アクタ境界をこの値だけ拡張してからカリングします。境界付近の許容範囲を調整するために使用します。 |
| `Mode` | `EPCGCullPointsMode` | `EPCGCullPointsMode::Ordered` | 入力順序を尊重するかどうかを選択します。`Ordered` は入力順を保持し、`Unordered` は高速な一括判定を行います。 |
