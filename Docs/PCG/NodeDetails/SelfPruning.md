# Self Pruning

## 概要
Self Pruningノードは、ポイント同士が重なっている場合に、指定された戦略に基づいてポイントを削除する（プルーニングする）ノードです。大小に基づく削除、重複削除など、複数のプルーニングタイプをサポートし、コリジョンベースの高度な重なり判定も可能です。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGSelfPruningSettings
- **エレメント**: FPCGSelfPruningElement
- **基底クラス**: UPCGSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSelfPruning.h
- **実装ファイル**: Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSelfPruning.cpp

## 機能詳細
このノードは`UPCGSelfPruningSettings`クラスとして実装されており、以下の処理を行います:

- ポイント同士の重なりを検出してプルーニング
- 5つのプルーニングタイプ: LargeToSmall、SmallToLarge、AllEqual、None、RemoveDuplicates
- エクステント（範囲）またはカスタム属性に基づく比較
- ランダマイズされたプルーニングによる予測不可能性の追加
- コリジョンベースの重なり判定（メッシュの実際の形状を考慮）
- タイムスライス対応（大量のポイントでも処理を分割して実行）

## プロパティ

### Parameters
- **型**: FPCGSelfPruningParameters
- **カテゴリ**: Settings
- **説明**: プルーニングのすべてのパラメータを含む構造体です。
- **メタフラグ**: PCG_Overridable, ShowOnlyInnerProperties
- **Blueprint対応**: 読み書き可能

### Parameters.PruningType
- **型**: EPCGSelfPruningType
- **デフォルト値**: LargeToSmall
- **説明**: プルーニングの戦略を指定します。
  - **LargeToSmall**: 大きいポイントから処理し、重なる小さいポイントを削除
  - **SmallToLarge**: 小さいポイントから処理し、重なる大きいポイントを削除
  - **AllEqual**: すべてのポイントを同等に扱い、重なりを検出
  - **None**: プルーニングを行わない（パススルー）
  - **RemoveDuplicates**: 完全に重複するポイントを削除
- **メタフラグ**: PCG_Overridable

### Parameters.ComparisonSource
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: プルーニング時の比較に使用するソースを指定します。デフォルトではポイントのエクステントを使用しますが、Density、カスタム属性なども指定できます。数値またはベクトル（2乗長に変換）のみサポートします。
- **メタフラグ**: PCG_Overridable, EditCondition="PruningType == EPCGSelfPruningType::LargeToSmall || PruningType == EPCGSelfPruningType::SmallToLarge"

### Parameters.RadiusSimilarityFactor
- **型**: float
- **デフォルト値**: 0.25
- **カテゴリ**: Settings
- **説明**: 2つのポイントを「等しい」とみなす類似度係数です。例えば、ポイントのエクステントの2乗長が10で係数が0.25の場合、7.5から12.5の範囲にあるすべてのポイントは「同じ」とみなされます。
- **メタフラグ**: PCG_Overridable, EditCondition="PruningType == EPCGSelfPruningType::LargeToSmall || PruningType == EPCGSelfPruningType::SmallToLarge", ClampMin="0.0"

### Parameters.bRandomizedPruning
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: trueに設定すると、同じサイズのポイント間でランダムな順序でプルーニングが行われます。falseの場合、決定論的な順序になります。
- **メタフラグ**: PCG_Overridable

### Parameters.bUseCollisionAttribute
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、ポイントの代わりに指定されたメッシュのコリジョンを使用します。RemoveDuplicatesモードでは無視されます。
- **メタフラグ**: PCG_Overridable, EditCondition="PruningType != EPCGSelfPruningType::RemoveDuplicates"

### Parameters.CollisionAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: コリジョンとして使用するメッシュを指定する属性です。
- **メタフラグ**: PCG_Overridable, PCG_DiscardPropertySelection, PCG_DiscardExtraSelection, EditCondition="bUseCollisionAttribute && PruningType != EPCGSelfPruningType::RemoveDuplicates"

### Parameters.CollisionQueryFlag
- **型**: EPCGCollisionQueryFlag
- **デフォルト値**: Simple
- **カテゴリ**: Settings
- **説明**: コリジョンクエリでシンプルコリジョンまたはコンプレックスコリジョンを使用するかを制御します。コンプレックスを有効にすると、パフォーマンスに影響があります。
- **メタフラグ**: PCG_Overridable, PCG_OverrideAliases="bUseComplexCollision", EditCondition="bUseCollisionAttribute && PruningType != EPCGSelfPruningType::RemoveDuplicates"

## 使用例

### 例1: 大きいポイントを優先して保持
1. `Parameters.PruningType`を`LargeToSmall`に設定
2. `Parameters.RadiusSimilarityFactor`を`0.25`に設定
3. 実行すると、大きいポイントが優先的に保持され、重なる小さいポイントが削除されます

