# Select (Multi) - Branch

## 概要
Select (Multi) - Branchは、`Select (Multi)`ノードの概念的なバリエーションで、条件分岐のような動作を提供します。実装上は`UPCGMultiSelectSettings`と同じノードですが、複数の入力から1つを選択する「Branch」スタイルの使い方を強調しています。

## 注記
このドキュメントは概念的な参照用です。完全な技術詳細については、以下のメインドキュメントを参照してください：

**メインドキュメント**: [Select_MultiSelect.md](Select_MultiSelect.md)

## 概念的な用途
「Branch」という名前は、プログラミングにおける条件分岐（if-else、switch文など）の概念を反映しています。このノードは、整数、文字列、または列挙型の値に基づいて、複数の入力パスから1つを選択します。

### 典型的な使用シナリオ
- **条件に基づくパス選択**: ある条件（整数値、文字列ID、列挙型状態）に応じて、異なるデータソースや処理パイプラインを選択
- **Switch文のような動作**: 複数の選択肢から1つを選ぶSwitch文の動作をPCGグラフで実現
- **状態ベースの選択**: ゲームの状態、天候、時間帯などに応じて異なる処理を実行

## 主な特徴
- **3つの選択モード**: Integer、String、Enum
- **動的な入力ピン**: 選択肢に応じて入力ピンが自動生成
- **オーバーライド可能**: 選択値を他のノードから動的に設定可能
- **デフォルトケース**: 選択値が無効な場合のフォールバック

## 使用例

### 整数値による分岐（Switch-Case スタイル）
```
SelectionMode: Integer
IntOptions: {0, 1, 2, 3}
IntegerSelection: 2

入力:
"0" ← 処理A（初期化処理）
"1" ← 処理B（通常処理）
"2" ← 処理C（詳細処理）
"3" ← 処理D（最終処理）
"Default" ← エラー処理

Output → 次のノード

結果: IntegerSelection = 2 なので、処理Cが実行される
```

### 列挙型による状態分岐
```
SelectionMode: Enum
EnumSelection.Class: EGameState
EnumSelection.Value: InGame

入力:
"MainMenu" ← メインメニュー用のデータ
"InGame" ← ゲーム中のデータ
"Paused" ← ポーズ中のデータ
"GameOver" ← ゲームオーバー用のデータ
"Default" ← デフォルトデータ

結果: 現在のゲーム状態に応じたデータが選択される
```

## BranchとSelectの概念的な違い

| 概念 | 説明 | 実装 |
|------|------|------|
| Select | データソースの選択に焦点 | UPCGMultiSelectSettings |
| Branch | 条件分岐の制御フローに焦点 | 同上（同じクラス） |
| Switch | Switch-Case文のような動作 | 同上（同じクラス） |

実装は同じですが、用途や考え方が異なります：
- **Select**: 「どのデータソースを使うか」
- **Branch**: 「どの処理パスを通るか」
- **Switch**: 「どのケースに該当するか」

## 関連ドキュメント
- **[Select_MultiSelect.md](Select_MultiSelect.md)**: 完全な技術ドキュメント
- **[Select_Switch.md](Select_Switch.md)**: Switch文スタイルの概念的な参照
- **[Select_BooleanSelect.md](Select_BooleanSelect.md)**: ブール値による2つの入力からの選択
- **[RuntimeQualityBranch.md](RuntimeQualityBranch.md)**: 品質レベルに基づく出力分岐

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGMultiSelect.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/ControlFlow/PCGMultiSelect.cpp`
