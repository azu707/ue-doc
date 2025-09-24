# Boolean Operation

- **日本語名**: ブール演算
- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGBooleanOperationSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGBooleanOperation.h:30`

## 概要

ダイナミック メッシュ間のブール演算<br><span style='color:gray'>(Boolean operation between dynamic meshes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `BooleanOperation` | `EGeometryScriptBooleanOperation` | `Intersection` | 実行するブーリアン演算を選択します。`Union`/`Intersection`/`Subtract` に加え、`TrimInside`・`TrimOutside` など Geometry Script 由来の特殊モードも利用できます。 |
| `BooleanOperationOptions` | `FGeometryScriptMeshBooleanOptions` | 構造体既定値 | 結果メッシュの後処理を制御します。穴埋めを行うか (`bFillHoles`)、出力の単純化 (`bSimplifyOutput` と `SimplifyPlanarTolerance`)、空メッシュを許可するか (`bAllowEmptyResult`)、および結果の座標空間 (`OutputTransformSpace`) をまとめて設定します。 |
| `TagInheritanceMode` | `EPCGBooleanOperationTagInheritanceMode` | `Both` | 出力メッシュに継承するポイントタグを制御します。`Both` は A/B 両方のタグを維持し、`A` または `B` は片側のみ引き継ぎます。 |
| `Mode` | `EPCGBooleanOperationMode` | `EachAWithEachB` | A 入力と B 入力の突き合わせ方法を指定します。1:1、逐次累積、直積展開などを選択し、出力の組み合わせ数や順序を調整します。 |
