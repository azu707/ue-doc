# Random Choice

- **日本語名**: ランダムな選択
- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGRandomChoiceSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGRandomChoice.h:19`

## 概要

複数の入力データからランダムに 1 つを選択して出力します。<br><span style='color:gray'>(Randomly selects one of the connected inputs to output.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bFixedMode` | `bool` | `true` | 固定数で選ぶか、割合で選ぶかを切り替えます。 |
| `FixedNumber` | `int` | `1` | 固定モード時に保持するエントリ数。 |
| `Ratio` | `float` | `0.5` | 比率モード時に保持する割合（0〜1）。 |
| `bOutputDiscardedEntries` | `bool` | `true` | 除外されたエントリを追加出力に送るか。 |
| `bHasCustomSeedSource` | `bool` | `false` | 選択シードを属性から供給するか。 |
| `CustomSeedSource` | `FPCGAttributePropertyInputSelector` | なし | シード計算に使用する属性。 |
| `bUseFirstAttributeOnly` | `bool` | `true` | 複数属性がある場合に最初の要素だけでシードを生成するか。 |
