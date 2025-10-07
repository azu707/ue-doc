# Cluster ノード

## 概要

Clusterノードは、ポイントを指定数のクラスタ（カテゴリ）にグループ化するノードです。K-MeansまたはEM（期待値最大化）アルゴリズムを使用して最適なクラスタリングを実行します。

**ノードタイプ**: Point Ops  
**クラス名**: `UPCGClusterSettings` / `FPCGClusterElement`  
**シード使用**: あり

## 主な機能

- K-MeansおよびEMアルゴリズム
- 初期セントロイドの指定またはランダム選択
- 最終セントロイドとクラスタサイズの出力
- Time Slicing対応

## プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| **Algorithm** | EPCGClusterAlgorithm | KMeans | クラスタリングアルゴリズム |
| **Num Clusters** | int32 | 3 | クラスタ数 |
| **Cluster Attribute** | FPCGAttributePropertyOutputNoSourceSelector | ClusterID | クラスタID出力属性 |
| **Max Iterations** | int32 | 100 | 最大反復回数 |
| **Tolerance** | double | UE_DOUBLE_KINDA_SMALL_NUMBER | EM収束判定閾値 |
| **Output Final Centroids** | bool | false | 最終セントロイド出力 |
| **Output Final Centroid Element Count** | bool | false | クラスタ要素数出力 |
| **Final Centroid Element Count Attribute** | FPCGAttributePropertyOutputNoSourceSelector | ClusterElementCount | 要素数属性名 |

## アルゴリズム

### K-Means
1. ランダムまたは指定されたセントロイドで初期化
2. 各ポイントを最近接セントロイドに割り当て
3. 各クラスタのセントロイドを平均位置で更新
4. 収束するまで2-3を反復

### EM (Expectation-Maximization)
1. ガウス分布モデルで初期化
2. **E-Step**: 各ポイントの各ガウスへの所属確率を計算
3. **M-Step**: 確率に基づきガウスパラメータ（平均、共分散）を更新
4. Log Likelihoodが収束するまで2-3を反復

## 入出力ピン

### 入力
- **In**: クラスタリング対象のポイント（必須）
- **Initial Centroids**: 初期セントロイドの位置（オプション）

### 出力
- **Out**: ClusterID属性が追加されたポイント
- **Final Centroids**: 最終セントロイドの位置（オプション）

## 使用例

### 基本的なK-Meansクラスタリング
```
Algorithm: KMeans
Num Clusters: 5
Max Iterations: 100

結果: ポイントが5つのクラスタに分類され、ClusterID (0-4)が割り当てられる
```

### EM with カスタム初期位置
```
Algorithm: EM
Num Clusters: 3
Initial Centroids: 手動配置した3つのポイント

結果: 指定位置を起点にガウス分布でクラスタリング
```

## パフォーマンス

- K-Means: O(N * K * I) - N=ポイント数、K=クラスタ数、I=反復回数
- EM: O(N * K * I) + 共分散行列計算のオーバーヘッド
- 大規模データセット: Time Slicingで中断可能

## 関連ノード

- Attribute Partition - 属性値によるパーティション
- Collapse Points - ポイントの統合
