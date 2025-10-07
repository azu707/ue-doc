# Apply Scale To Bounds ノード

## 概要

Apply Scale To Boundsノードは、各ポイントのスケールをバウンドに適用し、スケールを1.0にリセットするノードです。これにより、スケール情報がバウンドサイズに転送されます。

**ノードタイプ**: Point Ops
**クラス名**: `UPCGApplyScaleToBoundsSettings` / `FPCGApplyScaleToBoundsElement`
**ファイル**: `PCGApplyScaleToBounds.h`, `PCGApplyScaleToBounds.cpp`

## 主な機能

- ポイントのスケールをバウンド(BoundsMin/BoundsMax)に適用
- スケールを(1.0, 1.0, 1.0)にリセット
- トランスフォームの視覚的な表現を変更せずに内部表現を変更

## プロパティ

このノードには設定可能なプロパティがありません。入力ポイントに対して自動的に処理を実行します。

## 実装の詳細

### アルゴリズム

```cpp
void PCGPointHelpers::ApplyScaleToBounds(
    FTransform& Transform,      // 入出力: トランスフォーム
    FVector& BoundsMin,         // 入出力: バウンド最小値
    FVector& BoundsMax          // 入出力: バウンド最大値
)
{
    // 1. 現在のスケールを取得
    FVector Scale = Transform.GetScale3D();

    // 2. バウンドにスケールを適用
    BoundsMin *= Scale;
    BoundsMax *= Scale;

    // 3. スケールをリセット
    Transform.SetScale3D(FVector::One());
}
```

### 処理の流れ

1. **入力ポイントのコピー**: 全てのポイントプロパティをコピー
2. **各ポイントに対して**:
   - トランスフォームからスケールを取得
   - BoundsMin/MaxにスケールをComponent-wiseで乗算
   - トランスフォームのスケールを(1.0, 1.0, 1.0)に設定

### ベースクラス

`FPCGPointOperationElementBase`を継承しており、並列処理を自動的にサポートします。

## パフォーマンス考慮事項

- **計算コスト**: O(N) - Nはポイント数
- **メモリ**: 入力ポイントの完全なコピーを作成
- **並列化**: 自動的に並列処理されるため、大規模データセットでも効率的

## 使用例

### 基本的な使用

```
入力ポイント:
  Transform: Location=(100, 200, 0), Scale=(2.0, 2.0, 1.0)
  BoundsMin: (-50, -50, -10)
  BoundsMax: (50, 50, 10)

Apply Scale To Bounds適用後:
  Transform: Location=(100, 200, 0), Scale=(1.0, 1.0, 1.0)
  BoundsMin: (-100, -100, -10)  // -50 * 2.0, -50 * 2.0, -10 * 1.0
  BoundsMax: (100, 100, 10)     // 50 * 2.0, 50 * 2.0, 10 * 1.0

結果: 視覚的な表現は同じだが、スケール情報がバウンドに転送される
```

### 用途

1. **スケールの正規化**: 後続のノードでスケールを考慮する必要がない場合
2. **バウンドベースの処理**: バウンドサイズでフィルタリングやソートを行う前処理
3. **Static Mesh Sampler出力の正規化**: スケールされたメッシュからサンプリングした後の処理

## 関連ノード

- **Bounds Modifier**: バウンドの変更（スケールは変更しない）
- **Extents Modifier**: エクステントの変更
- **Transform Points**: ポイントのトランスフォーム変更

## 注意事項

- このノードを適用すると、元のスケール情報は失われます
- バウンド情報が必要ない場合、このノードは不要です
- スケールが(1.0, 1.0, 1.0)の場合、効果はありません

## 技術的な詳細

- プロパティ割り当て: Transform、BoundsMin、BoundsMax
- BasePointDataをサポート
- ポイントデータをコピーして処理
