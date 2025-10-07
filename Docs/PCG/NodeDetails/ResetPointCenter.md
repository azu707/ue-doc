# Reset Point Center

## 概要

Reset Point Centerノードは、ポイントの境界ボックス内での位置を変更し、境界ボックス自体は変更しないノードです。ポイントのピボット位置を境界の中心、端、または任意の位置に再配置できます。

**カテゴリ**: Point Ops
**クラス**: `UPCGResetPointCenterSettings`
**エレメント**: `FPCGResetPointCenterElement`

## 機能詳細

このノードは、ポイントのトランスフォーム（位置）を調整し、ポイントが境界ボックス内のどの位置に配置されるかを制御します。境界ボックスのサイズと向きは変更されず、ポイントの位置のみが移動します。

境界ボックスとポイント位置の関係:
- ポイントの位置は境界ボックスの「ピボット」点として機能します
- 正規化された座標系で位置を指定します（0.0 = 最小、0.5 = 中央、1.0 = 最大）
- 境界ボックスは常にワールド空間で定義されます

## プロパティ

### PointCenterLocation

- **型**: `FVector`
- **デフォルト値**: `FVector(0.5, 0.5, 0.5)` (境界の中央)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

ポイントの正規化された中心位置を設定します。各成分は0.0から1.0の範囲で指定します。

- **X成分**: 境界ボックスのX軸上での位置
  - `0.0`: 最小X位置（境界の左端）
  - `0.5`: 中央X位置
  - `1.0`: 最大X位置（境界の右端）

- **Y成分**: 境界ボックスのY軸上での位置
  - `0.0`: 最小Y位置（境界の前端）
  - `0.5`: 中央Y位置
  - `1.0`: 最大Y位置（境界の後端）

- **Z成分**: 境界ボックスのZ軸上での位置
  - `0.0`: 最小Z位置（境界の底）
  - `0.5`: 中央Z位置
  - `1.0`: 最大Z位置（境界の頂上）

例:
- `(0.5, 0.5, 0.5)`: 境界の中央（デフォルト）
- `(0.5, 0.5, 0.0)`: 底面の中央
- `(0.0, 0.0, 0.0)`: 境界の最小コーナー
- `(1.0, 1.0, 1.0)`: 境界の最大コーナー
- `(0.5, 0.5, 1.0)`: 上面の中央

## ピン設定

### 入力ピン

- **名前**: In (デフォルト入力ピン)
- **型**: Point Data
- **説明**: 中心位置を変更するポイントデータ

### 出力ピン

- **名前**: Out (デフォルト出力ピン)
- **型**: Point Data
- **説明**: 中心位置が変更されたポイントデータ

## 実装の詳細

### ExecuteInternalメソッド

ノードは`FPCGPointOperationElementBase`を継承し、ポイント操作の共通フレームワークを使用します:

```cpp
bool FPCGResetPointCenterElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGResetPointCenterSettings* Settings = Context->GetInputSettings<UPCGResetPointCenterSettings>();

    return ExecutePointOperation(PointCenterContext,
        [&PointCenterLocation = Settings->PointCenterLocation]
        (const UPCGBasePointData* InputData, UPCGBasePointData* OutputData, int32 StartIndex, int32 Count)
        {
            // トランスフォームと境界範囲を取得
            TPCGValueRange<FTransform> TransformRange = OutputData->GetTransformValueRange();
            TPCGValueRange<FVector> BoundsMinRange = OutputData->GetBoundsMinValueRange();
            TPCGValueRange<FVector> BoundsMaxRange = OutputData->GetBoundsMaxValueRange();

            // 各ポイントについて中心位置をリセット
            for (int32 Index = StartIndex; Index < (StartIndex + Count); ++Index)
            {
                PCGPointHelpers::ResetPointCenter(
                    PointCenterLocation,
                    TransformRange[Index],
                    BoundsMinRange[Index],
                    BoundsMaxRange[Index]
                );
            }

            return true;
        });
}
```

### PCGPointHelpers::ResetPointCenter

実際の中心位置リセット処理は、`PCGPointHelpers::ResetPointCenter`関数で実装されています:

```cpp
void ResetPointCenter(
    const FVector& PointCenterLocation,  // 正規化された位置 (0-1)
    FTransform& InOutTransform,          // 更新されるトランスフォーム
    FVector& InOutBoundsMin,             // 更新される境界最小値
    FVector& InOutBoundsMax)             // 更新される境界最大値
{
    // 1. 現在の境界サイズを計算
    const FVector CurrentExtents = InOutBoundsMax - InOutBoundsMin;

    // 2. 新しいピボット位置を計算（境界内での位置）
    const FVector NewPivotOffset = CurrentExtents * (PointCenterLocation - FVector(0.5));

    // 3. トランスフォームの位置を調整
    InOutTransform.AddToTranslation(NewPivotOffset);

    // 4. 境界をオフセットで調整（ワールド位置は変わらず、ローカル位置が変わる）
    InOutBoundsMin -= NewPivotOffset;
    InOutBoundsMax -= NewPivotOffset;
}
```

### プロパティ割り当て

