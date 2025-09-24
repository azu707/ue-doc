# Extents Modifier

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGPointExtentsModifierSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointExtentsModifier.h:20`

## 概要

ポイントの extents (半径) を調整し、バウンディングボリュームを拡大・縮小します。<br><span style='color:gray'>(Adjusts point extents to expand or shrink their bounding volume.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Extents` | `FVector` | `(1,1,1)` | 目標とするエクステント（半径）。`Mode` によって適用方法が変わります。 |
| `Mode` | `EPCGPointExtentsModifierMode` | `Set` | エクステントの適用モード。固定値設定、最小・最大制約、加算、乗算から選択します。 |

## 実装メモ

- 実行時はポイントデータをコピーし、`BoundsMin`/`BoundsMax` のみを更新します。<br><span style='color:gray'>(The element clones point data and touches only the bounds ranges.)</span>
- `Set` はエクステントを強制的に指定値へ置き換え、`Minimum`／`Maximum` は既存エクステントとの逐次比較、`Add`／`Multiply` はベクトル演算で増減させます。<br><span style='color:gray'>(Each mode wraps a lambda that either clamps or applies arithmetic to the current extents.)</span>
- エクステントから導出されるポイント中心は変更されないため、必要に応じて別ノード（例: Reset Point Center）と組み合わせます。<br><span style='color:gray'>(Point centers remain untouched; combine with other nodes if you need to recenter after changing bounds.)</span>
