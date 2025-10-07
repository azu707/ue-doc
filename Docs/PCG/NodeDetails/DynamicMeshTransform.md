# Dynamic Mesh Transform

## 概要

**Dynamic Mesh Transform**ノードは、すべてのダイナミックメッシュに変換（Transform）を適用するノードです。メッシュの位置、回転、スケールを変更できます。

カテゴリ: DynamicMesh
クラス名: `UPCGDynamicMeshTransformSettings`
エレメント: `FPCGDynamicMeshTransformElement`

## プロパティ

### Transform
- **型**: `FTransform`
- **デフォルト値**: Identity（変換なし）
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: メッシュに適用する変換。位置、回転、スケールを含みます。

## 入力ピン

### In (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: 変換を適用するダイナミックメッシュ

## 出力ピン

### Out (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: 変換が適用されたダイナミックメッシュ

## 使用例

### メッシュの移動

```
Transform.Location = FVector(100, 200, 50)

[DynamicMesh] → [Dynamic Mesh Transform] → [MovedMesh]
```

### メッシュの回転

```
Transform.Rotation = FRotator(0, 90, 0)  // Y軸周りに90度回転

[DynamicMesh] → [Dynamic Mesh Transform] → [RotatedMesh]
```

### メッシュのスケール

```
Transform.Scale3D = FVector(2, 2, 2)  // 2倍に拡大

[DynamicMesh] → [Dynamic Mesh Transform] → [ScaledMesh]
```

## 実装の詳細

すべての入力ダイナミックメッシュに対して、指定された変換を適用します。変換は頂点座標と法線に影響します。

## 関連ノード

- **Transform Points**: ポイントデータの変換
- **Boolean Operation**: メッシュ間のブーリアン演算
