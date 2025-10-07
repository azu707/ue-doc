# Subdivide Spline

## 概要

Subdivide Splineノードは、スプラインを指定されたモジュール高さに基づいて分割します。Grammarシステムを使用してスプラインに沿ってモジュールを配置し、各モジュールの位置を示すポイントを生成します。

## 機能詳細

このノードは、スプラインを指定された高さ（モジュール高さ）のセグメントに分割します。各分割点はモジュールの配置位置を表し、Grammarシステムを使用してプロシージャルな構造を生成できます。

### 処理フロー

1. **入力スプラインの取得**: スプラインデータを入力から取得
2. **モジュール高さの決定**: 固定値または属性から取得
3. **スプラインの分割**: モジュール高さに基づいてスプラインを分割
4. **ポイントの生成**: 各分割点にポイントを生成
5. **属性の追加**: モジュールインデックスや端点属性などを追加

### モジュール高さのソース

#### 固定値
- `bModuleHeightAsAttribute = false`（デフォルト）
- 設定で指定した`ModuleHeight`を使用

#### 属性から取得
- `bModuleHeightAsAttribute = true`
- 入力スプラインの属性から高さを取得

## プロパティ

### bAcceptIncompleteSubdivision
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 不完全な分割を許可するかどうか
  - `false`: スプライン全体をモジュールで埋める必要がある
  - `true`: 端数が残っても有効とする

### bModuleHeightAsAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: いいえ（エディタ設定のみ）
- **説明**: モジュール高さを属性から取得するかどうか
  - `false`: 設定の`ModuleHeight`を使用
  - `true`: 属性`ModuleHeightAttribute`から取得

### ModuleHeight
- **型**: `double`
- **デフォルト値**: `100.0` (1m)
- **オーバーライド可能**: いいえ
- **説明**: 各モジュールの高さ（cm単位）
- **条件**: `bModuleHeightAsAttribute = false`の場合のみ表示

### ModuleHeightAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: （未設定）
- **オーバーライド可能**: いいえ
- **説明**: モジュール高さを含むスプライン属性の名前
- **条件**: `bModuleHeightAsAttribute = true`の場合のみ表示

### bOutputModuleIndexAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: モジュールインデックス属性を出力に追加するかどうか

### ModuleIndexAttributeName
- **型**: `FName`
- **デフォルト値**: `"ModuleIndex"`
- **オーバーライド可能**: はい
- **説明**: モジュールインデックス属性の名前
- **条件**: `bOutputModuleIndexAttribute = true`の場合のみ表示

### bOutputExtremityAttributes
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 端点（最初と最後のポイント）を示す属性を出力するかどうか

### IsFirstAttributeName
- **型**: `FName`
- **デフォルト値**: `"IsFirst"`
- **オーバーライド可能**: はい
- **説明**: 最初のモジュールの最初のポイントを示す属性の名前
- **条件**: `bOutputExtremityAttributes = true`の場合のみ表示

### IsFinalAttributeName
- **型**: `FName`
- **デフォルト値**: `"IsFinal"`
- **オーバーライド可能**: はい
- **説明**: 最後のモジュールの最後のポイントを示す属性の名前
- **条件**: `bOutputExtremityAttributes = true`の場合のみ表示

### ModulePlacementTolerance
- **型**: `double`
- **デフォルト値**: `0.01` (0.1mm)
- **最小値**: `0.000001` (PCGSubdivideSplineConstants::MinimumBisectionTolerance)
- **オーバーライド可能**: はい
- **説明**: モジュール間の許容誤差（重なりまたは隙間）
  - 小さい値ほど精度が高いが、パフォーマンスに影響
  - 非常に小さい値はパフォーマンスを低下させる
- **カテゴリ**: Advanced Display

## 使用例

### 基本的なスプライン分割

```
Get Spline Data
  → Subdivide Spline (ModuleHeight=100)
  → (1mごとに分割点を生成)
```

### 道路沿いの街灯配置

