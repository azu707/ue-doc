# Instanced Skinned Mesh Spawner

## 概要
Instanced Skinned Mesh Spawnerノードは、入力ポイントデータに基づいてスキンメッシュ（AnimBankを使用）のインスタンスを効率的にスポーンします。アニメーション付きメッシュを大量に配置する際に、通常のSkeletal Meshよりも高いパフォーマンスを実現します。

- **ノードタイプ**: Spawner
- **クラス**: `UPCGSkinnedMeshSpawnerSettings`
- **エレメント**: `FPCGSkinnedMeshSpawnerElement`

## 機能詳細
このノードは、PCGポイントデータの各ポイントに対してスキンメッシュインスタンスを生成します。AnimBankシステムを使用することで、アニメーション付きのキャラクターやクリーチャーを大量に配置できます。

### 主な機能
- **AnimBankインスタンシング**: アニメーション付きメッシュの効率的な描画
- **柔軟なメッシュ選択**: 複数のメッシュセレクタモード（単一、属性ベース、ウェイト付き）
- **カスタムデータパッキング**: 属性をインスタンスごとのカスタムデータとして渡す
- **GPU実行対応**: GPU上での実行をサポート（将来的に有効化予定）
- **プロパティオーバーライド**: AnimBankデスクリプタのプロパティを動的に設定
- **非同期ロード**: メッシュとマテリアルの非同期ロードをサポート

### 処理フロー
1. 入力ポイントデータを取得
2. メッシュセレクタを使用してスキンメッシュを選択
3. インスタンスデータパッカーでカスタムデータを準備
4. AnimBankコンポーネントを作成または取得
5. インスタンスを追加
6. ポストプロセス関数を実行

## プロパティ

### MeshSelectorParameters
- **型**: UPCGSkinnedMeshSelector*（Instanced）
- **カテゴリ**: MeshSelector
- **アクセス**: BlueprintReadOnly, VisibleAnywhere
- **説明**: スキンメッシュセレクタのパラメータ。選択方法とメッシュリストを定義します

### InstanceDataPackerType
- **型**: TSubclassOf<UPCGSkinnedMeshInstanceDataPackerBase>
- **カテゴリ**: InstanceDataPacker
- **アクセス**: BlueprintReadOnly, EditAnywhere
- **説明**: スポーンされたAnimBankメッシュのカスタムデータパッキング方法を定義します
  - 注意: Rotatorは3フロート、Quaternionは4フロートとして扱われます

### InstanceDataPackerParameters
- **型**: UPCGSkinnedMeshInstanceDataPackerBase*（Instanced）
- **カテゴリ**: InstanceDataPacker
- **アクセス**: BlueprintReadOnly, VisibleAnywhere
- **説明**: インスタンスデータパッカーのパラメータ

### SkinnedMeshComponentPropertyOverrides
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: 属性をAnimBankデスクリプタのプロパティに直接マッピングします
- **注意**: 現在、SelectByAttributeメッシュ選択でのみ有効

### bApplyMeshBoundsToPoints
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: 各ポイントのBoundsMinとBoundsMax属性を、AnimBankメッシュの境界に設定します

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

### 基本的なAnimBankスポーン
```
// 単一のAnimBankメッシュを全ポイントにスポーン
MeshSelectorParameters:
  AnimBankEntries: [
    - AnimBank: ABP_Character
      Weight: 1.0
  ]
結果: すべてのポイント位置にABP_Characterがスポーンされる
```

### 属性ベースのメッシュ選択
```
// 属性値に基づいて異なるAnimBankをスポーン
MeshSelectorParameters:
  bSelectByAttribute: true
  AttributeName: "CharacterType"
  AttributeToMeshMap:
    - AttributeValue: "Warrior"
      AnimBank: ABP_Warrior
    - AttributeValue: "Mage"
      AnimBank: ABP_Mage
結果: CharacterType属性の値に応じて適切なAnimBankがスポーンされる
```

