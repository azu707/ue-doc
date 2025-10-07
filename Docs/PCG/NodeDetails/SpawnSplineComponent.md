# Spawn Spline Component

## 概要
Spawn Spline Componentノードは、スプラインデータからスプラインコンポーネントを生成します。入力スプラインの形状を維持したまま、実際のUSplineComponentをワールドに配置します。

- **ノードタイプ**: Spawner
- **クラス**: `UPCGSpawnSplineSettings`
- **エレメント**: `FPCGSpawnSplineElement`

## 機能詳細
このノードは、PCGスプラインデータからUnreal EngineのSplineComponentを生成し、ターゲットアクターに追加します。スプラインに沿った道路、パイプライン、ケーブルなどの配置に使用できます。

### 主な機能
- **スプラインコンポーネント生成**: USplineComponentまたはそのサブクラスを生成
- **プロパティオーバーライド**: スプラインコンポーネントのプロパティを動的に設定
- **属性ベースのクラス選択**: 属性値に基づいて異なるスプラインコンポーネントクラスを使用
- **コンポーネント参照出力**: 生成されたコンポーネントへの参照を属性として出力
- **ポストプロセス関数**: 生成後にカスタム関数を実行

### 処理フロー
1. 入力スプラインデータを取得
2. スプラインコンポーネントクラスを決定（固定または属性ベース）
3. ターゲットアクターにスプラインコンポーネントを作成
4. スプライン形状をコピー
5. プロパティオーバーライドを適用
6. ポストプロセス関数を実行
7. コンポーネント参照を出力（オプション）

## プロパティ

### SplineComponent
- **型**: TSubclassOf<USplineComponent>
- **デフォルト値**: USplineComponent::StaticClass()
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: OnlyPlaceable, PCG_Overridable
- **説明**: スポーンするコンポーネントのクラス。USplineComponentのサブクラスである必要があります

### bSpawnComponentFromAttribute
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, InlineEditConditionToggle
- **説明**: trueの場合、コンポーネントクラスを属性から取得します

### SpawnComponentFromAttributeName
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, EditCondition = bSpawnComponentFromAttribute
- **メタ**: PCG_DiscardPropertySelection, PCG_DiscardExtraSelection
- **説明**: コンポーネントクラスを取得する属性の名前

### TargetActor
- **型**: TSoftObjectPtr<AActor>
- **PCG_Overridable**: あり
- **説明**: スプラインコンポーネントを追加するターゲットアクター

### PostProcessFunctionNames
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: スプライン作成後にターゲットアクターで呼び出す関数のリスト。パラメータレス、"CallInEditor"フラグが必要

### PropertyOverrideDescriptions
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: スポーンされたコンポーネントに適用するプロパティオーバーライド

### bOutputSplineComponentReference
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, InlineEditConditionToggle
- **説明**: スポーンされたコンポーネント参照を属性として出力するかどうか

### ComponentReferenceAttributeName
- **型**: FName
- **デフォルト値**: PCGAddComponentConstants::ComponentReferenceAttribute
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, EditCondition = bOutputSplineComponentReference
- **説明**: コンポーネント参照を出力する属性名

## 使用例

### 基本的なスプライン生成
```
// 単純なスプラインコンポーネントを作成
SplineComponent: USplineComponent
TargetActor: (CreateTargetActorノードの出力)
結果: 入力スプラインの形状を持つUSplineComponentが生成される
```

### カスタムスプラインクラスの使用
```
// カスタムスプラインコンポーネントを使用
SplineComponent: BP_CustomSplineComponent
PropertyOverrideDescriptions:
  - PropertyName: "Width"
    AttributeName: "RoadWidth"
  - PropertyName: "Material"
    AttributeName: "SurfaceMaterial"
結果: カスタムプロパティを持つスプラインコンポーネントが生成される
```

### 属性ベースのコンポーネントクラス選択
```
// 属性値に基づいて異なるスプラインクラスを使用
bSpawnComponentFromAttribute: true
SpawnComponentFromAttributeName: "SplineType"
// 各スプラインのSplineType属性に基づいて、
// 異なるスプラインコンポーネントクラスが使用される
結果: 動的なコンポーネントクラス選択
```

### 道路スプラインの生成
```
// 道路用スプラインを生成
SplineComponent: BP_RoadSplineComponent
PropertyOverrideDescriptions:
  - PropertyName: "Lanes"
    AttributeName: "LaneCount"
  - PropertyName: "SpeedLimit"
    AttributeName: "MaxSpeed"
PostProcessFunctionNames: ["GenerateRoadMesh", "PlaceRoadSigns"]
結果: 道路メッシュと標識が自動生成される
```

### コンポーネント参照の取得
```
// 後続処理のためにコンポーネント参照を保持
bOutputSplineComponentReference: true
ComponentReferenceAttributeName: "GeneratedSpline"
結果: "GeneratedSpline"属性に各スプラインコンポーネントへの参照が格納される
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（Spline、複数接続可）: スプライン形状のソースとなるスプラインデータ
- **出力ピン**:
  - "Out"（Spline）: 入力スプラインデータをパススルー

### 処理の特徴
- **メインスレッド実行**: `CanExecuteOnlyOnMainThread()` が `true` を返すため、メインスレッドでのみ実行
- **キャッシュ不可**: `IsCacheable()` が `false` を返すため、結果はキャッシュされない
- **コンポーネント管理**: 生成されたコンポーネントは自動的にPCGコンポーネントのマネージドリソースとして追跡

### スプライン形状のコピー
入力スプラインデータのすべてのコントロールポイント、タンジェント、回転情報が新しいスプラインコンポーネントにコピーされます。

### プロパティオーバーライドの適用順序
1. デフォルトのコンポーネントプロパティ
2. スプライン形状のコピー
3. プロパティオーバーライドの適用
4. ポストプロセス関数の実行

## パフォーマンス考慮事項

1. **スプラインの複雑度**: コントロールポイントが多いスプラインは処理時間が増加します
2. **プロパティオーバーライド**: オーバーライドが多いほど処理時間が増加します
3. **ポストプロセス関数**: 複雑な関数（メッシュ生成など）はパフォーマンスに大きく影響します
4. **コンポーネント数**: 大量のスプラインコンポーネントはメモリとパフォーマンスに影響します
5. **属性ベース選択**: 動的なクラス解決にわずかなオーバーヘッドがあります

## 注意事項

1. **コンポーネントクラスの有効性**: SplineComponentはUSplineComponentのサブクラスである必要があります
2. **ターゲットアクターの要件**: ターゲットアクターは有効で、コンポーネントを追加できる状態である必要があります
3. **ポストプロセス関数の要件**: 関数はパラメータレスで、"CallInEditor"フラグが必要です
4. **プロパティオーバーライドの型**: オーバーライドする型はコンポーネントのプロパティ型と一致する必要があります
5. **スプラインデータの型**: 入力はスプラインデータ型（PolyLineまたはLandscapeSpline）である必要があります
6. **属性の存在**: bSpawnComponentFromAttributeを使用する場合、指定された属性がすべてのスプラインに存在する必要があります

## 関連ノード
- **Spawn Spline Mesh**: スプラインに沿ってSplineMeshComponentをスポーン
- **Create Spline**: ポイントデータからスプラインを作成
- **Get Spline Data**: スプラインコンポーネントからPCGスプラインデータを取得
- **Create Target Actor**: スポーン先のターゲットアクターを作成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpawnSpline.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSpawnSpline.cpp`
