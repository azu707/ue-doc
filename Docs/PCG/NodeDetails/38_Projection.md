# Projection（投影）

## 概要

Projectionノードは、ソースデータをターゲット形状に投影するノードです。ポイント、スプライン、ボリュームなどを地形やその他の形状に投影し、密度やその他のプロパティをサンプリングします。

**ノードタイプ**: Spatial
**クラス名**: `UPCGProjectionSettings`, `FPCGProjectionElement`

## 機能詳細

このノードは、空間データを別の空間データに投影します。主に地形への投影や、複雑な形状へのデータの適合に使用されます。投影時には、ターゲットの密度やその他のプロパティがソースに適用されます。

### 主な特徴

- **多様な投影方法**: 様々な投影パラメータをサポート
- **密度サンプリング**: ターゲット形状から密度をサンプリング
- **動的ピン**: 入力タイプに応じて動的にピンタイプを変更
- **ポイント変換オプション**: 結果を強制的にポイントに変換可能

## プロパティ

### ProjectionParams
- **型**: `FPCGProjectionParams`
- **説明**: 投影パラメータの詳細設定。以下のサブプロパティを含みます:
  - 投影方向
  - 投影距離
  - 色/密度/法線などのサンプリング設定
  - その他の投影関連設定
- **PCG_Overridable**: 可
- **ShowOnlyInnerProperties**: 有効（ネストされたプロパティを直接表示）

### bForceCollapseToPoint
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 結果を強制的にポイントデータにサンプリングします。To Pointノードを後続に配置するのと同等の効果があります
- **PCG_Overridable**: 可

### bKeepZeroDensityPoints
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 密度がゼロになったポイントを保持するかどうか
- **PCG_Overridable**: 可

## 使用例

### 基本的な使用方法

```
Source Data → Projection → Projected Data
                ↑
          Target Shape
```

### 実際のワークフロー例

1. **地形への投影**
   - Grid Createで平面グリッドを生成
   - Projectionで地形データに投影
   - 地形の起伏に沿ったポイント配置

2. **スプラインの地形追従**
   - 空中に浮いたスプラインを作成
   - 地形をターゲットにProjection
   - 地形に沿ったスプラインに変換

3. **複雑形状へのマッピング**
   - 単純な2Dパターンを生成
   - 複雑な3D形状に投影
   - 形状に沿ったパターン配置

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGProjectionElement.h`
- **パラメータ**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGProjectionParams.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGProjectionElement.cpp`

### 継承関係
- `UPCGProjectionSettings` ← `UPCGSettings`
- `FPCGProjectionElement` ← `IPCGElement`

### 動的ピンサポート

```cpp
virtual bool HasDynamicPins() const override { return true; }
virtual EPCGDataType GetCurrentPinTypes(const UPCGPin* InPin) const override;
```

このノードは入力データのタイプに応じて、ピンのデータタイプを動的に変更します。

### ExecuteInternal処理フロー

1. **入力データ取得**: ソースデータとターゲット（Projection Target）データを取得
2. **投影実行**:
   ```cpp
   for each source data:
       ProjectedData = Source.ProjectOn(Target, ProjectionParams)
       Apply density and other properties from target
   ```
3. **ポイント変換**: `bForceCollapseToPoint`が有効な場合、結果をポイントデータに変換
4. **ゼロ密度処理**: `bKeepZeroDensityPoints`に基づいてゼロ密度ポイントをフィルタ
5. **出力**: 投影されたデータを出力

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト): ソースデータ
  - `Projection Target`: 投影ターゲット形状
  - タイプ: 動的（Spatial系データ）

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: 入力に依存（動的）

### パフォーマンス特性

- **BasePointData対応**: あり（`SupportsBasePointDataInputs = true`）
- **キャッシュ可能**: はい
- **複雑度**: ソースとターゲットのデータ量に依存

### 技術的詳細

#### ProjectionParams の主な設定項目

`FPCGProjectionParams`構造体には以下のような設定が含まれます:
- **bProjectPositions**: 位置を投影するか
- **bProjectRotations**: 回転を投影するか
- **bProjectScales**: スケールを投影するか
- **bProjectColors**: 色を投影するか
- **投影方向とレイキャスト設定**
- **属性のマッピング設定**

詳細は`PCGProjectionParams.h`を参照してください。

#### 非推奨化処理

```cpp
#if WITH_EDITOR
virtual void ApplyDeprecation(UPCGNode* InOutNode) override;
#endif
```

エディタでは、古いバージョンからの設定を適切に移行する処理が実装されています。

### 注意事項

1. **Projection Targetピン**: 投影先の形状を接続する専用ピンがあります
2. **動的ピンタイプ**: 入力データのタイプによって出力タイプが変わります
3. **密度ゼロ**: 投影先の外側にあるポイントは密度ゼロになる場合があります
4. **bForceCollapseToPoint**: 有効にすると、すべてのデータがポイントに変換されます
5. **パフォーマンス**: 大量のポイントを複雑な形状に投影する場合、処理時間がかかります

### ユースケース

- **地形追従**: ポイントやスプラインを地形に沿わせる
- **形状マッピング**: 平面パターンを3D形状にマッピング
- **密度サンプリング**: ターゲット形状から密度情報を取得
- **高さ調整**: ポイントの高さを地形に合わせる
- **曲面配置**: 曲面に沿ったアセット配置
