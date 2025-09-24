# Duplicate Point

- **日本語名**: 点を複製
- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGDuplicatePointSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDuplicatePoint.h:12`

## 概要

各ポイントの複製を、オプションでトランスフォーム オフセットを付けて作成します<br><span style='color:gray'>(Creates duplicates of each point with optional transform offsets.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Iterations` | `int` | `1` | 各ポイントの複製数。`bOutputSourcePoint` が `true` の場合は元ポイント＋この数になります。 |
| `Direction` | `FVector` | `(0,0,1)` | 複製ごとの移動方向。各成分は内部で -1〜1 にクランプされます。 |
| `bDirectionAppliedInRelativeSpace` | `bool` | `false` | `true` の場合はポイントのローカル境界サイズを掛け合わせて相対方向に積算します。 |
| `bOutputSourcePoint` | `bool` | `true` | 元のポイントを出力へ含めるかどうか。 |
| `PointTransform` | `FTransform` | 単位行列 | 各複製に適用する追加オフセット。位置・回転・スケールが反復ごとに累積します。 |

## 実装メモ

- `bDirectionAppliedInRelativeSpace` 有効時は境界サイズと方向ベクトルから複製ごとのローカル変換を算出し、`PointTransform` を乗算した結果を順次適用します。<br><span style='color:gray'>(Relative mode scales offsets by the point's bounds before composing with the supplied transform.)</span>
- 無効時は `Iterations`×ポイント数分のループを行い、`PointTransform` の平行移動・回転・スケールを指数関数的に累積させて複製番号に応じた変換を生成します。<br><span style='color:gray'>(Non-relative mode exponentiates the transform per duplicate index.)</span>
- 新しいポイントには `PCGHelpers::ComputeSeedFromPosition` で位置ベースのシードが再割り当てされるため、後続ノードでも一意性を保持できます。<br><span style='color:gray'>(Each duplicate recomputes its seed from the final location.)</span>
