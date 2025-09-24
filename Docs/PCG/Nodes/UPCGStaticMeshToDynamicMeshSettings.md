# Static Mesh To Dynamic Mesh Element

- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGStaticMeshToDynamicMeshSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGStaticMeshToDynamicMeshElement.h:18`

## 概要

スタティックメッシュをダイナミック メッシュ データに変換します<br><span style='color:gray'>(Convert a static mesh into a dynamic mesh data.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `StaticMesh` | `TSoftObjectPtr<UStaticMesh>` | なし | ダイナミックメッシュ化する元のスタティックメッシュ。ソフト参照で遅延ロードに対応します。 |
| `bExtractMaterials` | `bool` | `true` | 元メッシュのマテリアル情報をダイナミックメッシュへコピーするかどうか。オフにするとマテリアルは設定されません。 |
| `OverrideMaterials` | `TArray<TSoftObjectPtr<UMaterialInterface>>` | 空 | `bExtractMaterials = true` の場合に適用する差し替えマテリアル。元メッシュのマテリアル数と同数の要素が必要です。 |
| `RequestedLODType` | `EGeometryScriptLODType` | `MaxAvailable` | どの LOD ソースからトライアングルを抽出するか。高精細ソース／レンダーデータなどを選択できます。 |
| `RequestedLODIndex` | `int32` | `0` | 取得対象の LOD インデックス。LOD タイプによっては無視されます。 |
| `bSynchronousLoad` | `bool` | `false` | スタティックメッシュとマテリアルを同期ロードします。大量アセットを扱う場合はデフォルトの非同期が推奨です。 |
