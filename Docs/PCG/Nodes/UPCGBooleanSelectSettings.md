# Select (Boolean)

- **英語名**: Select (Multi)
- **カテゴリ**: ControlFlow (制御フロー) — 6件
- **実装クラス**: `UPCGBooleanSelectSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGBooleanSelect.h:11`

## 概要

「入力 B を使用」プロパティに基づいてピン A またはピン B のみのすべての入力データを選択する制御フロー ノード。これはオーバーライドすることもできます<br><span style='color:gray'>(Control flow node that will select all input data on either Pin A or Pin B only, based on the 'Use Input B' property - which can also be overridden.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bUseInputB` | `bool` | `false` | true の場合は入力 B を通し、false の場合は入力 A を通します。 |
