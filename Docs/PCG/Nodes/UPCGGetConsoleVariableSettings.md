# Get Console Variable

- **日本語名**: コンソール変数を取得
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGGetConsoleVariableSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetConsoleVariable.h:13`

## 概要

指定したコンソール変数の値を取得し、PCG データとして利用します。<br><span style='color:gray'>(Reads a console variable and outputs its value as data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ConsoleVariableName` | `FName` | `NAME_None` | 取得するコンソール変数名。 |
| `OutputAttributeName` | `FName` | `NAME_None` | 読み取った値を書き込む属性名。 |
