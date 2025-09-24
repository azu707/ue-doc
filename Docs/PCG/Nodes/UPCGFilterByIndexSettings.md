# Filter Data By Index

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGFilterByIndexSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByIndex.h:10`

## 概要

ユーザー選択インデックスに従ってコレクション内のデータをフィルタします<br><span style='color:gray'>(Filters data in the collection according to user selected indices)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bInvertFilter` | `bool` | `false` | 選択したインデックス集合を除外し、その他を残すモードに切り替えます。<br><span style='color:gray'>(Will invert which indices will be included and excluded.)</span> |
| `SelectedIndices` | `FString` | なし | インデックスや範囲をカンマ区切りで列挙します（例: `0,2,4:5,7:-1`）。<br><span style='color:gray'>(Selected individual indices or index ranges...)</span> |
