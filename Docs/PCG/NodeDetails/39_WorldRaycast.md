# World Raycast（ワールドレイキャスト / Proxy）

## 概要

World Raycastノード（別名: Proxy）は、提供されたポイントから指定された方向にレイキャストまたはコリジョン形状スイープを実行し、ヒット位置にポイントを移動するノードです。地形や他のアクターへのポイント投影に使用されます。

**ノードタイプ**: Spatial
**クラス名**: `UPCGWorldRaycastElementSettings`, `FPCGWorldRaycastElement`
**別名**: Proxy (World Raycast)

## 機能詳細

このノードは、各入力ポイントから物理レイキャストを実行し、ワールド内のコリジョンオブジェクトとの交差点を検出します。ヒットした場合、ポイントをその位置に移動させます。ラインレイキャストだけでなく、球、ボックス、カプセルなどの形状スイープもサポートします。

### 主な特徴

- **複数のレイキャストモード**: 無限、正規化+長さ指定、セグメント
- **コリジョン形状**: ライン、球、ボックス、カプセル
- **属性ベースのカスタマイズ**: 原点、方向、長さを属性から取得可能
- **ミス時の処理**: レイキャストが外れた場合の動作を制御可能
- **バウンディング制限**: アクターバウンズまたはカスタム形状で制限可能

## プロパティ

### CollisionShape
- **型**: `FPCGCollisionShape`
- **説明**: ラインレイキャストまたはコリジョン形状スイープのパラメータ
  - ShapeType: Line, Sphere, Box, Capsule
  - 各形状の詳細パラメータ（半径、サイズなど）
- **PCG_Overridable**: 可
- **ShowOnlyInnerProperties**: 有効

### RaycastMode
- **型**: `EPCGWorldRaycastMode` (enum)
- **デフォルト値**: `Infinite`
- **説明**: レイの方向と距離の計算方法
  - **Infinite**: 無限長のレイ
  - **NormalizedWithLength**: 正規化された方向+長さ指定
  - **Segments**: 始点と終点を指定

### OriginInputAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **説明**: レイの原点を決定する属性セレクタ。デフォルトではポイント位置を使用
- **PCG_Overridable**: 可

### bOverrideRayDirections
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: レイの方向を属性から取得するかどうか（Segmentsモード以外）
- **PCG_Overridable**: 可

### RayDirection
- **型**: `FVector`
- **デフォルト値**: `-FVector::UnitZ()` (下向き: 0, 0, -1)
- **説明**: すべてのレイキャストに使用される方向（bOverrideRayDirectionsがfalseの場合）
- **PCG_Overridable**: 可

### RayDirectionAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **説明**: レイの方向を決定する属性セレクタ（bOverrideRayDirectionsがtrueの場合）
- **PCG_Overridable**: 可

### EndPointAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **説明**: レイの終点を決定する属性セレクタ（Segmentsモードの場合）
- **PCG_Overridable**: 可

### bOverrideRayLengths
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: レイの長さを属性から取得するかどうか（NormalizedWithLengthモードの場合）
- **PCG_Overridable**: 可

### RayLength
- **型**: `double`
- **デフォルト値**: `100000.0` (1km)
- **説明**: すべてのレイキャストに使用される長さ（bOverrideRayLengthsがfalseの場合）
- **PCG_Overridable**: 可

### RayLengthAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **説明**: レイの長さを決定する属性セレクタ（bOverrideRayLengthsがtrueの場合）
- **PCG_Overridable**: 可

### WorldQueryParams
- **型**: `FPCGWorldRaycastQueryParams`
- **説明**: ワールドレイキャストパラメータ
  - コリジョンチャンネル設定
  - フィルタリングアクター
  - トレースタイプ（シンプル/コンプレックス）
  - その他のクエリフラグ
- **PCG_Overridable**: 可
- **ShowOnlyInnerProperties**: 有効

### bKeepOriginalPointOnMiss
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: レイキャストがヒットしなかった場合、またはヒット結果がバウンズ外の場合、元の位置のポイントを保持するかどうか
- **PCG_Overridable**: 可

### bUnbounded
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: Bounding Shape入力が提供されていない場合、アクターバウンズの代わりに無制限にサンプル生成領域を拡張するかどうか
- **PCG_Overridable**: 可

## 使用例

### 基本的な使用方法

```
ポイント生成 → World Raycast → 地形に投影されたポイント
```

### 実際のワークフロー例

