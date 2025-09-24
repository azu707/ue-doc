# Runtime Quality Branch

- **日本語名**: ランタイム品質ブランチ
- **カテゴリ**: ControlFlow (制御フロー) — 6件
- **実装クラス**: `UPCGQualityBranchSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGQualityBranch.h:12`

## 概要

「'pcg.Quality'」設定に基づいて入力データを動的にルーティングする制御フロー ノードです<br><span style='color:gray'>(Control flow node that dynamically routes input data based on 'pcg.Quality' setting.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bUseLowPin` | `bool` | `false` | `pcg.Quality = Low` の出力ピンを有効にします。 |
| `bUseMediumPin` | `bool` | `false` | `Medium` ピンを有効にします。 |
| `bUseHighPin` | `bool` | `false` | `High` ピンを有効にします。 |
| `bUseEpicPin` | `bool` | `false` | `Epic` ピンを有効にします。 |
| `bUseCinematicPin` | `bool` | `false` | `Cinematic` ピンを有効にします。 |
