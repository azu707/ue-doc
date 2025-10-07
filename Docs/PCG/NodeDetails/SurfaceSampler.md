# Surface Sampler

## 概要

**ノードタイプ**: Sampler
**クラス**: UPCGSurfaceSamplerSettings
**エレメント**: FPCGSurfaceSamplerElement

Surface Samplerノードは、サーフェス（地形、メッシュ、プリミティブなど）上に規則的なグリッドパターンでポイントを生成します。地形上への植生配置や、サーフェスに沿ったオブジェクトの分布など、2Dサーフェス上のポイント生成に最適なノードです。

## 機能詳細

Surface Samplerノードは、PCGサーフェスデータ（ランドスケープ、スプライン、プリミティブなど）上に2Dグリッドパターンでポイントを生成します。ポイントの密度は平方メートルあたりのポイント数で制御され、各ポイントのサイズと配置のランダム性（Looseness）を調整できます。サーフェスの密度情報を自動的にポイントに適用することも可能です。

主な機能:
- 平方メートルあたりのポイント数による密度制御
- ポイントサイズ（Extents）のカスタマイズ
- Loosenessによる配置のランダム性制御
- サーフェス密度の自動適用
- タイムスライシングによる大規模データの処理
- バウンディングシェイプによる範囲制限

## プロパティ

### PointsPerSquaredMeter
- **型**: float
- **デフォルト値**: 0.1
- **説明**: グリッドセルのサイズを制御します。値が大きいほどポイント密度が高くなります。最小サイズはPoint Extentsによって定義されます
- **範囲**: 0以上
- **オーバーライド可能**: はい

### PointExtents
- **型**: FVector
- **デフォルト値**: (50.0, 50.0, 50.0)
- **説明**: 作成するポイントの範囲（ハーフサイズ）。各ポイントの実際のサイズは PointExtents × 2 になります。グリッドセルの最小サイズを決定します
- **オーバーライド可能**: はい

### Looseness
- **型**: float
- **デフォルト値**: 1.0
- **説明**: ポイントがセル内でどのように配置されるかを制御します。0の場合はセルの中心、1の場合はセル全体のどこでもランダムに配置されます
- **範囲**: 0以上
- **オーバーライド可能**: はい

### bUnbounded
- **型**: bool
- **デフォルト値**: false
- **説明**: Bounding Shape入力が提供されない場合、アクターバウンドを使用してサンプル生成ドメインを制限します。このオプションを有効にすると、アクターバウンドを無視してサーフェス全体に生成します。大量のポイントが生成される可能性があるため注意が必要です
- **オーバーライド可能**: はい

### bApplyDensityToPoints
- **型**: bool
- **デフォルト値**: true
- **説明**: trueの場合、サーフェスの密度情報をポイントに適用します。密度が低い領域ではポイントの密度も低くなります
- **オーバーライド可能**: はい
- **カテゴリ**: Settings|Points

### PointSteepness
- **型**: float
- **デフォルト値**: 0.5
- **説明**: 各PCGポイントは、ワールド空間の離散化されたボリューメトリック領域を表します。ポイントのSteepness値[0.0-1.0]は、そのボリュームの「硬さ」または「柔らかさ」を確立します。0では、ポイントの中心から最大2倍のバウンドまで密度が線形に増加します。1では、ポイントのバウンドサイズのバイナリボックス関数を表します
- **範囲**: 0.0 - 1.0
- **オーバーライド可能**: はい
- **カテゴリ**: Settings|Points

### bKeepZeroDensityPoints（エディタのみ）
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、密度がゼロのポイントも出力に含めます。デバッグ時に有用です
- **オーバーライド可能**: はい
- **カテゴリ**: Settings|Debug
- **注意**: エディタ専用のプロパティです

### bUseLegacyGridCreationMethod
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、以前のグリッド作成メカニズムを使用します（セルがextents × (1 + steepness)になり、その後平方メートルあたりのポイント数でフィルタリング）。互換性のために提供されています
- **カテゴリ**: Settings (Advanced Display)

## 入力ピン

### Surface
- **型**: Surface Data / Spatial Data
- **説明**: サンプリング対象のサーフェスデータ（ランドスケープ、スプライン、プリミティブなど）
- **ラベル**: "Surface"

### Bounding Shape（オプション）
- **型**: Spatial Data
- **説明**: サンプリング領域を制限するバウンディングシェイプ。提供されない場合、アクターバウンドが使用されます（bUnboundedがfalseの場合）
- **ラベル**: "Bounding Shape"

