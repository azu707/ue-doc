# Spatial Noise（空間ノイズ）

## 概要

Spatial Noiseノードは、様々なフラクタルノイズを使用してポイントをフィルタリングまたは属性を生成するノードです。Perlin、Caustic、Voronoi、FBM（Fractional Brownian Motion）、EdgeMaskなど、複数のノイズタイプをサポートします。

**ノードタイプ**: Spatial
**クラス名**: `UPCGSpatialNoiseSettings`, `FPCGSpatialNoise`

## 機能詳細

このノードは、ポイントの3D位置に基づいてノイズ値を計算し、その値を密度や属性として出力します。タイリング可能なノイズ、エッジブレンディング、Voronoiセルなど、高度なノイズ機能を提供します。

### 主な特徴

- **複数のノイズタイプ**: Perlin、Caustic、Voronoi、FBM、EdgeMask
- **タイリング対応**: シームレスに繰り返し可能なノイズ生成
- **フラクタルイテレーション**: 詳細度を制御可能
- **Voronoi特殊機能**: セルID、エッジ方向、ランダム性の調整
- **トランスフォーム適用**: ノイズ空間の回転・スケール・移動

## プロパティ

### Mode
- **型**: `PCGSpatialNoiseMode` (enum)
- **デフォルト値**: `Perlin2D`
- **説明**: 使用するノイズ手法
  - **Perlin2D**: クラシックなパーリンノイズ
  - **Caustic2D**: 水中のコースティック（焦線）レンダリングベース、渦巻き状の外観
  - **Voronoi2D**: ボロノイノイズ、エッジまでの距離とセルIDを出力
  - **FractionalBrownian2D**: フラクタルブラウニアンモーションベース
  - **EdgeMask2D**: エッジをブレンドアウトするマスク作成用
- **PCG_Overridable**: 可

### EdgeMask2DMode
- **型**: `PCGSpatialNoiseMask2DMode` (enum)
- **デフォルト値**: `Perlin`
- **説明**: EdgeMaskモードで使用するノイズタイプ（Mode == EdgeMask2Dの場合のみ）
  - Perlin、Caustic、FractionalBrownianから選択
- **PCG_Overridable**: 可

### Iterations
- **型**: `int32`
- **デフォルト値**: `4`
- **範囲**: 1 ~ 100
- **説明**: フラクタル手法の再帰回数。大きいほど詳細が増加（Voronoi以外）
- **PCG_Overridable**: 可

### bTiling
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: バウンディングボックスのサイズに沿ってタイリングする結果を生成するかどうか
- **PCG_Overridable**: 可

### Brightness
- **型**: `float`
- **デフォルト値**: `0.0`
- **説明**: ノイズ値に加算されるブライトネスオフセット
- **PCG_Overridable**: 可

### Contrast
- **型**: `float`
- **デフォルト値**: `1.0`
- **説明**: ノイズ値に乗算されるコントラスト係数
- **PCG_Overridable**: 可

### ValueTarget
- **型**: `FPCGAttributePropertyOutputNoSourceSelector`
- **説明**: ノイズ値を書き込む出力属性名。NAME_Noneでない場合、指定された属性に値を出力
- **PCG_Overridable**: 可

### RandomOffset
- **型**: `FVector`
- **デフォルト値**: `FVector(100000.0)`
- **説明**: この量までのランダムオフセットを追加。シード値に基づいて決定論的に生成
- **PCG_Overridable**: 可

### Transform
- **型**: `FTransform`
- **デフォルト値**: `FTransform::Identity`
- **説明**: ノイズ計算前にポイントに適用されるトランスフォーム（Voronoi非タイリング時またはVoronoi以外）
- **PCG_Overridable**: 可

### VoronoiCellRandomness
- **型**: `double`
- **デフォルト値**: `1.0`
- **範囲**: 0.0 ~ 1.0
- **説明**: ランダム性が少ないほどグリッドに近くなります（Voronoiモードのみ）
- **PCG_Overridable**: 可

### VoronoiCellIDTarget
- **型**: `FPCGAttributePropertyOutputNoSourceSelector`
- **説明**: ボロノイセルIDを書き込む出力属性名（Voronoiモードのみ）
- **PCG_Overridable**: 可

### bVoronoiOrientSamplesToCellEdge
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 出力ポイントをセルエッジに向けるかどうか。エフェクトに使用可能（Voronoiモードのみ）
- **PCG_Overridable**: 可

### TiledVoronoiResolution
- **型**: `int32`
- **デフォルト値**: `8`
- **範囲**: 最小1
- **説明**: タイル化されたボロノイのセル解像度（バウンズ全体）（Voronoi + Tilingの場合のみ）
- **PCG_Overridable**: 可

### TiledVoronoiEdgeBlendCellCount
- **型**: `int32`
- **デフォルト値**: `2`
- **説明**: エッジ周辺でタイリングするセルの数（Voronoi + Tilingの場合のみ）
- **PCG_Overridable**: 可

### EdgeBlendDistance
- **型**: `float`
- **デフォルト値**: `1.0`
- **説明**: この値が > 0 の場合、タイリングエッジ値にブレンド（EdgeMaskモードのみ）
- **PCG_Overridable**: 可

