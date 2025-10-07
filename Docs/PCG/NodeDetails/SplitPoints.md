# Split Points

## 概要

Split Pointsノードは、各入力ポイントを指定された軸と位置で2つの別々のポイントに分割します。分割された各ポイントは、分割平面に基づいて調整された境界を持ちます。

**カテゴリ**: Point Ops
**クラス**: `UPCGSplitPointsSettings`
**エレメント**: `FPCGSplitPointsElement`

## 機能詳細

このノードは、各ポイントの境界ボックスを指定された軸に沿って分割し、2つの新しいポイントを生成します:

1. **Before Split**: 分割平面の前（最小側）の部分
2. **After Split**: 分割平面の後（最大側）の部分

各ポイントは元のポイントのプロパティを継承しますが、境界ボックスは分割位置に応じて調整されます。

## 列挙型

### EPCGSplitAxis

分割する軸を定義します。

| 値 | 数値 | 説明 |
|---|---|---|
| `X` | 0 | X軸に沿って分割（左右方向） |
| `Y` | 1 | Y軸に沿って分割（前後方向） |
| `Z` | 2 | Z軸に沿って分割（上下方向） |

## プロパティ

### SplitPosition

- **型**: `float`
- **デフォルト値**: `0.5f`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **制約**: 0.0から1.0の範囲にクランプされます

境界ボックス内での分割位置を正規化された値で指定します。

- `0.0`: 境界の最小位置で分割（Before Splitは空になる）
- `0.5`: 境界の中央で分割（デフォルト、均等に2分割）
- `1.0`: 境界の最大位置で分割（After Splitは空になる）
- `0.25`: 境界の25%の位置で分割

### SplitAxis

- **型**: `EPCGSplitAxis`
- **デフォルト値**: `EPCGSplitAxis::Z`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

分割を行う軸を指定します。

- `EPCGSplitAxis::X`: X軸方向（横方向）で分割
- `EPCGSplitAxis::Y`: Y軸方向（縦方向）で分割
- `EPCGSplitAxis::Z`: Z軸方向（高さ方向）で分割（デフォルト）

## ピン設定

### 入力ピン

- **名前**: In (デフォルト入力ピン)
- **型**: Point Data
- **説明**: 分割するポイントデータ

### 出力ピン

このノードは2つの出力ピンを持ちます:

#### Before Split ピン

- **名前**: Before Split
- **型**: Point Data
- **複数接続**: 可
- **複数データ**: 可
- **説明**: 分割平面の前（最小側）の部分を含むポイント

#### After Split ピン

- **名前**: After Split
- **型**: Point Data
- **複数接続**: 可
- **複数データ**: 可
- **説明**: 分割平面の後（最大側）の部分を含むポイント

## 実装の詳細

### OutputPinPropertiesメソッド

カスタム出力ピンの定義:

```cpp
TArray<FPCGPinProperties> UPCGSplitPointsSettings::OutputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;

    PinProperties.Emplace(
        PCGSplitPointsConstants::OutputALabel,  // "Before Split"
        EPCGDataType::Point,
        /*bAllowMultipleConnections=*/true,
        /*bAllowMultipleData=*/true,
        LOCTEXT("PinATooltip", "The portion of each point before the split plane.")
    );

    PinProperties.Emplace(
        PCGSplitPointsConstants::OutputBLabel,  // "After Split"
        EPCGDataType::Point,
        /*bAllowMultipleConnections=*/true,
        /*bAllowMultipleData=*/true,
        LOCTEXT("PinBTooltip", "The portion of each point after the split plane.")
    );

    return PinProperties;
}
```

### ExecuteInternalメソッド

ノードの主要なロジック:

