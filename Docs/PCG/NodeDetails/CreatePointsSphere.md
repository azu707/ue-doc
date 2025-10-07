# Create Points Sphere

## 概要
Create Points Sphereノードは、球面上にポイントを生成するノードです。複数の生成方法（測地線、角度ベース、ランダムなど）をサポートし、球状のパターンを作成します。

## 機能詳細
このノードは`UPCGCreatePointsSphereSettings`クラスとして実装されており、以下の処理を行います:

- 指定された原点と半径を中心とした球面上にポイントを生成
- 複数の生成アルゴリズム（Geodesic、Angle、Segments、Random、Poisson）をサポート
- ポイントの向き（法線方向、中心方向、なし）を制御

## プロパティ

### SphereGeneration
- **型**: EPCGSphereGeneration
- **デフォルト値**: EPCGSphereGeneration::Geodesic
- **カテゴリ**: Settings
- **説明**: 球の生成タイプを決定します。
  - **Geodesic**: 正三角形を細分化して生成
  - **Angle**: 経度・緯度の角度で均等分割
  - **Segments**: セグメント数で均等分割
  - **Random**: 球面上に一様ランダム分布
  - **Poisson**: 最小距離を保つサンプリング
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### CoordinateSpace
- **型**: EPCGCoordinateSpace
- **デフォルト値**: EPCGCoordinateSpace::World
- **カテゴリ**: Settings
- **説明**: ポイントの生成参照座標系
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### PointOrientation
- **型**: EPCGSpherePointOrientation
- **デフォルト値**: EPCGSpherePointOrientation::Radial
- **カテゴリ**: Settings
- **説明**: 生成されたポイントの向きを決定します。
  - **Radial**: 原点から外向き（球面の法線）
  - **Centric**: 原点に向かって内向き
  - **None**: 明示的な向きなし
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### Origin
- **型**: FVector
- **デフォルト値**: FVector::ZeroVector
- **カテゴリ**: Settings
- **説明**: 球の中心位置
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### Radius
- **型**: double
- **デフォルト値**: 100.0
- **カテゴリ**: Settings
- **説明**: 球の半径
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### GeodesicSubdivisions
- **型**: int32
- **デフォルト値**: 2
- **カテゴリ**: Settings
- **説明**: 測地線球の細分化レベル。高いほど指数関数的にコストが増加します。
- **編集条件**: SphereGeneration == Geodesic
- **メタフラグ**: PCG_Overridable, ClampMin=0, ClampMax=8
- **Blueprint対応**: 読み書き可能

### Theta
- **型**: double
- **デフォルト値**: 12
- **カテゴリ**: Settings
- **説明**: 緯度方向のセグメント角度（度数）
- **編集条件**: SphereGeneration == Angle
- **メタフラグ**: PCG_Overridable, ClampMin=0.001, ClampMax=90
- **Blueprint対応**: 読み書き可能

### Phi
- **型**: double
- **デフォルト値**: 12
- **カテゴリ**: Settings
- **説明**: 経度方向のセグメント角度（度数）
- **編集条件**: SphereGeneration == Angle
- **メタフラグ**: PCG_Overridable, ClampMin=0.001, ClampMax=180
- **Blueprint対応**: 読み書き可能

### LatitudinalSegments
- **型**: int32
- **デフォルト値**: 15
- **カテゴリ**: Settings
- **説明**: 緯度方向のセグメント数
- **編集条件**: SphereGeneration == Segments
- **メタフラグ**: PCG_Overridable, ClampMin=1, ClampMax=90000
- **Blueprint対応**: 読み書き可能

### LongitudinalSegments
- **型**: int32
- **デフォルト値**: 30
- **カテゴリ**: Settings
- **説明**: 経度方向のセグメント数
- **編集条件**: SphereGeneration == Segments
- **メタフラグ**: PCG_Overridable, ClampMin=1, ClampMax=180000
- **Blueprint対応**: 読み書き可能

