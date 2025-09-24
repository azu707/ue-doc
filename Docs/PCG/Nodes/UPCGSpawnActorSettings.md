# Spawn Actor (Subgraph)

- **英語名**: Spawn Actor
- **カテゴリ**: Subgraph (サブグラフ) — 3件
- **実装クラス**: `UPCGSpawnActorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpawnActor.h:40`

## 概要

任意のアクタークラスをポイントごとに生成します。<br><span style='color:gray'>(Spawns the configured actor class at each point.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PostSpawnFunctionNames` | `TArray<FName>` | なし | スポーン後にテンプレートクラス上で呼ぶ関数。`CallInEditor` フラグ付きで、引数はなし、または `PCGPoint` / `PCGMetadata` のみ。 |
| `Option` | `EPCGSpawnActorOption` | `EPCGSpawnActorOption::CollapseActors` | 生成結果の統合方法（Collapse、NoMerging など）。新規ノードの既定は `NoMerging` に変更済みです。 |
| `bForceDisableActorParsing` | `bool` | `true` | アクタの解析処理を無効化してスポーンのみ実行します。 |
| `GenerationTrigger` | `EPCGSpawnActorGenerationTrigger` | `EPCGSpawnActorGenerationTrigger::Default` | 生成トリガー（常時 / 需要時など）を指定します。 |
| `bInheritActorTags` | `bool` | `false` | 親アクタのタグを継承するか。非統合階層でのみ機能します。 |
| `TagsToAddOnActors` | `TArray<FName>` | なし | 生成アクタへ追加するタグ。 |
| `TemplateActor` | `TObjectPtr<AActor>` | なし | 雛形として使用するアクタインスタンス。 |
| `SpawnedActorPropertyOverrideDescriptions` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | 生成アクタに適用するプロパティ上書き設定。 |
| `RootActor` | `TSoftObjectPtr<AActor>` | なし | アタッチ先のルートアクタ。 |
| `AttachOptions` | `EPCGAttachOptions` | `EPCGAttachOptions::Attached` | アタッチ方法（フォルダ配置など）。新規ノードの既定は `InFolder`。 |
| `bSpawnByAttribute` | `bool` | `false` | 属性に基づいてスポーンするアクタクラスを切り替えます。 |
| `SpawnAttribute` | `FName` | `NAME_None` | クラスやテンプレートを指定する属性名。 |
| `bWarnOnIdenticalSpawn` | `bool` | `true` | 同条件での再スポーン時に警告を表示します。 |
| `bDeleteActorsBeforeGeneration` | `bool` | `false` | 再生成前に既存アクタを削除するか。 |
| `DataLayerSettings` | `FPCGDataLayerSettings` | なし | データレイヤー配置設定。 |
| `HLODSettings` | `FPCGHLODSettings` | なし | HLOD に関するスポーン設定。 |
| `TemplateActorClass` | `TSubclassOf<AActor>` | `nullptr` | テンプレートアクタをクラスで指定する場合に使用します。 |
| `bAllowTemplateActorEditing` | `bool` | `false` | テンプレートアクタを編集可能にするか。 |
