# Pathfinding

- **日本語名**: パスファインダー
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGPathfindingSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPathfindingElement.h:41`

## 概要

開始と終了位置、ポイント間の最大ジャンプ距離を指定したときに、指定点群 (1 つ存在することが必要) のポイント間で最適パスを見つけます。部分パスを返すことがあります<br><span style='color:gray'>(Finds the optimal path across the points of a given point cloud--should one exist--when provided a start and goal location, and a maximum jump distance between points. Can return a partial path.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SearchDistance` | `double` | `1000` | ポイント間の探索距離上限（cm）。 |
| `bStartLocationsAsInput` | `bool` | `false` | 開始地点を入力から取得するか。 |
| `StartLocationAttribute` | `FPCGAttributePropertyInputSelector` | なし | 開始位置を提供する属性。 |
| `Start` | `FVector` | `FVector::ZeroVector` | 固定開始位置。 |
| `bGoalLocationsAsInput` | `bool` | `false` | 目標地点を入力から取得するか。 |
| `GoalLocationAttribute` | `FPCGAttributePropertyInputSelector` | なし | ゴール位置を提供する属性。 |
| `Goal` | `FVector` | `FVector::ZeroVector` | 固定ゴール位置。 |
| `GoalMappingMode` | `EPCGPathfindingGoalMappingMode` | `EPCGPathfindingGoalMappingMode::EachStartToNearestGoal` | 複数開始・ゴールをどう対応付けるか。 |
| `HeuristicWeight` | `double` | `1.0` | A* ヒューリスティックの重み。 |
| `CostFunctionMode` | `EPCGPathfindingCostFunctionMode` | `EPCGPathfindingCostFunctionMode::Distance` | コスト計算のモード。 |
| `CostAttribute` | `FPCGAttributePropertyInputSelector` | なし | コスト計算に使用する属性。 |
| `MaximumFitnessPenaltyFactor` | `double` | `10.0` | フィットネスペナルティの最大係数。 |
| `bUsePathTraces` | `bool` | `false` | レイキャストで障害物を検出するか。 |
| `PathTraceParams` | `FPCGWorldRaycastQueryParams` | なし | レイキャスト処理の詳細設定。 |
| `bAcceptPartialPath` | `bool` | `true` | 完全な経路が得られない場合でも部分経路を返します。 |
| `bOutputAsSpline` | `bool` | `true` | 結果をスプラインとして出力するか。 |
| `SplineMode` | `EPCGPathfindingSplineMode` | `EPCGPathfindingSplineMode::Curve` | 出力スプラインの補間モード。 |
| `bCopyOriginatingPoints` | `bool` | `false` | 元のポイント属性を結果にコピーするか。 |
