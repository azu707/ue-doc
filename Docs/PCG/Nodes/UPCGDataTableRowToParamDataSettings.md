# Data Table Row To Attribute Set

- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGDataTableRowToParamDataSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDataTableRowToParamData.h:13`

## 概要

Data Table の指定行を読み込み、属性セットとしてパラメータデータに変換します。<br><span style='color:gray'>(Loads a specific Data Table row and turns it into parameter data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `RowName` | `FName` | `NAME_None` | 取得する DataTable 行キー名。`NAME_None` のままでは実行時に入力ピンからの指定が必要になります。 |
| `DataTable` | `TSoftObjectPtr<UDataTable>` | なし | 読み込み対象の DataTable アセット。ソフト参照なので未ロードでも指定でき、実行時に解決されます。 |
| `bSynchronousLoad` | `bool` | `false` | `true` にすると DataTable を即座に同期ロードします。デフォルトの非同期ロードで依存関係が問題になる場合やデバッグ時に使用します。 |