### SampleCount
- **型**: int32
- **デフォルト値**: 100
- **カテゴリ**: Settings
- **説明**: ランダムおよびポアソンサンプリングで生成するサンプル数
- **編集条件**: SphereGeneration == Random || Poisson
- **メタフラグ**: PCG_Overridable, ClampMin=1
- **Blueprint対応**: 読み書き可能

### PoissonDistance
- **型**: double
- **デフォルト値**: 100.0
- **カテゴリ**: Settings
- **説明**: ポアソンサンプリング時のポイント間の最大ワールド距離（cm）
- **編集条件**: SphereGeneration == Poisson
- **メタフラグ**: PCG_Overridable, ClampMin=1
- **Blueprint対応**: 読み書き可能

### PoissonMaxAttempts
- **型**: int32
- **デフォルト値**: 32
- **カテゴリ**: Settings
- **説明**: ポアソンサンプリングが空き位置を探す試行回数の上限
- **編集条件**: SphereGeneration == Poisson
- **メタフラグ**: PCG_Overridable, ClampMin=1
- **Blueprint対応**: 読み書き可能

### LatitudinalStartAngle / LatitudinalEndAngle
- **型**: double
- **デフォルト値**: -90.0 / 90.0
- **カテゴリ**: Settings
- **説明**: 緯度方向の開始/終了角度（赤道角度）
- **メタフラグ**: PCG_Overridable, ClampMin=-90, ClampMax=90
- **Blueprint対応**: 読み書き可能

### LongitudinalStartAngle / LongitudinalEndAngle
- **型**: double
- **デフォルト値**: -180.0 / 180.0
- **カテゴリ**: Settings
- **説明**: 経度方向の開始/終了角度（子午線角度）
- **メタフラグ**: PCG_Overridable, ClampMin=-180, ClampMax=180
- **Blueprint対応**: 読み書き可能

### Jitter
- **型**: double
- **デフォルト値**: 0.0
- **カテゴリ**: Settings
- **説明**: 生成されたポイントの角度にランダム化を追加（[-Jitter, Jitter]の範囲）
- **編集条件**: SphereGeneration == Angle || Segments
- **メタフラグ**: PCG_Overridable, ClampMin=0.0, ClampMax=0.5
- **Blueprint対応**: 読み書き可能

### PointSteepness
- **型**: float
- **デフォルト値**: 0.5f
- **カテゴリ**: Settings
- **説明**: 出力ポイントのsteepness値として直接設定
- **メタフラグ**: ClampMin="0", ClampMax="1", PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bCullPointsOutsideVolume
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: ボリューム外のポイントを削除
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. 生成方法（Geodesic、Random など）を選択
2. 球の原点と半径を設定
3. 選択した生成方法に応じてパラメータ（細分化レベル、サンプル数など）を調整
4. ポイントの向きを設定
5. ノードを実行すると、球面上にポイントが生成される

### 一般的な用途
- 球状のオブジェクト配置（惑星の周りの衛星など）
- ドーム構造の作成
- 放射状のパーティクルエフェクトの初期配置
- 球面サンプリング

## 実装の詳細

### クラス構造
```cpp
UCLASS(BlueprintType, ClassGroup = (Procedural))
class UPCGCreatePointsSphereSettings : public UPCGSettings
```

### 実行エレメント
```cpp
class FPCGCreatePointsSphereElement : public IPCGElement
{
    virtual void GetDependenciesCrc(...) const override;
};
```

### ノードの特徴
- **ノード名**: CreatePointsSphere
- **表示名**: Create Points Sphere
- **カテゴリ**: Spatial
- **シード使用**: true（ランダム/ポアソン生成時）

## 注意事項
- Geodesicの細分化レベルが高いと、ポイント数が指数関数的に増加します
- ポアソンサンプリングは、PoissonDistanceとRadiusの関係によっては、SampleCountに達しない場合があります
- 角度範囲を制限すると、部分的な球面を生成できます

## 関連ノード
- **Create Points Grid**: グリッド状のポイント生成
- **Create Points**: 手動ポイント定義
