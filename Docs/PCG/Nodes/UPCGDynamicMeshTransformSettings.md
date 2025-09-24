# Dynamic Mesh Transform

- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGDynamicMeshTransformSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGDynamicMeshTransform.h:12`

## 概要

すべてのダイナミック メッシュにトランスフォームを適用します<br><span style='color:gray'>(Apply a transform to all dynamic meshes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Transform` | `FTransform` | 単位変換行列 | すべての入力ダイナミックメッシュに適用する平行移動・回転・スケール。既定は単位行列で変更なしです。オーバーライドすると一括配置やサイズ調整が可能です。 |
