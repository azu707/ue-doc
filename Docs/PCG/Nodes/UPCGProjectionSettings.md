# Projection

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGProjectionSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGProjectionElement.h:15`

## 概要

In につながる各入力を投影ターゲットに投影し、すべての結果を結合して Out にします<br><span style='color:gray'>(Projects each of the inputs connected to In onto the Projection Target and concatenates all of the results to Out.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ProjectionParams` | `FPCGProjectionParams` | なし | プロジェクション対象形状や投影方向などの詳細パラメータ。 |
| `bForceCollapseToPoint` | `bool` | `false` | 出力を常にポイントデータへ変換します。`To Point` ノードを後段に置くのと同じ効果です。 |
| `bKeepZeroDensityPoints` | `bool` | `false` | 密度 0 となったポイントを削除せず保持します。 |
