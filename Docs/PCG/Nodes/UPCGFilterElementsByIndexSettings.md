# Filter Elements By Index

- **日本語名**: 要素をインデックスでフィルタリング処理
- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGFilterElementsByIndexSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterElementsByIndex.h:10`

## 概要

属性セットの要素またはポイントを、ポイント、属性セットまたはユーザー定義インデックス範囲式の第 2 入力に基づいてフィルタリングします<br><span style='color:gray'>(Filters points or the elements of an attribute set based on a second input of points, attribute sets, or a user-defined index range expression.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bSelectIndicesByInput` | `bool` | `true` | 第二入力のポイント／属性セットからインデックス集合を受け取るか。 |
| `IndexSelectionAttribute` | `FPCGAttributePropertyInputSelector` | なし | インデックスを指定する属性。 |
| `SelectedIndices` | `FString` | `":"` | 文字列によるインデックス指定（`start:end` 形式など）。<br><span style='color:gray'>(Selected individual indices or index ranges...)</span> |
| `bOutputDiscardedElements` | `bool` | `false` | 除外された要素を別出力として保持するか。 |
| `bInvertFilter` | `bool` | `false` | インデックス集合を反転します。 |
