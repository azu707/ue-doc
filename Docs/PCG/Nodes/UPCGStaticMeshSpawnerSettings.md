# Static Mesh Spawner

- **カテゴリ**: Spawner (スポナー) — 6件
- **実装クラス**: `UPCGStaticMeshSpawnerSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGStaticMeshSpawner.h:21`

## 概要

静的メッシュをポイントの変換情報に基づいてスポーンします。<br><span style='color:gray'>(Instantiates static meshes using point transforms.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `MeshSelectorType` | `TSubclassOf<UPCGMeshSelectorBase>` | なし | 使用するメッシュ選択ロジック（リスト選択、属性参照など）を指定します。 |
| `bAllowDescriptorChanges` | `bool` | `true` | ナナイト対応などで必要な場合に ISM/HISM の自動切り替えなどを許可します。 |
| `InstanceDataPackerType` | `TSubclassOf<UPCGInstanceDataPackerBase>` | なし | インスタンス化メッシュのカスタムデータパッキング方法を定義します。 |
| `StaticMeshComponentPropertyOverrides` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | 属性から ISM ディスクリプタのプロパティを上書きします。 |
| `OutAttributeName` | `FName` | `NAME_None` | 出力ピン接続時に、使用したメッシュの SoftObjectPath を記録する属性名。既存と重複すると上書きされます。 |
| `bApplyMeshBoundsToPoints` | `bool` | `true` | 生成メッシュの境界をポイントの BoundsMin/BoundsMax に反映させます。 |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | インスタンスを配置するターゲットアクタ。 |
| `PostProcessFunctionNames` | `TArray<FName>` | なし | スポーン後に実行する関数リスト。 |
| `bSynchronousLoad` | `bool` | `false` | メッシュ／マテリアルを同期ロードします。 |
| `bAllowMergeDifferentDataInSameInstancedComponents` | `bool` | `true` | 異なる入力データ由来でも同一 ISM にまとめるか。OFF にすると描画コストが上がる場合があります。 |
| `bSilenceOverrideAttributeNotFoundErrors` | `bool` | `false` | プロパティ上書き用属性が見つからない場合のエラーを抑制します。 |
| `bWarnOnIdenticalSpawn` | `bool` | `true` | 同条件での再スポーン時に警告を出します。 |
