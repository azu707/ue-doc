# Mesh Sampler

- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGMeshSamplerSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGMeshSampler.h:56`

## 概要

スタティックメッシュのポイントをサンプリングします<br><span style='color:gray'>(Sample points on a static mesh.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bExtractMeshFromInput` | `bool` | `false` | 入力データからメッシュ（アクタ／コンポーネント）を抽出してサンプリングするか。 |
| `StaticMesh` | `TSoftObjectPtr<UStaticMesh>` | なし | 直接サンプリングするスタティックメッシュ。ソフト参照のため遅延ロード可能です。 |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 入力からメッシュ参照やコンポーネントを取得する属性セレクタ。 |
| `SamplingMethod` | `EPCGMeshSamplingMethod` | `EPCGMeshSamplingMethod::OnePointPerTriangle` | ポイント生成手法（面積均一、ポアソンなど）を選択します。 |
| `bUseColorChannelAsDensity` | `bool` | `false` | 頂点カラーを密度として使用します。 |
| `ColorChannelAsDensity` | `EPCGColorChannel` | `EPCGColorChannel::Red` | 密度に変換するカラー成分。 |
| `bVoxelize` | `bool` | `false` | 事前にボクセル化して内部の重複三角形を整理します。 |
| `VoxelSize` | `float` | `100.0f` | ボクセル化時のセルサイズ（cm）。 |
| `bRemoveHiddenTriangles` | `bool` | `true` | ボクセル化後に内部に隠れた三角形を除去します。 |
| `RequestedLODType` | `EGeometryScriptLODType` | `EGeometryScriptLODType::RenderData` | DynamicMesh 化に使用する LOD 種別。 |
| `RequestedLODIndex` | `int32` | `0` | 使用する LOD インデックス。 |
| `SamplingOptions` | `FGeometryScriptMeshPointSamplingOptions` | なし | メッシュポイントサンプリングの詳細（Poisson 半径など）。 |
| `NonUniformSamplingOptions` | `FGeometryScriptNonUniformPointSamplingOptions` | なし | 非一様サンプリング設定。 |
| `bExtractUVAsAttribute` | `bool` | `false` | UV 座標を属性として出力します。 |
| `UVAttributeName` | `FName` | `TEXT("UV")` | UV 属性名。 |
| `UVChannel` | `int32` | `0` | 参照する UV チャンネル。 |
| `bOutputTriangleIds` | `bool` | `false` | 出力ポイントに元三角形の ID を付与します。 |
| `TriangleIdAttributeName` | `FName` | `TEXT("TriangleId")` | 三角形 ID の属性名。 |
| `bOutputMaterialInfo` | `bool` | `false` | マテリアルIDや名称を属性として出力します。 |
| `MaterialIdAttributeName` | `FName` | `TEXT("MaterialId")` | マテリアル ID 属性名。 |
| `MaterialAttributeName` | `FName` | `TEXT("Material")` | マテリアル名を格納する属性名。 |
| `PointSteepness` | `float` | `0.5f` | 出力ポイントの密度勾配。0 で滑らか、1 で鋭い影響になります。 |
| `bSynchronousLoad` | `bool` | `false` | メッシュを同期ロードします。デフォルトは非同期ロードです。 |
