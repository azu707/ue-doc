# Load PCG Data Asset

- **日本語名**: PCGデータアセットをロード
- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGLoadDataAssetSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGLoadAssetElement.h:18`

## 概要

PCG データアセットを読み込み、保存済みのデータをグラフへ取り込みます。<br><span style='color:gray'>(Loads a PCG Data Asset and injects its stored data into the graph.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Asset` | `TSoftObjectPtr<UPCGDataAsset>` | なし | 読み込む PCG データアセット。固定のアセットを指定する場合はここで設定します。 |
| `bLoadFromInput` | `bool` | `false` | `true` にすると入力データ内の属性からアセット参照を取得します。外部リストを基に複数アセットを切り替える際に使用します。 |
| `AssetReferenceSelector` | `FPCGAttributePropertyInputSelector` | なし | `bLoadFromInput = true` の場合に使用。入力データからアセット参照（ソフトオブジェクトパスなど）を読み取る属性／プロパティを指定します。 |
| `InputIndexTag` | `FName` | `NAME_None` | `bLoadFromInput` 時、ロードに使用した入力行インデックスを `Tag:Value` 形式で結果データに付与します。タグ名に使用するプレフィックスを指定します。 |
| `DataIndexTag` | `FName` | `NAME_None` | 読み込んだアセット内でのデータブロック順を `Tag:Value` 形式でタグ付けします。複数の出力を識別したい場合に使用します。 |
| `bSetDefaultAttributeOverridesFromInput` | `bool` | `false` | `true` で入力側に追加される属性セットピンからデフォルト属性値を上書きできます。動的に初期値を差し替える用途向けです。 |
| `DefaultAttributeOverrides` | `TArray<FString>` | 空 | `Tag:Value` 形式の文字列一覧。`bSetDefaultAttributeOverridesFromInput = false` の場合に、ロードしたデータへ適用する既定値の上書きを列挙します。 |
| `CommaSeparatedDefaultAttributeOverrides` | `FString` | なし | グラフ実行時に上書えられる一括指定用文字列。複数の `Tag:Value` をカンマ区切りで指定すると `DefaultAttributeOverrides` より優先されます。 |
| `bWarnIfNoAsset` | `bool` | `true` | アセットが無効または読み込めなかった場合に警告を出すかどうか。パイプライン監視向けの安全装置です。 |
| `bSynchronousLoad` | `bool` | `false` | アセットを同期ロードします。大量ロード時は非同期が推奨ですが、確実に即時展開したい場合に有効化します。 |
