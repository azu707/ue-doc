# Save Dynamic Mesh To Asset

- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGSaveDynamicMeshToAssetSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGSaveDynamicMeshToAsset.h:15`

## 概要

スタティックメッシュ アセットにダイナミック メッシュ データを保存します<br><span style='color:gray'>(Saves dynamic mesh data into a static mesh asset.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ExportParams` | `FPCGAssetExporterParameters` | 構造体既定値 | 書き出し先アセット名 (`AssetName`)、保存パス (`AssetPath`)、保存ダイアログ表示 (`bOpenSaveDialog`)、書き出し後の自動保存 (`bSaveOnExportEnded`) など、アセット生成フロー全体の挙動をまとめて管理します。 |
| `bExportMaterialsFromDynamicMesh` | `bool` | `true` | 入力ダイナミックメッシュに格納されたマテリアル情報を優先的にアセットへ書き込みます。`false` の場合は `CopyMeshToAssetOptions` の設定に従います。 |
| `CopyMeshToAssetOptions` | `FGeometryScriptCopyMeshToAssetOptions` | 構造体既定値 | メッシュ書き込み時の詳細設定。法線/タンジェントの再計算、縮退ポリゴンの除去、ボーン階層のミスマッチ処理、マテリアルの差し替え、ライトマップ UV 生成、Nanite 設定適用などを制御します。 |
| `MeshWriteLOD` | `FGeometryScriptMeshWriteLOD` | `bWriteHiResSource = false`, `LODIndex = 0` | どの LOD にメッシュを書き込むかを指定します。`bWriteHiResSource` を有効にするとハイレゾ・ソースモデルへ直接書き込み、`LODIndex` は対象レンダリング LOD を示します。 |
