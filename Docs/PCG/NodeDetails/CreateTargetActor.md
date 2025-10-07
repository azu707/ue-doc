# Create Target Actor

## 概要
Create Target Actorノードは、PCG生成時に使用するターゲットアクターを動的に作成します。このアクターは、スポーンされたメッシュやコンポーネントのコンテナとして機能し、データレイヤーやHLOD設定を含む高度なワールドパーティション設定をサポートします。

- **ノードタイプ**: Spawner
- **クラス**: `UPCGCreateTargetActor`
- **エレメント**: `FPCGCreateTargetActorElement`

## 機能詳細
このノードは、PCGグラフの実行時に新しいアクターを作成し、後続のスポーンノードで使用できるようにします。テンプレートアクターから派生させることで、事前設定されたコンポーネントやプロパティを持つアクターを生成できます。

### 主な機能
- **テンプレートベースの生成**: テンプレートアクタークラスまたはインスタンスからアクターを作成
- **プロパティオーバーライド**: 生成されたアクターのプロパティを動的に設定
- **アタッチメント制御**: 生成されたアクターのアタッチメントオプションを設定
- **データレイヤー統合**: ワールドパーティションのデータレイヤーに割り当て
- **HLOD対応**: HLODシステムとの統合
- **ポストプロセス関数**: 生成後にカスタム関数を実行

### 処理フロー
1. 入力パラメータを取得（オーバーライド可能なプロパティを含む）
2. テンプレートアクタークラスまたはインスタンスからアクターをスポーン
3. プロパティオーバーライドを適用
4. データレイヤーとHLOD設定を設定
5. ポストプロセス関数を実行
6. アクター参照を出力

## プロパティ

### TemplateActor
- **型**: AActor*（オブジェクトポインタ、Instanced）
- **カテゴリ**: Settings
- **表示条件**: `bAllowTemplateActorEditing == true`
- **説明**: 生成するアクターのテンプレートインスタンス。直接編集可能で、詳細なカスタマイズが可能です

### TemplateActorClass
- **型**: TSubclassOf<AActor>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadOnly
- **メタ**: OnlyPlaceable, DisallowCreateNew
- **説明**: 生成するアクターのクラス。配置可能なアクタークラスのみ選択可能

### bAllowTemplateActorEditing
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite
- **説明**: trueの場合、TemplateActorのプロパティを直接編集できます

### AttachOptions
- **型**: EPCGAttachOptions
- **デフォルト値**: Attached（新規ノードはInFolder）
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite
- **説明**: 生成されたアクターのアタッチメント方法を指定
  - `Attached`: 親アクターにアタッチ
  - `InFolder`: フォルダに配置（アタッチしない）

### RootActor
- **型**: TSoftObjectPtr<AActor>
- **PCG_Overridable**: あり
- **説明**: アタッチオプションがAttachedの場合のアタッチ先アクター。デフォルトはコンポーネントのオーナー

### ActorLabel
- **型**: FString
- **PCG_Overridable**: あり
- **説明**: 作成されるアクターの名前（エディタ表示名）

### ActorPivot
- **型**: FTransform
- **PCG_Overridable**: あり
- **説明**: 作成されるアクターのトランスフォーム（位置、回転、スケール）

### PropertyOverrideDescriptions
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite
- **説明**: ターゲットアクターのデフォルトプロパティ値をオーバーライドします。ポストプロセス関数の前に適用されます

### PostProcessFunctionNames
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite
- **説明**: アクター作成後に呼び出す関数のリスト。関数はパラメータレスで、"CallInEditor"フラグが有効である必要があります

### DataLayerSettings
- **型**: FPCGDataLayerSettings
- **カテゴリ**: Streaming
- **アクセス**: BlueprintReadWrite
- **PCG_Overridable**: あり
- **説明**: ワールドパーティションのデータレイヤー設定

### HLODSettings
- **型**: FPCGHLODSettings
- **カテゴリ**: Streaming
- **表示名**: HLOD Settings
- **アクセス**: BlueprintReadWrite
- **PCG_Overridable**: あり
- **説明**: 階層的LOD（HLOD）の設定

