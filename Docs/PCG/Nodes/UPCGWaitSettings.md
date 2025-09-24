# Wait

- **日本語名**: ウェイト
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGWaitSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGWait.h:14`

## 概要

一定時間か一定フレーム数 (またはその両方) の間待機します。非常に特別なケースを除き、プロダクションで使用するべきノードではありません<br><span style='color:gray'>(Waits some time and/or frames. Not a node that should be used in production except in very special cases.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `WaitTimeInSeconds` | `double` | `1.0` | 待機する秒数。 |
| `WaitTimeInEngineFrames` | `int64` | `0` | エンジン フレーム数での待機。 |
| `WaitTimeInRenderFrames` | `int64` | `0` | レンダー フレーム数での待機。 |
| `bEndWaitWhenAllConditionsAreMet` | `bool` | `true` | すべての条件が満たされた場合のみ待機終了するか。 |
