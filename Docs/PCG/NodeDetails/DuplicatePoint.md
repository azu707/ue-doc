# Duplicate Point

## 概要

Duplicate Pointノードは、各入力ポイントの複製を作成し、オプションでトランスフォームオフセットを適用します。ポイントを指定回数複製し、方向に沿って配置したり、カスタムトランスフォームを適用したりできます。

**カテゴリ**: Point Ops
**クラス**: `UPCGDuplicatePointSettings`
**エレメント**: `FPCGDuplicatePointElement`

## 機能詳細

このノードは、以下の2つのモードで動作します:

1. **相対空間モード** (`bDirectionAppliedInRelativeSpace = true`): 各ポイントのローカル空間で方向が適用され、複製が相対的に配置されます
2. **ワールド空間モード** (`bDirectionAppliedInRelativeSpace = false`): 複製がワールド空間で配置され、トランスフォームが累積的に適用されます

## プロパティ

### Iterations

- **型**: `int`
- **デフォルト値**: `1`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **制約**: 最小値 = 1

生成する複製の数を指定します。

- `1`: 各ポイントから1つの複製を生成（元のポイントを含めると合計2ポイント）
- `5`: 各ポイントから5つの複製を生成（元のポイントを含めると合計6ポイント）

注意: この値が0以下の場合、ノードは警告を表示して処理を終了します。

### Direction

- **型**: `FVector`
- **デフォルト値**: `FVector(0.0, 0.0, 1.0)` (Z軸方向)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **制約**: 各成分は-1.0から1.0の範囲にクランプされます

ポイント複製を配置する方向を指定します。各成分は正規化された値として扱われます。

- `(0, 0, 1)`: Z軸方向（上方向）に積み重ねる（デフォルト）
- `(1, 0, 0)`: X軸方向に配置
- `(0.5, 0.5, 0)`: XY平面上、45度方向に配置

### bDirectionAppliedInRelativeSpace

- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

軸変位を相対空間で適用するかどうかを制御します。

- `true`: 各ポイントのローカル空間で方向が適用され、複製はポイントのトランスフォームに対して相対的に配置されます
- `false`: ワールド空間で方向が適用され、トランスフォームが累積的に適用されます（デフォルト）

### bOutputSourcePoint

- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

元のポイントを出力に含めるかどうかを制御します。

- `true`: 元のポイントと複製の両方を出力（デフォルト）
- `false`: 複製のみを出力し、元のポイントは含まれません

### PointTransform

- **型**: `FTransform`
- **デフォルト値**: `FTransform()` (単位行列)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

各ポイント複製に適用するトランスフォームオフセットを指定します。

- **相対空間モード**: このトランスフォームは方向オフセットと組み合わされて各複製に適用されます
- **ワールド空間モード**: このトランスフォームは累積的に適用されます（複製インデックスに応じて乗算）

## ピン設定

### 入力ピン

- **名前**: In (デフォルト入力ピン)
- **型**: Point Data
- **説明**: 複製するポイントデータ

### 出力ピン

- **名前**: Out (デフォルト出力ピン)
- **型**: Point Data
- **説明**: 元のポイントと複製を含むポイントデータ

## 実装の詳細

### ExecuteInternalメソッド

ノードの主要なロジックは`FPCGDuplicatePointElement::ExecuteInternal`で実装されています。処理は2つのモードに分かれています:

#### 相対空間モード (`bDirectionAppliedInRelativeSpace = true`)

```cpp
// 各ポイントについて
for (int32 ReadIndex = StartReadIndex; ReadIndex < StartReadIndex + Count; ++ReadIndex)
{
    // 1. ポイントの境界から方向オフセットを計算
    const FTransform DuplicateAxisTransform = FTransform(
        (BoundsMax - BoundsMin) * Direction
    );

    // 2. ユーザー指定のトランスフォームと組み合わせ
    const FTransform DuplicateTransform = DuplicateAxisTransform * SourceDuplicateTransform;

    // 3. 各複製について累積的にトランスフォームを適用
    FTransform CurrentTransform = PointTransform;
    for (int Duplicate = 0; Duplicate < DuplicatesPerPoint; ++Duplicate)
    {
        CurrentTransform = DuplicateTransform * CurrentTransform;
        // トランスフォームと新しいシードを設定
    }
}
```

このモードでは、各複製はポイントのローカル空間で配置され、トランスフォームが順次適用されます。

#### ワールド空間モード (`bDirectionAppliedInRelativeSpace = false`)

```cpp
for (int32 GlobalReadIndex = StartReadIndex; GlobalReadIndex < StartReadIndex + Count; ++GlobalReadIndex)
{
    // 1. 複製インデックスを計算
    const int DuplicateIndex = FirstDuplicateIndex + GlobalReadIndex / NumInputPoints;

    if (DuplicateIndex != 0)
    {
        // 2. 位置オフセットを計算（境界 * 方向 + トランスフォーム位置）* インデックス
        const FVector DuplicateLocationOffset =
            ((BoundsMax - BoundsMin) * Direction + SourceDuplicateTransform.GetLocation())
            * DuplicateIndex;

        // 3. 回転オフセットを計算（回転 * インデックス）
        const FRotator DuplicateRotationOffset =
            SourceDuplicateTransform.Rotator() * DuplicateIndex;

        // 4. スケール乗数を計算（スケール ^ インデックス）
        const FVector DuplicateScaleMultiplier = FVector(
            FMath::Pow(SourceDuplicateTransform.GetScale3D().X, DuplicateIndex),
            FMath::Pow(SourceDuplicateTransform.GetScale3D().Y, DuplicateIndex),
            FMath::Pow(SourceDuplicateTransform.GetScale3D().Z, DuplicateIndex)
        );

        // 5. 最終トランスフォームを適用
        OutTransform = FTransform(DuplicateRotationOffset, DuplicateLocationOffset, DuplicateScaleMultiplier)
                      * InTransform;
    }
}
```

