# Volume Sampler

## 概要

**ノードタイプ**: Sampler
**クラス**: UPCGVolumeSamplerSettings
**エレメント**: FPCGVolumeSamplerElement

Volume Samplerノードは、3Dボリューム内に規則的な3Dグリッドパターンでポイントを生成します。ボリューム全体を均等に充填する必要がある場合や、3D空間でのオブジェクト配置に最適なノードです。

## 機能詳細

Volume Samplerノードは、PCGスパシャルデータ（ボックス、スフィア、ボリュームなど）の内部に3Dグリッドパターンでポイントを生成します。ボクセルサイズを指定することで、ポイント間の間隔を制御できます。各ボクセルの中心にポイントが配置され、ボリュームの密度情報が自動的に適用されます。

主な機能:
- ボクセルサイズによる3Dグリッド制御
- ボリュームの密度情報の自動適用
- タイムスライシングによる大規模データの処理
- バウンディングシェイプによる範囲制限
- ポイントSteepnessによる密度関数の調整

## プロパティ

### VoxelSize
- **型**: FVector
- **デフォルト値**: (100.0, 100.0, 100.0)
- **説明**: 各ボクセルのサイズ（cm単位）。X、Y、Z方向のそれぞれの間隔を指定します。値が小さいほど、より多くのポイントが生成されます
- **オーバーライド可能**: はい
- **カテゴリ**: Data

### bUnbounded
- **型**: bool
- **デフォルト値**: false
- **説明**: Bounding Shape入力が提供されない場合、アクターバウンドを使用してサンプル生成ドメインを制限します。このオプションを有効にすると、アクターバウンドを無視してボリューム全体に生成します。大量のポイントが生成される可能性があるため注意が必要です
- **オーバーライド可能**: はい

### PointSteepness
- **型**: float
- **デフォルト値**: 0.5
- **説明**: 各PCGポイントは、ワールド空間の離散化されたボリューメトリック領域を表します。ポイントのSteepness値[0.0-1.0]は、そのボリュームの「硬さ」または「柔らかさ」を確立します。0では、ポイントの中心から最大2倍のバウンドまで密度が線形に増加します。1では、ポイントのバウンドサイズのバイナリボックス関数を表します
- **範囲**: 0.0 - 1.0
- **オーバーライド可能**: はい
- **カテゴリ**: Settings|Points

## 入力ピン

### Volume
- **型**: Spatial Data / Volume Data
- **説明**: サンプリング対象の3Dボリュームデータ（ボックス、スフィア、カスタムボリュームなど）
- **ラベル**: "Volume"

### Bounding Shape（オプション）
- **型**: Spatial Data
- **説明**: サンプリング領域を制限するバウンディングシェイプ。提供されない場合、アクターバウンドが使用されます（bUnboundedがfalseの場合）
- **ラベル**: "Bounding Shape"

## 出力ピン

### Out
- **型**: Point Data
- **説明**: ボリューム内に生成されたポイント

## 使用例

### 例1: ボックス内の均等な3D配置
立方体の空間内にオブジェクトを均等に配置する場合:
1. Create Volumeまたはget Actor Dataでボリュームを取得
2. Volume Samplerノードで接続:
   - VoxelSize: (100, 100, 100)（1メートル間隔）
   - PointSteepness: 0.5（標準）
3. Static Mesh Spawnerで配置
4. 立方体内に規則的な3Dグリッドでオブジェクトが配置されます

### 例2: 球体内のランダムな粒子配置
球体内にパーティクル風のオブジェクトを配置する場合:
1. Create Sphere Volumeで球体ボリュームを作成
2. Volume Samplerノードで:
   - VoxelSize: (50, 50, 50)（密なグリッド）
   - PointSteepness: 0.2（柔らかい密度関数）
3. Select Pointsで一部をランダムに選択（例: Ratio 0.3）
4. 球体内にランダムに分布したポイントが生成されます

### 例3: 建物内部の充填
建物の内部空間全体にオブジェクトを配置する場合:
1. 建物のボリュームを表すPCGデータを取得
2. Volume Samplerノードで:
   - VoxelSize: (200, 200, 200)（2メートル間隔）
   - bUnbounded: false（建物のバウンド内のみ）
3. Filter By Attributeで特定の階や部屋のみをフィルタリング
4. 建物内部に規則的にポイントが配置されます

### 例4: 異なる密度の層構造
高さに応じて異なる密度のポイントを生成する場合:
1. 大きなボックスボリュームを作成
2. Volume Samplerノードで:
   - VoxelSize: (100, 100, 100)
   - PointSteepness: 0.5
