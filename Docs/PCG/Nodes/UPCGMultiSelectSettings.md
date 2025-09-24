# Multi Select

- **英語名**: Select (Multi)
- **カテゴリ**: ControlFlow (制御フロー) — 6件
- **実装クラス**: `UPCGMultiSelectSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGMultiSelect.h:12`

## 概要

指定選択モードと対応「選択」プロパティに一致する単一の入力ピンのすべての入力データを選択する制御フロー ノード。これもオーバーライドされる可能性があります<br><span style='color:gray'>(Control flow node that will select all input data on a single input pin that matches a given selection mode and corresponding 'selection' property - which can also be overridden.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SelectionMode` | `EPCGControlFlowSelectionMode` | `EPCGControlFlowSelectionMode::Integer` | 入力選択に使用する値の種類（整数／文字列／列挙）。 |
| `IntegerSelection` | `int32` | `0` | `Integer` モードで選択する入力ピン番号。 |
| `IntOptions` | `TArray<int32>` | `{0}` | `Integer` モードでの選択候補。 |
| `StringSelection` | `FString` | なし | `String` モードで選択するキー。 |
| `StringOptions` | `TArray<FString>` | なし | `String` モードの選択肢。 |
| `EnumSelection` | `FEnumSelector` | なし | `Enum` モードで使用する列挙値。 |
