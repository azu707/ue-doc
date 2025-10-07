# Spawn Instanced Actors

## 概要
Spawn Instanced Actorsノードは、入力ポイントデータに基づいてアクターをスポーンします。Static Mesh SpawnerやInstanced Skinned Mesh Spawnerとは異なり、このノードは完全なアクターインスタンスを作成します。Spawn Actorノードの別名であり、実際には同じ実装を使用します。

- **ノードタイプ**: Spawner（内部的にはSubgraphとして動作）
- **クラス**: `UPCGSpawnActorSettings`
- **エレメント**: `FPCGSpawnActorElement`
- **ノード**: `UPCGSpawnActorNode`

## 機能詳細
このノードは、各ポイントに対して個別のアクターインスタンスを生成します。アクターのPCGコンポーネントを自動的に生成することもでき、入れ子になったPCG処理をサポートします。

### 主な機能
- **完全なアクター生成**: 各ポイントに個別のアクター
- **サブグラフ統合**: スポーンされたアクターのPCGコンポーネントを自動生成
- **アクター統合オプション**: CollapseActors、MergePCGOnly、NoMergingの3つのモード
- **プロパティオーバーライド**: スポーンされたアクターのプロパティを動的に設定
- **属性ベーススポーン**: 属性値に基づいて異なるアクタークラスをスポーン
- **ポストスポーン関数**: スポーン後にカスタム関数を実行

### 処理フロー
1. 入力ポイントデータを取得
2. 各ポイントに対してアクターをスポーン
3. プロパティオーバーライドを適用
4. ポストスポーン関数を実行
5. PCGコンポーネント生成（オプション）
6. サブグラフ実行（オプション）

## プロパティ

### TemplateActorClass
- **型**: TSubclassOf<AActor>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadOnly, EditAnywhere
- **メタ**: OnlyPlaceable, DisallowCreateNew
- **説明**: スポーンするアクターのクラス。配置可能なアクタークラスのみ選択可能

### TemplateActor
- **型**: AActor*（オブジェクトポインタ、Instanced）
- **カテゴリ**: Settings
- **表示条件**: `bAllowTemplateActorEditing && Option != CollapseActors`
- **説明**: スポーンするアクターのテンプレートインスタンス。直接編集可能

### bAllowTemplateActorEditing
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option != CollapseActors`
- **説明**: trueの場合、TemplateActorのプロパティを直接編集できます

### Option
- **型**: EPCGSpawnActorOption
- **デフォルト値**: CollapseActors（新規ノードはNoMerging）
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: アクタースポーンの動作モードを指定
  - `CollapseActors`: アクターを統合し、ISMCを使用
  - `MergePCGOnly`: PCGコンポーネントのみをマージ
  - `NoMerging`: 各ポイントに個別のアクターを生成

### bForceDisableActorParsing
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option == NoMerging`
- **説明**: アクターパーシング（静的メッシュの自動検出）を強制的に無効化

### GenerationTrigger
- **型**: EPCGSpawnActorGenerationTrigger
- **デフォルト値**: Default
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option == NoMerging`
- **説明**: PCGコンポーネントの生成トリガー
  - `Default`: "Generate On Load"の設定に従う
  - `ForceGenerate`: すべてのケースで生成
  - `DoNotGenerateInEditor`: エディタでは生成しない
  - `DoNotGenerate`: 生成しない

### bInheritActorTags
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option != CollapseActors`
- **説明**: 親アクターのタグを継承します
- **警告**: 非統合アクター階層でのみ機能します

### TagsToAddOnActors
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option != CollapseActors`
- **説明**: スポーンされたアクターに追加するタグのリスト

### PostSpawnFunctionNames
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option != CollapseActors`
- **説明**: 各アクタースポーン後に呼び出す関数のリスト（順番に実行）
- **要件**: "CallInEditor"フラグが有効で、パラメータなしまたはPCGPoint+PCGMetadataのパラメータのみ

