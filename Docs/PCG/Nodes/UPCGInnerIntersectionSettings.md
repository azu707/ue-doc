# Inner Intersection

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGInnerIntersectionSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGInnerIntersectionElement.h:10`

## 概要

他の入力ソースと順番に交差させた結果のみを空間データとして出力し、交差が存在しない場合は出力を生成しません。<br><span style='color:gray'>(Spatial data will be generated as the result of intersecting with the other source inputs sequentially or no output if such an intersection does not exist.)</span><br>参照: Intersection ノード<br><span style='color:gray'>(See also: Intersection Node)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bTagOutputsBasedOnInputs` | `bool` | `false` | 入力ピン名を元に出力へタグを付与し、どの入力と交差したかを判別できるようにします。 |
| `bKeepZeroDensityPoints` | `bool` | `false` | 交差結果で密度が 0 になったポイントも削除せず保持します。 |