このモードでは、トランスフォームが複製インデックスに応じて累積的に適用されます。

### 非同期処理

ノードは`FPCGAsync::AsyncProcessingOneToOneRangeEx`を使用して処理を実行します:

```cpp
FPCGAsync::AsyncProcessingOneToOneRangeEx(
    &Context->AsyncState,
    InputPointData->GetNumPoints(),  // 処理する要素数
    InitializeFunc,                   // 初期化関数
    ProcessRangeFunc,                 // 処理関数
    /*bEnableTimeSlicing=*/false      // タイムスライシングは無効
);
```

## 使用例

### 例1: 垂直にポイントを積み重ねる

```
設定:
- Iterations: 4
- Direction: (0, 0, 1)
- bDirectionAppliedInRelativeSpace: false
- bOutputSourcePoint: true
- PointTransform: Identity

結果:
- 各ポイントから5つのポイントが生成（元 + 4複製）
- 各複製はポイントの高さ分だけZ軸上に配置
```

### 例2: スパイラル配置

```
設定:
- Iterations: 8
- Direction: (0, 0, 1)
- bDirectionAppliedInRelativeSpace: false
- bOutputSourcePoint: true
- PointTransform: (Location: (0,0,10), Rotation: (0,0,45), Scale: (1,1,1))

結果:
- 各ポイントから9つのポイントが生成
- 各複製は高さ10ずつ上がり、45度ずつ回転
- スパイラル階段のような配置
```

### 例3: 相対空間での複製

```
設定:
- Iterations: 3
- Direction: (1, 0, 0)
- bDirectionAppliedInRelativeSpace: true
- bOutputSourcePoint: false
- PointTransform: Identity

結果:
- 各ポイントから3つの複製のみが生成（元のポイントなし）
- 各複製はポイントのローカルX軸方向に、ポイントの幅分だけオフセット
```

### 例4: スケール変化

```
設定:
- Iterations: 4
- Direction: (0, 0, 0)
- bDirectionAppliedInRelativeSpace: false
- bOutputSourcePoint: true
- PointTransform: (Location: (0,0,0), Rotation: (0,0,0), Scale: (0.8,0.8,0.8))

結果:
- 各ポイントから5つのポイントが同じ位置に生成
- 各複製のスケールは前の複製の0.8倍
- 1.0, 0.8, 0.64, 0.512, 0.4096のスケール系列
```

## パフォーマンス考慮事項

### 計算量

- **時間計算量**: O(N * M) - Nは入力ポイント数、Mは(Iterations + bOutputSourcePoint ? 1 : 0)
- **空間計算量**: O(N * M) - 出力ポイント数

### メモリ使用量

出力ポイント数 = 入力ポイント数 × (Iterations + (bOutputSourcePoint ? 1 : 0))

### 最適化

1. **プロパティ割り当て**: 入力データの割り当て済みプロパティに加えて、TransformとSeedプロパティが確実に割り当てられます
2. **非同期処理**: 現在はタイムスライシングが無効化されていますが、非同期フレームワークを使用
3. **メタデータ**: 入力からメタデータを継承し、不要な複製を避けます

### 推奨事項

- Iterationsを大きくすると、出力ポイント数が線形に増加します
- 大量のポイントを処理する場合、メモリ使用量に注意してください
- 不要な複製を避けるため、適切なフィルタリングを事前に行ってください

## 関連ノード

- **Transform Points**: ポイントにランダムまたは固定のトランスフォームを適用
- **Points Grid**: グリッド状にポイントを生成（複製とは異なるアプローチ）
- **Split Points**: ポイントを分割（複製の逆操作）
- **Merge Points**: 複数のポイントセットを結合

## 注意事項

1. **シード再計算**: 各複製の新しい位置からシードが再計算されるため、複製ごとに異なるランダム値が生成されます
2. **空間データ継承**: `bInheritSpatialData = false`により、空間データは継承されません
3. **トランスフォームの累積**: ワールド空間モードでは、スケールは累乗的に適用されます（例: 2回目の複製は `Scale^2`）
4. **方向のクランプ**: Direction の各成分は-1.0から1.0の範囲にクランプされます

## 技術仕様

### エレメント特性

- **実行ループモード**: `SinglePrimaryPin` - プライマリピンごとに1回実行
- **ベースポイントデータサポート**: はい - `UPCGBasePointData`のサブクラスをサポート
- **非同期処理**: はい - `FPCGAsync::AsyncProcessingOneToOneRangeEx`を使用

### データフロー

```
入力ポイントデータ → モード判定 → 複製生成 → 出力ポイントデータ
                       ↓
              相対空間 / ワールド空間
                       ↓
              トランスフォーム適用
                       ↓
              シード再計算
```

### 処理パターン

相対空間モードでは1対多の変換パターンを使用し、ワールド空間モードでは反復的な処理を最適化した形で実行します。