```
Get Spline Data (道路)
  → Subdivide Spline (ModuleHeight=500)
  → Static Mesh Spawner (街灯メッシュ)
```

5mごとに街灯を配置

### 可変モジュール高さ

```
Get Spline Data
  → Attribute Transform Op (高さ属性を設定)
  → Subdivide Spline (bModuleHeightAsAttribute=true)
  → (スプラインの各部分で異なる間隔で分割)
```

### モジュールインデックスの使用

```
Get Spline Data
  → Subdivide Spline (bOutputModuleIndexAttribute=true)
  → Attribute Select (ModuleIndexに基づいて異なるメッシュを選択)
```

### 端点の特別処理

```
Get Spline Data
  → Subdivide Spline (bOutputExtremityAttributes=true)
  → Filter Data By Attribute (IsFirst または IsFinal)
  → (端点にのみ特別なメッシュを配置)
```

### 典型的な用途

- **等間隔配置**: スプラインに沿った等間隔オブジェクト配置
- **モジュール構造**: フェンス、レール、パイプなどのモジュール構造生成
- **Grammarベース生成**: Grammar ルールを使用したプロシージャル構造
- **道路要素**: 街灯、標識、ガードレールなどの配置
- **建築要素**: 柱、窓、装飾などの等間隔配置

## 実装の詳細

### クラス構成

```cpp
// 設定クラス（Subdivision基底クラスを継承）
class UPCGSubdivideSplineSettings : public UPCGSubdivisionBaseSettings

// 実行エレメント
class FPCGSubdivideSplineElement : public FPCGSubdivisionBaseElement
```

### 基底クラス

`UPCGSubdivisionBaseSettings`を継承しており、Grammarサブシステムの分割機能の一部です。

### ピン構成

**入力ピン**:
- カスタム入力ピン（スプラインデータ）

**出力ピン**:
- カスタム出力ピン（分割点のポイントデータ）

### Grammarシステム

このノードはGrammarサブシステムの一部で、プロシージャルな構造生成をサポートします。

### 配置精度

`ModulePlacementTolerance`は、モジュール間の誤差を制御します:
- 重なり: 2つのモジュールがわずかに重なる
- 隙間: 2つのモジュール間にわずかな隙間がある

小さい値ほど正確ですが、計算コストが増加します。

### パフォーマンス考慮事項

- **モジュール高さ**: 小さいモジュール高さは多数の分割点を生成
- **スプライン長**: 長いスプラインは処理時間が増加
- **配置許容誤差**: 非常に小さい値はパフォーマンスを大幅に低下
- **属性評価**: 属性からモジュール高さを取得する場合、若干のオーバーヘッド

## 注意事項

1. **モジュール高さの単位**: センチメートル（cm）単位です
2. **不完全な分割**: デフォルトでは、スプライン全体をモジュールで埋める必要があります
3. **端数処理**: `bAcceptIncompleteSubdivision`を有効にすると、端数が残っても許可されます
4. **配置許容誤差**: 適切なバランスを見つけることが重要（精度 vs パフォーマンス）
5. **最小許容誤差**: `0.000001`より小さい値は設定できません

## Grammarワークフローとの統合

Subdivide Splineは、Grammarワークフローの一部として以下のノードと組み合わせて使用されます:
- **Subdivide Segment**: セグメントの分割
- **Duplicate Cross-Sections**: 断面の複製
- **Spline to Segment**: スプラインからセグメントへの変換

## 関連ノード

- **Subdivide Segment**: セグメントの分割
- **Spline Sampler**: スプラインのサンプリング
- **Duplicate Cross-Sections**: 断面の複製
- **Get Spline Data**: スプラインデータの取得
- **Attribute Transform Op**: 属性の変換

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSubdivideSpline.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Grammar/PCGSubdivideSpline.cpp`
- **基底クラス**: `PCGSubdivisionBase.h`
- **カテゴリ**: Spatial (Grammar)
