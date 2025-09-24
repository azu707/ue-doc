# Intersection

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGOuterIntersectionSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGOuterIntersectionElement.h:19`

## 概要

プライマリピンに与えた各入力について、他の入力（暗黙的に結合されたもの）と順次交差させ、交差が存在する場合にその空間データを出力します。追加ピンを動的に増やせ、同じピンの入力は自動的に結合されます。データが無い入力は、'Ignore Empty Secondary Input' フラグが true でない限り空の結果を返します。<br><span style='color:gray'>(For each given source input on the primary pin, spatial data will be generated as the result of sequentially intersecting with the other source inputs (implicitly unioned), should an intersection exist. Additional pins maybe dynamically added and for each of these, all of the inputs into the same pin will be 'unioned' together automatically. Source pins receiving no or empty data will logically return an empty output, unless the 'Ignore Empty Secondary Input' flag has been set to 'true'.)</span><br>参照: Inner Intersection ノード、Union ノード<br><span style='color:gray'>(See also: Inner Intersection Node, Union Node)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGIntersectionMode` | `EPCGIntersectionMode::Default` | 複数入力の交差方法（順序付き、全組合せなど）を選択します。 |
| `bIgnoreEmptySecondaryInput` | `bool` | `false` | 補助入力が空の場合でも交差を無視せず空結果を返すかどうか。 |
| `bTagOutputsBasedOnInputs` | `bool` | `false` | 入力ピン名を元に出力へタグを付与します。 |
