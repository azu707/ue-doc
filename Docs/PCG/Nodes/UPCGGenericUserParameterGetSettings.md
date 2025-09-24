# Get Graph Parameter

- **カテゴリ**: GraphParameters (グラフパラメータ) — 2件
- **実装クラス**: `UPCGGenericUserParameterGetSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGUserParameterGet.h:81`

## 概要

汎用型でグラフのユーザーパラメータを取得し、値を出力します。<br><span style='color:gray'>(Fetches user graph parameters in a type-safe manner and outputs the value.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PropertyPath` | `FString` | 空 | 取得したいパラメータへのパス。ドット区切りや配列インデックスに対応します。 |
| `bForceObjectAndStructExtraction` | `bool` | `false` | メタデータ対応の構造体／オブジェクトを展開し、子プロパティを個別属性にします。 |
| `bSanitizeOutputAttributeName` | `bool` | `true` | 特殊文字をクリーンアップして安全な属性名に変換します。 |
| `OutputAttributeName` | `FName` | `None` | 抽出結果の属性名を明示的に指定します。未指定の場合はパスから自動生成されます。 |
| `Source` | `EPCGUserParameterSource` | `Current` | 現在のグラフ、上流、ルートのどこからパラメータを検索するかを決定します。 |
| `bQuiet` | `bool` | `false` | 失敗時のログ出力を抑制します。ワイルドカード検索時などに便利です。 |

## 実装メモ

- `PropertyPath` は `GetPropertyByPath` 的なアクセサを通じてリフレクション検索され、見つかった型に応じて自動でメタデータ属性が生成されます。<br><span style='color:gray'>(The node walks reflection data to resolve the path and marshals values into metadata.)</span>
- `Source` が `Upstream` の場合は一つ上のグラフスタック、「Root」の場合はルートグラフに定義されたパラメータを探索します。<br><span style='color:gray'>(Different execution layers are looked up by chasing the graph execution hierarchy.)</span>
- 実行はメインスレッド限定で、失敗時には `bQuiet` フラグに応じて警告／エラーを抑制できます。固有の `FString` パスを利用できるため、固定 GUID に依存しない柔軟な参照方法として便利です。<br><span style='color:gray'>(Because it uses string paths, the node avoids stored GUIDs and remains flexible across graph refactors.)</span>