### カスタムデータを使用したスポーン
```
// インスタンスごとにカスタムデータを渡す
InstanceDataPackerType: UPCGSkinnedMeshInstanceDataPackerByAttribute
InstanceDataPackerParameters:
  AttributeNames: ["AnimationSpeed", "Health", "TeamColor"]
結果: マテリアルでアクセス可能なカスタムデータとして属性が渡される
```

### プロパティオーバーライドの使用
```
// 属性に基づいてAnimBankプロパティを動的に設定
SkinnedMeshComponentPropertyOverrides:
  - PropertyName: "AnimationRate"
    AttributeName: "SpeedMultiplier"
  - PropertyName: "LODDistanceScale"
    AttributeName: "ImportanceFactor"
結果: 各インスタンスグループがポイント属性に基づいて異なるアニメーション設定を持つ
```

### 大規模キャラクター配置
```
// 大量のアニメーションキャラクターを配置
MeshSelectorParameters:
  AnimBankEntries: [
    - AnimBank: ABP_Crowd_Walk
      Weight: 0.7
    - AnimBank: ABP_Crowd_Idle
      Weight: 0.3
  ]
bApplyMeshBoundsToPoints: true
結果: ウェイト付きランダムで選択されたAnimBankが効率的にスポーンされる
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（Spatial、複数接続可）: スポーン位置となるポイントデータ
- **出力ピン**:
  - "Out"（Point）: メッシュ情報と境界が追加されたポイントデータ

### 処理の特徴
- **GPU実行**: `CreateKernels()` メソッドが定義されているがコメントアウトされており、将来のGPU実行に対応予定
- **メインスレッド実行**: 状況に応じて `CanExecuteOnlyOnMainThread()` が判定
- **キャッシュ不可**: `IsCacheable()` が `false` を返すため、結果はキャッシュされません
- **非同期ロード**: `PrepareDataInternal()` でメッシュとマテリアルの非同期ロードを準備
- **シード使用**: `UseSeed()` が `true` を返し、ランダム選択に使用

### コンテキスト
`FPCGSkinnedMeshSpawnerContext` を使用して、非同期ロードの状態とインスタンスリストを管理します。

### AnimBankシステム
AnimBankは、アニメーション付きスキンメッシュを効率的にインスタンシングするためのUnrealEngineのシステムです。通常のSkeletalMeshComponentよりも大幅に少ないオーバーヘッドで、アニメーション付きメッシュを大量に描画できます。

## パフォーマンス考慮事項

1. **インスタンシングの効率**: 同じAnimBankは単一のコンポーネントに統合されます
2. **非同期ロード**: bSynchronousLoadはfalseのままにすることを推奨
3. **カスタムデータの量**: 大量のカスタムデータはメモリとパフォーマンスに影響します
4. **AnimBank vs Skeletal Mesh**: AnimBankは通常のSkeletal Meshよりも大幅に効率的です
5. **アニメーション複雑度**: 複雑なアニメーションはパフォーマンスに影響します
6. **LOD設定**: 適切なLOD設定で遠距離のパフォーマンスを最適化できます

## 注意事項

1. **AnimBankの有効性**: 選択されたAnimBankは有効なアセットである必要があります
2. **カスタムデータの型**: Rotatorは3フロート、Quaternionは4フロートとして扱われます
3. **属性の存在**: 属性ベース選択では、指定された属性がすべてのポイントに存在する必要があります
4. **マテリアルの互換性**: カスタムデータを使用する場合、マテリアルはPerInstanceCustomDataに対応している必要があります
5. **アニメーション同期**: すべてのインスタンスは同じアニメーションタイミングを共有します
6. **エディタ制限**: AnimBankのプレビューはエディタでは制限される場合があります

## 関連ノード
- **Static Mesh Spawner**: スタティックメッシュのインスタンシング
- **Spawn Actor**: アクター単位でのスポーン（個別アニメーション制御可能）
- **Create Target Actor**: スポーン先のターゲットアクターを作成
- **Point From Mesh**: メッシュからポイントを生成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSkinnedMeshSpawner.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSkinnedMeshSpawner.cpp`