### EdgeBlendCurveOffset
- **型**: `float`
- **デフォルト値**: `1.0`
- **範囲**: 最小0
- **説明**: カーブの中心点を調整（x = curve(x) が交差する位置）（EdgeMaskモードのみ）
- **PCG_Overridable**: 可

### EdgeBlendCurveIntensity
- **型**: `float`
- **デフォルト値**: `1.0`
- **範囲**: 最小0
- **説明**: フォールオフをより急に、または柔らかくします（EdgeMaskモードのみ）
- **PCG_Overridable**: 可

## 使用例

### 基本的な使用方法

```
ポイント生成 → Spatial Noise → 密度フィルタまたは属性ベースの処理
```

### 実際のワークフロー例

1. **ランダム密度フィルタリング**
   - Surface Samplerでポイント生成
   - Spatial Noise (Perlin) でノイズベースの密度を適用
   - Density Filterでフィルタリング

2. **Voronoiセルベースの配置**
   - Grid Createでポイント生成
   - Spatial Noise (Voronoi2D) でセルIDを生成
   - セルIDに基づいて異なるアセットを配置

3. **エッジフェードアウト**
   - ポイント生成
   - Spatial Noise (EdgeMask2D) で境界をフェード
   - 滑らかなエッジ処理

4. **タイリングテクスチャ**
   - bTiling = true
   - シームレスに繰り返すノイズパターン生成

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpatialNoise.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSpatialNoise.cpp`

### 継承関係
- `UPCGSpatialNoiseSettings` ← `UPCGSettings`
- `FPCGSpatialNoise` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **設定の取得**: Mode、Iterations、Transformなどのパラメータを取得
2. **ランダムオフセット計算**: シードベースのオフセットを生成
3. **各ポイントの処理**:
   ```cpp
   for each point:
       // トランスフォーム適用
       position = Transform.TransformPosition(point.Position)
       position += RandomOffset

       // ノイズ値計算
       switch (Mode):
           case Perlin2D:
               value = PerlinNoise(position, Iterations)
           case Caustic2D:
               value = CausticNoise(position, Iterations)
           case Voronoi2D:
               (value, cellID) = VoronoiNoise(position, ...)
           // その他のモード...

       // Brightness/Contrast適用
       value = (value * Contrast) + Brightness

       // 値を属性または密度に出力
       if (ValueTarget != None):
           SetAttribute(ValueTarget, value)
       else:
           SetDensity(value)
   ```

### ノイズアルゴリズムの詳細

#### Perlin Noise
クラシックなグラデーションノイズ。滑らかで自然な見た目。

#### Caustic Noise
水中のコースティック（光の集中）パターンをシミュレート。渦巻き状の外観。

#### Voronoi Noise
最も近いボロノイセルの中心までの距離を計算。セルラーパターンを生成。

#### Fractional Brownian Motion (FBM)
複数のオクターブのノイズを重ね合わせて、自然な地形風のパターンを生成。

#### Edge Mask
バウンディングボックスのエッジから内側に向かってフェードするマスクを生成。

### タイリングの実装

```cpp
if (bTiling)
{
    // バウンディングボックスサイズに基づいて座標を正規化
    // 0-1の範囲にマッピングし、シームレスに繰り返し
    FLocalCoordinates2D localCoords = CalcLocalCoordinates2D(
        ActorLocalBox,
        ActorTransformInverse,
        Scale,
        Position
    );

    // 4つのコーナーでノイズを計算し、補間
}
```

### パフォーマンス特性

- **実行ループモード**: SinglePrimaryPin
- **BasePointData対応**: あり
- **シード使用**: モードによって異なる（UseSeed()で制御）
- **計算コスト**: Iterationsが高いほど計算コストが増加

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト): ポイントまたは空間データ
  - `Bounding Shape` (オプション): タイリング用のバウンズ
  - タイプ: Spatial系データ

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: 入力と同じ

### 技術的詳細

#### ローカル座標計算

```cpp
struct FLocalCoordinates2D
{
    double X0, Y0, X1, Y1;  // タイリングエッジの座標
    double FracX, FracY;    // コーナー間の補間係数
};

FLocalCoordinates2D CalcLocalCoordinates2D(
    const FBox& ActorLocalBox,
    const FTransform& ActorTransformInverse,
    FVector2D Scale,
    const FVector& Position
);
```

#### エッジブレンド計算

```cpp
double CalcEdgeBlendAmount2D(
    const FLocalCoordinates2D& LocalCoords,
    double EdgeBlendDistance
);
```

### 注意事項

1. **パフォーマンス**: Iterationsを高くすると計算コストが増加します
2. **タイリング**: bTilingを有効にする場合、適切なバウンディングボックスが必要です
3. **Voronoiセル**: タイリングVoronoiはエッジでブレンドするため、完全なセルパターンではありません
4. **トランスフォーム**: Transformはノイズ空間のスケールと回転に影響します
5. **シード依存**: RandomOffsetはシードに基づいて計算されます

### ユースケース

- **地形バリエーション**: 自然なランダムパターンで密度を変化
- **クラスタリング**: Voronoiで有機的なグループ化
- **境界フェード**: EdgeMaskでシームレスなエッジ処理
- **タイリングテクスチャ**: シームレスに繰り返すパターン生成
- **プロシージャルディテール**: FBMで詳細な自然パターン
