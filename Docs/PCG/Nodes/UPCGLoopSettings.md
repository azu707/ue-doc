# Loop

- **カテゴリ**: Subgraph (サブグラフ) — 3件
- **実装クラス**: `UPCGLoopSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGLoopElement.h:9`

## 概要

ループ ピン (特定のループ ピンが指定されていない場合は最初のピン) で各データに対して指定サブグラフを実行し、残りの定数を維持します<br><span style='color:gray'>(Executes the specified Subgraph for each data on the loop pins (or on the first pin if no specific loop pins are provided), keeping the rest constant.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SubgraphOverride` | `TObjectPtr<UPCGGraphInterface>` | なし | 実行するサブグラフを個別指定する場合に使用します。 |
| `bUseGraphDefaultPinUsage` | `bool` | `true` | ループ／フィードバックピンの使い方をサブグラフ定義に従わせます。 |
| `LoopPins` | `FString` | なし | ループ対象のピン名をカンマ区切りで列挙します。複数指定時は同じデータ数である必要があります。 |
| `FeedbackPins` | `FString` | なし | 前回出力を次の入力に戻すフィードバックピン名のリスト。初期データを渡すことも可能です。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | ピン名の区切りとして空白を使用するか。 |
