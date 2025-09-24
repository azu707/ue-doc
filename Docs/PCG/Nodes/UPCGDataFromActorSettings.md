# Get Actor Data

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGDataFromActorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDataFromActor.h:29`

## 概要

選択したアクタから PCG 互換データのコレクションをビルドします<br><span style='color:gray'>(Builds a collection of PCG-compatible data from the selected actors.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ActorSelector` | `FPCGActorSelectorSettings` | なし | データ収集の対象となるアクター選択条件。範囲・タグ・クラスなどを指定します。 |
| `ComponentSelector` | `FPCGComponentSelectorSettings` | なし | 取得対象となるコンポーネント種別やタグを定義します。 |
| `Mode` | `EPCGGetDataFromActorMode` | `EPCGGetDataFromActorMode::ParseActorComponents` | 収集するデータの種類（コンポーネント解析、単一点、PCG コンポーネント複製など）を決定します。 |
| `bIgnorePCGGeneratedComponents` | `bool` | `true` | PCG によりスポーンされたコンポーネントを除外します。 |
| `bAlsoOutputSinglePointData` | `bool` | `false` | 選択アクターごとに位置情報のみのポイントデータも併せて出力します。 |
| `bComponentsMustOverlapSelf` | `bool` | `true` | ソースコンポーネントの境界と重なっているコンポーネントのみを対象とします。 |
| `bGetDataOnAllGrids` | `bool` | `true` | パーティション化された PCG コンポーネントからデータを取得する際に、全グリッドサイズを対象とします。 |
| `AllowedGrids` | `int32` | `int32(EPCGHiGenGrid::Uninitialized)` | 取得対象とするグリッドサイズをビットマスクで制限します。 |
| `bMergeSinglePointData` | `bool` | `false` | 単一点データを個別ではなく 1 つのコレクションにまとめます。 |
| `ExpectedPins` | `TArray<FName>` | なし | 取得したデータを自動的に接続するための出力ピン名リスト。同名のピンに自動でルーティングされます。 |
| `PropertyName` | `FName` | `NAME_None` | アクターから直接データコレクションを取得するプロパティ名。`Mode = GetDataFromProperty` で使用します。 |
| `bAlwaysRequeryActors` | `bool` | `false` | キャッシュを行わず、毎回アクター検索とデータ収集をやり直します。変化の激しいシーン向け。 |
| `bSilenceSanitizedAttributeNameWarnings` | `bool` | `false` | 属性名が正規化（無効文字の置換）された際の警告を抑制します。 |
| `bSilenceReservedAttributeNameWarnings` | `bool` | `false` | 予約語と衝突する属性名が除外された際の警告を抑制します。 |
| `bTrackActorsOnlyWithinBounds` | `bool` | `true` | エディタ上で、コンポーネント境界外のアクター変化では再実行を発生させないようにします。 |
