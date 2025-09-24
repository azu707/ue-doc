# Switch

- **英語名**: Select (Multi)
- **カテゴリ**: ControlFlow (制御フロー) — 6件
- **実装クラス**: `UPCGSwitchSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGSwitch.h:12`

## 概要

入力データを、特定の選択モードおよび対応する「選択」プロパティに一致する特定の出力ピンに対してパス スルーする制御フロー ノードです。このプロパティもオーバーライドされる場合があります<br><span style='color:gray'>(Control flow node that passes through input data to a specific output pin that matches a given selection mode and corresponding 'selection' property - which can also be overridden.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SelectionMode` | `EPCGControlFlowSelectionMode` | `EPCGControlFlowSelectionMode::Integer` | 出力選択に使用する値の種類。 |
| `IntegerSelection` | `int32` | `0` | `Integer` モードで選択する出力ピン番号。 |
| `IntOptions` | `TArray<int32>` | `{0}` | `Integer` モード時の出力候補。 |
| `StringSelection` | `FString` | なし | `String` モードで選択する出力キー。 |
| `StringOptions` | `TArray<FString>` | なし | `String` モードの出力候補。 |
| `EnumSelection` | `FEnumSelector` | なし | `Enum` モードで使用する列挙値。 |
