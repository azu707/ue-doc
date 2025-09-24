# Get Actor Property

- **カテゴリ**: Param (パラメータ) — 9件
- **実装クラス**: `UPCGGetActorPropertySettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetActorProperty.h:17`

## 概要

アクターの任意プロパティをリフレクション経由で読み出し、属性として利用します。<br><span style='color:gray'>(Reads an arbitrary actor property via reflection and exposes it as an attribute.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ActorSelector` | `FPCGActorSelectorSettings` | なし | 対象アクタの選択条件。 |
| `bSelectComponent` | `bool` | `false` | アクタではなくコンポーネントを対象にするか。 |
| `ComponentClass` | `TSubclassOf<UActorComponent>` | なし | 取得対象コンポーネントのクラス。 |
| `bProcessAllComponents` | `bool` | `false` | 該当するすべてのコンポーネントを処理するか（false なら最初の1つ）。 |
| `bOutputComponentReference` | `bool` | `false` | 取得したコンポーネント参照属性を出力に含めます。 |
| `PropertyName` | `FName` | `NAME_None` | 読み取るプロパティ名。未指定ならアクタ／コンポーネント自体を出力します。複数指定も可能。 |
| `bForceObjectAndStructExtraction` | `bool` | `false` | サポートされる構造体／オブジェクトを分解して全フィールドを抽出します。 |
| `OutputAttributeName` | `FPCGAttributePropertyOutputSelector` | なし | 出力属性名。複数プロパティ抽出時は無視されます。 |
| `bSanitizeOutputAttributeName` | `bool` | `true` | 不正文字を除外して属性名を整形します。 |
| `bOutputActorReference` | `bool` | `false` | 取得元のアクタ参照を属性として出力します。 |
| `bAlwaysRequeryActors` | `bool` | `true` | キャッシュせず毎回アクタを再取得します。 |
| `bTrackActorsOnlyWithinBounds` | `bool` | `false` | PCG コンポーネント境界外のアクタ変更で再実行しないようにします（エディタ専用）。 |
