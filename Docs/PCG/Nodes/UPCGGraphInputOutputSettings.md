# Input Node / Output Node

- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGGraphInputOutputSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/PCGInputOutputSettings.h:28`

## 概要

グラフの入出力ノードを提供し、外部データとの受け渡しを管理します。<br><span style='color:gray'>(Provides the graph’s input/output nodes to move data in and out of the PCG graph.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Pins` | `TArray<FPCGPinProperties>` | ノード種別に応じた既定値 | 入出力ピンの一覧。各要素でラベル、許可データ型、タグ付けなどを設定し、PCG グラフのインターフェースを拡張／整理できます。 |
