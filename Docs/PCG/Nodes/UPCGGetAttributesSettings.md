# Get Attribute List

- **日本語名**: 属性リストを取得
- **カテゴリ**: Param (パラメータ) — 9件
- **実装クラス**: `UPCGGetAttributesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetDataInfo.h:44`

## 概要

入力データの属性ごとに単一のエントリを持つ属性セットを作成します<br><span style='color:gray'>(Creates an attribute set with one entry per attribute on the input data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bGetType` | `bool` | `false` | 属性型を `'Type'` 属性として出力するか。 |
| `bGetDefaultValue` | `bool` | `false` | 属性のデフォルト値を `'DefaultValue'` 属性に出力するか。 |
