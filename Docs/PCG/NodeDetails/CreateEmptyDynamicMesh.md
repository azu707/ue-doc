# Create Empty Dynamic Mesh

## 概要

**Create Empty Dynamic Mesh**ノードは、空のダイナミックメッシュデータを作成するノードです。他のダイナミックメッシュ処理の開始点として、またはカスタムメッシュ構築のベースとして使用されます。

カテゴリ: DynamicMesh
クラス名: `UPCGCreateEmptyDynamicMeshSettings`
エレメント: `FPCGCreateEmptyDynamicMeshElement`

## プロパティ

このノードにはユーザー設定可能なプロパティはありません。単純に空のダイナミックメッシュを作成します。

## 入力ピン

なし（入力ピンなし）

## 出力ピン

### Out (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: 空のダイナミックメッシュ（頂点もトライアングルも含まれない）

## 使用例

```
[Create Empty Dynamic Mesh] → [カスタム処理] → [結果]
```

空のメッシュを作成し、後続のノードでジオメトリを追加します。

## 関連ノード

- **Merge Dynamic Meshes**: 空のメッシュに他のメッシュを追加
- **Append Meshes From Points**: 空のメッシュにポイントからメッシュを追加
