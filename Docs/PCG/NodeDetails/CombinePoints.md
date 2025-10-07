# Combine Points

## 概要

Combine Pointsノードは、入力された複数のポイントを結合し、すべてのポイントの範囲を包含する単一のポイントを生成します。各入力ポイントセットに対して、すべてのポイントの境界を統合した1つのポイントが出力されます。

**カテゴリ**: Point Ops
**クラス**: `UPCGCombinePointsSettings`
**エレメント**: `FPCGCombinePointsElement`

## 機能詳細

このノードは、入力されたポイントデータを処理し、各入力セットごとに以下の処理を実行します:

1. すべてのポイントの境界ボックスを計算
2. 統合された境界を持つ単一のポイントを生成
3. オプションで、ポイントの中心位置を調整
4. 新しいポイントのトランスフォームを設定

## プロパティ

### bCenterPivot

- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

統合された境界の中心にポイントを配置するかどうかを制御します。

- `true`: ポイントの中心位置が境界の中心に配置されます（デフォルト）
- `false`: ピボット位置が調整されません

内部的には`FPCGPoint::ResetPointCenter(FVector(0.5))`が呼ばれ、ポイントの中心を境界の中央(50%の位置)に配置します。

### bUseFirstPointTransform

- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

最初のポイントのトランスフォームを使用するかどうかを制御します。

- `true`: 入力の最初のポイント(インデックス0)のトランスフォームを出力ポイントに適用（デフォルト）
- `false`: `PointTransform`プロパティで指定されたトランスフォームを使用

### PointTransform

- **型**: `FTransform`
- **デフォルト値**: `FTransform()` (単位行列)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **編集条件**: `!bUseFirstPointTransform`

`bUseFirstPointTransform`が`false`の場合に使用されるトランスフォームを指定します。このトランスフォームは、出力ポイントの位置、回転、スケールを決定します。

## ピン設定

### 入力ピン

- **名前**: In (デフォルト入力ピン)
- **型**: Point Data
- **説明**: 結合するポイントデータ

### 出力ピン

- **名前**: Out (デフォルト出力ピン)
- **型**: Point Data
- **説明**: 各入力セットごとに1つのポイントを含むポイントデータ

## 実装の詳細

### ExecuteInternalメソッド

ノードの主要なロジックは`FPCGCombinePointsElement::ExecuteInternal`で実装されています:

```cpp
bool FPCGCombinePointsElement::ExecuteInternal(FPCGContext* Context) const
{
    // 1. 設定とデータの取得
    const UPCGCombinePointsSettings* Settings = Context->GetInputSettings<UPCGCombinePointsSettings>();
    const TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    // 2. 各入力データの処理
    for (int i = 0; i < Inputs.Num(); ++i)
    {
        // 入力の検証
        const UPCGBasePointData* InputPointData = Cast<UPCGBasePointData>(Inputs[i].Data);
        if (!InputPointData || InputPointData->IsEmpty()) continue;

        // 3. トランスフォームの決定
        const FTransform& PointTransform = Settings->bUseFirstPointTransform
            ? InputPoint.Transform
            : Settings->PointTransform;

        // 4. 境界ボックスの計算
        FBox OutBox(EForceInit::ForceInit);
        for (int j = 0; j < InputPointData->GetNumPoints(); ++j)
        {
            // 各ポイントのローカル境界をポイントトランスフォーム空間に変換して統合
            OutBox += PCGPointHelpers::GetLocalBounds(...).TransformBy(...);
        }

        // 5. 出力ポイントの設定
        OutPoint.SetLocalBounds(OutBox);
        OutPoint.Transform = PointTransform;
        OutPoint.Seed = PCGHelpers::ComputeSeedFromPosition(OutPoint.Transform.GetLocation());

        // 6. オプション: ピボットの中央配置
        if (Settings->bCenterPivot)
        {
            OutPoint.ResetPointCenter(FVector(0.5));
        }
    }

    return true;
}
```

#### 処理手順の詳細

1. **初期化**: 最初のポイントを取得し、スケールを境界に適用
2. **トランスフォーム計算**: 逆行列を計算して座標変換の準備
3. **出力データ作成**: 1ポイント分のメモリを確保し、すべてのプロパティを割り当て
4. **境界統合**: すべての入力ポイントの境界をローカル空間で統合
5. **シード計算**: ポイントの新しい位置からシード値を計算
6. **中心調整**: `bCenterPivot`がtrueの場合、ピボットを中央に配置

### 座標空間の処理

ノードは以下の座標変換を実行します:

- 各ポイントのローカル境界をワールド空間に変換
- すべての境界を出力ポイントのトランスフォーム空間に逆変換
- 結果の統合境界を出力ポイントのローカル境界として設定

## 使用例

### 例1: 複数のポイントを1つにまとめる

建物の各部品を表すポイント群を1つの境界ボックスに統合する場合:

```
設定:
- bCenterPivot: true
- bUseFirstPointTransform: true

結果:
- すべてのポイントを包含する境界を持つ1ポイントが生成
- 中心は境界ボックスの中央
- 最初のポイントの位置とスケールを継承
```

### 例2: カスタムトランスフォームでの結合

特定の位置とスケールで結合する場合:

```
設定:
- bCenterPivot: false
- bUseFirstPointTransform: false
- PointTransform: (Location: (0,0,100), Rotation: (0,0,0), Scale: (2,2,2))

結果:
- 指定した位置に配置され、スケールが2倍になった統合ポイント
- ピボットは境界の端
```

## パフォーマンス考慮事項

### 計算量

- **時間計算量**: O(N) - Nは入力ポイント数
- **空間計算量**: O(1) - 常に1ポイントを出力

### 最適化

1. **境界計算**: 各ポイントの境界は一度だけ変換されます
2. **メモリ効率**: 出力は常に1ポイントなので、メモリ使用量は最小限
3. **空間データ**: `bInheritSpatialData = false`により、不要な空間データの継承を防ぎます

### 推奨事項

- 大量のポイントを結合する場合、CPU負荷が高くなる可能性があります
- 不必要に頻繁に実行しないよう、グラフ構造を最適化してください
- 結合前にフィルタリングを行うことで、処理するポイント数を減らせます

## 関連ノード

- **Merge Points**: ポイントを結合しますが、複数のポイントを保持します
- **Bounding Box Modifier**: 境界ボックスを直接変更します
- **Reset Point Center**: ポイントの中心位置を調整します（このノードでも使用される機能）
- **Point Extents Modifier**: ポイントの範囲を変更します

## 注意事項

1. **メタデータの処理**: 出力ポイントは入力データからメタデータを継承しますが、最初のポイントのエントリが使用されます
2. **属性の保持**: すべてのネイティブプロパティが割り当てられ、入力データの属性が保持されます
3. **空の入力**: 入力にポイントがない場合、警告が表示され、その入力はスキップされます
4. **複数入力**: 各入力タグデータに対して個別に処理が行われ、それぞれ1つの出力ポイントが生成されます

## 技術仕様

### エレメント特性

- **実行ループモード**: `SinglePrimaryPin` - プライマリピンごとに1回実行
- **ベースポイントデータサポート**: はい - `UPCGBasePointData`のサブクラスをサポート
- **非同期処理**: なし - 同期的に実行

### データフロー

```
入力ポイントデータ → 境界統合処理 → 単一ポイント生成 → 出力ポイントデータ
                     ↓
                トランスフォーム適用
                     ↓
                中心位置調整(オプション)
```
