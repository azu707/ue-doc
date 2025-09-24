# Get Dynamic Mesh Data

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGGetDynamicMeshDataSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGGetDynamicMeshData.h:14`

## 概要

選択したアクタから PCG 互換データのコレクションをビルドします<br><span style='color:gray'>(Builds a collection of PCG-compatible data from the selected actors.)</span>

## 設定項目


このノードは「Get Actor Data」の設定に加えて、ダイナミックメッシュ取得用の以下のプロパティを持ちます。

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Options` | `FGeometryScriptCopyMeshFromComponentOptions` | なし | コンポーネントからメッシュを複製する際の Geometry Script オプション。法線や UV のコピー方法などを細かく制御します。 |