### 例2: 小さいポイントを優先して保持
1. `Parameters.PruningType`を`SmallToLarge`に設定
2. 実行すると、小さいポイントが優先的に保持され、重なる大きいポイントが削除されます

### 例3: 密度に基づくプルーニング
1. `Parameters.PruningType`を`LargeToSmall`に設定
2. `Parameters.ComparisonSource`を`Density`プロパティに設定
3. 実行すると、密度の高いポイントが優先的に保持されます

### 例4: カスタム属性でプルーニング
1. `Parameters.PruningType`を`LargeToSmall`に設定
2. `Parameters.ComparisonSource`をカスタム属性（例: `Priority`）に設定
3. 実行すると、指定された属性の値が大きいポイントが優先的に保持されます

### 例5: 完全な重複を削除
1. `Parameters.PruningType`を`RemoveDuplicates`に設定
2. 実行すると、完全に同じ位置にあるポイントが1つを除いて削除されます

### 例6: コリジョンベースのプルーニング
1. `Parameters.PruningType`を`LargeToSmall`に設定
2. `Parameters.bUseCollisionAttribute`をtrueに設定
3. `Parameters.CollisionAttribute`をメッシュ属性（例: `StaticMesh`）に設定
4. `Parameters.CollisionQueryFlag`を`Simple`に設定
5. 実行すると、メッシュの実際のコリジョン形状を使用して重なりを判定します

### 例7: ランダマイズを無効化
1. `Parameters.PruningType`を`LargeToSmall`に設定
2. `Parameters.bRandomizedPruning`をfalseに設定
3. 実行すると、決定論的な順序でプルーニングが行われ、同じ入力に対して常に同じ結果が得られます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup=(Procedural))
class UPCGSelfPruningSettings : public UPCGSettings

