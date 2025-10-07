# Duplicate Cross-Sections

## 概要

Duplicate Cross-Sectionsノードは、入力スプラインの断面を指定されたベクトル方向に複製（押し出し）します。スプラインの断面形状を保持したまま、3D空間で複数のコピーを生成します。Grammarサブシステムの一部です。

## 機能詳細

このノードは、スプラインの断面を指定された押し出しベクトル（Extrude Vector）に沿って複製します。これにより、2Dの断面形状から3Dの構造を生成できます。

### 処理フロー

1. **入力スプラインの取得**: スプライン（または断面）データを入力から取得
2. **押し出しベクトルの決定**: 固定値または属性から取得
3. **断面の複製**: 押し出しベクトル方向に断面を複製
4. **出力データの生成**: 複製された断面データを出力
5. **スプラインインデックスの追加**: オプションでスプラインインデックス属性を追加

### 押し出しベクトルのソース

#### 固定ベクトル
- `bExtrudeVectorAsAttribute = false`（デフォルト）
- 設定で指定した`ExtrudeVector`を使用

#### 属性から取得
- `bExtrudeVectorAsAttribute = true`
- 入力スプラインの属性から押し出しベクトルを取得

## プロパティ

### bExtrudeVectorAsAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: いいえ（エディタ設定のみ）
- **説明**: 押し出しベクトルを属性から取得するか、設定から取得するか
  - `false`: 設定の`ExtrudeVector`を使用
  - `true`: スプラインの属性`ExtrudeVectorAttribute`から取得

### ExtrudeVector
- **型**: `FVector`
- **デフォルト値**: `(0.0, 0.0, 1000.0)` (Z軸方向に10m)
- **オーバーライド可能**: はい
- **説明**: 断面を押し出す方向と距離を示すベクトル（cm単位）
- **条件**: `bExtrudeVectorAsAttribute = false`の場合のみ表示

### ExtrudeVectorAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: （未設定）
- **オーバーライド可能**: はい
- **説明**: 押し出しベクトルを含む入力スプラインの属性名
- **条件**: `bExtrudeVectorAsAttribute = true`の場合のみ表示

### bOutputSplineIndexAttribute
- **型**: `bool`
- **デフォルト値**: `true`
- **オーバーライド可能**: はい
- **説明**: スプラインインデックス属性を出力に追加するかどうか
  - 有効にすると、各複製断面にスプラインインデックスが付与される

### SplineIndexAttributeName
- **型**: `FName`
- **デフォルト値**: `"SplineIndex"`
- **オーバーライド可能**: はい
- **説明**: 出力されるスプラインインデックス属性の名前
- **条件**: `bOutputSplineIndexAttribute = true`の場合のみ表示

## 使用例

### 基本的な押し出し

```
Create Spline (2D断面形状)
  → Duplicate Cross-Sections (ExtrudeVector=(0,0,1000))
  → (Z軸方向に10m押し出した断面を生成)
```

### 属性による可変押し出し

```
Create Spline
  → Attribute Transform Op (押し出しベクトルを属性に設定)
  → Duplicate Cross-Sections (bExtrudeVectorAsAttribute=true)
  → (各断面で異なる押し出し方向/距離)
```

### フェンスやレールの生成

```
Get Spline Data (道路の中心線)
  → Create Cross-Section (断面形状)
  → Duplicate Cross-Sections (横方向に押し出し)
  → Static Mesh Spawner (フェンスメッシュを配置)
```

### 複数レイヤーの構造

```
Create Spline (基本形状)
  → Duplicate Cross-Sections (ExtrudeVector=(0,0,300))
  → Duplicate Cross-Sections (ExtrudeVector=(0,0,300))
  → (複数回押し出して階層構造を作成)
```

### 典型的な用途

- **壁の生成**: 2D輪郭から3D壁構造を作成
- **レールやフェンス**: 道路に沿った構造物の生成
- **建物の層**: 各階の断面を垂直方向に複製
- **トンネルやパイプ**: 断面形状をパス に沿って複製
- **スライス構造**: 3Dオブジェクトをスライスして断面を生成

## 実装の詳細

### クラス構成

```cpp
// 設定クラス（Subdivision基底クラスを継承）
class UPCGDuplicateCrossSectionsSettings : public UPCGSubdivisionBaseSettings

// 実行エレメント
class FPCGDuplicateCrossSectionsElement : public FPCGSubdivisionBaseElement
```

### 基底クラス

`UPCGSubdivisionBaseSettings`を継承しており、Grammarサブシステムの分割/複製機能の一部です。

### ピン構成

**入力ピン**:
- カスタム入力ピン（スプラインまたは断面データ）

**出力ピン**:
- カスタム出力ピン（複製された断面データ）

### Grammarサブシステム

このノードは`Elements/Grammar/`ディレクトリに配置されており、PCGのGrammarサブシステムの一部です。Grammarは、形状の分割、複製、変換などの操作を提供します。

### パフォーマンス考慮事項

- **複製数**: 大きな押し出しベクトルや複数回の適用は出力データ量を増加
- **属性評価**: 属性からベクトルを取得する場合、若干のオーバーヘッド
- **スプラインインデックス**: 有効にすると、メタデータの書き込みコストが追加

## 注意事項

1. **押し出し方向**: ExtrudeVectorは方向と距離の両方を定義します（単位はcm）
2. **属性の型**: `ExtrudeVectorAttribute`はVector型の属性である必要があります
3. **断面の保持**: 元の断面形状は保持されますが、位置が変更されます
4. **複数回の適用**: このノードを複数回適用することで、複雑な3D構造を作成可能
5. **スプラインインデックス**: 後続ノードでフィルタリングやグループ化に使用できます

## Grammarワークフローとの統合

Duplicate Cross-Sectionsは、Grammarワークフローの一部として以下のノードと組み合わせて使用されます:
- **Subdivide Spline**: スプラインを分割
- **Subdivide Segment**: セグメントを分割
- **Spline to Segment**: スプラインをセグメントに変換

これらを組み合わせることで、複雑なプロシージャル構造を生成できます。

## 関連ノード

- **Subdivide Spline**: スプラインの分割
- **Subdivide Segment**: セグメントの分割
- **Spline to Segment**: スプラインからセグメントへの変換
- **Create Spline**: スプラインの作成
- **Attribute Transform Op**: 属性の変換（押し出しベクトルの設定）

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGDuplicateCrossSections.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Grammar/PCGDuplicateCrossSections.cpp`
- **基底クラス**: `PCGSubdivisionBase.h`
- **カテゴリ**: Spatial (Grammar)
