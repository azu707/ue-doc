# Point Neighborhood（ポイント近傍）

## 概要

Point Neighborhoodノードは、各ポイントの近隣にあるポイント群から、平均密度、平均色、平均位置などの統計的な量を計算するノードです。ポイント間の関係性に基づいた処理を行う際に使用します。

**ノードタイプ**: Spatial
**クラス名**: `UPCGPointNeighborhoodSettings`, `FPCGPointNeighborhoodElement`

## 機能詳細

このノードは、指定された検索距離内にある近隣ポイントを検索し、それらのポイントから様々な統計値を計算します。計算された値は、ポイントの密度、位置、色などに適用したり、カスタム属性として出力したりできます。

### 主な特徴

- **近隣探索**: 指定距離内の近隣ポイントを効率的に検索
- **複数の統計値**: 密度、位置、色の平均値を計算
- **重み付け平均**: ポイントのバウンズを考慮した重み付け計算に対応
- **属性出力**: 距離や平均位置を属性として出力可能

## プロパティ

### SearchDistance
- **型**: `double`
- **デフォルト値**: `500.0`
- **範囲**: 0以上
- **説明**: 近隣ポイントを検索する距離（cm単位）
- **PCG_Overridable**: 可

### bSetDistanceToAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 最も近い近隣ポイントまでの距離を属性に出力するかどうか
- **PCG_Overridable**: 可

### DistanceAttribute
- **型**: `FName`
- **デフォルト値**: `"Distance"`
- **説明**: 距離を出力する属性名（bSetDistanceToAttributeが有効な場合のみ）
- **PCG_Overridable**: 可

### bSetAveragePositionToAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 近隣ポイントの平均位置を属性に出力するかどうか
- **PCG_Overridable**: 可

### AveragePositionAttribute
- **型**: `FName`
- **デフォルト値**: `"AvgPosition"`
- **説明**: 平均位置を出力する属性名（bSetAveragePositionToAttributeが有効な場合のみ）
- **PCG_Overridable**: 可

### SetDensity
- **型**: `EPCGPointNeighborhoodDensityMode` (enum)
- **デフォルト値**: `None`
- **説明**: ポイント密度への書き込みモード
  - **None**: 密度を変更しない
  - **SetNormalizedDistanceToDensity**: 正規化された距離を密度に設定
  - **SetAverageDensity**: 近隣ポイントの平均密度を設定
- **PCG_Overridable**: 可

### bSetAveragePosition
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 近隣ポイントの平均位置をポイントのトランスフォーム位置に設定するかどうか
- **PCG_Overridable**: 可

### bSetAverageColor
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 近隣ポイントの平均色をポイントの色に設定するかどうか
- **PCG_Overridable**: 可

### bWeightedAverage
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: ポイントのバウンズ（大きさ）を考慮して重み付け平均を計算するかどうか
- **PCG_Overridable**: 可

## 使用例

### 基本的な使用方法

```
ポイント生成ノード → Point Neighborhood → 後続処理
```

### 実際のワークフロー例

1. **密度平滑化**
   - Surface Samplerでポイント生成
   - Point Neighborhoodで平均密度を計算
   - 密度の急激な変化を滑らかに

2. **クラスタリング**
   - ランダムポイント生成
   - Point Neighborhoodで平均位置を計算
   - bSetAveragePosition = true でポイントを近隣の中心に移動

3. **密度ベースのフィルタリング**
   - ポイント生成
   - Point Neighborhoodで近隣密度を計算
   - Density Filterで低密度/高密度エリアを除外

4. **距離ベースの属性付与**
   - ポイント配置
   - Point Neighborhoodで最近接距離を属性に出力
   - 距離に応じたスケール調整

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointNeighborhood.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGPointNeighborhood.cpp`

### 継承関係
- `UPCGPointNeighborhoodSettings` ← `UPCGSettings`
- `FPCGPointNeighborhoodElement` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **空間インデックス構築**: 効率的な近隣検索のためのデータ構造を作成
2. **各ポイントの処理**:
   ```cpp
   for each point:
       neighbors = FindPointsInRadius(point.Position, SearchDistance)

       if bWeightedAverage:
           Calculate weighted statistics using point bounds
       else:
           Calculate simple average statistics

       Apply calculated values based on settings
   ```
3. **統計値の適用**: 設定に応じて密度、位置、色、属性を更新

### 近隣検索アルゴリズム

```cpp
// 距離ベースの近隣検索
TArray<NeighborPoint> FindNeighbors(Point, SearchDistance)
{
    // 空間インデックスを使用した効率的な検索
    // SearchDistance内のポイントを取得
}

// 重み付け平均の計算
if (bWeightedAverage)
{
    TotalWeight = Sum(NeighborBoundsSize)
    WeightedValue = Sum(NeighborValue * NeighborBoundsSize) / TotalWeight
}
else
{
    AverageValue = Sum(NeighborValue) / NeighborCount
}
```

### パフォーマンス特性

- **空間インデックス**: 近隣検索を高速化
- **実行ループモード**: SinglePrimaryPin（単一プライマリピンモード）
- **キャッシュ可能**: はい
- **BasePointData対応**: あり

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト)
  - タイプ: `EPCGDataType::Point`

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: `EPCGDataType::Point`

### 密度モードの詳細

#### None
密度は変更されません。

#### SetNormalizedDistanceToDensity
```cpp
normalizedDistance = MinDistance / SearchDistance
density = 1.0 - normalizedDistance
```
近い近隣ほど高密度になります。

#### SetAverageDensity
```cpp
density = Average(neighbor.Density for all neighbors)
```
近隣ポイントの密度の平均値を設定します。

### 技術的詳細

#### ExecutionLoopMode
```cpp
virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override
{
    return EPCGElementExecutionLoopMode::SinglePrimaryPin;
}
```

単一のプライマリピン（入力）に対して実行されます。

### 注意事項

1. **検索距離**: SearchDistanceが大きいほど処理コストが増加します
2. **メモリ使用**: 空間インデックスの構築に追加メモリを使用します
3. **近隣なし**: 検索距離内に近隣ポイントがない場合、元の値が保持されます
4. **重み付け計算**: bWeightedAverageはポイントのバウンズサイズを使用します
5. **属性型**: 距離属性はdouble、平均位置属性はFVector型で作成されます

### ユースケース

- **密度平滑化**: 密度の急激な変化を滑らかに
- **ポイントクラスタリング**: 近隣ポイントの中心への移動
- **アイソレーション検出**: 孤立したポイントの検出と処理
- **適応的スケーリング**: 近隣密度に応じたスケール調整
- **色ブレンディング**: 近隣ポイントの色を混ぜ合わせる
- **スムージング**: ポイント配置の平滑化