### SpawnedActorPropertyOverrideDescriptions
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option != CollapseActors`
- **説明**: スポーンされたアクターのプロパティをオーバーライド

### RootActor
- **型**: TSoftObjectPtr<AActor>
- **PCG_Overridable**: あり
- **説明**: アタッチ先のルートアクター

### AttachOptions
- **型**: EPCGAttachOptions
- **デフォルト値**: Attached（新規ノードはInFolder）
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `Option != CollapseActors`
- **説明**: スポーンされたアクターのアタッチメント方法

### bSpawnByAttribute
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: InlineEditConditionToggle
- **説明**: 属性値に基づいて異なるアクタークラスをスポーン

### SpawnAttribute
- **型**: FName
- **デフォルト値**: NAME_None
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `bSpawnByAttribute`
- **説明**: スポーンするアクタークラスを指定する属性名

### bWarnOnIdenticalSpawn
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示**: AdvancedDisplay
- **説明**: 同一条件で繰り返しスポーンした際に警告を表示

### bDeleteActorsBeforeGeneration
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示**: AdvancedDisplay
- **説明**: 生成前に既存のアクターを削除

### DataLayerSettings
- **型**: FPCGDataLayerSettings
- **カテゴリ**: Streaming
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **PCG_Overridable**: あり
- **説明**: データレイヤー設定

### HLODSettings
- **型**: FPCGHLODSettings
- **カテゴリ**: Streaming
- **表示名**: HLOD Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **PCG_Overridable**: あり
- **説明**: HLOD設定

## 使用例

### 基本的なアクタースポーン（NoMergingモード）
```
// 各ポイントに個別のアクターをスポーン
TemplateActorClass: BP_TreeActor
Option: NoMerging
結果: 各ポイント位置にBP_TreeActorの完全なインスタンスが生成される
```

### CollapseActorsモードでの効率的なスポーン
```
// アクターを統合してISMCを使用
TemplateActorClass: BP_StaticProp
Option: CollapseActors
結果: すべてのメッシュがISMCに統合され、パフォーマンスが最適化される
```

### 属性ベースのアクタースポーン
```
// 属性値に基づいて異なるアクターをスポーン
bSpawnByAttribute: true
SpawnAttribute: "BuildingType"
// 各ポイントのBuildingType属性に基づいて、
// 異なるBuildingアクタークラスがスポーンされる
結果: 動的なアクタークラス選択
```

### ポストスポーン関数の使用
```
// スポーン後にカスタム初期化を実行
TemplateActorClass: BP_InteractiveObject
PostSpawnFunctionNames: ["Initialize", "SetupCollision", "RegisterWithSystem"]
Option: NoMerging
結果: 各アクタースポーン後に指定された関数が順番に実行される
```

### プロパティオーバーライド付きスポーン
```
// 属性に基づいてアクターのプロパティを設定
TemplateActorClass: BP_CustomActor
SpawnedActorPropertyOverrideDescriptions:
  - PropertyName: "Health"
    AttributeName: "MaxHealth"
  - PropertyName: "Speed"
    AttributeName: "MovementSpeed"
結果: 各アクターがポイント属性に基づいてカスタマイズされる
```

### サブグラフを持つアクターのスポーン
```
// PCGコンポーネントを持つアクターをスポーン
TemplateActorClass: BP_PCGActor（PCGコンポーネント付き）
GenerationTrigger: ForceGenerate
Option: NoMerging
結果: 各アクターのPCGコンポーネントが自動的に生成される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGBaseSubgraphSettings`を継承
- **Element**: `FPCGSubgraphElement`を継承
- **Node**: `UPCGBaseSubgraphNode`を継承

### 入出力ピン
- **入力ピン**:
  - "In"（Spatial、複数接続可）: スポーン位置となるポイントデータ
  - サブグラフの入力ピン（動的）
- **出力ピン**:
  - "Out"（Point）: スポーン情報が追加されたポイントデータ
  - サブグラフの出力ピン（動的）

### 処理の特徴
- **メインスレッド実行**: `CanExecuteOnlyOnMainThread()` が `true` を返す
- **キャッシュ不可**: `IsCacheable()` が `false` を返す
- **サブグラフ対応**: `IsDynamicGraph()` は `bSpawnByAttribute` の値を返す
- **ポイントデータ対応**: `SupportsBasePointDataInputs()` が `true` を返す

### サブグラフインターフェース
スポーンされたアクタークラスからPCGグラフインターフェースを取得し、サブグラフとして実行します。

## パフォーマンス考慮事項

1. **アクター数**: NoMergingモードは大量のアクターを生成し、パフォーマンスに影響します
2. **CollapseActorsの利点**: ISMCを使用するため、大幅にパフォーマンスが向上します
3. **サブグラフの複雑度**: 各アクターがPCGコンポーネントを持つ場合、生成コストが増加します
4. **プロパティオーバーライド**: オーバーライドが多いとスポーン時間が増加します
5. **ポストスポーン関数**: 複雑な関数はスポーン時間を大幅に増加させます
6. **属性ベーススポーン**: 動的なアクタークラス解決にわずかなオーバーヘッドがあります

## 注意事項

1. **アクタークラスの有効性**: テンプレートアクタークラスは有効な配置可能なクラスである必要があります
2. **ポストスポーン関数の要件**: 関数は"CallInEditor"フラグが必要で、パラメータなしまたはPCGPoint+PCGMetadataのみ
3. **タグの継承**: bInheritActorTagsは非統合アクター階層でのみ機能します
4. **サブグラフの制約**: サブグラフを持つアクターはNoMergingモードでのみ適切に機能します
5. **プロパティオーバーライドの型**: オーバーライドする型はアクターのプロパティ型と一致する必要があります
6. **属性の存在**: bSpawnByAttributeを使用する場合、指定された属性がすべてのポイントに存在する必要があります

## 関連ノード
- **Spawn Actor**: 同じ実装を使用する別名
- **Static Mesh Spawner**: ISMCを使用した効率的なメッシュスポーン
- **Instanced Skinned Mesh Spawner**: AnimBankを使用したスキンメッシュスポーン
- **Create Target Actor**: スポーン先のターゲットアクターを作成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpawnActor.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSpawnActor.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/PCGSubgraph.h`
