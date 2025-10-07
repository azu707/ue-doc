# Spline To Mesh

## 概要

**Spline To Mesh**ノードは、スプラインデータをダイナミックメッシュに変換するノードです。スプラインカーブを三角形分割してメッシュジオメトリを生成します。

カテゴリ: DynamicMesh
クラス名: `UPCGSplineToMeshSettings`
エレメント: `FPCGSplineToMeshElement`

## プロパティ

### ErrorTolerance
- **型**: `double`
- **デフォルト値**: `1.0`
- **カテゴリ**: Spline
- **範囲**: 最小値 0.001
- **説明**: スプラインカーブから三角形分割境界がどれだけ逸脱できるか。頂点を追加する前の許容範囲。

### FlattenMethod
- **型**: `EFlattenCurveMethod` (enum)
- **デフォルト値**: `EFlattenCurveMethod::DoNotFlatten`
- **カテゴリ**: Spline
- **説明**: カーブを平坦化するかどうか、およびその方法。カーブが平坦化される場合、オフセットも可能。

### Thickness
- **型**: `double`
- **デフォルト値**: `0.0`
- **カテゴリ**: Mesh
- **範囲**: 最小値 0.0
- **説明**: 0より大きい場合、三角形分割をこの量だけ押し出します。

### bFlipResult
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Mesh
- **説明**: 生成されたメッシュの向きを反転します。

### OpenCurves
- **型**: `EOffsetOpenCurvesMethod` (enum)
- **デフォルト値**: `EOffsetOpenCurvesMethod::TreatAsClosed`
- **カテゴリ**: Offset
- **条件**: `FlattenMethod != DoNotFlatten`
- **説明**: 開いたカーブの処理方法: オフセットするか、閉じたカーブとして扱うか。

### CurveOffset
- **型**: `double`
- **デフォルト値**: `0.0`
- **カテゴリ**: Offset
- **条件**: `FlattenMethod != DoNotFlatten`
- **説明**: カーブに適用するオフセット量。

### OffsetClosedCurves
- **型**: `EOffsetClosedCurvesMethod` (enum)
- **デフォルト値**: `EOffsetClosedCurvesMethod::OffsetOuterSide`
- **カテゴリ**: Offset
- **条件**: `FlattenMethod != DoNotFlatten && CurveOffset != 0`
- **説明**: 閉じたカーブにオフセットを適用するかどうか、およびその方法。

### EndShapes
- **型**: `EOpenCurveEndShapes` (enum)
- **デフォルト値**: `EOpenCurveEndShapes::Square`
- **カテゴリ**: Offset
- **条件**: `FlattenMethod != DoNotFlatten && OpenCurves != TreatAsClosed && CurveOffset != 0`
- **説明**: オフセットカーブの端の形状。

### JoinMethod
- **型**: `EOffsetJoinMethod` (enum)
- **デフォルト値**: `EOffsetJoinMethod::Square`
- **カテゴリ**: Offset
- **条件**: `FlattenMethod != DoNotFlatten && CurveOffset != 0`
- **説明**: オフセットカーブのセグメント間の接合部の形状。

### MiterLimit
- **型**: `double`
- **デフォルト値**: `1.0`
- **カテゴリ**: Offset
- **範囲**: 最小値 0.0
- **条件**: `FlattenMethod != DoNotFlatten && CurveOffset != 0 && JoinMethod == Miter`
- **説明**: マイタージョインが四角ジョインに置き換えられるまでの最大延長距離。

## 入力ピン

### In (スプラインデータ)
- **型**: スプラインデータ
- **説明**: メッシュに変換するスプライン

## 出力ピン

### Out (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: スプラインから生成されたメッシュ

## 使用例

### 基本的なスプラインメッシュ生成

```
[SplineData] → [Spline To Mesh] → [DynamicMesh]

// 設定:
ErrorTolerance = 1.0
FlattenMethod = DoNotFlatten
```

### 押し出しメッシュの生成

```
// 設定:
Thickness = 10.0
bFlipResult = false
```

### オフセット付きメッシュ

```
// 設定:
FlattenMethod = FlattenToWorldXY
CurveOffset = 5.0
JoinMethod = Round
```

## 実装の詳細

このノードは、GeometryScriptのカーブ三角形分割機能を使用してスプラインをメッシュに変換します。

## 関連ノード

- **Get Spline Data**: スプラインデータの取得
- **Create Spline**: スプラインの作成
- **Create Surface From Spline**: スプラインから平面を作成
