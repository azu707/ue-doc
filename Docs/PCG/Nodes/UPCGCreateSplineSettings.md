# Create Spline

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCreateSplineSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateSpline.h:21`

## 概要

入力 PCG ポイント データから PCG スプライン データを順番に作成します<br><span style='color:gray'>(Creates PCG spline data from the input PCG point data, in a sequential order.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGCreateSplineMode` | `EPCGCreateSplineMode::CreateDataOnly` | スプラインデータのみ生成するか、ターゲットアクタにスプラインコンポーネントを生成するかを選びます。 |
| `bClosedLoop` | `bool` | `false` | スプラインを閉じたループとして扱うかを指定します。 |
| `bLinear` | `bool` | `false` | 区間を直線補間にするかを制御します。`true` なら各セグメントが直線になります。 |
| `bApplyCustomTangents` | `bool` | `false` | 到達／離脱タンジェントを入力ポイントの属性から読み込みます。線形スプラインでは利用できません。 |
| `ArriveTangentAttribute` | `FName` | なし | 到達タンジェントを取得する属性名。`bApplyCustomTangents` 有効時のみ利用されます。 |
| `LeaveTangentAttribute` | `FName` | なし | 離脱タンジェントを取得する属性名。`bApplyCustomTangents` 有効時のみ利用されます。 |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | `Mode = CreateComponent` の場合にスプラインコンポーネントを配置するターゲットアクタ。 |
| `PostProcessFunctionNames` | `TArray<FName>` | なし | スプライン生成後にターゲットアクタで呼び出す `CallInEditor` 対応関数名のリスト。 |
