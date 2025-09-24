# Clean Spline

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCleanSplineSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCleanSpline.h:19`

## 概要

スプラインの不要な制御点 (同じ場所または同じ直線上にある、など) を削除します<br><span style='color:gray'>(Remove superfluous control points along the spline, such as those that are co-located or collinear.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bFuseColocatedControlPoints` | `bool` | `true` | 同一地点にある制御点を距離閾値に基づいて統合し、冗長なポイントを減らします。 |
| `ColocationDistanceThreshold` | `double` | `UE_KINDA_SMALL_NUMBER` | 制御点同士の距離がこの値以下であれば同一点とみなして統合します。 |
| `bUseSplineLocalSpace` | `bool` | `false` | 距離判定をスプラインのローカル座標系で実行します。`false` の場合はワールド座標で比較します。 |
| `FuseMode` | `EPCGControlPointFuseMode` | `EPCGControlPointFuseMode::Auto` | コロケートした制御点を統合する際のルール（平均化や一方の属性優先など）を指定します。 |
| `bRemoveCollinearControlPoints` | `bool` | `true` | スプラインの直線区間にある不要な制御点を除去し、データ量を削減します。 |
| `CollinearAngleThreshold` | `double` | `5` | 隣接区間との角度がこの値以下であれば直線区間とみなし、制御点を削除候補とします。 |
| `bUseRadians` | `bool` | `false` | 角度閾値の単位をラジアンに切り替えます。切り替え時には既存値が自動換算されます。 |
