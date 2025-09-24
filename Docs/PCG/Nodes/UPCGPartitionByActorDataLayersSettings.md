# Partition by Actor Data Layers

- **日本語名**: アクタデータレイヤーによるパーティション
- **カテゴリ**: DataLayers (データレイヤー) — 2件
- **実装クラス**: `UPCGPartitionByActorDataLayersSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPartitionByActorDataLayers.h:12`

## 概要

アクターの所属データレイヤー単位で入力データをグルーピングします。<br><span style='color:gray'>(Partitions input by the data layers of the reference actor.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ActorReferenceAttribute` | `FPCGAttributePropertyInputSelector` | `Actor.Reference` | パーティションの対象となるアクター参照を含む属性。 |
| `DataLayerReferenceAttribute` | `FPCGAttributePropertyOutputSelector` | `DataLayer.Reference` | 作成したデータレイヤーパーティションを格納する出力属性。 |
| `IncludedDataLayers` | `FPCGDataLayerReferenceSelector` | 空 | パーティション対象として許可するデータレイヤー。空ならすべて対象。 |
| `ExcludedDataLayers` | `FPCGDataLayerReferenceSelector` | 空 | 除外するデータレイヤー。優先度は除外が高く、含まれていればスキップされます。 |

## 実装メモ

- ノードはアクターごとに所属データレイヤーを列挙し、それぞれのレイヤーに対して新しいパラメータデータを生成します。`Included`/`Excluded` でフィルタリングした結果のみ出力されます。<br><span style='color:gray'>(Actors contribute partitions only for layers passing the include/exclude selectors.)</span>
- 出力は `UPCGParamData` として作成され、データレイヤー参照は `FSoftObjectPath` としてメタデータに格納されます。<br><span style='color:gray'>(Each partition holds a soft object path pointing to the layer asset.)</span>
- 実行はメインスレッド専用で、キャッシュ不可としてマークされているため常に最新の Data Layer 状態が反映されます。<br><span style='color:gray'>(Running on the main thread ensures editor data layer state is up to date per execution.)</span>