## 出力ピン

### Out
- **型**: Point Data
- **説明**: サーフェス上に生成されたポイント

## 使用例

### 例1: ランドスケープ上の植生配置
地形全体に草や木をランダムに配置する場合:
1. Get Landscape Dataでランドスケープデータを取得
2. Surface Samplerノードで接続:
   - PointsPerSquaredMeter: 0.5（適度な密度）
   - PointExtents: (25, 25, 25)（小さめの植生）
   - Looseness: 1.0（完全にランダム配置）
   - bApplyDensityToPoints: true（地形の密度を適用）
3. Density Filterで密度に基づいて間引き
4. Static Mesh Spawnerで植生メッシュを配置

### 例2: 特定エリアへの密な配置
プレイヤーの周辺に高密度でオブジェクトを配置する場合:
1. Get Landscape Dataでランドスケープを取得
2. Create Pointsで中心ポイントを作成
3. Boundsノードでバウンディングボックスを作成
4. Surface Samplerノードで:
   - Surface入力: ランドスケープ
   - Bounding Shape入力: バウンディングボックス
   - PointsPerSquaredMeter: 2.0（高密度）
   - Looseness: 0.5（半ランダム配置）
5. 指定されたエリアにのみポイントが生成されます

### 例3: 規則的なグリッドパターン
サーフェス上に整列したグリッドを作成する場合:
1. Get Primitive Dataでプリミティブサーフェスを取得（例：Box）
2. Surface Samplerノードで:
   - PointsPerSquaredMeter: 1.0
   - PointExtents: (50, 50, 50)
   - Looseness: 0.0（中央揃え、ランダム性なし）
   - bApplyDensityToPoints: false
3. 完全に規則的なグリッドパターンが生成されます

### 例4: 密度マップによる配置制御
テクスチャマップを使用して植生の密度を制御する場合:
1. Get Landscape Dataでランドスケープを取得
2. Get Texture Dataで密度マップを取得
3. ランドスケープとテクスチャを結合（Intersectionなど）
4. Surface Samplerノードで:
   - PointsPerSquaredMeter: 1.0
   - bApplyDensityToPoints: true（テクスチャの密度が適用される）
5. Density Filterで密度が高いポイントのみを残す
6. 白い領域にのみ植生が配置されます

## 実装の詳細

### 処理フロー

1. **入力の検証**: サーフェスデータとオプションのバウンディングシェイプを取得
2. **有効範囲の計算**:
   - Bounding Shapeが提供されている場合、そのバウンドを使用
   - 提供されていない場合、bUnboundedがfalseならアクターバウンドを使用
   - bUnboundedがtrueの場合、サーフェス全体を使用
3. **グリッドパラメータの計算**:
   - PointsPerSquaredMeterとPointExtentsからセルサイズを計算
   - セルの数（X、Y方向）を計算
4. **グリッドポイントの生成**（タイムスライシング可能）:
   - 各セルに対してループ
   - Loosenessに基づいてセル内のランダム位置を計算
   - シードを使用してランダム位置を決定（決定論的）
5. **サーフェスへの投影**:
   - 各グリッドポイントをサーフェスに投影
   - サーフェスの法線方向を取得
6. **密度の適用**:
   - bApplyDensityToPointsがtrueの場合、サーフェスの密度を各ポイントに適用
7. **ポイント属性の設定**:
   - 位置、回転（法線方向）、スケール、密度、シードなどを設定
8. **ゼロ密度ポイントのフィルタリング**:
   - bKeepZeroDensityPointsがfalseの場合、密度ゼロのポイントを除外
9. **出力の生成**: 生成されたポイントデータを出力

### コードスニペット

**サーフェスサンプリング用のヘルパー関数**:
```cpp
namespace PCGSurfaceSampler
{
    // サーフェスをサンプリングして結果のポイントデータを返す
    // タイムスライシング不可
    PCG_API UPCGBasePointData* SampleSurface(
        FPCGContext* Context,
        const FSurfaceSamplerParams& ExecutionParams,
        const UPCGSurfaceData* InSurface,
        const UPCGSpatialData* InBoundingShape,
        const FBox& EffectiveBounds,
        TSubclassOf<UPCGBasePointData> PointDataClass = nullptr);

    // サーフェスをサンプリングし、結果を指定されたポイントデータに書き込む
    // タイムスライシング可能、処理が完了していない場合はfalseを返す
    bool SampleSurface(
        FPCGContext* Context,
        const FSurfaceSamplerData& SamplerData,
        const UPCGSurfaceData* InSurface,
        const UPCGSpatialData* InBoundingShape,
        UPCGBasePointData* SampledData,
        const bool bTimeSlicingIsEnabled = false);
}
```

