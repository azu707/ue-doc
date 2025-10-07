# Save Dynamic Mesh To Asset

## 概要

**Save Dynamic Mesh To Asset**ノードは、ダイナミックメッシュデータをスタティックメッシュアセットとして保存するノードです。

カテゴリ: DynamicMesh
クラス名: `UPCGSaveDynamicMeshToAssetSettings`
エレメント: `FPCGSaveDynamicMeshToAssetElement`

## プロパティ

### ExportParams
- **型**: `FPCGAssetExporterParameters`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: アセットエクスポートパラメータ（保存先パス、命名規則など）

### bExportMaterialsFromDynamicMesh
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: PCGダイナミックメッシュデータに保存されているマテリアルでマテリアルを置き換えます。このオプションは `CopyMeshToAssetOptions.ReplaceMaterials` より優先されます。

### CopyMeshToAssetOptions
- **型**: `FGeometryScriptCopyMeshToAssetOptions`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: メッシュをアセットにコピーする際のオプション

### MeshWriteLOD
- **型**: `FGeometryScriptMeshWriteLOD`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: メッシュ書き込みLOD設定

## 入力ピン

### In (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: 保存するダイナミックメッシュ

## 出力ピン

### Out (出力データ)
- **型**: 適切なデータ型
- **説明**: 保存操作の結果

## 使用例

```
[DynamicMesh] → [Save Dynamic Mesh To Asset]

// 設定:
ExportParams.AssetPath = "/Game/GeneratedMeshes/"
ExportParams.AssetName = "MyProcedura lMesh"
bExportMaterialsFromDynamicMesh = true
```

## 実装の詳細

このノードはメインスレッドでのみ実行されます（`CanExecuteOnlyOnMainThread` が true）。

## 注意事項

- エディタでのみ使用可能
- アセット保存にはディスクアクセスが必要
- 既存のアセットを上書きする場合は注意

## 関連ノード

- **Static Mesh To Dynamic Mesh Element**: 逆方向の変換
