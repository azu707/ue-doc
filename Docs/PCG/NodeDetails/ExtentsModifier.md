# Extents Modifier

## 概要

Extents Modifierノードは、ポイントの範囲（Extents）を変更するノードです。ポイントの境界ボックスのサイズを設定、最小化、最大化、加算、乗算することができます。ポイントの位置や回転は変更せず、範囲のみを調整します。

**カテゴリ**: Point Ops
**クラス**: `UPCGPointExtentsModifierSettings`
**エレメント**: `FPCGPointExtentsModifier`

## 機能詳細

このノードは、ポイントの境界ボックス（BoundsMin と BoundsMax）を操作し、ポイントの範囲を変更します。5つの異なるモードで動作し、それぞれ異なる方法で範囲を調整します。

範囲（Extents）は、境界ボックスの半分のサイズを表すベクトルで、以下の式で計算されます:
```
Extents = (BoundsMax - BoundsMin) / 2
```

## 列挙型

### EPCGPointExtentsModifierMode

ポイントの範囲を変更する方法を定義します。

| 値 | 説明 |
|---|---|
| `Set` | 範囲を指定された値に設定します |
| `Minimum` | 現在の範囲と指定された値の最小値を使用します |
| `Maximum` | 現在の範囲と指定された値の最大値を使用します |
| `Add` | 現在の範囲に指定された値を加算します |
| `Multiply` | 現在の範囲に指定された値を乗算します |

## プロパティ

### Extents

- **型**: `FVector`
- **デフォルト値**: `FVector::One()` (1, 1, 1)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

範囲の変更に使用するベクトル値を指定します。Modeプロパティによって、この値の使用方法が異なります。

- **Set モード**: この値が新しい範囲になります
- **Minimum モード**: この値と現在の範囲の成分ごとの最小値が使用されます
- **Maximum モード**: この値と現在の範囲の成分ごとの最大値が使用されます
- **Add モード**: この値が現在の範囲に加算されます
- **Multiply モード**: この値が現在の範囲に乗算されます

例:
- `(2, 2, 2)`: 各軸で2ユニットの範囲
- `(1, 1, 0.5)`: X, Y軸で1ユニット、Z軸で0.5ユニット
- `(0.5, 0.5, 0.5)`: Multiplyモードで使用すると範囲を半分にする

### Mode

- **型**: `EPCGPointExtentsModifierMode`
- **デフォルト値**: `EPCGPointExtentsModifierMode::Set`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

範囲を変更する方法を指定します。詳細は上記の列挙型セクションを参照してください。

## ピン設定

### 入力ピン

- **名前**: In (デフォルト入力ピン)
- **型**: Point Data
- **説明**: 範囲を変更するポイントデータ

### 出力ピン

- **名前**: Out (デフォルト出力ピン)
- **型**: Point Data
- **説明**: 範囲が変更されたポイントデータ

## 実装の詳細

### ExecuteInternalメソッド

ノードは`FPCGPointOperationElementBase`を継承し、ポイント操作の共通フレームワークを使用します。主要なロジックは`ExecuteInternal`メソッドで実装されています:

```cpp
bool FPCGPointExtentsModifier::ExecuteInternal(FPCGContext* InContext) const
{
    const UPCGPointExtentsModifierSettings* Settings = Context->GetInputSettings<UPCGPointExtentsModifierSettings>();
    const EPCGPointExtentsModifierMode Mode = Settings->Mode;
    const FVector& Extents = Settings->Extents;

    // 各モードに応じた処理
    switch (Mode)
    {
        case EPCGPointExtentsModifierMode::Set:
            // 範囲を直接設定
            PCGPointHelpers::SetExtents(Extents, OutBoundsMin, OutBoundsMax);
            break;

        case EPCGPointExtentsModifierMode::Minimum:
            // 現在の範囲と指定値の最小値
            PCGPointHelpers::SetExtents(FVector::Min(CurrentExtents, Extents), OutBoundsMin, OutBoundsMax);
            break;

        case EPCGPointExtentsModifierMode::Maximum:
            // 現在の範囲と指定値の最大値
            PCGPointHelpers::SetExtents(FVector::Max(CurrentExtents, Extents), OutBoundsMin, OutBoundsMax);
            break;

        case EPCGPointExtentsModifierMode::Add:
            // 範囲を加算
            PCGPointHelpers::SetExtents(CurrentExtents + Extents, OutBoundsMin, OutBoundsMax);
            break;

        case EPCGPointExtentsModifierMode::Multiply:
            // 範囲を乗算
            PCGPointHelpers::SetExtents(CurrentExtents * Extents, OutBoundsMin, OutBoundsMax);
            break;
    }

    return true;
}
```

### SetExtentsLoopヘルパー関数

処理の中核となるヘルパー関数:

```cpp
auto SetExtentsLoop = [](UPCGBasePointData* OutputData, int32 StartIndex, int32 Count,
                         TFunctionRef<void(const FVector&, FVector&, FVector&)> SetExtentsFunc)
{
    TPCGValueRange<FVector> BoundsMinRange = OutputData->GetBoundsMinValueRange();
    TPCGValueRange<FVector> BoundsMaxRange = OutputData->GetBoundsMaxValueRange();

    for (int32 Index = StartIndex; Index < (StartIndex + Count); ++Index)
    {
        FVector& BoundsMin = BoundsMinRange[Index];
        FVector& BoundsMax = BoundsMaxRange[Index];

        // 現在の範囲を取得
        FVector CurrentExtents = PCGPointHelpers::GetExtents(BoundsMin, BoundsMax);

        // モード固有の処理関数を呼び出し
        SetExtentsFunc(CurrentExtents, BoundsMin, BoundsMax);
    }

    return true;
};
```

