# Get Static Mesh Resource Data

- **カテゴリ**: Resource (リソース) — 2件
- **実装クラス**: `UPCGGetStaticMeshResourceDataSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetStaticMeshResourceData.h:15`

## 概要

静的メッシュのリソース情報 (頂点・マテリアルなど) を抽出します。<br><span style='color:gray'>(Extracts static mesh resource data such as vertices or materials.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `StaticMeshes` | `TArray<TSoftObjectPtr<UStaticMesh>>` | 空 | 取得したい静的メッシュのリスト。`bOverrideFromInput` が無効のとき使用します。 |
| `bOverrideFromInput` | `bool` | `false` | 入力ピンからメッシュ参照を受け取る場合に有効化します。 |
| `MeshAttribute` | `FPCGAttributePropertyInputSelector` | なし | `bOverrideFromInput` 有効時に、オーバーライド入力からメッシュ参照を抽出する属性。 |

## 実装メモ

- `bOverrideFromInput` をオンにすると「Meshes」パラメータピンが必須となり、指定した属性から `FSoftObjectPath` を抽出して動的にリソースリストを構築します。<br><span style='color:gray'>(Overrides are read from the dedicated pin when enabled.)</span>
- 内部ではメッシュごとに `UPCGStaticMeshResourceData` をキャッシュし、同じメッシュを複数回要求しても 1 つのオブジェクトを共有します。<br><span style='color:gray'>(A map of mesh soft pointers prevents redundant resource creation.)</span>
- エディタでは選択キー追跡 (`GetStaticTrackedKeys`) に対応し、参照メッシュのアセット更新が自動でグラフへ伝播します。<br><span style='color:gray'>(Static key tracking keeps the graph up to date when referenced meshes change.)</span>
