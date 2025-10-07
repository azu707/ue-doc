# Get Static Mesh Resource Data

## 概要

**Get Static Mesh Resource Data**ノードは、指定されたソフトオブジェクトパスからスタティックメッシュリソースデータを作成するノードです。

カテゴリ: Resource
クラス名: `UPCGGetStaticMeshResourceDataSettings`
エレメント: `FPCGGetStaticMeshResourceDataElement`

## 機能詳細

このノードは、スタティックメッシュへの参照をPCGリソースデータとして生成します。メッシュのロードやキャッシングを処理し、後続のノードで使用できるリソースデータを提供します。

## プロパティ

### StaticMeshes
- **型**: `TArray<TSoftObjectPtr<UStaticMesh>>`
- **カテゴリ**: Settings
- **条件**: `!bOverrideFromInput`
- **説明**: 生成するメッシュのリスト。各エントリに対して1つのリソースデータを生成します。

### bOverrideFromInput
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **説明**: 入力からスタティックメッシュをオーバーライドします。

### MeshAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **カテゴリ**: Settings
- **条件**: `bOverrideFromInput`
- **メタデータ**: `PCG_DiscardPropertySelection`, `PCG_DiscardExtraSelection`
- **説明**: メッシュを取得する入力属性。

## 入力ピン

動的に定義されます。`bOverrideFromInput = true` の場合、メッシュ属性を含むデータを受け取ります。

## 出力ピン

### Out (リソースデータ)
- **型**: スタティックメッシュリソースデータ
- **説明**: 各メッシュに対して1つのリソースデータ

## 使用例

### 固定メッシュリスト

```
[Get Static Mesh Resource Data] → [ResourceData]

// 設定:
StaticMeshes = [
    /Game/Meshes/Rock1.Rock1,
    /Game/Meshes/Rock2.Rock2,
    /Game/Meshes/Rock3.Rock3
]

// 結果: 3つのリソースデータが出力される
```

### 入力からのメッシュ

```
[AttributeSetWithMeshPaths] → [Get Static Mesh Resource Data] → [ResourceData]

// 設定:
bOverrideFromInput = true
MeshAttribute = "MeshPath"
```

## 実装の詳細

### 静的キー追跡

- `GetStaticTrackedKeys()`: 静的に決定可能なメッシュを追跡
- `CanDynamicallyTrackKeys()`: `bOverrideFromInput` が true の場合に動的追跡が可能

### プロパティ変更検出

`GetChangeTypeForProperty()` メソッドは、StaticMeshes や bOverrideFromInput の変更を適切に処理します。

## 関連ノード

- **Get Resource Path**: リソースパスを抽出
- **Static Mesh Spawner**: リソースからメッシュをスポーン
- **Static Mesh To Dynamic Mesh Element**: リソースからダイナミックメッシュを作成
