# Get Resource Path

- **カテゴリ**: Resource (リソース) — 2件
- **実装クラス**: `UPCGGetResourcePath`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetResourcePath.h:11`

## 概要

入力データが指すリソースパス文字列を取得して出力します。<br><span style='color:gray'>(Outputs the resource path associated with the incoming data.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| なし | — | — | ユーザーが編集する設定はありません。 |

## 実装メモ

- 入力は `EPCGDataType::Resource` のみ受け付け、`UPCGResourceData::GetResourcePath()` から取得したソフト参照を `ResourceReference` 属性として `UPCGParamData` に書き込みます。<br><span style='color:gray'>(Each resource input yields a param set with a `ResourceReference` soft object path.)</span>
- 実行依存ピンを持たないため、グラフの任意位置でリソース参照を文字列化する軽量ノードとして利用できます。<br><span style='color:gray'>(With no execution dependency pin the node can be dropped inline wherever resource metadata is needed.)</span>