### bDeleteActorsBeforeGeneration
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite
- **表示**: AdvancedDisplay
- **説明**: 生成前に既存のアクターを削除するかどうか

## 使用例

### 基本的なターゲットアクター生成
```
// 単純な空のアクターを作成
TemplateActorClass: Actor
ActorLabel: "PCG_Container"
AttachOptions: InFolder
結果: PCGコンテナとして機能する空のアクターが作成される
```

### カスタムアクターのスポーン
```
// プロパティ付きのカスタムアクターを作成
TemplateActorClass: BP_CustomContainer
ActorPivot: Transform(Location=(0,0,100))
PropertyOverrideDescriptions:
  - PropertyName: "CustomProperty"
    bOverrideValue: true
    Value: 42
結果: 特定の位置にカスタムプロパティを持つアクターが生成される
```

### データレイヤー統合
```
// 特定のデータレイヤーにアクターを配置
TemplateActorClass: Actor
DataLayerSettings:
  DataLayerAssets: [DataLayer_PCGGenerated]
AttachOptions: InFolder
結果: 指定されたデータレイヤーに割り当てられたアクターが作成される
```

### ポストプロセス関数の実行
```
// 生成後にカスタム初期化を実行
TemplateActorClass: BP_InitializableActor
PostProcessFunctionNames: ["InitializeComponents", "SetupMaterials"]
結果: アクター作成後に指定された関数が順番に実行される
```

### HLOD設定を持つアクター
```
// HLOD生成用のアクターを作成
TemplateActorClass: Actor
HLODSettings:
  HLODLayer: MyHLODLayer
  bIncludeInHLOD: true
結果: HLODシステムに統合されたアクターが生成される
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（Spatial、複数接続可）: オーバーライド可能なパラメータのソースとなるスペーシャルデータ
- **出力ピン**:
  - "Out"（Spatial）: 入力データをパススルー
  - "Target Actor"（Param）: 作成されたアクターへの参照

### 処理の特徴
- **メインスレッド実行**: `CanExecuteOnlyOnMainThread()` が `true` を返すため、メインスレッドでのみ実行されます
- **キャッシュ不可**: `IsCacheable()` が `false` を返すため、結果はキャッシュされません
- **アクター管理**: 生成されたアクターは自動的にPCGコンポーネントのマネージドリソースとして追跡されます

### エディタ機能
- **ブループリントイベント**: テンプレートアクターのブループリントが再コンパイルされた際に自動更新
- **Undo/Redo対応**: エディタのUndo/Redo操作に対応
- **プロパティ変更検出**: プロパティ変更時に適切な更新タイプを決定

## パフォーマンス考慮事項

1. **アクター生成コスト**: アクターの生成は比較的重い処理なので、必要な場合のみ使用してください
2. **プロパティオーバーライド**: オーバーライドが多いほど処理時間が増加します
3. **ポストプロセス関数**: 複雑な関数は生成時間を大幅に増加させる可能性があります
4. **データレイヤー**: データレイヤーの切り替えにはコストがかかります
5. **削除オプション**: bDeleteActorsBeforeGenerationを有効にすると、再生成時に追加の削除コストが発生します

## 注意事項

1. **テンプレートアクターの有効性**: テンプレートアクタークラスは有効な配置可能なクラスである必要があります
2. **ポストプロセス関数の要件**: 関数はパラメータレスで、"CallInEditor"フラグが必要です
3. **アタッチメントの制約**: Attachedモードでは、RootActorが有効なアクターである必要があります
4. **プロパティオーバーライドの型**: オーバーライドする型はアクターのプロパティ型と一致する必要があります
5. **ワールドパーティション**: データレイヤーとHLOD設定はワールドパーティション有効時のみ機能します

## 関連ノード
- **Spawn Actor**: ポイントごとにアクターをスポーン
- **Static Mesh Spawner**: スタティックメッシュインスタンスをスポーン
- **Spawn Spline Component**: スプラインコンポーネントをスポーン
- **Instanced Skinned Mesh Spawner**: スキンメッシュインスタンスをスポーン

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateTargetActor.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGCreateTargetActor.cpp`
