# Get Points Count

- **日本語名**: ポイント数を取得
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGNumberOfPointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGNumberOfElements.h:39`

## 概要

入力ポイント データ内のポイントの数を返します<br><span style='color:gray'>(Return the number of points in the input point data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bExactCount` | `bool` | `false` | `true` の場合、全ポイントを列挙して正確な個数を取得します。`false` なら高速な近似カウントを実行します。 |
