# Export Selected Attributes

- **日本語名**: 選択した属性をエクスポート
- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGExportSelectedAttributesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGExportSelectedAttributes.h:36`

## 概要

選択されている属性を、指定された形式でファイルに直接エクスポートします<br><span style='color:gray'>(Exports selected attributes directly to a file in a specified format.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Format` | `EPCGExportAttributesFormat` | `Binary` | 書き出しフォーマット。`Binary` は Unreal のアーカイブ形式、`Json` は人が読める JSON 形式で書き出します。 |
| `Layout` | `EPCGExportAttributesLayout` | `ByElement` | JSON 出力時のレイアウト。`ByElement` は各要素ごとに全属性を束ね、`ByAttribute` は属性ごとに全要素の値を並べます。`Binary` 選択時は変更不可です。 |
| `Path` | `FDirectoryPath` | なし | 出力先ディレクトリ。未指定の場合は実行時に保存ダイアログが表示されます。 |
| `FileName` | `FString` | なし | 書き出すファイル名（拡張子無し）。実際の拡張子は `Format` に応じて自動付与されます。 |
| `bExportAllAttributes` | `bool` | `true` | `true` で入力データのすべての属性／ポイントプロパティを出力します。`false` にすると任意の属性のみを選択できます。 |
| `AttributeSelectors` | `TArray<FPCGAttributePropertyInputSelector>` | 空 | `bExportAllAttributes = false` のときに使用。エクスポート対象とする属性名やポイントプロパティをセレクタで列挙します。 |
| `bAddCustomDataVersion` | `bool` | `false` | `true` にするとエクスポートメタデータにカスタムバージョン番号を含め、外部パイプラインで互換性チェックができるようにします。 |
| `CustomVersion` | `int32` | `0` | `bAddCustomDataVersion` が有効な場合に書き込む任意のバージョン番号。ツールチェーン間でスキーマ変更を伝えるために使用します。 |
