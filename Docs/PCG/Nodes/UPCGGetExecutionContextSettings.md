# Get Execution Context Info

- **日本語名**: 実行コンテキスト情報を取得
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGGetExecutionContextSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetExecutionContext.h:24`

## 概要

コンテキストに特有の共通情報を返します<br><span style='color:gray'>(Returns some context-specific common information.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGGetExecutionContextMode` | `EPCGGetExecutionContextMode::IsRuntime` | ランタイムかどうかなど、取得するコンテキスト情報の種類を指定します。 |
