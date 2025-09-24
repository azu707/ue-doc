# Filter Data By Type

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGFilterByTypeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByType.h:10`

## 概要

データ型に従ってコレクション内のデータをフィルタします<br><span style='color:gray'>(Filters data in the collection according to data type)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `TargetType` | `EPCGDataType` | `EPCGDataType::Any` | 残すデータ型（Point、Spline など）を指定します。 |
| `bShowOutsideFilter` | `bool` | `false` | 取り除いたデータを追加出力に回すか。 |
