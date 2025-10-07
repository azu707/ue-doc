# Get Water Spline Data

## 概要

Get Water Spline Dataノードは、Water Pluginのウォータースプラインコンポーネントから専用のスプラインデータを取得するノードです。河川、湖、海洋などの水域の形状情報をPCGで利用可能にし、水辺の植生配置や地形生成に活用できます。

**ノードタイプ**: Spatial
**クラス**: 明示的な専用クラスは存在しない可能性（`UPCGGetSplineSettings`またはカスタム実装を使用）
**関連データ**: `UPCGLandscapeSplineData`（ウォータースプラインは同様の構造）

## 機能詳細

Get Water Spline Dataノードは、以下のタイプのウォーター関連スプラインからデータを取得できる可能性があります:

1. **Water Body Spline**: 水域の形状を定義するスプライン
2. **Water Zone Spline**: 水域ゾーンのスプライン
3. **Custom Water Splines**: プロジェクト固有のウォータースプライン

このノードは、水域に沿った以下のような処理に使用されます:
- **水辺の植生配置**: スプラインに沿って草や木を配置
- **桟橋や構造物の配置**: 水域の形状に基づいた構造物の配置
- **地形の調整**: 水域に合わせた地形の生成

## プロパティ

現在のPCGプラグインでは、明示的な"Get Water Spline Data"ノードは見つかりませんでした。ウォータースプラインデータの取得は以下の方法で行われる可能性があります:

### 代替方法1: Get Spline Data
`UPCGGetSplineSettings`を使用してウォータースプラインコンポーネントを取得

### 代替方法2: Get Actor Data
Water Bodyアクターからスプラインコンポーネントを解析

### 代替方法3: カスタム実装
プロジェクト固有のウォーター統合ノード

## 使用例

### 例1: Get Spline Dataを使用してウォータースプラインを取得
```
Get Spline Data:
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = WaterBodyRiver
  → WaterBodyのスプラインコンポーネントを取得
```

### 例2: 水辺に沿った植生配置
```
Get Spline Data (Water Body) -> Spline Sampler ->
  Offset (法線方向に移動) -> Surface Sampler (Landscape) ->
  Static Mesh Spawner (水辺の草)
```

### 例3: 川の両岸に木を配置
```
Get Spline Data (River) -> Spline Sampler ->
  Create Points (両側にオフセット) ->
  Static Mesh Spawner (Trees)
```

## 実装の詳細

### Water Bodyアクターの構造

Unreal EngineのWater Pluginでは、Water Bodyアクターがスプラインコンポーネントを含んでいます:

```cpp
// Water Body River Actor
AWaterBodyRiver
{
    SplineComp: UWaterSplineComponent*      // ウォータースプライン
    WaterSplineMetadata: UWaterSplineMetadata*  // 幅、深さなどのメタデータ
    // その他のコンポーネント
}
```

### Get Spline Data経由の取得

```cpp
// Get Spline Dataノードの設定
UPCGGetSplineSettings* Settings = NewObject<UPCGGetSplineSettings>();
Settings->ActorSelector.ActorFilter = EPCGActorFilter::AllWorldActors;
Settings->ActorSelector.ActorSelection = EPCGActorSelection::ByClass;
Settings->ActorSelector.ActorSelectionClass = AWaterBody::StaticClass(); // または AWaterBodyRiver など

// 実行すると、Water BodyのUWaterSplineComponentが取得される
```

### ウォータースプラインメタデータ

ウォータースプラインには、通常のスプラインにはない追加のメタデータが含まれています:

```cpp
UWaterSplineMetadata
{
    // 各制御点での設定
    Depth: float                // 水深
    Width: float                // 幅（川の場合）
    Velocity: float             // 流速
    AudioIntensity: float       // オーディオの強さ
    // その他の水域固有のプロパティ
}
```

### カスタムノードの実装例

プロジェクトでウォータースプライン専用のノードが必要な場合:

```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGGetWaterSplineSettings : public UPCGGetSplineSettings
{
    GENERATED_BODY()

public:
    UPCGGetWaterSplineSettings()
    {
        // Water Bodyアクターのみを対象
        ActorSelector.ActorSelectionClass = AWaterBody::StaticClass();
    }

    // Water固有のフィルタリング
    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    bool bIncludeRivers = true;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    bool bIncludeLakes = true;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    bool bIncludeOceans = false;

    // Water Spline Metadataの取得
    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    bool bExtractWaterMetadata = true;
};
```

### ウォータースプラインメタデータの抽出

