# Static Mesh Spawner

## 概要
Static Mesh Spawnerノードは、入力ポイントデータに基づいてスタティックメッシュインスタンスを効率的にスポーンします。Instanced Static Mesh Component (ISMC) または Hierarchical Instanced Static Mesh Component (HISMC) を使用して、大量のメッシュを高パフォーマンスで描画します。

- **ノードタイプ**: Spawner
- **クラス**: `UPCGStaticMeshSpawnerSettings`
- **エレメント**: `FPCGStaticMeshSpawnerElement`

## 機能詳細
このノードは、PCGポイントデータの各ポイントに対してスタティックメッシュインスタンスを生成します。メッシュセレクタシステムにより、様々な方法でメッシュを選択でき、カスタムデータパッキングにより属性をインスタンスデータとして渡すことができます。

### 主な機能
- **高効率インスタンシング**: ISMCまたはHISMCを使用した最適化されたレンダリング
- **柔軟なメッシュ選択**: 複数のメッシュセレクタモード（単一、属性ベース、ウェイト付き）
- **カスタムデータパッキング**: 属性をインスタンスごとのカスタムデータとして渡す
- **GPU実行対応**: GPU上での実行をサポート
- **プロパティオーバーライド**: ISMCデスクリプタのプロパティを動的に設定
- **非同期ロード**: メッシュとマテリアルの非同期ロードをサポート

### 処理フロー
1. 入力ポイントデータを取得
2. メッシュセレクタを使用してメッシュを選択
3. インスタンスデータパッカーでカスタムデータを準備
4. ISMCまたはHISMCを作成または取得
5. インスタンスを追加
6. ポストプロセス関数を実行

## プロパティ

### MeshSelectorType
- **型**: TSubclassOf<UPCGMeshSelectorBase>
- **カテゴリ**: MeshSelector
- **アクセス**: BlueprintReadOnly, EditAnywhere, NoClear
- **説明**: ポイントごとのメッシュ選択方法を定義します
  - `UPCGMeshSelectorWeighted`: ウェイト付きランダム選択
  - `UPCGMeshSelectorByAttribute`: 属性値に基づく選択

### MeshSelectorParameters
- **型**: UPCGMeshSelectorBase*（Instanced）
- **カテゴリ**: MeshSelector
- **アクセス**: BlueprintReadOnly, VisibleAnywhere
- **説明**: メッシュセレクタのパラメータ。セレクタタイプに応じて異なるプロパティを持ちます

### bAllowDescriptorChanges
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: MeshSelector
- **アクセス**: BlueprintReadOnly, EditAnywhere
- **説明**: PCGがデスクリプタに自動変更を適用できるようにします（例: Naniteメッシュ用にISMを使用）

### InstanceDataPackerType
- **型**: TSubclassOf<UPCGInstanceDataPackerBase>
- **カテゴリ**: InstanceDataPacker
- **アクセス**: BlueprintReadOnly, EditAnywhere
- **説明**: スポーンされた(H)ISMCのカスタムデータパッキング方法を定義します
  - 注意: Rotatorは3フロート、Quaternionは4フロートとして扱われます

### InstanceDataPackerParameters
- **型**: UPCGInstanceDataPackerBase*（Instanced）
- **カテゴリ**: InstanceDataPacker
- **アクセス**: BlueprintReadOnly, VisibleAnywhere
- **説明**: インスタンスデータパッカーのパラメータ

### StaticMeshComponentPropertyOverrides
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: 属性をISMデスクリプタのプロパティに直接マッピングします
- **注意**: 現在、SelectByAttributeメッシュ選択でのみ有効

### OutAttributeName
- **型**: FName
- **デフォルト値**: NAME_None
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: 出力ピンが接続されている場合、メッシュのSoftObjectPathを格納する属性名。既存の属性を上書きします

### bApplyMeshBoundsToPoints
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: 各ポイントのBoundsMinとBoundsMax属性を、その位置にスポーンされたスタティックメッシュの境界に設定します

### TargetActor
- **型**: TSoftObjectPtr<AActor>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite
- **PCG_Overridable**: あり
- **説明**: インスタンスをスポーンするターゲットアクター

### PostProcessFunctionNames
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: インスタンス生成後にターゲットアクターで呼び出す関数のリスト。パラメータレス、"CallInEditor"フラグが必要

### bSynchronousLoad
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings|Debug
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: メッシュ/マテリアルを非同期ではなく同期的にロードします

### bAllowMergeDifferentDataInSameInstancedComponents
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示**: AdvancedDisplay
- **PCG_Overridable**: あり
- **説明**: 異なるデータ由来のインスタンスを同じISMに統合できるようにします。falseの場合はパフォーマンス警告

### bSilenceOverrideAttributeNotFoundErrors
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示**: AdvancedDisplay
- **説明**: プロパティオーバーライド属性が見つからない場合のエラーを抑制します（オプトイン）

