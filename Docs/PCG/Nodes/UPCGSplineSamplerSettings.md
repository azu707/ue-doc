# Spline Sampler

- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGSplineSamplerSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSplineSampler.h:260`

## 概要

指定スプラインに沿って、バウンディング形状が存在する場合はその内部にポイントを生成します<br><span style='color:gray'>(Generates points along the given Spline, and within the Bounding Shape if provided.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SamplerParams` | `FPCGSplineSamplerParams` | なし | スプライン上の間隔、サンプリング範囲、補間モードなどをまとめた設定。 |
