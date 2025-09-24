# Branch

- **英語名**: Select (Multi)
- **カテゴリ**: ControlFlow (制御フロー) — 6件
- **実装クラス**: `UPCGBranchSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGBranch.h:11`

## 概要

「B へ出力」プロパティに基づいて入力を出力 A または出力 B にルーティングする制御フロー ノード。これはオーバーライドすることもできます<br><span style='color:gray'>(Control flow node that will route the input to either Output A or Output B, based on the 'Output To B' property - which can also be overridden.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bOutputToB` | `bool` | `false` | true で出力 B にルーティングし、false で出力 A に送ります。 |
