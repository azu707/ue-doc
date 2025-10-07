# Normal To Density（法線から密度へ）

## 概要

Normal To Densityノードは、ポイントの法線ベクトルと指定された方向ベクトルとの角度を計算し、その結果をポイントの密度値に適用するノードです。地形の傾斜に応じた密度調整など、法線方向に基づいたフィルタリングに使用されます。

**ノードタイプ**: Spatial
**クラス名**: `UPCGNormalToDensitySettings`, `FPCGNormalToDensityElement`
**GPU対応**: あり

## 機能詳細

このノードは、各ポイントのZ軸方向（上方向）と指定された法線ベクトルとの内積を計算し、その値を密度に変換します。オフセットとストレングスパラメータにより、細かい調整が可能です。

### 主な特徴

- **法線ベースの密度計算**: ポイントの向きに基づいて密度を調整
- **複数の密度モード**: Set、Min、Max、Add、Subtract、Multiply、Divideの7つのモード
- **GPU実行対応**: 大量のポイント処理を高速化
- **カーブ調整**: Strengthパラメータで密度曲線を調整可能

## プロパティ

### Normal
- **型**: `FVector`
- **デフォルト値**: `FVector::UpVector` (0, 0, 1)
- **説明**: 比較対象となる法線ベクトル。通常は正規化された方向を指定します
- **PCG_Overridable**: 可

### Offset
- **型**: `double`
- **デフォルト値**: `0.0`
- **説明**: 法線との内積結果にバイアスを加えます。正の値は法線方向に、負の値は逆方向にバイアスをかけます
- **PCG_Overridable**: 可

### Strength
- **型**: `double`
- **デフォルト値**: `1.0`
- **範囲**: 0.0001 ~ 100.0
- **説明**: 結果密度にカーブを適用します。計算式: `Result = Result^(1/Strength)`
  - 1.0: リニア
  - > 1.0: 曲線が緩やかに（より多くのポイントが残る）
  - < 1.0: 曲線が急に（より少ないポイントが残る）
- **PCG_Overridable**: 可

### DensityMode
- **型**: `PCGNormalToDensityMode` (enum)
- **デフォルト値**: `Set`
- **説明**: 出力密度への適用方法
  - **Set**: 計算値で密度を置き換え
  - **Minimum**: 現在の密度と計算値の最小値
  - **Maximum**: 現在の密度と計算値の最大値
  - **Add**: 現在の密度に加算
  - **Subtract**: 現在の密度から減算
  - **Multiply**: 現在の密度と乗算
  - **Divide**: 現在の密度を計算値で除算

## 使用例

### 基本的な使用方法

```
Surface Sampler → Normal To Density → Density Filter
```

### 実際のワークフロー例

1. **地形の傾斜フィルタリング**
   - Landscape上でSurface Samplerを実行
   - Normal To Densityで上向き法線 (0,0,1) との角度を計算
   - 平らな場所のみ高密度、傾斜地は低密度に設定

2. **壁面検出**
   - Normal: (1, 0, 0) （横方向）
   - Offset: 0.0
   - Strength: 2.0
   - 垂直な壁面のポイントのみ高密度に

3. **天井/床の分離**
   - Normal: (0, 0, -1) （下向き）
   - 天井面のポイントを検出

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGNormalToDensity.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGNormalToDensity.cpp`
- **GPUカーネル**: `Engine/Plugins/PCG/Source/PCG/Private/Compute/Elements/PCGNormalToDensityKernel.h`

### 継承関係
- `UPCGNormalToDensitySettings` ← `UPCGSettings`
- `FPCGNormalToDensityElement` ← `FPCGPointOperationElementBase` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **設定値の取得**: Normal、Offset、Strength、DensityModeを取得
2. **正規化**: Normalベクトルを正規化
3. **逆ストレングス計算**: `InvStrength = 1.0 / Max(0.0001, Strength)`
4. **各ポイントの処理**:
   ```cpp
   for each point:
       Up = point.Transform.GetUnitAxis(Z)  // ポイントのZ軸方向
       dotProduct = Up.Dot(Normal) + Offset
       value = Clamp(dotProduct, 0.0, 1.0)
       density = Pow(value, InvStrength)
       ApplyDensityMode(density, point.Density)
   ```

### 密度計算式

```cpp
// 基本計算
Up = Point.Transform.GetUnitAxis(EAxis::Z)
DotProduct = Up.Dot(Normal) + Offset
ClampedValue = Clamp(DotProduct, 0.0, 1.0)
FinalDensity = Pow(ClampedValue, 1.0 / Strength)
```

### GPU実行対応

このノードはGPU実行をサポートしており、エディタ設定で有効化できます:
```cpp
virtual bool DisplayExecuteOnGPUSetting() const override { return true; }
```

GPUカーネルが利用可能な場合、大量のポイント処理が大幅に高速化されます。

### パフォーマンス特性

- **並列処理**: マルチスレッド対応（Point Operation Base使用）
- **GPU対応**: UPCGNormalToDensityKernelによる高速処理
- **メモリ使用**: ポイントコピーを作成
- **割り当てプロパティ**: Densityプロパティのみ
- **キャッシュ可能**: はい

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト)
  - タイプ: `EPCGDataType::Point`

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: `EPCGDataType::Point`

### 技術的詳細

#### GetPropertiesToAllocate
```cpp
EPCGPointNativeProperties::Density
```

#### DensityMode実装
各モードに対応するラムダ関数が定義されており、効率的な分岐処理を実現:
- Set: `OutDensity = InNormalDensity`
- Minimum: `OutDensity = Min(OutDensity, InNormalDensity)`
- Maximum: `OutDensity = Max(OutDensity, InNormalDensity)`
- Add: `OutDensity += InNormalDensity`
- Subtract: `OutDensity -= InNormalDensity`
- Multiply: `OutDensity *= InNormalDensity`
- Divide: `OutDensity /= Max(KINDA_SMALL_NUMBER, InNormalDensity)`

### 注意事項

1. **法線の正規化**: Normalベクトルは自動的に正規化されます
2. **範囲のクランプ**: 内積結果は0.0～1.0にクランプされます
3. **ゼロ除算対策**: Strengthは最小0.0001、Divide時の除数はKINDA_SMALL_NUMBERで保護
4. **ポイントの向き**: ポイントのZ軸（上方向）が法線として使用されます
5. **BasePointData対応**: すべてのBasePointDataタイプをサポート

### ユースケース

- **地形傾斜フィルタ**: 特定の傾斜角度の場所のみにアセット配置
- **壁面検出**: 垂直面の検出と処理
- **方向ベースのカリング**: 特定方向を向いたポイントの選別
- **密度グラデーション**: 法線角度に基づいた滑らかな密度変化
