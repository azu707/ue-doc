# Blur ノード

## 概要

Blurノードは、ポイントの数値属性を近傍ポイントの値で平滑化（ブラー）するノードです。距離に基づく重み付けで複数回の反復処理が可能です。

**ノードタイプ**: Point Ops  
**クラス名**: `UPCGBlurSettings` / `FPCGBlurElement`

## 主な機能

- 数値属性のブラー処理（int32, int64, float, double, Vector系, Rotator, Quat対応）
- 3つの重み付けモード（Constant, Linear, Gaussian）
- 複数回反復によるより強いブラー効果
- Time Slicing対応

## プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| **Input Source** | FPCGAttributePropertyInputSelector | - | ブラーする属性（数値型） |
| **Output Target** | FPCGAttributePropertyOutputSelector | - | 結果を書き込む属性 |
| **Num Iterations** | int | 1 | 反復回数（大きいほど強いブラー） |
| **Search Distance** | double | 1000.0 | 近傍検索半径 |
| **Blur Mode** | EPCGBlurElementMode | Constant | 重み付けモード |
| **Use Custom Standard Deviation** | bool | false | カスタム標準偏差を使用（Gaussianモード） |
| **Custom Standard Deviation** | double | 1.0 | 標準偏差値（Gaussianモード） |

## Blur Mode

### Constant
全ての近傍ポイントに均等な重み（1/N）。

### Linear
距離に基づく線形減衰: `Weight = 1 - Distance/SearchDistance`

### Gaussian
ガウス分布による重み付け。デフォルトの標準偏差は`SearchDistance/9.0`（3σ = SearchDistanceとなるよう設定）。

## アルゴリズム

```cpp
for (iteration = 0; iteration < NumIterations; ++iteration)
{
    for each point
    {
        neighbors = FindNeighborsWithinDistance(SearchDistance);
        
        totalWeight = 0;
        for each neighbor
        {
            weight = CalculateWeight(distance, BlurMode);
            totalWeight += weight;
        }
        
        blurredValue = ZeroValue;
        for each neighbor
        {
            normalizedWeight = weight / totalWeight;
            blurredValue += neighborValue * normalizedWeight;
        }
        
        outputValue[point] = blurredValue;
    }
    
    // 次の反復のために出力を入力にコピー
}
```

## 使用例

### 高さフィールドの平滑化
```
Input Source: "Height" (float)
Output Target: "SmoothedHeight"
Num Iterations: 3
Search Distance: 500
Blur Mode: Gaussian

結果: 各ポイントのHeightが近傍の値で平滑化され、より滑らかな地形に
```

### Densityの均一化
```
Input Source: "@Density"
Output Target: "@Density"
Num Iterations: 5
Search Distance: 1000
Blur Mode: Constant

結果: 密度のムラが減少し、より均一な分布に
```

## パフォーマンス

- 計算コスト: O(N * M * I) - N=ポイント数、M=近傍数、I=反復回数
- メモリ: 2つのワーキングバッファ（反復のため）
- Octreeによる空間検索で最適化
- 並列処理とTime Slicing対応

## 注意事項

- 補間不可能な型（文字列など）には使用不可
- 反復回数が多いと計算コストが増大
- QuaternionとRotatorは正規化が必要なため追加コスト

## 関連ノード

- Spatial Noise - ノイズ追加
- Attribute Noise - 属性へのノイズ追加
- Point Neighborhood - 近傍ポイント処理
