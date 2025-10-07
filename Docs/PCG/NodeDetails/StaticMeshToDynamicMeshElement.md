# Static Mesh To Dynamic Mesh Element

## 概要

**Static Mesh To Dynamic Mesh Element**ノードは、スタティックメッシュをダイナミックメッシュデータに変換するノードです。

カテゴリ: DynamicMesh
クラス名: `UPCGStaticMeshToDynamicMeshSettings`
エレメント: `FPCGStaticMeshToDynamicMeshElement`

## プロパティ

### StaticMesh
- **型**: `TSoftObjectPtr<UStaticMesh>`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 変換するスタティックメッシュ

### bExtractMaterials
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: スタティックメッシュからマテリアルを抽出し、PCGダイナミックメッシュデータに保存します。

### OverrideMaterials
- **型**: `TArray<TSoftObjectPtr<UMaterialInterface>>`
- **カテゴリ**: Settings
- **条件**: `bExtractMaterials`
- **説明**: マテリアルを抽出する場合、オーバーライドマテリアルを指定できます。スタティックメッシュのマテリアル数と同じ数が必要です。

### RequestedLODType
- **型**: `EGeometryScriptLODType` (enum)
- **デフォルト値**: `EGeometryScriptLODType::MaxAvailable`
- **カテゴリ**: Settings|LODSettings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: スタティックメッシュからダイナミックメッシュを作成する際に使用するLODタイプ

### RequestedLODIndex
- **型**: `int32`
- **デフォルト値**: `0`
- **カテゴリ**: Settings|LODSettings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 使用するLODインデックス

### bSynchronousLoad
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings|Debug
- **説明**: 同期ロードを使用（デバッグ用）

## 入力ピン

なし（または空間データ）

## 出力ピン

### Out (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: 変換されたダイナミックメッシュ

## 使用例

```
[Static Mesh To Dynamic Mesh] → [Boolean Operation]

// 設定:
StaticMesh = /Game/Meshes/MyMesh.MyMesh
bExtractMaterials = true
RequestedLODType = MaxAvailable
```

## 実装の詳細

- 非同期メッシュロードをサポート
- 静的キー追跡をサポート（`GetStaticTrackedKeys`）
- 動的キー追跡が可能（`CanDynamicallyTrackKeys` が true）
- 条件付きメインスレッド実行（`CanExecuteOnlyOnMainThread`）

## 関連ノード

- **Save Dynamic Mesh To Asset**: 逆方向の変換
- **Append Meshes From Points**: スタティックメッシュからダイナミックメッシュを作成し配置
