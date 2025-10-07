# Apply Hierarchy ノード

## 概要

Apply Hierarchyノードは、階層的な親子関係を持つポイントデータに対して、親のトランスフォームを子に適用するノードです。PCG Data Assetsで定義された階層深度、ポイントインデックス、親インデックスのスキームに基づいて階層トランスフォームを適用します。

**ノードタイプ**: Point Ops
**クラス名**: `UPCGApplyHierarchySettings` / `FPCGApplyHierarchyElement`
**ファイル**: `PCGApplyHierarchy.h`, `PCGApplyHierarchy.cpp`

## 主な機能

- 階層構造を持つポイントデータの親子関係に基づくトランスフォーム適用
- 複数属性による複合キーのサポート
- 階層深度に基づく段階的なトランスフォーム計算
- 親の回転やスケールの適用/除外の柔軟な制御
- 無効な親を持つポイントの自動除外

## プロパティ

### Point Key Attributes (ポイントキー属性)
**型**: `TArray<FPCGAttributePropertyInputSelector>`
**デフォルト値**: `ActorIndex` (PCG Data Asset標準属性)
**説明**: ポイントを一意に識別するキーを構成する属性のリスト。現在はすべてint32型である必要があります。複数の属性を組み合わせて複合キーとして使用できます。

### Parent Key Attributes (親キー属性)
**型**: `TArray<FPCGAttributePropertyInputSelector>`
**デフォルト値**: `ParentIndex` (PCG Data Asset標準属性)
**説明**: 階層内のポイントの親を識別するキーを構成する属性のリスト。Point Key Attributesと同じ数の属性が必要です。

### Hierarchy Depth Attribute (階層深度属性)
**型**: `FPCGAttributePropertyInputSelector`
**デフォルト値**: `HierarchyDepth` (PCG Data Asset標準属性)
**説明**: 階層内のポイントの深度を示す属性。深度0がルート、深度が増えるごとに下層になります。

### Relative Transform Attribute (相対トランスフォーム属性)
**型**: `FPCGAttributePropertyInputSelector`
**デフォルト値**: `RelativeTransform` (PCG Data Asset標準属性)
**説明**: 親に対する相対的なトランスフォームを格納する属性。このトランスフォームが親トランスフォームと合成されます。

### Apply Parent Rotation (親の回転を適用)
**型**: `EPCGApplyHierarchyOption`
**デフォルト値**: `OptOutByAttribute`
**説明**: 親の回転をポイントに適用するかどうかを制御します。
- **Always**: 常に親の回転を適用
- **Never**: 親の回転を適用しない
- **OptInByAttribute**: 属性で指定されたポイントのみ親の回転を適用
- **OptOutByAttribute**: 属性で指定されたポイント以外に親の回転を適用

### Apply Parent Rotation Attribute (親の回転適用属性)
**型**: `FPCGAttributePropertyInputSelector`
**デフォルト値**: `IgnoreParentRotation` (PCG Data Asset標準属性)
**説明**: Apply Parent RotationがOptInByAttributeまたはOptOutByAttributeの場合に使用されるブール型属性。

**編集条件**: `ApplyParentRotation == OptInByAttribute || ApplyParentRotation == OptOutByAttribute`

### Apply Parent Scale (親のスケールを適用)
**型**: `EPCGApplyHierarchyOption`
**デフォルト値**: `OptOutByAttribute`
**説明**: 親のスケールをポイントに適用するかどうかを制御します。オプションはApply Parent Rotationと同様です。

### Apply Parent Scale Attribute (親のスケール適用属性)
**型**: `FPCGAttributePropertyInputSelector`
**デフォルト値**: `IgnoreParentScale` (PCG Data Asset標準属性)
**説明**: Apply Parent ScaleがOptInByAttributeまたはOptOutByAttributeの場合に使用されるブール型属性。

**編集条件**: `ApplyParentScale == OptInByAttribute || ApplyParentScale == OptOutByAttribute`

### Apply Hierarchy (階層適用)
**型**: `EPCGApplyHierarchyOption`
**デフォルト値**: `Always`
**カテゴリ**: Advanced
**説明**: 個々のポイントに対して階層トランスフォームを適用するかどうかを制御します。

### Apply Hierarchy Attribute (階層適用属性)
**型**: `FPCGAttributePropertyInputSelector`
**デフォルト値**: なし
**カテゴリ**: Advanced
**説明**: Apply HierarchyがOptInByAttributeまたはOptOutByAttributeの場合に使用されるブール型属性。

**編集条件**: `ApplyHierarchy == OptInByAttribute || ApplyHierarchy == OptOutByAttribute`

### Warn On Points With Invalid Parent (無効な親を持つポイントに警告)
**型**: `bool`
**デフォルト値**: `true`
**カテゴリ**: Advanced
**説明**: 無効な親インデックスまたは無効な深度を持つポイントが見つかった場合に警告を表示するかどうか。

## 実装の詳細

### アルゴリズム概要

