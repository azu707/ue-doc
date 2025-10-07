# Collapse Points ノード

## 概要

Collapse Pointsノードは、近接するポイントを統合（デシメート）するノードです。距離閾値内のポイントを反復的にマージし、重み付き平均で新しいポイントを作成します。

**ノードタイプ**: Point Ops  
**クラス名**: `UPCGCollapsePointsSettings` / `FPCGCollapsePointsElement`  
**シード使用**: あり（VisitOrder=Randomの場合）

## 主な機能

- 距離ベースのポイント統合
- 2つのマージモード（Pairwise/Absolute）
- 2つの比較モード（Position/Center）
- 柔軟なビジット順序制御
- 属性の重み付きマージ

## プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| **Distance Threshold** | double | 100.0 | 統合を停止する距離閾値 |
| **Mode** | EPCGCollapseMode | PairwiseClosest | マージモード |
| **Comparison Mode** | EPCGCollapseComparisonMode | Position | 距離比較モード |
| **Visit Order** | EPCGCollapseVisitOrder | Ordered | ペア作成順序 |
| **Visit Order Attribute** | FPCGAttributePropertyInputSelector | - | 順序決定属性 |
| **Use Merge Weight Attribute** | bool | false | マージ重み属性使用 |
| **Merge Weight Attribute** | FPCGAttributePropertyInputSelector | - | 重み属性 |
| **Attributes To Merge** | TArray | [Position] | マージする属性リスト |

## Mode詳細

### PairwiseClosest
各反復で排他的なペアを作成し、同時にマージ。訪問順序に基づいて最近接ペアを選択。

### AbsoluteClosest
各反復で最も近い1ペアのみをマージ（現在未実装）。

## Comparison Mode

### Position
ポイントの位置のみで距離計算（バウンド無視）。

### Center
ポイントのバウンド中心で距離計算。

## Visit Order

### Ordered
元のポイント順序でペア作成。

### Random
ランダムにシャッフルした順序でペア作成。

### MinAttribute / MaxAttribute
指定属性の昇順/降順でペア作成。

## アルゴリズム

```cpp
while (pairsFound)
{
    // 1. 訪問順序に従って排他的ペアを作成
    for each unvisited point in VisitOrder
    {
        closestNeighbor = FindClosestWithinThreshold(point, DistanceThreshold);
        if (closestNeighbor exists && not visited)
        {
            pairs.Add(point, closestNeighbor);
            Mark both as visited;
        }
    }
    
    // 2. 全ペアをマージ
    for each pair (primary, secondary)
    {
        totalWeight = weight[primary] + weight[secondary];
        alpha = weight[secondary] / totalWeight;
        
        newPosition = primary.position + alpha * (secondary.position - primary.position);
        newWeight = totalWeight;
        
        Mark secondary as merged into primary;
    }
    
    // 3. Octreeを再構築
    RebuildOctree(unmergedPoints);
}

// 4. 最終結果の作成
for each merge group
{
    CreatePointWithWeightedAverageOfAttributes();
}
```

## 使用例

### ポイント密度の削減
```
Distance Threshold: 50.0
Mode: PairwiseClosest
Visit Order: Ordered
Attributes To Merge: [Position, Normal, Color]

結果: 50単位以内のポイントがマージされ、ポイント数が削減される
```

### 高さ順でのマージ
```
Visit Order: MinAttribute
Visit Order Attribute: "Height"
Distance Threshold: 100.0

結果: 低い位置のポイントから順にマージ処理
```

## パフォーマンス

- 計算コスト: O(N * log(N) * I) - N=ポイント数、I=反復回数
- Octree再構築のオーバーヘッドあり
- 大規模データセット: Time Slicing対応

## 注意事項

- 補間不可能な属性はマージされない（最も重みの大きいポイントの値を使用）
- 反復回数が多いと計算コストが増大
- Distance Thresholdが大きすぎると全ポイントが1つにマージされる可能性

## 関連ノード

- Cluster - クラスタリング
- Self Pruning - 近接ポイントの除去
- Merge Points - ポイントのマージ