### プロパティ割り当て

```cpp
virtual EPCGPointNativeProperties GetPropertiesToAllocate(FPCGContext* Context) const override
{
    return EPCGPointNativeProperties::BoundsMin | EPCGPointNativeProperties::BoundsMax;
}
```

BoundsMinとBoundsMaxのみが新たに割り当てられ、他のプロパティは入力からコピーされます。

## 使用例

### 例1: 固定サイズの境界ボックスを設定

すべてのポイントに同じサイズの境界を設定する場合:

```
設定:
- Mode: Set
- Extents: (50, 50, 100)

結果:
- すべてのポイントが幅100、高さ200の境界ボックスを持つ
  (Extentsは半分のサイズなので、実際の幅は100、高さは200)
```

### 例2: 境界を拡大

すべてのポイントの境界を2倍にする場合:

```
設定:
- Mode: Multiply
- Extents: (2, 2, 2)

結果:
- 各ポイントの境界が各軸で2倍に拡大
- 元の範囲が(10, 10, 10)の場合、新しい範囲は(20, 20, 20)
```

### 例3: 境界の最小サイズを保証

ポイントの境界が最小サイズを下回らないようにする場合:

```
設定:
- Mode: Maximum
- Extents: (5, 5, 5)

結果:
- すべてのポイントの範囲が最低でも(5, 5, 5)になる
- 元の範囲が(3, 3, 3)の場合、(5, 5, 5)に拡大
- 元の範囲が(10, 10, 10)の場合、変更なし
```

### 例4: 垂直方向のみ範囲を増加

ポイントの高さのみを増やす場合:

```
設定:
- Mode: Add
- Extents: (0, 0, 10)

結果:
- すべてのポイントのZ軸範囲が10増加
- 元の範囲が(50, 50, 100)の場合、新しい範囲は(50, 50, 110)
- 実際の高さは220ユニット（元の200から220に増加）
```

### 例5: 異方性スケーリング

X, Y軸は拡大し、Z軸は縮小する場合:

```
設定:
- Mode: Multiply
- Extents: (1.5, 1.5, 0.5)

結果:
- X, Y軸の範囲が1.5倍
- Z軸の範囲が0.5倍（半分）
- 元の範囲が(10, 10, 20)の場合、新しい範囲は(15, 15, 10)
```

### 例6: 境界の最大サイズを制限

ポイントの境界が最大サイズを超えないようにする場合:

```
設定:
- Mode: Minimum
- Extents: (100, 100, 100)

結果:
- すべてのポイントの範囲が最大でも(100, 100, 100)になる
- 元の範囲が(150, 150, 150)の場合、(100, 100, 100)に縮小
- 元の範囲が(50, 50, 50)の場合、変更なし
```

## パフォーマンス考慮事項

### 計算量

- **時間計算量**: O(N) - Nは入力ポイント数
- **空間計算量**: O(N) - 出力ポイント数は入力と同じ

### 最適化

1. **ポイントコピー**: `ShouldCopyPoints() = true`により、入力ポイントのデータがコピーされます
2. **プロパティ割り当て**: BoundsMinとBoundsMaxのみが新たに割り当てられます
3. **ベースクラス**: `FPCGPointOperationElementBase`を使用して、共通の最適化を活用

### 推奨事項

- 境界の変更のみが必要な場合、このノードは効率的です
- 大量のポイントを処理する場合でも、単純な算術演算のみなのでパフォーマンスは良好です
- 他のトランスフォーム操作と組み合わせる場合、実行順序を最適化してください

## 関連ノード

- **Bounding Box Modifier**: より高度な境界ボックス操作を提供（存在する場合）
- **Transform Points**: ポイントのトランスフォーム全体を変更
- **Reset Point Center**: ポイントの中心位置を調整（境界は維持）
- **Combine Points**: 複数のポイントを1つの境界に統合

## 注意事項

1. **範囲とバウンディングボックス**: Extentsは境界ボックスの半分のサイズであることに注意してください。実際の境界ボックスのサイズは`Extents * 2`です。
2. **負の値**: Extentsに負の値を使用すると、境界が反転する可能性があります。通常は正の値を使用してください。
3. **スケールとの関係**: ポイントのスケールと範囲は別々に管理されます。このノードは範囲のみを変更します。
4. **境界のリセット**: Setモードは現在の範囲を無視し、完全に新しい値を設定します。

## 技術仕様

### エレメント特性

- **基底クラス**: `FPCGPointOperationElementBase`
- **ベースポイントデータサポート**: はい - `UPCGBasePointData`のサブクラスをサポート
- **ポイントコピー**: はい - `ShouldCopyPoints() = true`
- **非同期処理**: 基底クラスによって提供される可能性あり

### データフロー

```
入力ポイントデータ → ポイントコピー → 範囲計算 → モード別処理 → 出力ポイントデータ
                                         ↓
                        Set / Minimum / Maximum / Add / Multiply
                                         ↓
                          BoundsMin / BoundsMax更新
```

### PCGPointHelpers関数

ノードは以下のヘルパー関数を使用します:

```cpp
// 範囲を取得
FVector GetExtents(const FVector& BoundsMin, const FVector& BoundsMax);

// 範囲を設定
void SetExtents(const FVector& Extents, FVector& OutBoundsMin, FVector& OutBoundsMax);
```

これらの関数は境界ボックスと範囲の変換を処理します。