**タイムスライシングのサポート**:
```cpp
class FPCGSurfaceSamplerElement : public TPCGTimeSlicedElementBase<
    PCGSurfaceSampler::FSurfaceSamplerExecutionState,
    PCGSurfaceSampler::FSurfaceSamplerIterationState>
{
    // タイムスライシングをサポートする実装
};
```

**FullOutputDataCrcの計算**:
```cpp
// ランドスケープや外部データをサンプリングする可能性があるため、
// 変更伝播/再実行を停止できる場合に備えて完全なCRCを計算する価値がある
virtual bool ShouldComputeFullOutputDataCrc(FPCGContext* Context) const override
{
    return true;
}
```

### グリッド生成のアルゴリズム

1. **セルサイズの計算**:
   - `CellSize = 1.0 / sqrt(PointsPerSquaredMeter)`
   - ただし、`CellSize >= PointExtents × 2`（最小サイズ制約）

2. **セル数の計算**:
   - `CellCountX = floor(BoundsX / CellSize)`
   - `CellCountY = floor(BoundsY / CellSize)`

3. **セル内の位置**:
   - Looseness = 0: セルの中心 `(CellSize / 2, CellSize / 2)`
   - Looseness > 0: `Center + RandomOffset × Looseness × (CellSize / 2)`

4. **ランダムオフセット**: シードとセルインデックスから決定論的に生成

## パフォーマンス考慮事項

1. **タイムスライシング**: Surface Samplerはタイムスライシングをサポートしており、大量のポイントを生成する場合でもフレームレートへの影響を最小限に抑えます。

2. **密度制御**: PointsPerSquaredMeterを小さくすることで、生成されるポイント数を減らし、パフォーマンスを向上させることができます。

3. **バウンディングシェイプの使用**: 必要な領域のみをサンプリングすることで、不要な計算を避けることができます。

4. **サーフェスタイプ**: サーフェスのタイプによってサンプリングコストが異なります:
   - ランドスケープ: 中程度（高さクエリが必要）
   - プリミティブ: 比較的高速
   - スプライン: 中程度

5. **bApplyDensityToPoints**: 密度適用を無効にすることで、わずかにパフォーマンスが向上しますが、密度制御ができなくなります。

6. **Looseness**: Loosenessが0でない場合、各ポイントに対してランダム計算が追加されますが、コストはわずかです。

7. **FullOutputDataCrc**: 変更伝播を最適化するために完全なCRCを計算します。外部データ（ランドスケープなど）をサンプリングする場合、変更検出に有用です。

8. **レガシーメソッド**: bUseLegacyGridCreationMethodは、古いワークフローとの互換性のために提供されていますが、新しいメソッドの方が効率的です。

## 関連ノード

- **Volume Sampler**: 3Dボリューム内にポイントを生成
- **Spline Sampler**: スプライン上または周囲にポイントを生成
- **Get Landscape Data**: ランドスケープデータを取得
- **Get Primitive Data**: プリミティブシェイプのデータを取得
- **Density Filter**: 密度に基づいてポイントをフィルタリング
- **Projection**: ポイントをサーフェスに投影
- **Bounds Modifier**: バウンドを調整

## 注意事項

- bUnboundedをtrueにすると、サーフェスが非常に大きい場合に膨大な数のポイントが生成される可能性があります。メモリとパフォーマンスに注意してください。
- PointsPerSquaredMeterが非常に大きい値の場合、ポイント数が爆発的に増加します。適切な値を設定してください。
- Loosenessを1.0にすると、ポイントがランダムに配置されますが、決定論的です（同じシードで同じ結果）。
- bApplyDensityToPointsがtrueの場合、サーフェスに密度情報がない場合は密度1.0が適用されます。
- bKeepZeroDensityPointsはエディタ専用のデバッグ機能です。パッケージビルドには影響しません。
- Base Point Data入力をサポートしています。
- 複数のサーフェス入力がある場合、SinglePrimaryPinモードで各入力を順次処理します。
- タイムスライシングにより、大規模なサンプリング処理が複数のフレームに分散されます。
- FullOutputDataCrcを計算して外部データの変更を検出し、変更伝播を最適化します。
