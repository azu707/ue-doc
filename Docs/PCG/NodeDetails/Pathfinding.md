# Pathfinding ノード

## 概要

Pathfindingノードは、ポイントクラウド上でA*アルゴリズムを使用して最適なパスを見つけます。開始位置とゴール位置を指定し、ポイント間の最大ジャンプ距離内で到達可能なパスを計算します。部分的なパスの出力も可能で、スプラインまたはポイントデータとして結果を返します。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPathfindingElement.h`
**カテゴリ**: Generic (汎用)
**タイムスライス**: 対応（大規模なパス探索を複数フレームに分割可能）

## 機能詳細

1. **A*パス探索**: 効率的なヒューリスティック探索アルゴリズム
2. **柔軟な入力**: 単一またはアトリビュートからの開始/ゴール位置
3. **コスト関数**: 距離、フィットネス、コスト乗数の3モード
4. **レイキャスト統合**: パス上の障害物検出
5. **部分パス**: ゴールに到達できない場合の部分パスを許可
6. **スプライン出力**: パスをスプラインまたはポイントデータとして出力

## プロパティ

### UPCGPathfindingSettings

#### 基本パラメータ

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **SearchDistance** | double | 1000 | 各ポイントから次のポイントを探す最大距離 |
| **HeuristicWeight** | double | 1.0 | ヒューリスティック推定の重み（0-1+）|

#### 開始位置設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bStartLocationsAsInput** | bool | false | 開始位置を入力ピンから取得 |
| **StartLocationAttribute** | FPCGAttributePropertyInputSelector | $Position | 開始位置のアトリビュート |
| **Start** | FVector | (0,0,0) | 固定の開始位置 |

#### ゴール位置設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bGoalLocationsAsInput** | bool | false | ゴール位置を入力ピンから取得 |
| **GoalLocationAttribute** | FPCGAttributePropertyInputSelector | $Position | ゴール位置のアトリビュート |
| **Goal** | FVector | (0,0,0) | 固定のゴール位置 |
| **GoalMappingMode** | EPCGPathfindingGoalMappingMode | EachStartToNearestGoal | 開始とゴールのマッピング方法 |

#### コスト関数

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **CostFunctionMode** | EPCGPathfindingCostFunctionMode | Distance | コスト関数のモード |
| **CostAttribute** | FPCGAttributePropertyInputSelector | - | コスト計算用アトリビュート |
| **MaximumFitnessPenaltyFactor** | double | 10.0 | フィットネス0時の最大ペナルティ |

#### レイトレース

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bUsePathTraces** | bool | false | パス上でレイキャストを使用 |
| **PathTraceParams** | FPCGWorldRaycastQueryParams | - | レイキャストパラメータ |

#### 出力設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bAcceptPartialPath** | bool | true | 完全なパスが見つからない場合、部分パスを許可 |
| **bOutputAsSpline** | bool | true | 出力をスプラインとして生成 |
| **SplineMode** | EPCGPathfindingSplineMode | Curve | スプラインの補間モード |
| **bCopyOriginatingPoints** | bool | false | 元のポイントのプロパティをコピー |

### 列挙型

#### EPCGPathfindingSplineMode

| 値 | 説明 |
|----|------|
| **Curve** | スプラインを連続的な曲線として解釈 |
| **Linear** | スプラインを線形セグメントの集合として解釈 |

#### EPCGPathfindingCostFunctionMode

| 値 | 説明 |
|----|------|
| **Distance** | コストは距離のみ |
| **FitnessScore** | フィットネススコア（0-1）によるコスト調整 |
| **CostMultiplier** | 距離にコスト係数を乗算 |

#### EPCGPathfindingGoalMappingMode

| 値 | 説明 |
|----|------|
| **EachStartToNearestGoal** | 各開始位置から最も近いゴールへ |
| **EachStartToEachGoal** | 各開始位置から全ゴールへ（S1→G1, S1→G2, S2→G1, S2→G2） |
| **EachStartToPairwiseGoal** | 開始とゴールを1対1でペアリング |

### ピン設定

#### 入力ピン
- **In**: `EPCGDataType::Point` - パス探索用のポイントクラウド（必須）
- **Start**: `EPCGDataType::PointOrParam` - 開始位置（bStartLocationsAsInput=trueの場合）
- **Goal**: `EPCGDataType::PointOrParam` - ゴール位置（bGoalLocationsAsInput=trueの場合）
- **Filter Actor**: レイトレース用のアクターフィルター（bUsePathTraces=trueの場合）

#### 出力ピン
- **Out**: `EPCGDataType::Spline` または `EPCGDataType::Point` - 見つかったパス

## 使用例

### 基本的なパス探索

```
[Surface Sampler] → [Pathfinding: Start=(0,0,0), Goal=(1000,0,0)]
                            ↓
                    [スプラインパス出力]
