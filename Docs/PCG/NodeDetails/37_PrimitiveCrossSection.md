# Primitive Cross-Section（プリミティブ断面）

## 概要

Primitive Cross-Sectionノードは、1つ以上のプリミティブ（メッシュ）の頂点特徴に基づいて、スプラインの断面図を作成するノードです。メッシュを指定方向にスライスし、同一平面上の頂点からスプライン形状を抽出します。

**ノードタイプ**: Spatial
**クラス名**: `UPCGPrimitiveCrossSectionSettings`, `FPCGPrimitiveCrossSectionElement`
**プラグイン**: PCGGeometryScriptInterop

## 機能詳細

このノードは、入力されたプリミティブメッシュを指定された方向に沿ってスライスし、各「層（Tier）」の断面をスプラインデータとして抽出します。建物のフロアプラン生成や、複雑な形状の層別分解などに使用されます。

### 主な特徴

- **頂点ベースの層検出**: 同一平面上にある頂点群を自動検出
- **スプライン生成**: 各層の輪郭をスプラインとして出力
- **層のマージと除去**: 近接する層や小さな層をフィルタリング
- **押し出しベクトル**: 各断面の押し出し方向を属性として出力

## プロパティ

### SliceDirection
- **型**: `FVector`
- **デフォルト値**: `FVector::UpVector` (0, 0, 1)
- **説明**: スライシング方向のベクトル（正規化されます）。この方向に沿って最小頂点から層を検出します
- **PCG_Overridable**: 可

### ExtrusionVectorAttribute
- **型**: `FPCGAttributePropertyOutputSelector`
- **説明**: 各断面の押し出しベクトルを格納する属性セレクタ
- **PCG_Overridable**: 可

### MinimumCoplanarVertices
- **型**: `int32`
- **デフォルト値**: `3`
- **説明**: 層の「特徴」として認識するために必要な、同一平面上にある頂点の最小数
- **PCG_Overridable**: 可

### MaxMeshVertexCount
- **型**: `int32`
- **デフォルト値**: `2048`
- **説明**: 過度に複雑なメッシュで特徴検出を防ぐための安全装置。頂点数がこれを超えるメッシュは処理されません
- **PCG_Overridable**: 可
- **注**: TierSlicingモード以外で有効

### bEnableTierMerging
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 指定された閾値内にある層を統合するかどうか
- **PCG_Overridable**: 可

### TierMergingThreshold
- **型**: `double`
- **デフォルト値**: `1.0` (cm)
- **範囲**: 最小 0.01
- **説明**: 前の層からこの距離以内にある層は除去されます（bEnableTierMergingが有効な場合）
- **PCG_Overridable**: 可

### bEnableMinAreaCulling
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 指定された面積より小さい層を除去するかどうか
- **PCG_Overridable**: 可

### MinAreaCullingThreshold
- **型**: `double`
- **デフォルト値**: `100.0`
- **説明**: この面積（平方cm）より小さい層は除去されます（bEnableMinAreaCullingが有効な場合）
- **PCG_Overridable**: 可

### bRemoveRedundantSections
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: 複数の層を輪郭に影響を与えずに単一の層に統合できる場合、冗長な層を削除します
- **PCG_Overridable**: 可
- **注**: 現在、間に他のユニークな層がある場合でも除去されます

## 使用例

### 基本的な使用方法

```
Primitive Input → Primitive Cross-Section → Spline Data
```

### 実際のワークフロー例

1. **建物フロアプラン抽出**
   - 建物メッシュを入力
   - SliceDirection = (0, 0, 1) で垂直方向にスライス
   - 各フロアの平面図をスプラインとして取得

2. **地形の等高線生成**
   - 地形メッシュを入力
   - 垂直方向にスライス
   - 各高度の等高線をスプラインとして抽出

3. **複雑な形状の層別分解**
   - 複雑な3Dモデルを入力
   - 任意の方向でスライス
   - 各層を個別に処理

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGPrimitiveCrossSection.h`
- **実装**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Private/Elements/PCGPrimitiveCrossSection.cpp`

### 継承関係
- `UPCGPrimitiveCrossSectionSettings` ← `UPCGSettings`
- `FPCGPrimitiveCrossSectionElement` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **メッシュ検証**: 頂点数がMaxMeshVertexCount以下であることを確認
2. **頂点解析**: メッシュの全頂点を取得し、SliceDirection方向に投影
3. **層の検出**: 同一平面上にあるMinimumCoplanarVertices以上の頂点群を検出
4. **層のフィルタリング**:
   - TierMerging: 近接層の統合
   - MinAreaCulling: 小さい層の除去
   - Redundant Removal: 冗長層の削除
5. **スプライン生成**: 各層の頂点から輪郭スプラインを作成
6. **属性設定**: ExtrusionVectorAttributeに押し出しベクトルを設定

### アルゴリズムの詳細

```cpp
// 層検出の基本ロジック
1. すべての頂点をSliceDirection方向に投影
2. 投影値でソート
3. 連続する頂点群で、ほぼ同じ投影値を持つものを1つの層として認識
4. 各層がMinimumCoplanarVertices以上の頂点を持つか確認

// フィルタリング
if (bEnableTierMerging):
    if (CurrentTier.Distance - PreviousTier.Distance < TierMergingThreshold):
        Remove CurrentTier

if (bEnableMinAreaCulling):
    if (Tier.Area < MinAreaCullingThreshold):
        Remove Tier

if (bRemoveRedundantSections):
    if (Tier has same contour as combined neighbor tiers):
        Remove Tier
```

### パフォーマンス特性

- **キャッシュ不可**: `IsCacheable() = false` （外部データ依存のため）
- **メッシュ複雑度制限**: MaxMeshVertexCountで処理負荷を制限
- **GeometryScript使用**: UE5のGeometryScriptフレームワークを活用

### 入出力仕様

- **入力ピン**:
  - プリミティブデータ（メッシュ、コリジョンなど）
  - タイプ: Primitive/Spatial データ

- **出力ピン**:
  - スプラインデータ（各層の断面）
  - タイプ: `EPCGDataType::Spline`

### 技術的詳細

#### 定数
```cpp
namespace PCGPrimitiveCrossSection::Constants
{
    static constexpr double MinTierMergingThreshold = 0.01;
}
```

最小マージ閾値は0.01cm（非常に小さい値）です。

### 注意事項

1. **頂点数制限**: MaxMeshVertexCountを超えるメッシュは処理されません
2. **PCGGeometryScriptInterop必要**: このノードはGeometryScriptプラグインに依存します
3. **キャッシュ不可**: 外部メッシュデータに依存するため、キャッシュできません
4. **冗長削除の挙動**: bRemoveRedundantSectionsは、間にユニークな層があっても削除する可能性があります
5. **平面性の判定**: 頂点の共平面性は数値的な許容値内で判定されます

### ユースケース

- **建築ビジュアライゼーション**: 建物の各階平面図の自動抽出
- **地形解析**: 等高線の生成
- **3Dモデル分解**: 複雑な形状の層別分析
- **断面図生成**: 任意方向の断面スプライン作成
- **プロシージャル建物生成**: フロアごとの異なるレイアウト適用
