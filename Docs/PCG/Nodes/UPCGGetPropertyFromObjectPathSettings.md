# Get Property From Object Path

- **カテゴリ**: Param (パラメータ) — 9件
- **実装クラス**: `UPCGGetPropertyFromObjectPathSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetPropertyFromObjectPath.h:13`

## 概要

オブジェクトパスで参照されるアセットのプロパティ値を取得します。<br><span style='color:gray'>(Resolves an object path and reads a property from the referenced asset.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ObjectPathsToExtract` | `TArray<FSoftObjectPath>` | なし | 入力が無い場合に読み込むアセットパスのリスト。 |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 入力データからアセットパスを取得する場合の属性。 |
| `PropertyName` | `FName` | `NAME_None` | 読み取るプロパティ名。未指定ならオブジェクト全体を出力。 |
| `bForceObjectAndStructExtraction` | `bool` | `false` | 対応する構造体／オブジェクトを展開し全フィールドを抽出します。 |
| `OutputAttributeName` | `FPCGAttributePropertyOutputSelector` | なし | 出力属性名。複数プロパティ抽出時は無視。 |
| `bSanitizeOutputAttributeName` | `bool` | `true` | 属性名から不正文字を取り除きます。 |
| `bSynchronousLoad` | `bool` | `false` | アセットを同期ロードします。 |
| `bPersistAllData` | `bool` | `false` | 取得できなかった場合でも空データを生成し、入出力数を揃えます。 |
| `bSilenceErrorOnEmptyObjectPath` | `bool` | `false` | パスが空の場合のエラーを抑制します。 |