1. **親マッピングの構築**
   - ポイントキーと親キーを読み取り、各ポイントの親インデックスへのマッピングを作成
   - 複数の属性を組み合わせた複合キーをサポート
   - 無効な親参照を検出

2. **階層深度によるパーティション**
   - 階層深度属性に基づいてポイントをパーティション化
   - 深度順（0からN）にソート
   - 無効な深度を持つポイントを無効としてマーク

3. **深度ごとのトランスフォーム計算**
   - 深度0（ルート）: 相対トランスフォーム × 現在のポイントトランスフォーム
   - 深度1以降: 相対トランスフォーム × 親トランスフォーム
   - 親の回転/スケールの適用オプションを考慮

4. **無効なポイントのフィルタリング**
   - 無効な親を持つポイントを最終結果から除外
   - 階層チェーンで無効になったポイントも除外

### 主要なコード構造

```cpp
// 親マッピングの構築
for (int Index = 0; Index < ParentKeys.Num(); ++Index)
{
    const TArray<int32>& OriginalParentKey = ParentKeys[Index];
    if (!OriginalParentKey.Contains(INDEX_NONE))
    {
        const int32* ParentIndex = PointKeysToIndexMap.Find(ParentKeys[Index]);
        if (ParentIndex)
        {
            ParentIndices[Index] = *ParentIndex;
        }
        else
        {
            ParentIndices[Index] = InvalidParentIndex; // -2
        }
    }
    else
    {
        ParentIndices[Index] = INDEX_NONE; // -1 (ルートポイント)
    }
}

// トランスフォーム計算（非ルートポイント）
Transform = RelativeTransform * ParentTransform;

// オプション適用
if (ApplyParentRotation == bInvertApplyRotation)
{
    Transform.SetRotation(RelativeTransform.GetRotation());
}
if (ApplyParentScale == bInvertApplyScale)
{
    Transform.SetScale3D(RelativeTransform.GetScale3D());
}
```

### Time Slicing サポート

このノードは `TPCGTimeSlicedElementBase` を使用しており、大規模なデータセットでも中断可能な実行をサポートしています。

## パフォーマンス考慮事項

### メモリ使用量
- ポイント数に応じたマッピング配列の割り当て
- 階層深度ごとのパーティション配列
- 複合キーを使用する場合、追加のメモリオーバーヘッド

### 計算コスト
- **O(N * K)**: Nはポイント数、Kはキー属性の数（親マッピング構築）
- **O(N log N)**: 深度によるパーティションのソート
- **O(N * D)**: Dは最大階層深度（トランスフォーム計算）

### 最適化のヒント
1. **キー属性を最小限に**: 単一のint32インデックスが最も効率的
2. **階層深度を浅く**: 深い階層ツリーは計算コストが増加
3. **無効なポイントを事前にフィルタリング**: 入力データの品質を向上

## 使用例

### 基本的な階層トランスフォーム

```
シーン階層:
Root (Depth=0, ActorIndex=0, ParentIndex=-1)
  ├─ Child1 (Depth=1, ActorIndex=1, ParentIndex=0)
  └─ Child2 (Depth=1, ActorIndex=2, ParentIndex=0)
      └─ GrandChild (Depth=2, ActorIndex=3, ParentIndex=2)

Apply Hierarchyノードは各ポイントに親のトランスフォームを適用:
- Root: RelativeTransform × CurrentTransform
- Child1, Child2: RelativeTransform × RootTransform
- GrandChild: RelativeTransform × Child2Transform
```

### 回転のみを無視

```
設定:
- Apply Parent Rotation: Never
- Apply Parent Scale: Always

結果:
- 各ポイントは親の位置とスケールのみを継承
- 回転は相対トランスフォームのまま保持
```

### 複合キーの使用

```
設定:
- Point Key Attributes: [LevelIndex, ActorIndex]
- Parent Key Attributes: [ParentLevelIndex, ParentActorIndex]

異なるレベル間での階層関係を表現可能
```

## 関連ノード

- **Transform Points**: 単純なトランスフォーム変換
- **Copy Attributes**: 属性のコピー
- **Data Table Row To Attribute Set**: データテーブルからの属性読み込み

## トラブルシューティング

### 警告: 一部のポイントに無効な親がある

**原因**: 親キーがポイントキーマップに存在しないか、階層深度が無効
**解決策**:
1. すべてのポイントキー属性と親キー属性が正しく設定されているか確認
2. 親インデックスが実際に存在するポイントを参照しているか確認
3. 階層深度が連続した値（0, 1, 2...）であることを確認

### エラー: カーディナリティの不一致

**原因**: ポイントキーと親キーのプロパティのカーディナリティが一致しない
**解決策**: ポイントキー属性と親キー属性の数を同じにする

## 技術的な注意事項

- 現在、すべてのキー属性はint32型である必要があります
- 階層深度は0から始まる連続した整数である必要があります
- 循環参照は検出されず、無限ループを引き起こす可能性があります
- 親のトランスフォームはワールド空間で計算されます

## バージョン情報

- Unreal Engine 5.6以降で利用可能
- PCG Data Asset標準属性との統合
