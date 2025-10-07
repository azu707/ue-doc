# Spawn Dynamic Mesh

## 概要

**Spawn Dynamic Mesh**ノードは、各ダイナミックメッシュデータに対してダイナミックメッシュコンポーネントをスポーンするノードです。

カテゴリ: DynamicMesh
クラス名: `UPCGSpawnDynamicMeshSettings`
エレメント: `FPCGSpawnDynamicMeshElement`

## プロパティ

### TargetActor
- **型**: `TSoftObjectPtr<AActor>`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: メッシュコンポーネントをスポーンするターゲットアクター

### PostProcessFunctionNames
- **型**: `TArray<FName>`
- **カテゴリ**: Settings
- **説明**: インスタンスがスポーンされた後にターゲットアクターで呼び出される関数のリスト。関数はパラメータなしで "CallInEditor" フラグを有効にする必要があります。

## 入力ピン

### In (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: スポーンするダイナミックメッシュ

## 出力ピン

なし（または実行結果）

## 使用例

```
[DynamicMesh] → [Spawn Dynamic Mesh]

// 設定:
TargetActor = BP_TargetActor
PostProcessFunctionNames = ["OnMeshSpawned", "UpdateCollision"]
```

## 実装の詳細

- メインスレッドでのみ実行（`CanExecuteOnlyOnMainThread` が true）
- キャッシュ不可（`IsCacheable` が false）

## 注意事項

- ターゲットアクターが必要
- ポストプロセス関数はエディタで呼び出し可能である必要があります

## 関連ノード

- **Static Mesh Spawner**: スタティックメッシュのスポーン
