# Difference

## 概要

Differenceノードは、ソースデータから差分データを引き算する空間演算を実行します。複数の差分データをソースから除外し、結果として重なっていない領域のみを保持します。密度の再計算やメタデータの差分処理もサポートしています。

## 機能詳細

Differenceノードは、2つの空間データセット間の差分演算（A - B）を実行します。ソースデータから、差分データと重なる部分を除外し、残った領域を出力します。

### 処理フロー

1. **入力データの取得**: Sourceピンとして1つ、Differencesピンから1つ以上のデータを取得
2. **差分演算の実行**: ソースから各差分データと重なる部分を除外
3. **密度の再計算**: 指定された密度関数に基づいて密度を再計算
4. **メタデータ処理**: `bDiffMetadata`が有効な場合、メタデータも処理
5. **ゼロ密度フィルタリング**: `bKeepZeroDensityPoints`が無効な場合、密度0のポイントを除外

### 差分モード

#### Continuous (連続)
- 非破壊的なデータ出力を維持
- サーフェスやボリュームなどの暗黙的なデータ型を保持

#### Discrete (離散)
- 出力データを離散的なポイントに変換
- または明示的にポイントに変換

#### Inferred (推論)
- ソースデータと演算に基づいて、ContinuousまたはDiscreteを自動選択
- ほとんどの場合に推奨される設定

## プロパティ

### DensityFunction
- **型**: `EPCGDifferenceDensityFunction`
- **デフォルト値**: `Minimum`
- **オーバーライド可能**: はい
- **説明**: 差分演算後に密度を再計算する際に使用する関数
  - `Minimum`: ソースと差分の最小密度を使用
  - `Binary`: 0または1の二値密度
  - `ClampedSubtraction`: ソース密度から差分密度を引き算（0でクランプ）
  - その他の関数（実装に依存）

### Mode
- **型**: `EPCGDifferenceMode`
- **デフォルト値**: `Inferred`
- **オーバーライド可能**: いいえ
- **説明**: 差分演算の出力データの扱い方
  - `Continuous`: 暗黙的なデータ型を保持
  - `Discrete`: ポイントデータに変換
  - `Inferred`: 自動判定

### bDiffMetadata
- **型**: `bool`
- **デフォルト値**: `true`
- **オーバーライド可能**: いいえ
- **説明**: メタデータに対しても差分処理を適用するかどうか

### bKeepZeroDensityPoints
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 密度が0のポイントを出力に含めるかどうか
  - `false`: 密度0のポイントを自動的にフィルタリング（デフォルト）
  - `true`: 密度0のポイントも出力に含める

## 使用例

### 基本的な使用方法

1. **領域の除外**
   ```
   Get Landscape Data (ソース)
     → Difference ← Get Volume Data (除外したい領域)
     → Surface Sampler
   ```
   ランドスケープから特定のボリューム領域を除外してサンプリング

2. **複数領域の除外**
   ```
   Create Points Grid (ソース)
     → Difference ← Get Actor Data (複数の除外アクター)
     → Static Mesh Spawner
   ```
   グリッドから複数のアクター領域を除外してメッシュをスポーン

### 密度関数の使用

- **Minimum**: 最も保守的な差分（ソフトな境界）
- **Binary**: 明確な境界（ハードエッジ）
- **ClampedSubtraction**: グラデーション的な除外

### 典型的な用途

- **禁止エリアの定義**: 配置してはいけない領域をマスク
- **レイヤー合成**: 複数のPCGレイヤーを組み合わせる際の除外処理
- **道路や建物の除外**: 植生配置時に道路や建物領域を除外
- **カスタムマスキング**: 任意の形状による領域マスキング

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGDifferenceSettings : public UPCGSettings

// 実行エレメント
class FPCGDifferenceElement : public IPCGElement

// データクラス
class UPCGDifferenceData : public UPCGSpatialDataWithPointCache
```

### ピン構成

**入力ピン**:
- **Source**: 差分演算のベースとなるデータ（1つ）
- **Differences**: 除外する領域のデータ（複数可）

**出力ピン**:
- デフォルトの出力ピン（差分演算の結果）

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各Sourceデータに対して、すべてのDifferencesデータとの差分を計算

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### データ型の処理

差分演算は、様々な空間データ型に対応:
- **Volume - Volume**: ボリュームの差分
- **Surface - Volume**: サーフェスからボリュームを除外
- **Points - Spatial**: ポイントから空間データを除外
- その他の組み合わせ

### パフォーマンス考慮事項

- **Inferredモード**: ほとんどの場合で最適なパフォーマンス
- **Continuousモード**: 暗黙的な表現を保持するため、メモリ効率が良い
- **Discreteモード**: 明示的なポイント変換が必要な場合に使用
- **複数の差分**: Differencesピンに複数のデータを接続すると、すべてが除外対象となる

### 構造的な非推奨化

- `ApplyStructuralDeprecation`: 古いノード構造を新しい形式に自動変換
- 過去のバージョンとの互換性を維持

## 注意事項

1. **密度の扱い**: 密度関数の選択は、結果の境界のソフトさに大きく影響します
2. **ゼロ密度ポイント**: デフォルトでは密度0のポイントは自動的に除外されます
3. **メタデータ**: `bDiffMetadata`を有効にすると、メタデータも差分処理されます
4. **モードの選択**: ほとんどの場合、Inferredモードが最適です
5. **複数の差分**: Differencesピンには複数のデータを接続でき、すべてが除外対象となります
6. **空間データ型**: ソースと差分は互換性のある空間データ型である必要があります

## 関連ノード

- **Union**: 空間データの和集合
- **Intersection**: 空間データの積集合
- **Inner Intersection**: 内部交差
- **Projection**: データの投影
- **Density Filter**: 密度ベースのフィルタリング

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDifferenceElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGDifferenceElement.cpp`
- **データクラス**: `Engine/Plugins/PCG/Source/PCG/Public/Data/PCGDifferenceData.h`
- **カテゴリ**: Spatial
