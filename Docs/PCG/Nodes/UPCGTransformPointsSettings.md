# Transform Points

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGTransformPointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGTransformPoints.h:9`

## 概要

ポイントの位置・回転・スケールを変換します。<br><span style='color:gray'>(Transforms point position, rotation, and scale.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bApplyToAttribute` | `bool` | `false` | 変換対象をポイント本体ではなく、`FTransform` 型のメタデータ属性に限定します。 |
| `AttributeName` | `FName` | `None` | `bApplyToAttribute` が有効な場合に操作する属性名。未指定なら最後に追加された属性を対象にします。 |
| `OffsetMin` / `OffsetMax` | `FVector` | `(0,0,0)` | 平行移動のランダム範囲。各軸を独立にサンプリングします。 |
| `bAbsoluteOffset` | `bool` | `false` | `true` でワールド（ポイント）座標へ直接加算、`false` でローカル軸方向に加算します。 |
| `RotationMin` / `RotationMax` | `FRotator` | `(0,0,0)` | 追加する回転のランダム範囲。ピッチ／ヨー／ロールを個別に抽選します。 |
| `bAbsoluteRotation` | `bool` | `false` | 既存回転を上書きするか、積算（乗算）するかを切り替えます。 |
| `ScaleMin` / `ScaleMax` | `FVector` | `(1,1,1)` | スケールのランダム範囲。`bUniformScale` によって挙動が変わります。 |
| `bAbsoluteScale` | `bool` | `false` | スケール値を絶対指定するか、要素ごとに乗算するかを制御します。 |
| `bUniformScale` | `bool` | `true` | `true` で X 成分のみを抽選し XYZ に適用、`false` で各軸を個別に抽選します。 |
| `bRecomputeSeed` | `bool` | `false` | 新しい位置に基づいてポイントシードを再計算します。`bApplyToAttribute` 有効時は無効化されます。 |

## 実装メモ

- 変換値は `PCGHelpers::ComputeSeed` から導出した `FRandomStream` でサンプリングされ、各ポイントに一貫した乱数が割り当てられます。<br><span style='color:gray'>(Random offsets derive from the point's seed so the result is deterministic per seed.)</span>
- `bApplyToAttribute` が有効な場合、対象属性が `FTransform` 型か検証し、メタデータにプレースホルダーを追加して値を書き戻します。<br><span style='color:gray'>(When targeting metadata the node validates type and writes back through delayed entries.)</span>
- `bAbsoluteOffset` が無効のときはポイントの現在の回転を基準にローカルオフセットを変換して加算するため、複合的な揺らぎを付与できます。<br><span style='color:gray'>(Relative offsets are rotated by the source quaternion before being applied.)</span>