```

### 複数のゴール位置

```
[ポイントクラウド]
[開始位置データ] → [Pathfinding: 各開始から最も近いゴールへ]
[ゴール位置データ]
```

### コスト加重パス探索

```
[ポイントクラウド + Densityアトリビュート]
    ↓
[Pathfinding]
- CostFunctionMode: FitnessScore
- CostAttribute: Density
- MaximumFitnessPenaltyFactor: 5.0
    ↓
[密度の高い領域を優先したパス]
```

## 実装の詳細

### A*アルゴリズム

```cpp
// コスト関数
f(n) = g(n) + h(n) * HeuristicWeight

where:
  g(n) = 開始からnまでの実際のコスト
  h(n) = nからゴールまでの推定コスト（ヒューリスティック）
  HeuristicWeight = ヒューリスティックの重み
```

### コスト計算

**Distanceモード**:
```cpp
Cost = Distance(PointA, PointB)
```

**FitnessScoreモード**:
```cpp
FitnessPenalty = (1.0 - FitnessScore) * MaximumFitnessPenaltyFactor
Cost = Distance * (1.0 + FitnessPenalty)
```

**CostMultiplierモード**:
```cpp
Cost = Distance * Max(1.0, CostMultiplier)
```

### タイムスライス処理

大規模なパス探索は複数フレームに分割されます:
- 各反復で一定数のノードを探索
- ゲームスレッドをブロックせずに段階的に処理
- 進行状況を保存し、次フレームで継続

## パフォーマンス考慮事項

### 最適化のポイント

1. **SearchDistanceの調整**: 適切な検索距離でノード数を削減
2. **HeuristicWeightの調整**:
   - 1.0: 最適パス保証
   - \> 1.0: 高速だが最適性は低下
   - 0.0: 完全探索（遅い）
3. **タイムスライス**: 大規模探索では自動的に有効化

### パフォーマンスへの影響

- **処理時間**: O((V+E)logV)、V=ノード数、E=エッジ数
- **メモリ使用**: O(V)
- **レイキャスト**: パス上の各セグメントでレイキャストを実行（高コスト）

### ベストプラクティス

1. **ポイント密度**: 適度なポイント密度を維持
2. **検索距離**: 目的に応じた最小限の距離を設定
3. **部分パス**: ゴールに到達できない場合の処理を用意
4. **レイキャストの使用**: 必要な場合のみ有効化

## 関連ノード

- **Surface Sampler**: パス探索用のポイントクラウド生成
- **Spline Sampler**: スプライン上のポイント生成
- **Distance**: ポイント間の距離計算
- **Create Spline**: カスタムスプライン生成

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **キャッシャビリティ**: レイキャスト使用時はキャッシュ不可
2. **ポイント密度**: 密度が低すぎると到達不可能になる可能性
3. **ヒューリスティック**: 複数ゴールの場合、ヒューリスティックは無視されます
4. **タグ付け**: 完全パスは"CompletePath"、部分パスは"PartialPath"タグが付与されます

## トラブルシューティング

**問題**: パスが見つからない
**解決策**: SearchDistanceを増やす、ポイント密度を上げる、bAcceptPartialPath=trueに設定

**問題**: パスが遠回りしている
**解決策**: HeuristicWeightを調整、CostFunctionModeを見直す

**問題**: 処理が遅い
**解決策**: SearchDistanceを減らす、ポイント数を削減、レイキャストを無効化

## 実用例

### NPCの移動パス生成

```
[Nav Mesh Points] → [Pathfinding: Start=NPCPos, Goal=TargetPos]
                            ↓
                    [AI Follow Spline]
```

### 地形に沿った道路生成

```
[Landscape Surface Sample]
    ↓
[Pathfinding]
- CostAttribute: Slope (傾斜)
- bOutputAsSpline: true
    ↓
[Spline Mesh Spawner: Road]
```

### 障害物回避パス

```
[Surface Points]
    ↓
[Pathfinding]
- bUsePathTraces: true
- PathTraceParams: Landscape除外
    ↓
[障害物を回避するパス]
```
