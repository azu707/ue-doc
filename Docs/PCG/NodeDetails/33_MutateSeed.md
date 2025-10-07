# Mutate Seed（シード変異）

## 概要

Mutate Seedノードは、各ポイントの位置情報とユーザー指定のシード値を使用して、新しいランダムシードを生成し、すべてのポイントに適用するノードです。これにより、ポイントごとに異なる決定論的なランダム値を生成できます。

**ノードタイプ**: Spatial
**クラス名**: `UPCGMutateSeedSettings`, `FPCGMutateSeedElement`

## 機能詳細

このノードは各ポイントのトランスフォーム（位置）情報を基に新しいシード値を計算し、ポイントのSeedプロパティを更新します。これにより、同じ位置のポイントは常に同じシード値を持ち、異なる位置のポイントは異なるシード値を持つことが保証されます。

### 主な特徴

- **決定論的シード生成**: ポイントの位置に基づいて一貫したシードを生成
- **並列処理対応**: マルチスレッドで効率的に処理
- **ポイント操作ベース**: `FPCGPointOperationElementBase`を継承し、効率的なポイント処理を実装

## プロパティ

このノードには設定可能なプロパティはありません。ノード自体のシード値を使用して各ポイントのシードを計算します。

## 使用例

### 基本的な使用方法

```
ポイント生成ノード → Mutate Seed → ランダム要素を使うノード
```

### 実際のワークフロー例

1. **ランダムな配置のバリエーション**
   - Grid Createでポイントを生成
   - Mutate Seedで各ポイントに固有のシードを付与
   - Static Mesh Spawnerで各ポイントにランダムな回転やスケールを適用

2. **決定論的なランダム性**
   - Surface Samplerで地形上にポイントを生成
   - Mutate Seedでポイント位置ベースのシードを生成
   - Attribute Noiseで決定論的なノイズ値を生成

3. **複数ステージのランダム処理**
   - 初期ポイント生成
   - Mutate Seedで新しいシード系列を開始
   - 後続のランダム処理が独立した系列を使用

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGMutateSeed.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGMutateSeed.cpp`

### 継承関係
- `UPCGMutateSeedSettings` ← `UPCGSettings`
- `FPCGMutateSeedElement` ← `FPCGPointOperationElementBase` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **ポイント操作の実行**: `ExecutePointOperation`を使用して並列処理
2. **各ポイントの処理**:
   ```cpp
   for each point:
       position = point.Transform.GetLocation()
       positionSeed = ComputeSeedFromPosition(position)
       newSeed = ComputeSeed(positionSeed, NodeSeed, OldPointSeed)
       point.Seed = newSeed
   ```
3. **チャンク単位の処理**: 98,304ポイントごとにチャンク分割して並列処理

### シード計算アルゴリズム

```cpp
int32 ComputeSeed(int32 A, int32 B, int32 C)
{
    return PCGHelpers::ComputeSeed(
        PCGHelpers::ComputeSeedFromPosition(Transform.GetLocation()),
        Context->GetSeed(),
        PointSeed
    );
}
```

### パフォーマンス特性

- **並列処理**: マルチスレッド対応、チャンクサイズ98,304ポイント
- **メモリ使用**: ポイントコピーを作成（`ShouldCopyPoints() = true`）
- **割り当てプロパティ**: Seedプロパティのみ
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
EPCGPointNativeProperties::Seed
```
Seedプロパティのみを更新対象として指定します。

#### UseSeed
```cpp
virtual bool UseSeed() const override { return true; }
```
このノードはシード値を使用することを示します。

### 注意事項

1. **決定論性**: 同じ位置のポイントは常に同じシード値を生成します
2. **ポイントコピー**: 入力ポイントをコピーして新しいデータを作成します
3. **位置依存**: シード値はポイントの3D位置に完全に依存します
4. **BasePointData対応**: すべてのBasePointDataタイプをサポートします

### ユースケース

- **ランダム配置**: メッシュのランダムな回転・スケール適用前
- **ノイズ生成**: 決定論的なノイズパターンの生成
- **プロシージャル生成**: 位置ベースの一貫したランダム値が必要な場合
- **シード系列の分離**: 異なるランダム処理を独立させたい場合
