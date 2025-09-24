# Get Graph Parameter

- **カテゴリ**: GraphParameters (グラフパラメータ) — 2件
- **実装クラス**: `UPCGUserParameterGetSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGUserParameterGet.h:24`

## 概要

特定のユーザーパラメータを読み取り、PCG 内で利用します。<br><span style='color:gray'>(Reads a specific user parameter for use inside the PCG graph.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bForceObjectAndStructExtraction` | `bool` | `false` | メタデータ対応の構造体／オブジェクトパラメータを展開し、子プロパティを個別の属性として抽出します。 |
| `bSanitizeOutputAttributeName` | `bool` | `true` | 出力属性名から特殊文字を除去します。未検証の名前が必要な場合は無効化します。 |

（内部的には `PropertyGuid` と `PropertyName` が選択したグラフパラメータを追跡しますが、エディタ UI から直接変更することはありません。）

## 実装メモ

- ノードはプリタスク段階 (`RequiresDataFromPreTask`) でグラフインスタンスに登録されたユーザーパラメータを解決し、実行時にはメタデータ属性として複製します。<br><span style='color:gray'>(Parameters are fetched ahead of execution and materialized into metadata entries.)</span>
- パラメータ名の更新は `UpdatePropertyName` が担当し、変換プリセットを通じて別種の Getter ノードに置き換えることも可能です。<br><span style='color:gray'>(The node exposes conversion info so graph authors can swap between parameter getter variants.)</span>
- 実行はメインスレッド専用 (`CanExecuteOnlyOnMainThread`) かつ非キャッシュ (`IsCacheable == false`) のため、実行のたびに最新のグラフパラメータ値を取得します。<br><span style='color:gray'>(Because graph parameters are mutable, the node always pulls live values.)</span>
