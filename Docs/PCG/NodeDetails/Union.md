# Union

## 概要

Unionノードは、複数の空間データを結合して和集合を作成します。動的入力ピンをサポートし、入力の順序が尊重されます。密度関数とユニオンタイプを選択して、重なる領域の処理方法を制御できます。

## 機能詳細

Unionノードは、すべての入力データを結合し、それらの和集合を作成します。重なる領域での密度の計算方法や、優先順位の扱い方を設定できます。

### 処理フロー

1. **入力データの取得**: 動的入力ピンから複数の空間データを取得（順序保持）
2. **和集合の計算**: すべてのデータを結合
3. **密度の再計算**: 重なる領域で密度関数を適用
4. **優先順位の適用**: Typeに応じて優先順位を処理

### ユニオンタイプ

#### LeftToRightPriority (左から右への優先順位)
- デフォルト設定
- 左側（最初）の入力が優先される
- 重なる領域では左側のデータ属性が保持される

#### その他のタイプ
（実装により異なる可能性があります）

### 密度関数

#### Maximum (最大値)
- デフォルト設定
- 重なる領域では最大密度を使用
- 最も一般的な和集合の動作

#### その他の関数
（実装により異なる可能性があります）

## プロパティ

### Type
- **型**: `EPCGUnionType`
- **デフォルト値**: `LeftToRightPriority`
- **オーバーライド可能**: はい
- **説明**: 和集合の計算タイプ
  - `LeftToRightPriority`: 左から右への優先順位

### DensityFunction
- **型**: `EPCGUnionDensityFunction`
- **デフォルト値**: `Maximum`
- **オーバーライド可能**: はい
- **説明**: 重なる領域での密度計算関数
  - `Maximum`: 最大密度を使用

## 使用例

### 基本的な使用方法

```
Get Landscape Data
Get Volume Data     → Union
Get Actor Data          ↓
                    Surface Sampler
```

複数のデータソースを結合して、すべての領域をカバーするサーフェスを作成

### 複数の配置領域の結合

```
Get Spline Data (道路1)
Get Spline Data (道路2)   → Union
Get Spline Data (道路3)       ↓
                          Spline Sampler → Static Mesh Spawner
```

複数のスプラインを結合して、すべての道路に沿ってオブジェクトを配置

### 領域の拡張

```
Get Volume Data (基本エリア)
Get Actor Data (追加エリア) → Union (Maximum密度)
                                  ↓
                              Surface Sampler
```

基本エリアに追加エリアを結合して配置領域を拡張

### 典型的な用途

- **領域の結合**: 複数の配置可能領域を1つに統合
- **データの統合**: 異なるソースからのデータを結合
- **階層的な領域定義**: 複数のゾーンを重ねて複雑な領域を作成
- **マスクの合成**: 複数のマスクを OR 演算

## 実装の詳細

### クラス構成

```cpp
// 設定クラス（動的入力ピンサポート）
class UPCGUnionSettings : public UPCGSettingsWithDynamicInputs

// 実行エレメント
class FPCGUnionElement : public IPCGElement

// データクラス
class UPCGUnionData : public UPCGSpatialDataWithPointCache
```

### ピン構成

**入力ピン**:
- 複数の動的入力ピン
- `AddDefaultDynamicInputPin()`でエディタから動的にピンを追加可能
- すべての空間データ型をサポート
- 入力の順序が尊重される

**出力ピン**:
- デフォルトの出力ピン（和集合の結果）

### 動的入力ピン

- `UPCGSettingsWithDynamicInputs`を継承
- `HasDynamicPins() = true`
- エディタでピンを動的に追加・削除可能
- `GetDynamicInputPinsBaseLabel()`でピンのベースラベルを定義

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### パフォーマンス考慮事項

- **入力数**: 多数の入力がある場合、計算コストが増加
- **密度関数**: Maximum関数は計算コストが低い
- **データ型の互換性**: 同じデータ型の入力を結合する方が効率的

### 入力の順序

- ツールチップに記載: "Order of inputs is respected, beginning with the dynamic pin inputs."
- 動的ピンの入力から順に処理される
- 優先順位が重要な場合は、順序に注意

## 注意事項

1. **入力順序**: 左から右（動的ピンの順序）で処理され、優先順位に影響します
2. **動的ピン**: エディタでピンを追加・削除できますが、接続を確認してください
3. **密度の扱い**: Maximum関数は、重なる領域で最も高い密度を保持します
4. **データ型**: すべての入力は空間データ型である必要があります
5. **メタデータ**: 優先順位に応じて、左側のデータのメタデータが保持される可能性があります

## Union vs Intersection vs Difference

- **Union**: すべての入力の和集合（OR演算）
- **Intersection**: すべての入力の積集合（AND演算）
- **Difference**: ソースから他のデータを除外（減算）

Unionは、複数の領域を結合して拡張する場合に使用します。

## 関連ノード

- **Intersection**: 空間データの積集合
- **Inner Intersection**: 内部交差
- **Difference**: 空間データの差分
- **Merge Points**: ポイントデータのマージ

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGUnionElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGUnionElement.cpp`
- **データクラス**: `Engine/Plugins/PCG/Source/PCG/Public/Data/PCGUnionData.h`
- **カテゴリ**: Spatial
