# Print String

- **日本語名**: 出力文字列
- **カテゴリ**: Debug (デバッグ) — 5件
- **実装クラス**: `UPCGPrintElementSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPrintElement.h:47`

## 概要

指定されたメッセージをログのほか、オプションでグラフや画面に出力します<br><span style='color:gray'>(Issues a specified message to the log, and optionally to the graph and/or screen.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PrintString` | `FString` | なし | ログや画面に表示するメッセージ本文。 |
| `Verbosity` | `EPCGPrintVerbosity` | `EPCGPrintVerbosity::Log` | メッセージのログレベル（Log/Warning/Error など）。 |
| `CustomPrefix` | `FString` | なし | メッセージの前に付加するプレフィックス。 |
| `bDisplayOnNode` | `bool` | `false` | ノード上に警告／エラーとして表示するか。 |
| `bPrintPerComponent` | `bool` | `true` | コンポーネントごとにメッセージを出力するか。 |
| `bPrintToScreen` | `bool` | `false` | ビューポート上にメッセージを表示するか。 |
| `PrintToScreenDuration` | `double` | `15.0` | 画面表示を行う場合の表示時間（秒）。 |
| `PrintToScreenColor` | `FColor` | `FColor::Cyan` | 画面表示するメッセージの色。 |
| `bPrefixWithOwner` | `bool` | `false` | メッセージにオーナーアクタ名を付けるか。 |
| `bPrefixWithComponent` | `bool` | `false` | メッセージにコンポーネント名を付けるか。 |
| `bPrefixWithGraph` | `bool` | `true` | メッセージにグラフ名を付与するか。 |
| `bPrefixWithNode` | `bool` | `true` | メッセージにノード名を付けるか。 |
| `bEnablePrint` | `bool` | `true` | ノードの出力機能を有効にするか。 |
