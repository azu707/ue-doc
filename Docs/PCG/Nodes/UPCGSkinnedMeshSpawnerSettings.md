# Instanced Skinned Mesh Spawner

- **日本語名**: インスタンス化スキンメッシュスポナー
- **カテゴリ**: Spawner (スポナー) — 6件
- **実装クラス**: `UPCGSkinnedMeshSpawnerSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSkinnedMeshSpawner.h:22`

## 概要

スキンメッシュをポイントに沿ってスポーンし、スケルトン設定を反映します。<br><span style='color:gray'>(Spawns skinned meshes on points with appropriate skeletal setup.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InstanceDataPackerType` | `TSubclassOf<UPCGSkinnedMeshInstanceDataPackerBase>` | なし | アニメーション用カスタムデータの打ち込み方法を定義します。クォータニオン等の属性型に応じたパッキングを行うクラスを指定します。 |
| `SkinnedMeshComponentPropertyOverrides` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | 属性値をアニメバンク記述子のプロパティへマッピングして上書きします（現在は SelectByAttribute メッシュ選択時のみ有効）。 |
| `bApplyMeshBoundsToPoints` | `bool` | `true` | 生成されるメッシュの境界をポイントの BoundsMin/BoundsMax に反映させます。 |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | インスタンスを追加するターゲットアクタ。指定が無い場合は PCG 実行アクタが使用されます。 |
| `PostProcessFunctionNames` | `TArray<FName>` | なし | スポーン後にターゲットアクタ上で呼び出す `CallInEditor` 対応関数名を列挙します。 |
| `bSynchronousLoad` | `bool` | `false` | メッシュやマテリアルを同期ロードします。既定は非同期です。 |
| `bSilenceOverrideAttributeNotFoundErrors` | `bool` | `false` | プロパティ上書き用属性が見つからない場合のエラーを抑制します。 |
| `bWarnOnIdenticalSpawn` | `bool` | `true` | 同条件での再スポーン時に警告を出して無駄な生成を検知します。 |
