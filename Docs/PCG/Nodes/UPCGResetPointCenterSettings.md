# Reset Point Center

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGResetPointCenterSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGResetPointCenter.h:13`

## 概要

境界内のポイントの位置を変更しますが、境界は変わらないようにします<br><span style='color:gray'>(Modify the position of a point within its bounds, while keeping its bounds the same.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PointCenterLocation` | `FVector` | `(0.5,0.5,0.5)` | ローカル境界内での正規化位置。各軸 0〜1 の範囲で指定し、境界サイズは維持したまま中心のみを再配置します。 |

## 実装メモ

- `PCGPointHelpers::ResetPointCenter` を使って、境界の最小／最大値とトランスフォームの位置を再計算します。<br><span style='color:gray'>(The helper offsets bounds min/max and transform location while preserving extents.)</span>
- ポイントのスケールや回転には影響せず、中心座標とバウンディングボックスのみを変更します。<br><span style='color:gray'>(Only translation inside the bounds is affected; rotation/scale remain untouched.)</span>
