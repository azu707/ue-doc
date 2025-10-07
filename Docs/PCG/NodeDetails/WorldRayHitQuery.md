# World Ray Hit Query

## 概要

World Ray Hit Queryノードは、入力ポイントからワールドに対してレイキャスト（線分トレース）またはスイープ（形状トレース）を実行します。ヒットした位置、法線、アクター、マテリアルなどの情報を取得し、属性として出力できます。

## 機能詳細

このノードは、各入力ポイントからワールドに向けてレイまたは形状をトレースし、衝突情報を取得します。ヒットポイントの生成、法線の取得、マテリアル情報の抽出など、多様な用途に使用できます。

### 処理フロー

1. **入力ポイントの取得**: ポイントデータを入力から取得
2. **トレースの実行**: 各ポイントからレイキャストまたはスイープを実行
3. **ヒット情報の取得**: 衝突位置、法線、アクター、コンポーネント、マテリアルなどを取得
4. **フィルタリング**: 指定された条件でヒットをフィルタリング
5. **属性の追加**: ヒット情報を属性として追加
6. **ポイントの出力**: ヒット位置にポイントを生成

### トレースタイプ

#### Line Trace (ラインキャスト)
- `CollisionShape`が未設定の場合
- 単純な線分トレース
- 最も高速

#### Sweep (スイープ)
- `CollisionShape`で形状を指定
- 形状を移動させながらトレース
- より正確な衝突検出

## プロパティ

### CollisionShape
- **型**: `FPCGCollisionShape`
- **オーバーライド可能**: はい
- **説明**: トレースに使用する衝突形状
  - 未設定: ラインキャスト
  - 設定済み: 指定された形状でスイープ
- **サブプロパティ**: 形状の種類（Box, Sphere, Capsule）とサイズ

### QueryParams (FPCGWorldRayHitQueryParams)
- **型**: `FPCGWorldRayHitQueryParams`
- **オーバーライド可能**: はい（ShowOnlyInnerProperties）
- **説明**: ワールドクエリのパラメータ群
- **主要サブプロパティ**:
  - **トレース方向**: Up, Down, Custom
  - **トレース距離**: MaxDistance
  - **アクターフィルタ**: ActorTagFilter, ActorClassFilter
  - **ランドスケープ処理**: SelectLandscapeHits
  - **属性出力**: bGetNormal, bGetMaterial, bGetActorReference など

### QueryParams の主要プロパティ詳細

（FPCGWorldRaycastQueryParamsおよびFPCGWorldRayHitQueryParamsから継承）

#### トレース設定
- **トレース方向**: ポイントからのトレース方向
- **MaxDistance**: トレースの最大距離
- **bIgnoreSelf**: 自身のアクターを無視

#### フィルタリング
- **ActorTagFilter**: アクタータグによるフィルタリング
- **ActorClassFilter**: アクタークラスによるフィルタリング
- **ActorFilterFromInput**: 入力ピンからのアクターフィルタ
- **SelectLandscapeHits**: ランドスケープヒットの扱い

#### 出力属性
- **bGetNormal**: 法線を取得
- **bGetMaterial**: マテリアルを取得
- **bGetActorReference**: アクターリファレンスを取得
- **bGetPhysicalMaterial**: 物理マテリアルを取得
- **bApplyMetadataFromLandscape**: ランドスケープレイヤーのメタデータを適用

## 使用例

### 基本的なレイキャスト

```
Create Points Grid
  → World Ray Hit Query (Down方向, MaxDistance=10000)
  → (地面にヒットしたポイントを生成)
```

### 法線情報の取得

```
Create Points
  → World Ray Hit Query (bGetNormal=true)
  → Attribute Transform Op (法線を使用して回転)
  → Static Mesh Spawner (地形に沿って配置)
```

### マテリアル検出

```
Create Points Grid
  → World Ray Hit Query (bGetMaterial=true)
  → Filter Data By Attribute (特定のマテリアルのみ)
  → (特定のマテリアル上にのみオブジェクトを配置)
```

### アクターフィルタ

```
Create Points
  → World Ray Hit Query (ActorClassFilter=StaticMeshActor)
  → (StaticMeshActorのみにヒット)
```

### ランドスケープメタデータの適用

```
Create Points Grid
  → World Ray Hit Query (bApplyMetadataFromLandscape=true)
  → (ランドスケープレイヤー情報を属性に追加)
```

### 典型的な用途

- **地形への投影**: ポイントを地形に投影
- **配置可能位置の検出**: 配置可能なサーフェスを検出
- **法線取得**: サーフェスの法線を取得してオブジェクトを整列
- **マテリアル検出**: サーフェスのマテリアルに基づいてフィルタリング
- **衝突検出**: 特定のアクターやコンポーネントとの衝突を検出

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGWorldRayHitSettings : public UPCGSettings

// 実行エレメント
class FPCGWorldRayHitQueryElement : public IPCGElement

// パラメータ構造体
struct FPCGWorldRayHitQueryParams : public FPCGWorldRaycastQueryParams
struct FPCGWorldRaycastQueryParams : public FPCGWorldCommonQueryParams
struct FPCGWorldCommonQueryParams
```

### ピン構成

**入力ピン**:
- カスタム入力ピン（ポイントデータ）
- オプション: Filter Actor入力ピン（ActorFilterFromInputが設定されている場合）

**出力ピン**:
- カスタム出力ピン（ヒット位置のポイントデータ）

### キャッシュ不可

- `IsCacheable() = false`
- ワールドの状態に依存するため、キャッシュできない

### メインスレッド実行

- `CanExecuteOnlyOnMainThread()`を条件付きでサポート
- 一部の設定では、メインスレッドでのみ実行可能

### パフォーマンス考慮事項

- **ポイント数**: 多数のポイントは多数のトレースを実行
- **トレース距離**: 長い距離はパフォーマンスに影響
- **形状スイープ**: ラインキャストよりコストが高い
- **属性取得**: 多数の属性取得はオーバーヘッドを増加

## 注意事項

1. **キャッシュ不可**: ワールド状態に依存するため、結果はキャッシュされません
2. **パフォーマンス**: 大量のトレースは重い処理です
3. **トレース方向**: デフォルトの方向を確認してください
4. **フィルタリング**: 適切なフィルタを使用して不要なヒットを除外
5. **ランドスケープ**: ランドスケープに対する特別な処理が可能

## World Ray Hit Query vs Proxy (World Raycast)

- **World Ray Hit Query**:
  - より詳細な制御
  - 多数の出力属性オプション
  - フィルタリング機能が豊富

- **Proxy (World Raycast)**:
  - よりシンプルなインターフェース
  - 基本的なレイキャスト機能

World Ray Hit Queryは、より高度なワールドクエリが必要な場合に使用します。

## 関連ノード

- **World Volumetric Query**: ボリュメトリッククエリ（Overlap検出）
- **Proxy (World Raycast)**: シンプルなレイキャスト
- **Projection**: データの投影
- **Get Landscape Data**: ランドスケープデータの取得

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGWorldQuery.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGWorldQuery.cpp`
- **パラメータ**: `Engine/Plugins/PCG/Source/PCG/Public/Data/PCGWorldData.h`
- **ヘルパー**: `Engine/Plugins/PCG/Source/PCG/Public/Helpers/PCGWorldQueryHelpers.h`
- **カテゴリ**: Spatial
