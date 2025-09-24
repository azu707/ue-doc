# Select Grammar

- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGSelectGrammarSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSelectGrammar.h:79`

## 概要

入力属性を指定基準と比較することで、文法を選択します<br><span style='color:gray'>(Select a grammar by comparing an input attribute against a provided criteria.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bKeyAsAttribute` | `bool` | `true` | キーを属性から取得するか固定値を使うか。 |
| `Key` | `FName` | なし | 固定キー値。 |
| `KeyAttribute` | `FPCGAttributePropertyInputSelector` | なし | 属性からキーを読み取る場合のセレクタ。 |
| `ComparedValueAttribute` | `FPCGAttributePropertyInputSelector` | なし | 選択条件と比較する入力属性。数値として評価されます。 |
| `bCriteriaAsInput` | `bool` | `false` | 追加入力から選択条件（Attribute Set）を受け取るか。 |
| `Criteria` | `TArray<FPCGSelectGrammarCriterion>` | なし | 評価順に並ぶ選択条件。 |
| `bCopyKeyForUnselectedGrammar` | `bool` | `false` | 文法が選ばれなかった場合に元のキーを保持するか。 |
| `bRemapCriteriaAttributeNames` | `bool` | `false` | 条件で使用する属性名を再マッピングします。 |
| `CriteriaAttributeNames` | `FPCGSelectGrammarCriteriaAttributeNames` | なし | 条件で期待する属性名のセット。 |
| `OutputGrammarAttribute` | `FPCGAttributePropertyOutputSelector` | なし | 選択された文法を書き込む属性。 |