```cpp
virtual EPCGPointNativeProperties GetPropertiesToAllocate(FPCGContext* Context) const override
{
    return EPCGPointNativeProperties::Transform
         | EPCGPointNativeProperties::BoundsMin
         | EPCGPointNativeProperties::BoundsMax;
}
```

Transform、BoundsMin、BoundsMaxの3つのプロパティが割り当てられます。

## 使用例

### 例1: ポイントを底面中央に配置

建物やオブジェクトの基準点を底面の中央に設定する場合:

```
設定:
- PointCenterLocation: (0.5, 0.5, 0.0)

結果:
- ポイントの位置が境界ボックスの底面中央に移動
- 配置時、オブジェクトは地面に接地される
- 境界ボックスの上半分がポイントの上に位置する
```

### 例2: ポイントを最小コーナーに配置

グリッド配置などでコーナーを基準にする場合:

```
設定:
- PointCenterLocation: (0.0, 0.0, 0.0)

結果:
- ポイントが境界ボックスの最小コーナー（左下前）に配置
- 境界全体がポイントの正の方向に位置する
- グリッド配置が容易になる
```

### 例3: ポイントを中央に再配置

オフセットされたポイントを中央に戻す場合:

```
設定:
- PointCenterLocation: (0.5, 0.5, 0.5)

結果:
- ポイントが境界の中心に配置される（デフォルト状態）
- 境界がポイントを中心に対称的に配置される
- 回転などの操作が自然に行える
```

### 例4: ポイントを上面中央に配置

吊り下げるオブジェクトなど、上から配置する場合:

```
設定:
- PointCenterLocation: (0.5, 0.5, 1.0)

結果:
- ポイントが境界ボックスの上面中央に配置
- 境界全体がポイントの下に位置する
- 天井から吊るす配置に適している
```

### 例5: カスタムピボット位置

特定のオフセット位置にピボットを設定する場合:

```
設定:
- PointCenterLocation: (0.25, 0.5, 0.0)

結果:
- ポイントがX軸で25%の位置、Y軸で中央、Z軸で底面に配置
- 非対称なオブジェクトのバランス調整に使用可能
```

## パフォーマンス考慮事項

### 計算量

- **時間計算量**: O(N) - Nは入力ポイント数
- **空間計算量**: O(N) - 出力ポイント数は入力と同じ

### 最適化

1. **ポイントコピー**: `ShouldCopyPoints() = true`により、入力データが効率的にコピーされます
2. **プロパティ割り当て**: Transform、BoundsMin、BoundsMaxのみが新たに割り当てられます
3. **単純な演算**: ベクトル演算のみで、複雑な計算は不要
4. **ベースクラス**: `FPCGPointOperationElementBase`による最適化を活用

### 推奨事項

- このノードは非常に軽量で、大量のポイントでも高速に処理できます
- 他のノードとチェーンする場合、適切な順序で実行してください
- 境界の変更と組み合わせる場合、適切な順序を検討してください

## 関連ノード

- **Combine Points**: 複数ポイントを結合する際に`bCenterPivot`オプションで同様の処理を実行
- **Extents Modifier**: 境界のサイズを変更（このノードは位置のみ変更）
- **Transform Points**: ポイントの位置、回転、スケールを変更
- **Bounding Box Modifier**: 境界ボックス全体を変更

## 注意事項

1. **境界ボックスの保持**: このノードは境界ボックスのワールド空間位置を変更しません。ローカル座標系のみが調整されます。
2. **トランスフォームの変更**: ポイントのトランスフォームが変更されるため、子オブジェクトやメッシュの配置に影響します。
3. **正規化座標**: PointCenterLocationは0.0から1.0の範囲で指定しますが、範囲外の値も技術的には可能です（境界外にピボットを配置）。
4. **回転との関係**: ポイントが回転している場合、境界ボックスはワールド軸に整列しているため、予期しない結果になる可能性があります。

## 技術仕様

### エレメント特性

- **基底クラス**: `FPCGPointOperationElementBase`
- **ベースポイントデータサポート**: はい - `UPCGBasePointData`のサブクラスをサポート
- **ポイントコピー**: はい - `ShouldCopyPoints() = true`
- **非同期処理**: 基底クラスによって提供される可能性あり

### データフロー

```
入力ポイントデータ → ポイントコピー → 中心位置計算 → トランスフォーム調整 → 出力ポイントデータ
                                         ↓
                                  境界オフセット計算
                                         ↓
                              BoundsMin / BoundsMax更新
```

### 座標系の理解

ノードの動作を理解するための座標系:

```
ワールド空間: 境界ボックスの絶対位置
    ↓
ローカル空間: ポイントトランスフォームからの相対位置
    ↓
正規化空間: 境界内での0-1の位置 (PointCenterLocation)
```

PointCenterLocationは正規化空間で指定され、ローカル空間に変換されてトランスフォームに適用されます。

## ワークフロー例

### 建物配置ワークフロー

1. **Get Actor Data**: 建物メッシュからポイントを生成
2. **Reset Point Center**: `(0.5, 0.5, 0.0)`で底面中央にピボットを設定
3. **Transform Points**: 地形に配置
4. **Static Mesh Spawner**: 建物メッシュを配置

このワークフローにより、建物が自然に地面に接地されます。