3. Attribute Remapで高さ（Z座標）を密度にマッピング
   - 低い位置: 高密度（密度 1.0）
   - 高い位置: 低密度（密度 0.2）
4. Density Filterで密度に基づいてフィルタリング
5. 高さに応じて密度が変化する層構造が生成されます

### 例5: 制限されたエリアでの密なサンプリング
特定の小さなエリア内に密なポイントを生成する場合:
1. 大きなボリュームを作成
2. Create Pointsで中心ポイントを作成
3. Boundsノードでバウンディングボックスを作成（小さなエリア）
4. Volume Samplerノードで:
   - Volume入力: 大きなボリューム
   - Bounding Shape入力: 小さなバウンディングボックス
   - VoxelSize: (25, 25, 25)（密なグリッド）
5. 指定された小さなエリア内にのみ密なポイントが生成されます

## 実装の詳細

### 処理フロー

1. **入力の検証**: ボリュームデータとオプションのバウンディングシェイプを取得
2. **有効範囲の計算**:
   - Bounding Shapeが提供されている場合、そのバウンドを使用
   - 提供されていない場合、bUnboundedがfalseならアクターバウンドを使用
   - bUnboundedがtrueの場合、ボリューム全体を使用
3. **グリッドパラメータの計算**:
   - VoxelSizeから各方向のボクセル数を計算
   - `VoxelCountX = floor(BoundsX / VoxelSize.X)`
   - `VoxelCountY = floor(BoundsY / VoxelSize.Y)`
   - `VoxelCountZ = floor(BoundsZ / VoxelSize.Z)`
4. **3Dグリッドポイントの生成**（タイムスライシング可能）:
   - X、Y、Z方向にループ
   - 各ボクセルの中心位置を計算
   - ポイントをボリュームの座標空間に変換
5. **ボリューム内判定**:
   - 各ポイントがボリューム内にあるかを確認
   - ボリュームの密度情報を取得
6. **ポイント属性の設定**:
   - 位置、回転、スケール、密度、シードなどを設定
   - PointSteepnessに基づいて密度関数を調整
7. **ゼロ密度ポイントのフィルタリング**:
   - 密度がゼロのポイント（ボリューム外）を除外
8. **出力の生成**: 生成されたポイントデータを出力

### コードスニペット

**ボリュームサンプリング用のヘルパー関数**:
```cpp
namespace PCGVolumeSampler
{
    // ボリュームをサンプリングして結果のポイントデータを返す
    PCG_API UPCGBasePointData* SampleVolume(
        FPCGContext* Context,
        TSubclassOf<UPCGBasePointData> PointDataClass,
        const FVolumeSamplerParams& SamplerSettings,
        const UPCGSpatialData* Volume,
        const UPCGSpatialData* BoundingShape = nullptr);

    // ボリュームをサンプリングし、結果を指定されたポイントデータに書き込む
    // タイムスライシング可能、処理が完了していない場合はfalseを返す
    PCG_API bool SampleVolume(
        FPCGContext* Context,
        const FVolumeSamplerParams& SamplerSettings,
        const UPCGSpatialData* Volume,
        const UPCGSpatialData* BoundingShape,
        UPCGBasePointData* OutputData,
        const bool bTimeSlicingIsEnabled = false);
}
```

**ボリュームサンプラーパラメータ構造体**:
```cpp
struct FVolumeSamplerParams
{
    FVector VoxelSize = DefaultVoxelSize;  // (100, 100, 100)
    float PointSteepness = 0.0f;
    FBox Bounds{EForceInit::ForceInit};
};
```

**タイムスライシングのサポート**:
```cpp
class FPCGVolumeSamplerElement : public TPCGTimeSlicedElementBase<
    PCGVolumeSampler::FVolumeSamplerExecutionState,
    PCGVolumeSampler::FVolumeSamplerIterationState>
{
    // タイムスライシングをサポートする実装
};
```

**FullOutputDataCrcの計算**:
```cpp
// ブラシなどの外部データをサンプリングする可能性があるため、
// 変更伝播/再実行を停止できる場合に備えて完全なCRCを計算する価値がある
virtual bool ShouldComputeFullOutputDataCrc(FPCGContext* Context) const override
{
    return true;
}
```

### グリッド生成のアルゴリズム

1. **ボクセル数の計算**:
   ```
   VoxelCountX = floor((MaxX - MinX) / VoxelSize.X)
   VoxelCountY = floor((MaxY - MinY) / VoxelSize.Y)
   VoxelCountZ = floor((MaxZ - MinZ) / VoxelSize.Z)
   ```