```cpp
void ExtractWaterSplineMetadata(UWaterSplineComponent* WaterSpline, UPCGPolyLineData* OutData)
{
    if (!WaterSpline || !OutData) return;

    UWaterSplineMetadata* WaterMeta = Cast<UWaterSplineMetadata>(WaterSpline->GetSplinePointsMetadata());
    if (!WaterMeta) return;

    UPCGMetadata* PCGMeta = OutData->Metadata;

    // 深さ属性を作成
    FPCGMetadataAttribute<float>* DepthAttr = PCGMeta->CreateFloatAttribute("WaterDepth", 0.0f, true, false);

    // 幅属性を作成
    FPCGMetadataAttribute<float>* WidthAttr = PCGMeta->CreateFloatAttribute("WaterWidth", 0.0f, true, false);

    // 各制御点のメタデータを設定
    for (int32 i = 0; i < WaterSpline->GetNumberOfSplinePoints(); ++i)
    {
        float Depth = WaterMeta->Depth.Points[i].OutVal;
        float Width = WaterMeta->Width.Points[i].OutVal;

        PCGMetadataEntryKey Key = OutData->GetConstVerticesEntryKeys()[i];
        DepthAttr->SetValue(Key, Depth);
        WidthAttr->SetValue(Key, Width);
    }
}
```

## ウォータースプラインの活用パターン

### 1. 川沿いの植生配置
```
Get Spline Data (River) ->
  Spline Sampler (NumSamples = 100) ->
  Offset (Normal方向に±Width/2) ->
  Projection (Landscape) ->
  Density Noise ->
  Static Mesh Spawner (River Plants)
```

### 2. 水深に基づいた処理
```
Get Spline Data (Water) ->
  Get Spline Control Points ->
  Attribute Filter (WaterDepth > 2.0) ->
  処理（深い部分のみ）
```

### 3. 流速に基づいた効果配置
```
Get Spline Data (River) ->
  Sample Attribute (Velocity) ->
  Attribute Math (Velocity * Intensity) ->
  Spawn Particles (水飛沫)
```

### 4. 水辺の構造物配置
```
Get Spline Data (Lake) ->
  Spline Sampler (距離ベース) ->
  Offset (法線方向) ->
  Rotation Modifier (スプライン接線に整列) ->
  Static Mesh Spawner (桟橋セクション)
```

## トラブルシューティング

### Water Bodyが検出されない

**原因**:
- Water Pluginが有効化されていない
- Water Bodyアクターが正しく配置されていない
- アクターセレクター設定が正しくない

**解決策**:
```
1. プロジェクト設定でWater Pluginを有効化
2. Water Bodyアクターがレベルに配置されているか確認
3. ActorSelector.ActorSelectionClassを確認（AWaterBody, AWaterBodyRiver など）
```

### メタデータが取得できない

**原因**:
- Water Spline Metadataが設定されていない
- カスタム実装が必要

**解決策**:
```
1. Water BodyのSpline設定を確認
2. カスタムノードでメタデータ抽出処理を実装
3. Get Spline Control Pointsでメタデータエントリを確認
```

### 水辺の配置がずれる

**原因**:
- スプライン幅の考慮不足
- オフセット計算のミス
- ランドスケープとの不一致

**解決策**:
```
1. WaterWidthメタデータを使用してオフセット距離を調整
2. Projectionノードでランドスケープに投影
3. スプラインの法線方向を確認
```

## パフォーマンス考慮事項

1. **Water Bodyの数**: 多数のWater Bodyがある場合、フィルタリングを使用
2. **スプラインの複雑さ**: 多数の制御点を持つスプラインは処理コストが高い
3. **メタデータの抽出**: 追加のメタデータ処理はオーバーヘッドを増やす
4. **サンプリング密度**: スプラインに沿ったサンプリング数を調整

## Water Pluginとの統合

### Water Bodyタイプ

Unreal EngineのWater Pluginでは、複数のWater Bodyタイプがあります:

```cpp
// 河川
AWaterBodyRiver* River;
  → 直線的なスプライン、流れの方向あり

// 湖
AWaterBodyLake* Lake;
  → クローズドスプライン、静的な水面

// 海洋
AWaterBodyOcean* Ocean;
  → 大規模な水域、通常はスプラインなし

// カスタム
AWaterBodyCustom* Custom;
  → プロジェクト固有の水域
```

### 選択的な取得

```cpp
// 特定のWater Bodyタイプのみを取得
Get Spline Data:
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = AWaterBodyRiver  // 川のみ
  ActorSelector.bSelectMultiple = true
```

## 注意事項

1. **Water Plugin依存**: Water Pluginが有効化されている必要があります
2. **スプラインの方向**: 河川の場合、スプラインの方向が流れの方向を示します
3. **メタデータの可用性**: すべてのWater Bodyがメタデータを持つわけではありません
4. **パフォーマンス**: 複雑なウォーターシステムはPCG処理に影響を与える可能性があります

## 関連ノード
- Get Spline Data (スプラインデータの取得)
- Get Actor Data (アクターからのデータ取得)
- Spline Sampler (スプラインのサンプリング)
- Get Spline Control Points (制御点の抽出)
- Projection (サーフェスへの投影)

## 追加情報

現在のPCGプラグインには明示的な"Get Water Spline Data"ノードはありませんが、以下の方法でウォータースプラインデータを効果的に取得できます:

1. **Get Spline Data**: 最も簡単な方法、Water Bodyのスプラインコンポーネントを自動的に検出
2. **Get Actor Data**: より柔軟な設定、コンポーネントセレクターでフィルタリング可能
3. **カスタムノード**: プロジェクト固有の要件がある場合、専用ノードを実装

Water Pluginとの統合により、リアルな水辺の環境生成が可能になります。