### bWarnOnIdenticalSpawn
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示**: AdvancedDisplay
- **説明**: 同一条件で繰り返しスポーンした際に警告を表示します（同じメッシュデスクリプタが同じ位置など）

## 使用例

### 基本的なメッシュスポーン
```
// 単一のメッシュを全ポイントにスポーン
MeshSelectorType: UPCGMeshSelectorWeighted
MeshSelectorParameters:
  MeshEntries: [
    - StaticMesh: SM_Tree
      Weight: 1.0
  ]
結果: すべてのポイント位置にSM_Treeがスポーンされる
```

### 属性ベースのメッシュ選択
```
// 属性値に基づいて異なるメッシュをスポーン
MeshSelectorType: UPCGMeshSelectorByAttribute
MeshSelectorParameters:
  AttributeName: "TreeType"
  AttributeToMeshMap:
    - AttributeValue: "Oak"
      Mesh: SM_Oak
    - AttributeValue: "Pine"
      Mesh: SM_Pine
結果: TreeType属性の値に応じて適切なメッシュがスポーンされる
```

### カスタムデータを使用したスポーン
```
// インスタンスごとにカスタムデータを渡す
InstanceDataPackerType: UPCGInstanceDataPackerByAttribute
InstanceDataPackerParameters:
  AttributeNames: ["TreeAge", "TreeHealth", "WindStrength"]
結果: マテリアルでアクセス可能なカスタムデータとして属性が渡される
```

### プロパティオーバーライドの使用
```
// 属性に基づいてISMCプロパティを動的に設定
MeshSelectorType: UPCGMeshSelectorByAttribute
StaticMeshComponentPropertyOverrides:
  - PropertyName: "CastShadow"
    AttributeName: "ShouldCastShadow"
  - PropertyName: "ReceivesDecals"
    AttributeName: "CanReceiveDecals"
結果: 各インスタンスグループがポイント属性に基づいて異なるプロパティを持つ
```

### 境界情報の出力
```
// スポーンしたメッシュの境界情報を保持
bApplyMeshBoundsToPoints: true
OutAttributeName: "SpawnedMesh"
結果: 各ポイントにBoundsMin/BoundsMax属性とメッシュパスが追加される
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（Spatial、複数接続可）: スポーン位置となるポイントデータ
- **出力ピン**:
  - "Out"（Point）: メッシュ情報と境界が追加されたポイントデータ

### 処理の特徴
- **GPU実行**: `DisplayExecuteOnGPUSetting()` が `true` を返し、GPU実行をサポート
- **メインスレッド実行**: 状況に応じて `CanExecuteOnlyOnMainThread()` が判定
- **キャッシュ不可**: `IsCacheable()` が `false` を返すため、結果はキャッシュされません
- **非同期ロード**: `PrepareDataInternal()` でメッシュとマテリアルの非同期ロードを準備
- **シード使用**: `UseSeed()` が `true` を返し、ランダム選択に使用

### コンテキスト
`FPCGStaticMeshSpawnerContext` を使用して、非同期ロードの状態とインスタンスリストを管理します。

### インスタンシング戦略
- 同じメッシュとマテリアルの組み合わせは単一のISMC/HISMCに統合されます
- デスクリプタの変更により、NaniteメッシュはISMCを使用します
- HISMCは階層的なカリングで大規模シーンのパフォーマンスを向上させます

## パフォーマンス考慮事項

1. **インスタンシングの効率**: 同じメッシュは可能な限り統合されます
2. **非同期ロード**: bSynchronousLoadはfalseのままにすることを推奨
3. **カスタムデータの量**: 大量のカスタムデータはメモリとパフォーマンスに影響します
4. **HISMC vs ISMC**: 大規模シーンではHISMCのカリングが有効です
5. **プロパティオーバーライド**: オーバーライドが多いとISMCが細分化されます
6. **bAllowMergeDifferentDataInSameInstancedComponents**: falseにするとISMCが大幅に増加し、パフォーマンスが低下します

## 注意事項

1. **メッシュの有効性**: 選択されたスタティックメッシュは有効なアセットである必要があります
2. **Naniteメッシュ**: NaniteメッシュはHISMCではなくISMCを使用します
3. **カスタムデータの型**: Rotatorは3フロート、Quaternionは4フロートとして扱われます
4. **属性の存在**: 属性ベース選択では、指定された属性がすべてのポイントに存在する必要があります
5. **マテリアルの互換性**: カスタムデータを使用する場合、マテリアルはPerInstanceCustomDataに対応している必要があります
6. **同一スポーン警告**: デバッグ目的で、同じ位置への重複スポーンを検出します

## 関連ノード
- **Instanced Skinned Mesh Spawner**: スキンメッシュのインスタンシング
- **Spawn Actor**: アクター単位でのスポーン
- **Create Target Actor**: スポーン先のターゲットアクターを作成
- **Point From Mesh**: メッシュからポイントを生成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGStaticMeshSpawner.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGStaticMeshSpawner.cpp`
- **コンテキスト**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGStaticMeshSpawnerContext.h`
