# Inner Intersection

## 概要

Inner Intersectionノードは、すべての入力データの内部交差（完全に重なる領域）を計算します。すべての入力が重なっている領域のみを出力し、密度の再計算もサポートしています。

## 機能詳細

Inner Intersectionは、複数の空間データの内部交差を計算します。出力されるのは、**すべて**の入力データが重なっている領域のみです。これは、複数の条件を同時に満たす領域を見つけるのに有用です。

### 処理フロー

1. **入力データの取得**: 複数の空間データを入力ピンから取得
2. **内部交差の計算**: すべてのデータが重なっている領域を特定
3. **密度の再計算**: 指定された密度関数に基づいて密度を計算
4. **ゼロ密度フィルタリング**: `bKeepZeroDensityPoints`が無効な場合、密度0のポイントを除外

### 密度関数

#### Multiply (乗算)
- すべての入力データの密度を乗算
- 最も保守的な交差（1つでも密度が低いと全体が低くなる）
- デフォルト設定

#### Minimum (最小値)
- すべての入力データの最小密度を使用
- Multiplyより緩やかな交差

#### Maximum (最大値)
- すべての入力データの最大密度を使用
- 最も楽観的な交差

## プロパティ

### DensityFunction
- **型**: `EPCGIntersectionDensityFunction`
- **デフォルト値**: `Multiply`
- **オーバーライド可能**: はい
- **説明**: 交差演算後に密度を再計算する際に使用する関数
  - `Multiply`: 密度を乗算
  - `Minimum`: 最小密度を使用
  - `Maximum`: 最大密度を使用

### bKeepZeroDensityPoints
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 密度0のポイントを出力に含めるかどうか
  - `false`: 密度0のポイントを自動的にフィルタリング（デフォルト）
  - `true`: 密度0のポイントも出力に含める

## 使用例

### 基本的な使用方法

```
Get Landscape Data (地形)
Get Volume Data (配置可能エリア) → Inner Intersection
Get Spline Data (道路からの距離)      ↓
                                   Surface Sampler
```

3つの条件すべてを満たす領域（地形上 AND 配置可能エリア内 AND 道路から一定距離）にのみポイントを配置

### 複雑な条件の組み合わせ

```
Get Actor Data (森林エリア)
Get Volume Data (平地エリア)   → Inner Intersection
Get Texture Data (湿度マップ)      ↓
                                Dense ity Filter (高密度のみ)
                                    ↓
                                Static Mesh Spawner (湿地植物)
```

森林 AND 平地 AND 高湿度のエリアにのみ湿地植物を配置

### 典型的な用途

- **複数条件フィルタ**: すべての条件を満たす領域の特定
- **精密な配置制御**: 複数の制約を同時に適用
- **ゾーン重複**: 複数のゾーンが重なる部分の特定
- **マスクの組み合わせ**: 複数のマスクを AND 演算

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGInnerIntersectionSettings : public UPCGSettings

// 実行エレメント
class FPCGInnerIntersectionElement : public IPCGElement

// データクラス
class UPCGIntersectionData : public UPCGSpatialDataWithPointCache
```

### ピン構成

**入力ピン**:
- 複数の入力ピン（すべての空間データ型をサポート）
- すべての入力が交差演算に使用される

**出力ピン**:
- デフォルトの出力ピン（内部交差の結果）

### ノード無効化時の動作

- `OnlyPassThroughOneEdgeWhenDisabled = true`
- ノードが無効化された場合、最初のエッジのみがパススルーされる

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### パフォーマンス考慮事項

- **入力数の影響**: 入力データが多いほど、計算コストが増加
- **密度関数**: Multiply関数は計算コストが若干高い
- **早期除外**: すべての入力が重なる必要があるため、効率的なフィルタリングが行われる

### スレッドセーフティ

- マルチスレッド実行に対応
- 空間データの交差計算は並列化可能

## 注意事項

1. **すべてが重なる必要**: 1つでも重ならない入力があると、その領域は除外されます
2. **密度の乗算**: Multiply関数を使用すると、密度が急激に減少する可能性があります
3. **ゼロ密度**: デフォルトでは密度0のポイントは自動的に除外されます
4. **入力順序**: 入力の順序は結果に影響しません（交換可能）
5. **データ型の互換性**: すべての入力は互換性のある空間データ型である必要があります

## Inner Intersection vs Intersection (Outer)

- **Inner Intersection**: **すべて**の入力が重なる領域（AND演算）
- **Intersection (Outer)**: Primary入力と**いずれかの**Secondary入力が重なる領域

Inner Intersectionは、より厳格な条件を適用する場合に使用します。

## 関連ノード

- **Intersection (Outer)**: 外部交差（Primary と Secondary の交差）
- **Union**: 空間データの和集合
- **Difference**: 空間データの差分
- **Density Filter**: 密度ベースのフィルタリング

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGInnerIntersectionElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGInnerIntersectionElement.cpp`
- **データクラス**: `Engine/Plugins/PCG/Source/PCG/Public/Data/PCGIntersectionData.h`
- **カテゴリ**: Spatial