```cpp
bool FPCGSplitPointsElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGSplitPointsSettings* Settings = Context->GetInputSettings<UPCGSplitPointsSettings>();
    const float SplitPosition = FMath::Clamp(Settings->SplitPosition, 0.0f, 1.0f);

    for (int i = 0; i < Inputs.Num(); ++i)
    {
        // 1. 2つの出力ポイントデータを作成
        UPCGBasePointData* OutPointDataA = FPCGContext::NewPointData_AnyThread(Context);
        UPCGBasePointData* OutPointDataB = FPCGContext::NewPointData_AnyThread(Context);

        // 2. 入力データから初期化
        OutPointDataA->InitializeFromData(InputPointData);
        OutPointDataB->InitializeFromData(InputPointData);

        // 3. 同じ数のポイントを設定
        OutPointDataA->SetNumPoints(InputPointData->GetNumPoints());
        OutPointDataB->SetNumPoints(InputPointData->GetNumPoints());

        // 4. プロパティを割り当て
        OutPointDataA->AllocateProperties(EPCGPointNativeProperties::BoundsMax);
        OutPointDataB->AllocateProperties(EPCGPointNativeProperties::BoundsMin);

        // 5. 各ポイントを処理
        ProcessPoint(InputPointData, OutPointDataA, OutPointDataB);

        // 6. 出力ピンに割り当て
        OutputA.Pin = PCGSplitPointsConstants::OutputALabel;
        OutputB.Pin = PCGSplitPointsConstants::OutputBLabel;
    }

    return true;
}
```

### ポイント分割処理

各ポイントの分割ロジック:

```cpp
auto ProcessPoint = [Settings, SplitPosition, InputPointData, OutPointDataA, OutPointDataB]
    (const int32 StartReadIndex, const int32 StartWriteIndex, const int32 Count)
{
    for (int32 ReadIndex = StartReadIndex; ReadIndex < StartReadIndex + Count; ++ReadIndex)
    {
        // 1. 分割位置を計算
        const FVector SplitterPosition =
            (BoundsMax - BoundsMin) * SplitPosition;
        const FVector MinPlusSplit = BoundsMin + SplitterPosition;

        // 2. 分割軸を決定
        FVector SplitValues = FVector::ZeroVector;
        const int AxisIndex = static_cast<int>(Settings->SplitAxis);
        SplitValues[AxisIndex] = 1.0;

        // 3. Before Split (PointsA) の境界を設定
        // BoundsMaxを分割位置に制限
        OutRangesA.BoundsMaxRange[WriteIndex] =
            OutRangesA.BoundsMaxRange[WriteIndex] +
            SplitValues * (MinPlusSplit - OutRangesA.BoundsMaxRange[WriteIndex]);

        // 4. After Split (PointsB) の境界を設定
        // BoundsMinを分割位置に設定
        OutRangesB.BoundsMinRange[WriteIndex] =
            OutRangesB.BoundsMinRange[WriteIndex] +
            SplitValues * (MinPlusSplit - OutRangesB.BoundsMinRange[WriteIndex]);
    }
};
```

### 境界調整の詳細

分割軸の選択により、調整される境界成分が決まります:

- **X軸分割**: BoundsMax.X (Before Split) と BoundsMin.X (After Split) を調整
- **Y軸分割**: BoundsMax.Y (Before Split) と BoundsMin.Y (After Split) を調整
- **Z軸分割**: BoundsMax.Z (Before Split) と BoundsMin.Z (After Split) を調整

### 非同期処理

```cpp
FPCGAsync::AsyncProcessingOneToOneRangeEx(
    &Context->AsyncState,
    InputPointData->GetNumPoints(),
    /*Initialize=*/[]() {},
    ProcessPoint,
    /*bEnableTimeSlicing=*/false
);
```

## 使用例

### 例1: 水平に半分に分割

建物を上下2層に分割する場合:

```
設定:
- SplitPosition: 0.5
- SplitAxis: Z

結果:
- Before Split: 建物の下半分（地上階）
- After Split: 建物の上半分（2階以上）
- 各部分は元の高さの50%
```

### 例2: 底面25%を分離

