# NamedRerouteUsage

- **カテゴリ**: Reroute (リルート) — 4件
- **実装クラス**: `UPCGNamedRerouteUsageSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGReroute.h:86`

## 概要

宣言済みの名前付きリルートを参照してデータを受け取ります。<br><span style='color:gray'>(Consumes an existing named reroute declaration to receive its data.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Declaration` | `UPCGNamedRerouteDeclarationSettings*` | `null` | 参照する宣言ノード。宣言ノードとのペアリングにより入力と同期されます。 |

## 実装メモ

- ノードは宣言ノードの出力ピンを内部的に検索し、該当するデータを自身の入力として受け取ります。宣言が未設定の場合、実行時にエラーが発生します。<br><span style='color:gray'>(The usage node resolves its declaration and pulls data forwarded by the declaration element.)</span>
- `CanCullTaskIfUnwired()` を `false` にオーバーライドしており、たとえ未接続でもタスクは実行され宣言側に問題があればログ出力されます。<br><span style='color:gray'>(Tasks are kept alive to surface errors when the reroute connection is broken.)</span>
