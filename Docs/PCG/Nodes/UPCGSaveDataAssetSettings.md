# Save PCG Data Asset

- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGSaveDataAssetSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGSaveAssetElement.h:42`

## 概要

入力データを PCG データ アセットにエクスポートします<br><span style='color:gray'>(Exports the input data to a PCG Data Asset.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Pins` | `TArray<FPCGPinProperties>` | ノード既定の入力構成 | 保存対象とする入力ピンの定義。データの分岐やカスタムチャネルを新設したい場合に追加・編集します。 |
| `CustomDataCollectionExporterClass` | `TSubclassOf<UPCGDataCollectionExporter>` | `nullptr` | 既定のエクスポータを差し替えます。独自フォーマットや追記処理が必要な場合にカスタムサブクラスを指定します。 |
| `Params` | `FPCGAssetExporterParameters` | 構造体既定値 | 保存処理の振る舞い。保存ダイアログの表示 (`bOpenSaveDialog`)、アセット名／パス、書き出し後に自動保存するか (`bSaveOnExportEnded`) などを細かく制御できます。 |
| `AssetDescription` | `FString` | なし | 作成される PCG データアセットに書き込む説明文。アセットブラウザでの識別に役立ちます。 |
| `AssetColor` | `FLinearColor` | `FLinearColor::White` | Asset Browser やノードタイトルに表示されるカラー。成果物のカテゴリ分けに利用します。 |
