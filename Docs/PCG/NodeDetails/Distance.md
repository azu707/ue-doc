# Distance

## 概要

Distanceノードは、2つのポイントセット間の距離を計算します（N×N演算）。距離をスカラー値またはベクトルとして属性に出力でき、オプションで密度を距離に基づいて設定することもできます。最大距離を指定することで最適化が可能です。

## 機能詳細

Distanceノードは、Sourceピンのポイントとし、Targetピンのポイントとの間の距離を計算します。各ソースポイントに対して、最も近いターゲットポイントまでの距離を求め、その情報を属性として出力します。

### 処理フロー

1. **入力データの取得**: SourceピンとTargetピンからポイントデータを取得
2. **距離計算**: 各ソースポイントに対して、最も近いターゲットポイントまでの距離を計算
3. **属性出力**: 計算された距離を指定された属性に書き込み
4. **密度設定**: `bSetDensity`が有効な場合、距離に基づいて密度を0-1の範囲で設定
5. **最適化**: `MaximumDistance`を超えるポイントは早期に除外

### 距離形状モード

各ポイントの「形状」を定義し、その形状間の距離を計算します:

#### SphereBounds (球境界)
- ポイントの境界を球として扱う
- 球の表面間の距離を計算
- 最も一般的な使用方法

#### BoxBounds (ボックス境界)
- ポイントの境界をボックスとして扱う
- ボックスの表面間の距離を計算

#### Center (中心点)
- ポイントの中心位置のみを使用
- 境界を無視した点と点の距離

### 距離計算モード

#### 通常モード (bCheckSourceAgainstRespectiveTarget = false)
- 各ソースポイントを**すべて**のターゲットポイントと比較
- N×M演算（Nはソース数、Mはターゲット数）
- 最も近いターゲットまでの距離を出力

#### N:Nモード (bCheckSourceAgainstRespectiveTarget = true)
- 各ソースポイントを**対応する**ターゲットポイントのみと比較
- N:N演算（ソース数とターゲット数が一致している必要がある、または一方が1）
- ペアごとの距離を計算

## プロパティ

### bOutputToAttribute
- **型**: `bool`
- **デフォルト値**: `true`
- **オーバーライド可能**: はい
- **説明**: 距離または距離ベクトルを属性に出力するかどうか

### OutputAttribute
- **型**: `FPCGAttributePropertySelector`
- **デフォルト値**: `"Distance"`
- **オーバーライド可能**: はい
- **説明**: 距離値を出力する属性の名前
- **条件**: `bOutputToAttribute`が有効な場合のみ表示

### bOutputDistanceVector
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 属性を スカラー（距離値）またはベクトル（距離ベクトル）として出力するか
  - `false`: スカラー値（double型、距離の大きさ）
  - `true`: ベクトル値（FVector型、方向と距離）
- **条件**: `bOutputToAttribute`が有効な場合のみ表示

### bSetDensity
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 距離に基づいて密度を0-1の範囲で設定するかどうか
  - `true`: 距離0で密度1、`MaximumDistance`で密度0となるグラデーション
  - `false`: 密度は変更されない

### MaximumDistance
- **型**: `double`
- **デフォルト値**: `20000.0`（200メートル）
- **最小値**: `1.0`
- **オーバーライド可能**: はい
- **説明**: 検索する最大距離（cm単位）
  - 最適化に使用される
  - この距離を超えるターゲットは無視される
  - `bSetDensity`が有効な場合、密度計算の基準値となる

### SourceShape
- **型**: `PCGDistanceShape`
- **デフォルト値**: `SphereBounds`
- **オーバーライド可能**: はい
- **説明**: ソースポイントで使用する形状
  - `SphereBounds`: 球境界
  - `BoxBounds`: ボックス境界
  - `Center`: 中心点のみ

### TargetShape
- **型**: `PCGDistanceShape`
- **デフォルト値**: `SphereBounds`
- **オーバーライド可能**: はい
- **説明**: ターゲットポイントで使用する形状
  - `SphereBounds`: 球境界
  - `BoxBounds`: ボックス境界
  - `Center`: 中心点のみ

### bCheckSourceAgainstRespectiveTarget
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: N:N演算を実行するかどうか
  - `false`: 各ソースをすべてのターゲットと比較（N×M演算）
  - `true`: 各ソースを対応するターゲットのみと比較（N:N演算）
    - ソース数とターゲット数が一致している必要がある（または一方が1）

