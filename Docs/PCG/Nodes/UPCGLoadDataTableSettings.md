# Load Data Table

- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGLoadDataTableSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGDataTableElement.h:13`

## 概要

データを DataTable アセットからロードします<br><span style='color:gray'>(Loads data from DataTable asset)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `AttributeMapping` | `TMap<FString, FPCGAttributePropertyInputSelector>` | 空 | DataTable の列名を PCG の属性やポイントプロパティに割り当てます。列ごとに保存先を指定することで既定の属性名を上書きできます。 |
| `DataTable` | `TSoftObjectPtr<UDataTable>` | なし | 読み込む DataTable アセット。ソフト参照なので遅延ロードが可能です。 |
| `OutputType` | `EPCGExclusiveDataType` | `Point` | 出力データ型。`Point` でポイントデータ、`Param` で属性セットとして出力します。用途に合わせて選択してください。 |
| `bSynchronousLoad` | `bool` | `false` | `true` にすると DataTable を同期ロードします。非同期ロードでタイミングが合わない場合のデバッグ用途に利用します。 |
