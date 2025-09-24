# Primitive Cross-Section

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGPrimitiveCrossSectionSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGPrimitiveCrossSection.h:17`

## 概要

頂点機能に基づいて、もう 1 つのプリミティブのスプライン断面を作成します<br><span style='color:gray'>(Creates spline cross-sections of one more primitives based on vertex features.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SliceDirection` | `FVector` | `FVector::UpVector` | 最小頂点からのスライス方向。法線として正規化されます。 |
| `ExtrusionVectorAttribute` | `FPCGAttributePropertyOutputSelector` | なし | 各断面の押し出しベクトルを保存する属性。 |
| `MinimumCoplanarVertices` | `int32` | `3` | 同一平面上とみなすために必要な最小頂点数。 |
| `MaxMeshVertexCount` | `int32` | `2048` | 特徴抽出を行うメッシュの頂点数上限。安全装置として設定します。 |
| `bEnableTierMerging` | `bool` | `false` | 近い高さの段（tier）を統合するかどうか。 |
| `TierMergingThreshold` | `double` | `1.0` | ティア統合を行う際の距離閾値（cm）。 |
| `bEnableMinAreaCulling` | `bool` | `false` | 面積が一定以下のティアを除外します。 |
| `MinAreaCullingThreshold` | `double` | `100.0` | 面積除外の閾値（平方センチ）。 |
| `bRemoveRedundantSections` | `bool` | `true` | 輪郭形状に影響しない冗長なティアを削除します。 |
