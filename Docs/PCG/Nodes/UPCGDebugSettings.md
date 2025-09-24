# Debug

- **カテゴリ**: Debug (デバッグ) — 5件
- **実装クラス**: `UPCGDebugSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDebugElement.h:13`

## 概要

入力データの内容を可視化・ログ出力するためのデバッグノードです。<br><span style='color:gray'>(Outputs logs or simple visualization to inspect the incoming data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | デバッグ情報を表示する対象アクタ。指定が無い場合は PCG コンポーネントが使用されます。 |
