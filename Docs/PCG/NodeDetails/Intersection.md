# Intersection (Outer Intersection)

## 概要

Intersectionノード（正式名: Outer Intersection）は、Primary入力とSecondary入力の交差領域を計算します。複数のSecondary入力は暗黙的に結合（Union）されてからPrimary入力と比較されます。動的入力ピンをサポートし、空の入力を無視するオプションも提供します。

## 機能詳細

このノードは、Primary入力データと複数のSecondary入力データとの交差を計算します。Secondary入力は内部で和集合（Union）として扱われ、その後Primary入力との交差が計算されます。

### 処理フロー

1. **入力データの取得**: Primary入力（1つ）とSecondary入力（複数可）を取得
2. **Secondary入力の結合**: 複数のSecondary入力を暗黙的に結合（Union）
3. **交差の計算**: PrimaryとSecondaryの結合データとの交差を計算
4. **密度の再計算**: 指定された密度関数を適用
5. **ゼロ密度フィルタリング**: `bKeepZeroDensityPoints`が無効な場合、密度0のポイントを除外

### ピン構成の詳細

#### Primary Source ピン
- Primaryデータ（基準となるデータ）
- 1つの入力のみ
- 交差の基準

#### Source ピン（動的）
- Secondary入力
- 複数のピンを追加可能（動的入力ピン）
- すべてのSecondary入力が暗黙的に結合される
- 空のデータが渡されると、結果も空になる（`bIgnorePinsWithNoInput`が無効な場合）

## プロパティ

### DensityFunction
- **型**: `EPCGIntersectionDensityFunction`
- **デフォルト値**: `Multiply`
- **オーバーライド可能**: はい
- **説明**: 交差演算後に密度を再計算する際に使用する関数
  - `Multiply`: 密度を乗算
  - `Minimum`: 最小密度を使用
  - `Maximum`: 最大密度を使用

### bIgnorePinsWithNoInput
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 入力データがない動的ピンを無視するかどうか
  - `false`: 空のピンがあると結果も空になる（デフォルト）
  - `true`: 空のピンをバイパスして、データがあるピンのみで交差を計算

### bKeepZeroDensityPoints
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 密度0のポイントを出力に含めるかどうか
  - `false`: 密度0のポイントを自動的にフィルタリング（デフォルト）
  - `true`: 密度0のポイントも出力に含める

## 使用例

### 基本的な交差

```
Get Landscape Data (Primary)
  → Intersection ← Get Volume Data (Secondary)
  → Surface Sampler
```

ランドスケープとボリュームの重なる領域のみにポイントを生成

### 複数の制約条件

```
Get Landscape Data (Primary)
  → Intersection ← Get Volume Data (制約1)
      ↑         ← Get Spline Data (制約2)
      ↑         ← Get Actor Data (制約3)
```

Primaryデータと、3つのSecondary入力の和集合との交差を計算

### 空入力の無視

```
Get Landscape Data (Primary)
  → Intersection (bIgnorePinsWithNoInput=true)
      ↑ ← Get Volume Data (データあり)
      ↑ ← (未接続ピン - 無視される)
      ↑ ← Get Spline Data (データあり)
```

未接続のピンや空のデータを無視して交差を計算

### 典型的な用途

- **条件付き領域定義**: Primaryデータから特定の条件を満たす領域を抽出
- **マスキング**: Primaryデータに複数のマスクを適用
- **領域制限**: 配置領域を複数の制約条件で絞り込み
- **レイヤー合成**: 複数のレイヤーの重なり部分のみを使用

## 実装の詳細

### クラス構成

```cpp
// 設定クラス（動的入力ピンサポート）
class UPCGOuterIntersectionSettings : public UPCGSettingsWithDynamicInputs

// 実行エレメント
class FPCGOuterIntersectionElement : public IPCGElement

// データクラス
class UPCGIntersectionData : public UPCGSpatialDataWithPointCache
```

### ピン構成

**入力ピン**:
- **Primary Source**: 1つの静的ピン（交差の基準）
- **Source**: 複数の動的ピン（Secondary入力、暗黙的に結合される）

**出力ピン**:
- デフォルトの出力ピン（交差の結果）

**Secondary入力の扱い**:
ツールチップより:
> "Secondary pin inputs will be implicitly unioned together before being compared to the primary pin's input for calculation of the intersection operation. Empty data passed along on one of the secondary pins will result in an empty intersection output, unless the 'Ignore Empty Secondary Input' flag is enabled."

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各Primary入力に対して、すべてのSecondary入力との交差を計算

### ノード無効化時の動作

- `OnlyPassThroughOneEdgeWhenDisabled = false`
- ノードが無効化された場合、**すべて**のPrimaryエッジがパススルーされる

### 動的入力ピン

- `HasDynamicPins() = true`
- エディタでSecondaryピンを動的に追加・削除可能
- `AddDefaultDynamicInputPin()`でピンを追加

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### パフォーマンス考慮事項

- **Secondary入力の数**: 多数のSecondary入力は計算コストを増加
- **空入力のチェック**: `bIgnorePinsWithNoInput`を有効にすると、空チェックのオーバーヘッド
- **密度関数**: Multiply関数は計算コストが若干高い

## 注意事項

1. **Secondary入力の結合**: 複数のSecondary入力は**暗黙的に結合**されます
2. **空入力の影響**: デフォルトでは、1つでも空のSecondary入力があると結果が空になります
3. **Primary vs Secondary**: Primary入力が基準となり、その中からSecondaryと重なる部分を抽出
4. **動的ピン**: エディタでピンを追加できますが、接続を忘れないように注意
5. **密度の乗算**: Multiply関数では、密度が低くなる傾向があります

## Inner Intersection vs Intersection (Outer)

- **Inner Intersection**: **すべて**の入力が重なる領域（AND演算）
  - ピン区別なし

- **Intersection (Outer)**: **Primary**と**Secondary（結合）**の交差
  - Primaryピンと動的Secondaryピンを区別
  - Secondaryは暗黙的に結合される

Intersectionは、1つの基準データ（Primary）に対して複数の制約（Secondary）を適用する場合に便利です。

## 関連ノード

- **Inner Intersection**: 内部交差（すべての入力の完全な重なり）
- **Union**: 空間データの和集合
- **Difference**: 空間データの差分
- **Density Filter**: 密度ベースのフィルタリング

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGOuterIntersectionElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGOuterIntersectionElement.cpp`
- **データクラス**: `Engine/Plugins/PCG/Source/PCG/Public/Data/PCGIntersectionData.h`
- **カテゴリ**: Spatial
