# Subdivide Segment

## 概要

Subdivide Segmentノードは、セグメント（ポイント間の線分）を指定された軸に沿って分割します。Grammarシステムを使用してモジュールベースの分割を行い、各モジュールの位置を示すポイントを生成します。

## 機能詳細

このノードは、ポイント間のセグメントを、指定された軸方向に沿ってモジュール単位で分割します。各分割点はモジュールの配置位置を表し、Grammarシステムと組み合わせてプロシージャルな構造を生成できます。

### 処理フロー

1. **入力ポイントの取得**: ポイントデータを入力から取得
2. **分割軸の決定**: ローカル空間での分割方向を決定
3. **軸の反転判定**: 固定値または属性から反転フラグを取得
4. **セグメントの分割**: モジュール単位でセグメントを分割
5. **ポイントの生成**: 各分割点にポイントを生成
6. **属性の追加**: モジュールインデックスや端点属性などを追加

### 分割軸

ポイントのローカル空間（Transform）を基準に、以下のいずれかの軸で分割:
- **X軸**: ポイントの前方方向
- **Y軸**: ポイントの右方向
- **Z軸**: ポイントの上方向

### 軸の反転

オプションで軸を反転できます:
- 固定値: すべてのポイントで同じ反転設定
- 属性: ポイントごとに異なる反転設定

## プロパティ

### SubdivisionAxis
- **型**: `EPCGSplitAxis`
- **デフォルト値**: `X`
- **オーバーライド可能**: いいえ（エディタ設定のみ）
- **説明**: ポイントのローカル空間での分割方向
  - `X`: X軸方向（前方）
  - `Y`: Y軸方向（右）
  - `Z`: Z軸方向（上）

### bFlipAxisAsAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: いいえ（エディタ設定のみ）
- **説明**: 軸反転フラグを属性から取得するかどうか
  - `false`: 設定の`bShouldFlipAxis`を使用
  - `true`: 属性`FlipAxisAttribute`から取得

### bShouldFlipAxis
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 分割軸を反転するかどうか
  - `false`: 正の方向に分割
  - `true`: 負の方向に分割
- **条件**: `bFlipAxisAsAttribute = false`の場合のみ表示

### FlipAxisAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: （未設定）
- **オーバーライド可能**: はい
- **説明**: 軸反転フラグを含む属性の名前
- **条件**: `bFlipAxisAsAttribute = true`の場合のみ表示

### bAcceptIncompleteSubdivision
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 不完全な分割を許可するかどうか
  - `false`: セグメント全体をモジュールで埋める必要がある
  - `true`: 端数が残っても有効とする

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

### bOutputExtremityNeighborIndexAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 端点の隣接インデックス属性を出力するかどうか

### ExtremityNeighborIndexAttributeName
- **型**: `FName`
- **デフォルト値**: `"ExtremityNeighborIndex"`
- **オーバーライド可能**: はい
- **説明**: 端点の隣接インデックス属性の名前
- **条件**: `bOutputExtremityNeighborIndexAttribute = true`の場合のみ表示

## 使用例

### 基本的なセグメント分割

```
Create Points Grid
  → Subdivide Segment (SubdivisionAxis=X)
  → (X軸方向にセグメントを分割)
```

### 壁のモジュール配置

```
Get Spline Data
  → Spline Sampler (スプライン上にポイントを生成)
  → Subdivide Segment (SubdivisionAxis=X)
  → Static Mesh Spawner (壁パネルを配置)
```

### 軸反転の使用

```
Create Points
  → Attribute Transform Op (FlipAxis属性を設定)
  → Subdivide Segment (bFlipAxisAsAttribute=true)
  → (ポイントごとに異なる分割方向)
```

### モジュールインデックスの活用

```
Create Points Grid
  → Subdivide Segment (bOutputModuleIndexAttribute=true)
  → Attribute Select (ModuleIndexに基づいて異なるメッシュ)
  → Static Mesh Spawner
```

### 端点の特別処理

```
Spline Sampler
  → Subdivide Segment (bOutputExtremityAttributes=true)
  → Filter Data By Attribute (IsFirst または IsFinal)
  → (端点にのみ特別なメッシュを配置)
```

### 典型的な用途

- **モジュール構造**: 壁、フェンス、パイプなどのモジュールベース生成
- **等間隔配置**: セグメントに沿った等間隔オブジェクト配置
- **Grammarベース生成**: Grammar ルールを使用したプロシージャル構造
- **建築要素**: 柱、梁、パネルなどの配置
- **道路要素**: ガードレール、区画線などのセグメント分割

## 実装の詳細

### クラス構成

```cpp
// 設定クラス（Subdivision基底クラスを継承）
class UPCGSubdivideSegmentSettings : public UPCGSubdivisionBaseSettings

// 実行エレメント
class FPCGSegmentSubdivisionElement : public FPCGSubdivisionBaseElement
```

### 基底クラス

`UPCGSubdivisionBaseSettings`を継承しており、Grammarサブシステムの分割機能の一部です。

### ピン構成

**入力ピン**:
- カスタム入力ピン（ポイントデータまたはベースポイントデータ）

**出力ピン**:
- カスタム出力ピン（分割点のポイントデータ）

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### ローカル空間

分割軸は各ポイントのローカル空間（Transform）を基準とします:
- ポイントの回転が考慮される
- 各ポイントで異なる方向に分割可能

### Grammarシステム

このノードはGrammarサブシステムの一部で、プロシージャルな構造生成をサポートします。

### パフォーマンス考慮事項

- **ポイント数**: 多数のポイントは処理時間を増加
- **分割数**: 小さいモジュールサイズは多数の分割点を生成
- **属性評価**: 属性から反転フラグを取得する場合、若干のオーバーヘッド

## 注意事項

1. **ローカル空間**: 分割軸はポイントのローカル空間を基準とします
2. **不完全な分割**: デフォルトでは、セグメント全体をモジュールで埋める必要があります
3. **端数処理**: `bAcceptIncompleteSubdivision`を有効にすると、端数が残っても許可されます
4. **軸の反転**: ポイントごとに異なる反転設定が可能
5. **Transform依存**: ポイントのTransform（位置、回転、スケール）が分割に影響

## Subdivide Spline vs Subdivide Segment

- **Subdivide Spline**:
  - スプラインを分割
  - スプラインの長さに沿って分割
  - モジュール高さを使用

- **Subdivide Segment**:
  - ポイント間のセグメントを分割
  - 指定された軸方向に分割
  - ポイントのローカル空間を使用

Subdivide Segmentは、より一般的なポイントデータに対して使用でき、ローカル空間での分割が可能です。

## Grammarワークフローとの統合

Subdivide Segmentは、Grammarワークフローの一部として以下のノードと組み合わせて使用されます:
- **Subdivide Spline**: スプラインの分割
- **Duplicate Cross-Sections**: 断面の複製
- **Spline to Segment**: スプラインからセグメントへの変換

## 関連ノード

- **Subdivide Spline**: スプラインの分割
- **Spline to Segment**: スプラインからセグメントへの変換
- **Duplicate Cross-Sections**: 断面の複製
- **Split Points**: ポイントの分割
- **Attribute Transform Op**: 属性の変換

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSubdivideSegment.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Grammar/PCGSubdivideSegment.cpp`
- **基底クラス**: `PCGSubdivisionBase.h`
- **カテゴリ**: Spatial (Grammar)