1. **地形への垂直投影**
   - Grid Createで空中にグリッド生成
   - World RaycastでRayDirection = (0, 0, -1)
   - 地形上にポイントを配置

2. **壁面検出**
   - ポイント生成
   - World Raycastで横方向にレイキャスト
   - 壁にヒットした位置にポイント配置

3. **球形スイープ**
   - CollisionShape = Sphere
   - 障害物との衝突を考慮した配置

4. **セグメントモード**
   - RaycastMode = Segments
   - 2点間のレイキャストで障害物チェック

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGWorldRaycast.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGWorldRaycast.cpp`

### 継承関係
- `UPCGWorldRaycastElementSettings` ← `UPCGSettings`
- `FPCGWorldRaycastElement` ← `TPCGTimeSlicedElementBase<FPCGWorldRaycast::FExecutionState, FPCGWorldRaycast::FIterationState>`

### ExecuteInternal処理フロー

1. **準備フェーズ** (PrepareDataInternal):
   - コリジョンクエリパラメータの構築
   - フィルタアクターの収集
   - バウンディングボックスの計算

2. **実行フェーズ** (ExecuteInternal):
   ```cpp
   for each point:
       // レイの原点、方向、長さを計算
       origin = GetOrigin(point)
       direction = GetDirection(point)
       length = GetLength(point)

       // レイキャストまたはスイープ実行
       if (CollisionShape == Line):
           hit = LineTrace(origin, origin + direction * length)
       else:
           hit = ShapeSweep(origin, origin + direction * length, shape)

       // 結果処理
       if (hit && IsWithinBounds(hit.Location)):
           point.Transform.SetLocation(hit.Location)
       else if (!bKeepOriginalPointOnMiss):
           Remove point
   ```

3. **タイムスライシング**: 大量のポイント処理を複数フレームに分割

### レイキャストモードの詳細

#### Infinite
```cpp
ray.end = ray.origin + ray.direction * VERY_LARGE_NUMBER
```

#### NormalizedWithLength
```cpp
ray.direction = Normalize(direction)
ray.end = ray.origin + ray.direction * RayLength
```

#### Segments
```cpp
ray.origin = OriginAttribute
ray.end = EndPointAttribute
ray.direction = Normalize(end - origin)
```

### パフォーマンス特性

- **タイムスライシング**: 大量のポイント処理を複数フレームに分割
- **メインスレッド実行**: 物理クエリのため、メインスレッドで実行必須
- **キャッシュ不可**: `IsCacheable() = false`（ワールド状態に依存）
- **BasePointData対応**: あり

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト): ポイントデータ
  - `Bounding Shape` (オプション): サンプル領域制限
  - タイプ: `EPCGDataType::Point`, `EPCGDataType::Spatial`

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: `EPCGDataType::Point`

### 技術的詳細

#### タイムスライシング状態

```cpp
struct FExecutionState
{
    FCollisionQueryParams CollisionQueryParams;
    FCollisionObjectQueryParams CollisionObjectQueryParams;
    FBox Bounds;
};

struct FIterationState
{
    TArray<FVector> CachedRayOrigins;
    TArray<FVector> CachedRayVectors;
    TArray<double> CachedRayLengths;
    TSet<TObjectKey<AActor>> CachedFilterActors;
};
```

各フレームの実行状態とイテレーション状態を保持します。

#### メインスレッド実行の必須性

```cpp
virtual bool CanExecuteOnlyOnMainThread(FPCGContext* Context) const override
{
    return true; // 物理クエリはメインスレッドで実行必要
}
```

### 注意事項

1. **メインスレッド**: 物理レイキャストのため、必ずメインスレッドで実行されます
2. **パフォーマンス**: 大量のレイキャストは高コスト。タイムスライシングを活用します
3. **コリジョン設定**: ワールドのコリジョン設定が結果に影響します
4. **ミス処理**: `bKeepOriginalPointOnMiss`の設定によって、ヒットしなかった場合の動作が変わります
5. **バウンズ**: `bUnbounded`がfalseの場合、アクターバウンズまたはBounding Shape入力が必要です

### ユースケース

- **地形投影**: 空中のポイントを地形に投影
- **障害物回避**: レイキャストで障害物を検出し配置調整
- **壁面配置**: 壁にヒットした位置にデコレーション配置
- **天井/床検出**: 上下方向のレイキャストで高さ検出
- **物理ベースの配置**: コリジョンを考慮した正確な配置