USTRUCT(BlueprintType)
struct FPCGSelfPruningParameters
```

### 入力ピン
- **In** (Primary): プルーニング対象のポイントデータ（DefaultPointInputPinProperties）

### 出力ピン
- **Out**: プルーニング後のポイントデータ（DefaultPointOutputPinProperties）

### 実行エレメント
```cpp
class FPCGSelfPruningElement : public TPCGTimeSlicedElementBase<PCGTimeSlice::FEmptyStruct, PCGSelfPruningElement::FIterationState>
{
protected:
    virtual bool PrepareDataInternal(FPCGContext* Context) const override;
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
    virtual bool CanExecuteOnlyOnMainThread(FPCGContext* Context) const override;
    virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: SelfPruning
- **表示名**: Self Pruning
- **カテゴリ**: Filter
- **タイムスライス対応**: true（TPCGTimeSlicedElementBaseを継承）
- **実行ループモード**: SinglePrimaryPin
- **Base Point Data対応**: true
- **メインスレッド実行**: 条件付き（コリジョン使用時など）

### 処理フロー

#### LargeToSmall / SmallToLarge / AllEqualモード
1. 入力ポイントデータを取得
2. `ComparisonSource`に基づいてポイントを比較値でソート
3. `RadiusSimilarityFactor`を適用してソートを調整
4. `bRandomizedPruning`がtrueの場合、同じサイズのポイントをランダムにソート
5. ソートされた順序でポイントを処理:
   - 現在のポイントが既に除外されている場合はスキップ
   - 現在のポイントを保持リストに追加
   - オクツリーを使用して重なるポイントを検索
   - 重なるポイントを除外リストに追加
6. 保持リストに含まれるポイントのみを出力

#### RemoveDuplicatesモード
1. 入力ポイントデータを取得
2. オクツリーを使用して完全に重複する位置のポイントを検索
3. 各位置で最初のポイントのみを保持
4. 重複するポイントを除外
5. 保持されたポイントのみを出力

#### コリジョンベースのプルーニング（bUseCollisionAttribute = true）
1. 入力ポイントデータを取得
2. `CollisionAttribute`で指定されたメッシュのコリジョンデータを準備
3. 各メッシュのボディインスタンスを作成またはキャッシュ
4. ソートされた順序でポイントを処理:
   - 現在のポイントのコリジョン形状を配置
   - 重なる可能性のあるポイントをオクツリーで検索
   - 各候補ポイントのコリジョン形状と実際の重なりをチェック
   - `CollisionQueryFlag`に基づいてシンプルまたはコンプレックスコリジョンを使用
   - 重なるポイントを除外リストに追加
5. 保持されたポイントのみを出力

### タイムスライシング
```cpp
struct FIterationState
{
    const UPCGBasePointData* InputData = nullptr;
    UPCGBasePointData* OutputData = nullptr;
    TArray<PCGPointOctree::FPointRef> SortedPointRefs;
    FPointBitSet ExcludedPoints;
    FPointBitSet ExclusionPoints;
    int32 CurrentPointIndex = 0;
    bool bSortDone = false;
    FPCGCollisionWrapper CollisionWrapper;
    TMap<FBodyInstance*, FBodyInstance*> TemporaryBodyInstances;
};
```
FIterationStateを使用して処理状態を保持し、大量のポイントでも処理を分割して実行できます。

### ビットセットの最適化
```cpp
struct FPointBitSet
{
    TArray<uint32> Bits;
    void Initialize(int32 NumPoints);
    void Add(int32 Index);
    bool Contains(int32 Index);
};
```
ポイントの除外チェックにビットセットを使用し、メモリ効率とアクセス速度を最適化しています。

### ソートアルゴリズム
```cpp
namespace PCGSelfPruningAlgorithms
{
    bool RandomSort(const UPCGBasePointData* PointData, const PCGPointOctree::FPointRef& A, const PCGPointOctree::FPointRef& B);
    bool SortSmallToLargeNoRandom(...);
    bool SortSmallToLargeWithRandom(...);
    void SortExtents(...);
}
```
複数のソートアルゴリズムを実装し、プルーニングタイプとランダマイズ設定に応じて使い分けます。

### ユーティリティ関数
```cpp
namespace PCGSelfPruningElement
{
    void Execute(FPCGContext* Context, EPCGSelfPruningType PruningType, float RadiusSimilarityFactor, bool bRandomizedPruning);
    void Execute(FPCGContext* Context, const FPCGSelfPruningParameters& InParameters);
    bool ExecuteSlice(FIterationState& InState, const FPCGSelfPruningParameters& InParameters, FPCGContext* InOptionalContext = nullptr);
}
```
他のノードから呼び出せるユーティリティ関数を提供しています。

## パフォーマンス考慮事項

### 最適化のポイント
- **オクツリー**: 空間クエリにオクツリーを使用し、効率的な重なり検出を実現
- **ビットセット**: 除外チェックにビットセットを使用し、メモリ効率とアクセス速度を最適化
- **タイムスライシング**: 大量のポイントでも処理を分割し、フレームレート低下を防止
- **ソートの最適化**: エクステントベースのソートは属性ベースより高速
- **コリジョンキャッシュ**: ボディインスタンスをキャッシュして再利用

### パフォーマンス特性
- **時間計算量**: O(N log N + N × K)（N = ポイント数、K = 平均重なりポイント数）
  - ソート: O(N log N)
  - プルーニング: O(N × K)
- **空間計算量**: O(N)（ビットセットとソート済みリスト）
- **オクツリークエリ**: O(log N + K)（各ポイントに対して）

### パフォーマンスへの影響要因
- **ポイント数**: ポイント数が増えると処理時間が増加
- **重なりの密度**: 重なりが多いほど除外チェックの回数が増加
- **コリジョン使用**: コリジョンベースのプルーニングは大幅にコストが高い
- **コンプレックスコリジョン**: シンプルコリジョンより遅い
- **ランダマイズ**: わずかなオーバーヘッドがある

### 最適化の推奨事項
1. 可能な限りエクステントベースのプルーニングを使用
2. コリジョンベースのプルーニングは必要な場合のみ使用
3. シンプルコリジョンを優先的に使用
4. タイムスライシングを有効にして大量のポイントを処理
5. `RadiusSimilarityFactor`を調整して処理の粒度を制御

## 注意事項
- このノードはポイントデータのみをサポートします（Spatial Dataの他の型はサポートしません）
- コリジョンベースのプルーニングは非常にコストが高く、パフォーマンスに大きな影響を与えます
- コンプレックスコリジョンを使用すると、さらにパフォーマンスが低下します
- `RadiusSimilarityFactor`が大きすぎると、意図せず多くのポイントが「等しい」とみなされます
- `RemoveDuplicates`モードでは、`ComparisonSource`と`RadiusSimilarityFactor`は使用されません
- ランダマイズされたプルーニングは、シード値が異なる場合に異なる結果を生成します
- オクツリーの構築にはわずかなオーバーヘッドがあります
- 非推奨のプロパティ（`PruningType_DEPRECATED`など）は古いプロジェクトからの移行用です
- タイムスライシングはコンテキストで有効化されている場合にのみ機能します

## 関連ノード
- **Density Filter**: 密度に基づくフィルタリング
- **Filter Elements By Index**: インデックスによる要素のフィルタリング
- **Random Choice**: ランダムな選択
- **Distance**: 距離による要素のフィルタリング
- **Point Neighborhood**: 近傍ポイントの検索
- **Difference**: 差集合演算
- **Union**: 和集合演算
- **Projection**: ポイントの投影
