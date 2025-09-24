# Spline Direction

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGReverseSplineSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSplineDirection.h:39`

## 概要

スプラインの進行方向を反転し、接線や距離計測を逆向きにします。<br><span style='color:gray'>(Reverses a spline so tangents and lengths run backwards.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGReverseSplineOperation` | `EPCGReverseSplineOperation::Reverse` | スプラインの向きをどのように扱うか（反転のみ、属性書き込み付きなど）を指定します。 |
