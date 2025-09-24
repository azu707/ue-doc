# Point From Mesh

- **日本語名**: メッシュからのポイント
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGPointFromMeshSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointFromMeshElement.h:16`

## 概要

StaticMesh への SoftObjectPath を含む MeshPathAttributeName という属性で、原点に単一ポイントを作成します<br><span style='color:gray'>(Creates a single point at the origin with an attribute named MeshPathAttributeName containing a SoftObjectPath to the StaticMesh.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `StaticMesh` | `TSoftObjectPtr<UStaticMesh>` | なし | 取得元となるスタティックメッシュ。ソフト参照なので遅延ロード可能です。 |
| `MeshPathAttributeName` | `FName` | `NAME_None` | 出力ポイントにメッシュ参照パスを格納する属性名。空の場合は属性を作成しません。 |
| `bSynchronousLoad` | `bool` | `false` | メッシュを同期ロードします。デフォルトは非同期ロードです。 |