2. **各ボクセルの中心位置**:
   ```
   PositionX = MinX + (i + 0.5) × VoxelSize.X
   PositionY = MinY + (j + 0.5) × VoxelSize.Y
   PositionZ = MinZ + (k + 0.5) × VoxelSize.Z
   ```
   ここで、i、j、kはボクセルのインデックス（0から始まる）

3. **密度の取得**: 各ポイント位置でボリュームの密度関数をサンプリング

4. **ポイントSteepnessの適用**: 密度関数の形状を調整

## パフォーマンス考慮事項

1. **タイムスライシング**: Volume Samplerはタイムスライシングをサポートしており、大量のポイントを生成する場合でもフレームレートへの影響を最小限に抑えます。

2. **ボクセルサイズの影響**: VoxelSizeが小さいほど、生成されるポイント数が急激に増加します（3乗で増加）:
   - VoxelSize (100, 100, 100) → 1m³あたり1ポイント
   - VoxelSize (50, 50, 50) → 1m³あたり8ポイント
   - VoxelSize (25, 25, 25) → 1m³あたり64ポイント

3. **バウンディングシェイプの使用**: 必要な領域のみをサンプリングすることで、不要な計算を大幅に削減できます。特に3Dグリッドは計算コストが高いため重要です。

4. **ボリュームタイプ**: ボリュームのタイプによってサンプリングコストが異なります:
   - 単純なプリミティブ（ボックス、スフィア）: 高速
   - 複雑なカスタムボリューム: 中〜高コスト

5. **PointSteepness**: PointSteepnessの計算は各ポイントで行われますが、コストは比較的低いです。

6. **メモリ使用量**: 3Dグリッドは2Dグリッドよりも遥かに多くのメモリを使用します。1000×1000×1000のグリッドは10億ポイントになります。適切なVoxelSizeを選択してください。

7. **FullOutputDataCrc**: 変更伝播を最適化するために完全なCRCを計算します。外部データ（ボリュームブラシなど）をサンプリングする場合、変更検出に有用です。

8. **タイムスライシングの効果**: 非常に大きなボリュームの場合、タイムスライシングにより処理が複数のフレームに分散されます。

## 関連ノード

- **Surface Sampler**: 2Dサーフェス上にポイントを生成
- **Spline Sampler**: スプライン上または周囲にポイントを生成
- **Create Points Grid**: 2Dグリッドでポイントを生成
- **Create Points Sphere**: 球体内にポイントを生成
- **Get Volume Data**: ボリュームアクターからボリュームデータを取得
- **Get Actor Data**: アクターからスパシャルデータを取得
- **Density Filter**: 密度に基づいてポイントをフィルタリング
- **Bounds Modifier**: バウンドを調整

## 注意事項

- VoxelSizeを小さくしすぎると、膨大な数のポイントが生成され、メモリ不足やパフォーマンス問題を引き起こす可能性があります。特に3Dグリッドは注意が必要です。
- bUnboundedをtrueにすると、ボリュームが非常に大きい場合に膨大な数のポイントが生成される可能性があります。
- ポイント数の概算: `(BoundsX / VoxelSize.X) × (BoundsY / VoxelSize.Y) × (BoundsZ / VoxelSize.Z)`
- ボリュームの密度情報がない場合、密度1.0が適用されます。
- Base Point Data入力をサポートしています。
- 複数のボリューム入力がある場合、SinglePrimaryPinモードで各入力を順次処理します。
- タイムスライシングにより、大規模なサンプリング処理が複数のフレームに分散されます。
- FullOutputDataCrcを計算して外部データの変更を検出し、変更伝播を最適化します。
- VoxelSizeの各成分（X、Y、Z）を個別に設定できるため、非等方的なグリッドも作成可能です。

## パフォーマンス最適化のヒント

1. **適切なVoxelSizeの選択**: 目的に応じて必要最小限のポイント数になるようVoxelSizeを調整してください。

2. **バウンディングシェイプの活用**: 常にBounding Shapeを使用して、必要な領域のみをサンプリングしてください。

3. **段階的なフィルタリング**: Volume Samplerの後にDensity FilterやSelect Pointsを使用してポイント数を削減してください。

4. **非対称VoxelSize**: 必要に応じて、VoxelSizeのX、Y、Z成分を異なる値に設定してください（例: 高さ方向の解像度を低くする）。

5. **タイムスライシングの活用**: 大規模なボリュームの場合、タイムスライシングを有効にしてフレームレートを維持してください。
