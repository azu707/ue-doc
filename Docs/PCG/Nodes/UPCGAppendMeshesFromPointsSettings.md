# Append Meshes From Points

- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGAppendMeshesFromPointsSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGAppendMeshesFromPoints.h:24`

## 概要

ポイントのトランスフォーム時にメッシュを付加します。メッシュは、単一のスタティックメッシュ、ポイントからの複数のメッシュ、または別のダイナミック メッシュの場合があります<br><span style='color:gray'>(Append meshes at the points transforms. Mesh can be a single static mesh, multiple meshes coming from the points or another dynamic mesh.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGAppendMeshesFromPointsMode` | `SingleStaticMesh` | メッシュ取得方法を指定します。`SingleStaticMesh` は設定内の 1 つのスタティックメッシュを複製、`StaticMeshFromAttribute` は各ポイントの属性からメッシュ参照を読み込み、`DynamicMesh` は別入力のダイナミックメッシュをコピーします。 |
| `StaticMesh` | `TSoftObjectPtr<UStaticMesh>` | なし | `Mode = SingleStaticMesh` のときに使用するメッシュ。ソフト参照のため未ロードでも指定でき、実行時に解決されます。 |
| `MeshAttribute` | `FPCGAttributePropertyInputSelector` | なし | `Mode = StaticMeshFromAttribute` の場合にメッシュ参照を保持する属性（ソフトオブジェクトパスなど）を指定します。ポイントごとに異なるメッシュをアサインできます。 |
| `bExtractMaterials` | `bool` | `true` | スタティックメッシュからマテリアルスロットを読み出してダイナミックメッシュへ転写するか。`DynamicMesh` モードでは無効です。 |
| `RequestedLODType` | `EGeometryScriptLODType` | `RenderData` | スタティックメッシュからダイナミックメッシュ化する際に使用する LOD 種別（RenderData/SourceModel/HiRes 等）を選択します。 |
| `RequestedLODIndex` | `int32` | `0` | 取得する LOD インデックス。LOD タイプが単一 LOD 固定の場合は無視されます。 |
| `bSynchronousLoad` | `bool` | `false` | スタティックメッシュの読み込みを同期化します。大量アセットを扱う通常運用では非同期のままが推奨です。 |