基礎部分を分離する場合:

```
設定:
- SplitPosition: 0.25
- SplitAxis: Z

結果:
- Before Split: 底面から25%の部分（基礎）
- After Split: 残りの75%の部分（建物本体）
```

### 例3: 左右に分割

建物を左右に分割する場合:

```
設定:
- SplitPosition: 0.5
- SplitAxis: X

結果:
- Before Split: 建物の左半分
- After Split: 建物の右半分
- 各部分は元の幅の50%
```

### 例4: 前後に不均等分割

前方30%を分離する場合:

```
設定:
- SplitPosition: 0.3
- SplitAxis: Y

結果:
- Before Split: 建物の前方30%
- After Split: 建物の後方70%
```

## パフォーマンス考慮事項

### 計算量

- **時間計算量**: O(N) - Nは入力ポイント数
- **空間計算量**: O(2N) - 各ポイントが2つのポイントに分割される

### メモリ使用量

出力ポイント数 = 入力ポイント数 × 2

各入力セットごとに2つの出力データセットが生成されます。

### 最適化

1. **プロパティ継承**: 空間データの親がある場合、プロパティのコピーを避けます
2. **選択的割り当て**: Before SplitはBoundsMaxのみ、After SplitはBoundsMinのみを新規割り当て
3. **非同期処理**: `FPCGAsync::AsyncProcessingOneToOneRangeEx`を使用

### 推奨事項

- 出力ポイント数が2倍になるため、メモリ使用量に注意してください
- 連続して複数回分割する場合、ポイント数が指数的に増加します
- 不要な分割を避けるため、事前にフィルタリングを検討してください

## 関連ノード

- **Duplicate Point**: ポイントを複製（分割とは異なるアプローチ）
- **Combine Points**: 複数のポイントを1つに結合（逆操作）
- **Difference**: 境界の差分を取る
- **Intersection**: 境界の交差部分を取得

## 注意事項

1. **境界のみ変更**: ポイントのトランスフォーム（位置、回転、スケール）は変更されません
2. **同じポイント数**: 両方の出力は入力と同じ数のポイントを持ちます
3. **メタデータの継承**: 両方の出力ポイントは元のポイントのメタデータを継承します
4. **空間データ**: 空間データの親がある場合、プロパティの継承動作が異なります
5. **境界の重複**: 分割位置で境界が重複する場合があります（例: Before SplitのMaxとAfter SplitのMinが同じ位置）

## 技術仕様

### エレメント特性

- **実行ループモード**: `SinglePrimaryPin` - プライマリピンごとに1回実行
- **ベースポイントデータサポート**: はい - `UPCGBasePointData`のサブクラスをサポート
- **非同期処理**: はい - `FPCGAsync::AsyncProcessingOneToOneRangeEx`を使用

### データフロー

```
入力ポイントデータ → 分割処理 → Before Split出力 (BoundsMax調整)
                       ↓
                   After Split出力 (BoundsMin調整)
```

### 出力ピン定数

```cpp
namespace PCGSplitPointsConstants
{
    const FName OutputALabel = TEXT("Before Split");
    const FName OutputBLabel = TEXT("After Split");
}
```

## 応用例

### 建物の階層分離

複数階建ての建物を各階に分離:

```
1. Split Points (Z, 0.33) → 1階と2-3階
2. Before Split → 1階
3. After Split → Split Points (Z, 0.5) → 2階と3階
4. 再帰的に分割
```

### グリッドセル生成

ポイントを複数のセルに分割:

```
1. Split Points (X, 0.5) → 左右
2. 各出力に Split Points (Y, 0.5) → 前後
3. 各出力に Split Points (Z, 0.5) → 上下
4. 結果: 8つのサブセル
```

### 選択的処理

特定の部分のみを処理:

```
1. Split Points (Z, 0.2) → 底面と上部
2. Before Split → 基礎部分の処理
3. After Split → 建物本体の処理
```
