# Create Points Grid

## 概要
Create Points Gridノードは、2Dまたは3Dグリッド状のポイントを自動生成するノードです。指定された範囲とセルサイズに基づいて、規則的に配置されたポイントセットを作成します。

## 機能詳細
このノードは`UPCGCreatePointsGridSettings`クラスとして実装されており、以下の処理を行います:

- 指定された範囲（GridExtents）内にグリッド状のポイントを生成
- セルサイズに基づいてポイント間隔を決定
- ポイント位置をセルの中心または角に配置

## プロパティ

### GridExtents
- **型**: FVector
- **デフォルト値**: FVector(500.0, 500.0, 50.0)
- **カテゴリ**: Settings
- **説明**: グリッドの範囲をcm単位で指定します。X、Y、Zの各軸方向の範囲です。
- **メタフラグ**: PCG_Overridable, ClampMin="0.0", UIMin="0.0"
- **Blueprint対応**: 読み書き可能

### CellSize
- **型**: FVector
- **デフォルト値**: FVector(100.0, 100.0, 100.0)
- **カテゴリ**: Settings
- **説明**: 各セルのサイズをcm単位で指定します。これによりポイント間の距離が決まります。
- **メタフラグ**: PCG_Overridable, ClampMin="0.0", UIMin="0.0"
- **Blueprint対応**: 読み書き可能

### PointSteepness
- **型**: float
- **デフォルト値**: 0.5f
- **カテゴリ**: Settings
- **説明**: 各PCGポイントは離散化された体積領域を表します。Steepness値[0.0〜1.0]は、そのボリュームの「硬さ」や「柔らかさ」を確立します。0では中心からバウンドの2倍まで線形に密度への影響を増加させます。1では、ポイントのバウンドのサイズでバイナリボックス関数を表します。
- **メタフラグ**: ClampMin="0", ClampMax="1", PCG_Overridable
- **Blueprint対応**: 読み書き可能

### CoordinateSpace
- **型**: EPCGCoordinateSpace
- **デフォルト値**: EPCGCoordinateSpace::World
- **カテゴリ**: Settings
- **説明**: ポイントの生成参照座標系を設定します。
- **メタフラグ**: PCG_Overridable, PCG_OverrideAliases="GridPivot"
- **Blueprint対応**: 読み書き可能

### bSetPointsBounds
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: trueの場合、ポイントのバウンドは50.0に設定されます。falseの場合は1.0に設定されます。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bCullPointsOutsideVolume
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、ボリューム外にあるポイントが削除されます。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### PointPosition
- **型**: EPCGPointPosition
- **デフォルト値**: EPCGPointPosition::CellCenter
- **カテゴリ**: Settings
- **説明**: ポイントの配置位置を制御します。
  - **CellCenter**: セルの中心
  - **CellCorners**: セルの角
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. `GridExtents`でグリッドの全体サイズを設定
2. `CellSize`でポイント間の距離を設定
3. `PointPosition`でセル中心か角かを選択
4. ノードを実行すると、規則的に配置されたポイントが生成される

### 一般的な用途
- 規則的なパターンでオブジェクトを配置
- 地面や床のタイル配置
- グリッドベースの都市計画やレベルデザイン
- テストやデバッグ用の規則的なポイントセット

## 実装の詳細

### クラス構造
```cpp
UCLASS(BlueprintType, ClassGroup = (Procedural))
class UPCGCreatePointsGridSettings : public UPCGSettings
```

### 実行エレメント
```cpp
class FPCGCreatePointsGridElement : public IPCGElement
{
    virtual void GetDependenciesCrc(...) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override { return true; }
};
```

### 入力ピン
- オプションのボリューム入力（カリング用）
- ベースポイントデータ入力をサポート

### 出力ピン
- ポイントデータ（DefaultPointOutputPinProperties）

### ノードの特徴
- **ノード名**: CreatePointsGrid
- **表示名**: Create Points Grid
- **カテゴリ**: Spatial
- **依存関係CRC**: 座標空間とカリング設定を考慮

## 注意事項
- GridExtentsとCellSizeの組み合わせによっては、大量のポイントが生成される可能性があります
- ポイント数 ≈ (GridExtents.X / CellSize.X) × (GridExtents.Y / CellSize.Y) × (GridExtents.Z / CellSize.Z)
- メモリとパフォーマンスに注意して設定してください
- 非常に小さいCellSizeは、極端に多くのポイントを生成します

## 関連ノード
- **Create Points**: 手動でポイントを定義
- **Create Points Sphere**: 球面上のポイント生成
- **Transform Points**: 生成されたポイントの変換
