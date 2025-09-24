# Spline to Segment

- **日本語名**: スプラインをセグメントに変換
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGSplineToSegmentSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSplineToSegment.h:13`

## 概要

スプラインを直線セグメント群に分割し、文法処理向けに単純化します。<br><span style='color:gray'>(Splits a spline into straight segments for grammar operations.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bExtractTangents` | `bool` | `false` | 各セグメントの前後タンジェントを計算して属性に保存します。 |
| `bExtractAngles` | `bool` | `true` | 前後タンジェントとの角度を算出します。非閉ループでは端点の角度は 0 になります。 |
| `bExtractConnectivityInfo` | `bool` | `true` | 隣接セグメントのインデックスを出力し、連結情報を保持します。 |
| `bExtractClockwiseInfo` | `bool` | `true` | 閉じたループではポイント列が時計回りかどうかを示す属性を出力します。 |
