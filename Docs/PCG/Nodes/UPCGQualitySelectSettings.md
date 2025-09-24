# Runtime Quality Select

- **日本語名**: ランタイム品質選択
- **カテゴリ**: ControlFlow (制御フロー) — 6件
- **実装クラス**: `UPCGQualitySelectSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGQualitySelect.h:12`

## 概要

「pcg.Quality」設定に基づいて入力ピンから選択します<br><span style='color:gray'>(Selects from input pins based on 'pcg.Quality' setting.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bUseLowPin` | `bool` | `false` | `pcg.Quality = Low` の入力を選択候補に含めます。 |
| `bUseMediumPin` | `bool` | `false` | `Medium` 入力ピンを候補に含めます。 |
| `bUseHighPin` | `bool` | `false` | `High` 入力ピンを候補に含めます。 |
| `bUseEpicPin` | `bool` | `false` | `Epic` 入力ピンを候補に含めます。 |
| `bUseCinematicPin` | `bool` | `false` | `Cinematic` 入力ピンを候補に含めます。 |
