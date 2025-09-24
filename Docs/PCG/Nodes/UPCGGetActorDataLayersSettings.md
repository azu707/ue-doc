# Get Actor Data Layers

- **日本語名**: アクタデータレイヤーを取得
- **カテゴリ**: DataLayers (データレイヤー) — 2件
- **実装クラス**: `UPCGGetActorDataLayersSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetActorDataLayers.h:9`

## 概要

参照アクターが所属するデータレイヤー情報を取得します。<br><span style='color:gray'>(Retrieves the data layers an actor belongs to.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ActorReferenceAttribute` | `FPCGAttributePropertyInputSelector` | `Actor.Reference` | データレイヤーを調べるアクター参照を含む属性。ポイント／パラメータ入力のいずれにも対応します。 |
| `DataLayerReferenceAttribute` | `FPCGAttributePropertyOutputSelector` | `DataLayer.Reference` | 取得したデータレイヤー参照を出力する属性名。 |

## 実装メモ

- 入力ピンはポイントまたはパラメータデータを受け付け、アクター参照ごとに `UPCGParamData` を生成して Data Layer ソフト参照を列挙します。<br><span style='color:gray'>(Each input entry produces a param set listing the actor's data layer assets.)</span>
- 現状エディタ専用機能であり、ランタイムでは警告を出して終了します。<br><span style='color:gray'>(Execution logs an error when run at runtime worlds.)</span>
- 出力属性は `FSoftObjectPath` 型として追加されるため、他ノードからデータレイヤーアセット参照を直接扱えます。<br><span style='color:gray'>(The metadata attribute stores `FSoftObjectPath`, so downstream nodes can load data layer assets.)</span>