## 使用例

### 基本的な距離計算

```
Create Points Grid (ソース)
  → Distance ← Get Actor Data (ターゲット)
  → Filter Data By Attribute (Distance < 500)
```

アクターから500cm以内のポイントのみをフィルタリング

### 密度グラデーションの作成

```
Create Points Grid
  → Distance (bSetDensity = true, MaximumDistance = 1000) ← Get Spline Data
  → Static Mesh Spawner
```

スプラインからの距離に応じて密度が変化し、遠いほど疎になる

### 距離ベクトルの使用

```
Create Points Grid
  → Distance (bOutputDistanceVector = true) ← Get Actor Data
  → Attribute Transform Op (距離ベクトルを使用して回転)
```

最も近いアクターの方向にオブジェクトを向ける

### N:N距離計算

```
Spline Sampler (100ポイント) → Distance (bCheckSourceAgainstRespectiveTarget = true)
  ↑                                 ↓
  └── Create Points Grid (100ポイント)
```

各グリッドポイントと対応するスプラインポイント間の距離を計算

### 典型的な用途

- **近接フィルタリング**: 特定のオブジェクトから一定距離内/外のポイントをフィルタ
- **密度グラデーション**: 距離に基づいた密度の減衰
- **方向付け**: 距離ベクトルを使用してオブジェクトを最寄りのターゲットに向ける
- **スケーリング**: 距離に基づいてオブジェクトのサイズを変更
- **領域分析**: 特定のポイントからの距離フィールドを生成

## 実装の詳細

### クラス構成

```cpp
// 距離形状列挙型
enum class PCGDistanceShape
{
    SphereBounds,
    BoxBounds,
    Center,
};

// 設定クラス
class UPCGDistanceSettings : public UPCGSettings

// 実行エレメント
class FPCGDistanceElement : public IPCGElement
```

### ピン構成

**入力ピン**:
- **Source**: 距離を計算するソースポイント
- **Target**: 距離の計算対象となるターゲットポイント

**出力ピン**:
- デフォルトの出力ピン（距離情報が追加されたソースポイント）

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各Sourceデータに対して、すべてのTargetデータとの距離を計算

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### 計算の複雑さ

- **通常モード**: O(N × M)
  - N: ソースポイント数
  - M: ターゲットポイント数
- **N:Nモード**: O(N)
  - N: ポイント数（ソースとターゲットが同数の場合）

### 最適化

1. **最大距離**: `MaximumDistance`を設定することで、遠距離のターゲットを早期除外
2. **空間パーティショニング**: 内部で空間分割構造を使用して検索を高速化
3. **N:Nモード**: ペアごとの計算のため、大幅に高速

### パフォーマンス考慮事項

- **大量のポイント**: N×M演算は大量のポイントに対して非常にコストが高い
- **最大距離の設定**: 適切な`MaximumDistance`を設定することでパフォーマンス向上
- **N:Nモードの活用**: ペアごとの距離計算が必要な場合は、N:Nモードを使用
- **形状の選択**: `Center`モードは最も高速

### 非推奨プロパティ

- `AttributeName_DEPRECATED`: 古い属性名プロパティ（`OutputAttribute`セレクタに置き換えられた）

## 注意事項

1. **計算コスト**: 大量のポイント間の距離計算は非常にコストが高いため、`MaximumDistance`を適切に設定してください
2. **N:Nモードの制約**: N:Nモードでは、ソース数とターゲット数が一致している必要があります（または一方が1）
3. **距離の単位**: すべての距離はセンチメートル（cm）単位です
4. **密度の上書き**: `bSetDensity`を有効にすると、既存の密度値が上書きされます
5. **ベクトル vs スカラー**: 距離ベクトルは方向情報を含みますが、スカラーは大きさのみです
6. **形状の影響**: 形状モードによって、計算される距離の意味が変わります

## 関連ノード

- **Point Neighborhood**: 近傍ポイントの検索
- **Filter Data By Attribute**: 距離属性に基づくフィルタリング
- **Density Filter**: 密度ベースのフィルタリング
- **Attribute Remap**: 距離値の範囲変換
- **Attribute Select**: 距離に基づく値の選択

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDistance.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGDistance.cpp`
- **テスト**: `Engine/Plugins/PCG/Source/PCG/Private/Tests/Elements/PCGDistanceTest.cpp`
- **カテゴリ**: Spatial
