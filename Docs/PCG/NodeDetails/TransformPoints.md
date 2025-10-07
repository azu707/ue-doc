# Transform Points

## 概要

Transform Pointsノードは、ポイントのトランスフォーム（位置、回転、スケール）にランダムまたは固定のオフセットを適用するノードです。ポイント自体のトランスフォームまたは属性のトランスフォーム値を変更でき、多様性のある配置や手続き的な変形に使用できます。

**カテゴリ**: Point Ops
**クラス**: `UPCGTransformPointsSettings`
**エレメント**: `FPCGTransformPointsElement`

## 機能詳細

このノードは、以下の2つのモードで動作します:

1. **ポイントトランスフォームモード** (`bApplyToAttribute = false`): ポイント自体のトランスフォームを変更
2. **属性モード** (`bApplyToAttribute = true`): メタデータ属性のトランスフォーム値を変更

各トランスフォーム成分（位置、回転、スケール）について、最小値と最大値の範囲を指定でき、ランダムな値が生成されます。また、絶対値として適用するか、相対値として適用するかを選択できます。

## プロパティ

### bApplyToAttribute

- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

トランスフォームを属性に適用するかどうかを制御します。

- `false`: ポイント自体のトランスフォームを変更（デフォルト）
- `true`: 指定された属性のトランスフォーム値を変更

### AttributeName

- **型**: `FName`
- **デフォルト値**: `NAME_None`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **編集条件**: `bApplyToAttribute`

変更する属性の名前を指定します。`bApplyToAttribute`が`true`の場合に使用されます。

- `NAME_None`: 最新の属性を使用
- その他: 指定された名前の属性を使用

注意: 属性はTransform型である必要があります。

### OffsetMin / OffsetMax

- **型**: `FVector`
- **デフォルト値**: `FVector::Zero()` (0, 0, 0)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

位置オフセットの最小値と最大値を指定します。各ポイントについて、この範囲内でランダムなオフセットが生成されます。

例:
- `OffsetMin = (0, 0, 0)`, `OffsetMax = (100, 100, 0)`: XY平面上で最大100ユニットのランダムオフセット
- `OffsetMin = (-50, -50, -50)`, `OffsetMax = (50, 50, 50)`: 全軸で±50ユニットのランダムオフセット

### bAbsoluteOffset

- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

オフセットをワールド空間で適用するかどうかを制御します。

- `false`: オフセットをローカル空間（ポイントの回転に対して相対的）で適用（デフォルト）
- `true`: オフセットをワールド空間（絶対座標）で適用

### RotationMin / RotationMax

- **型**: `FRotator`
- **デフォルト値**: `FRotator::ZeroRotator` (0, 0, 0)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

回転オフセットの最小値と最大値を指定します。各ポイントについて、この範囲内でランダムな回転が生成されます。

注意: FRotatorの成分は以下の通り:
- `Pitch`: X軸周りの回転
- `Yaw`: Z軸周りの回転
- `Roll`: Y軸周りの回転

例:
- `RotationMin = (0, 0, 0)`, `RotationMax = (0, 360, 0)`: Z軸周りにランダムな回転
- `RotationMin = (-10, -10, -10)`, `RotationMax = (10, 10, 10)`: 全軸で±10度のランダムな傾き

### bAbsoluteRotation

- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

回転を絶対値として設定するか、相対値として適用するかを制御します。

- `false`: 回転を現在の回転に加算（相対回転）（デフォルト）
- `true`: 回転を絶対値として設定（現在の回転を置き換え）

### ScaleMin / ScaleMax

- **型**: `FVector`
- **デフォルト値**: `FVector::One()` (1, 1, 1)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **メタ**: AllowPreserveRatio

スケール乗数の最小値と最大値を指定します。各ポイントについて、この範囲内でランダムなスケールが生成されます。

例:
- `ScaleMin = (0.8, 0.8, 0.8)`, `ScaleMax = (1.2, 1.2, 1.2)`: 80%から120%のランダムなスケール
- `ScaleMin = (1, 1, 0.5)`, `ScaleMax = (1, 1, 2)`: Z軸のみ50%から200%にスケール

### bAbsoluteScale

- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

スケールを絶対値として設定するか、乗算値として適用するかを制御します。

- `false`: スケールを現在のスケールに乗算（相対スケール）（デフォルト）
- `true`: スケールを絶対値として設定（現在のスケールを置き換え）

### bUniformScale

- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

各軸で均一にスケールするかどうかを制御します。

- `true`: ScaleMinとScaleMaxのX成分のみを使用し、全軸に適用（デフォルト）
- `false`: 各軸で独立したスケール値を使用

### bRecomputeSeed

- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **編集条件**: `!bApplyToAttribute`

各ポイントの新しい位置からシードを再計算するかどうかを制御します。

- `false`: シードを変更しない（デフォルト）
- `true`: 新しい位置からシードを再計算

注意: `bApplyToAttribute`が`true`の場合、この設定は無視されます。

## ピン設定

### 入力ピン

- **名前**: In (デフォルト入力ピン)
- **型**: Spatial Data（Point Dataに変換される）
- **説明**: トランスフォームを変更するポイントデータ

### 出力ピン

- **名前**: Out (デフォルト出力ピン)
- **型**: Point Data
- **説明**: トランスフォームが変更されたポイントデータ

## 実装の詳細

### ExecuteInternalメソッド

ノードの主要なロジックは、各ポイントに対してランダムなトランスフォームを生成し、適用します:

```cpp
bool FPCGTransformPointsElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGTransformPointsSettings* Settings = Context->GetInputSettings<UPCGTransformPointsSettings>();
    const int Seed = Context->GetSeed();

    // 各入力データを処理
    for (const FPCGTaggedData& Input : Inputs)
    {
        // Spatial DataをPoint Dataに変換
        const UPCGSpatialData* SpatialData = Cast<UPCGSpatialData>(Input.Data);
        const UPCGBasePointData* PointData = SpatialData->ToBasePointData(Context);

        // 属性モードの場合、属性を検証
        if (bApplyToAttribute)
        {
            // Transform型属性の存在を確認
        }

        // 出力データを作成
        UPCGBasePointData* OutputData = FPCGContext::NewPointData_AnyThread(Context);
        OutputData->InitializeFromData(PointData);
        OutputData->SetNumPoints(PointData->GetNumPoints());

        // 各ポイントを処理
        ProcessPoints(PointData, OutputData);
    }

    return true;
}
```

### ポイント処理ループ

各ポイントに対するトランスフォーム生成と適用:

```cpp
auto ProcessRangeFunc = [&](int32 StartReadIndex, int32 StartWriteIndex, int32 Count)
{
    for (int32 ReadIndex = StartReadIndex; ReadIndex < StartReadIndex + Count; ++ReadIndex)
    {
        // 1. ランダムソースを初期化
        FRandomStream RandomSource(PCGHelpers::ComputeSeed(Seed, ReadSeedRange[ReadIndex]));

        // 2. ランダムなオフセットを生成
        const float OffsetX = RandomSource.FRandRange(OffsetMin.X, OffsetMax.X);
        const float OffsetY = RandomSource.FRandRange(OffsetMin.Y, OffsetMax.Y);
        const float OffsetZ = RandomSource.FRandRange(OffsetMin.Z, OffsetMax.Z);
        const FVector RandomOffset(OffsetX, OffsetY, OffsetZ);

        // 3. ランダムな回転を生成
        const float RotationX = RandomSource.FRandRange(RotationMin.Pitch, RotationMax.Pitch);
        const float RotationY = RandomSource.FRandRange(RotationMin.Yaw, RotationMax.Yaw);
        const float RotationZ = RandomSource.FRandRange(RotationMin.Roll, RotationMax.Roll);
        const FQuat RandomRotation(FRotator(RotationX, RotationY, RotationZ).Quaternion());

        // 4. ランダムなスケールを生成
        FVector RandomScale;
        if (bUniformScale)
        {
            RandomScale = FVector(RandomSource.FRandRange(ScaleMin.X, ScaleMax.X));
        }
        else
        {
            RandomScale.X = RandomSource.FRandRange(ScaleMin.X, ScaleMax.X);
            RandomScale.Y = RandomSource.FRandRange(ScaleMin.Y, ScaleMax.Y);
            RandomScale.Z = RandomSource.FRandRange(ScaleMin.Z, ScaleMax.Z);
        }

        // 5. ソーストランスフォームを取得
        FTransform SourceTransform = bApplyToAttribute
            ? SourceAttribute->GetValueFromItemKey(ReadMetadataEntryRange[ReadIndex])
            : ReadTransformRange[ReadIndex];

        // 6. トランスフォームを適用
        FTransform FinalTransform = ApplyTransform(SourceTransform, RandomOffset, RandomRotation, RandomScale);

        // 7. 結果を保存
        if (!bApplyToAttribute)
        {
            WriteTransformRange[WriteIndex] = FinalTransform;
            if (bRecomputeSeed)
            {
                WriteSeedRange[WriteIndex] = PCGHelpers::ComputeSeedFromPosition(FinalTransform.GetLocation());
            }
        }
        else
        {
            TargetAttribute->SetValue(WriteMetadataEntryRange[WriteIndex], FinalTransform);
        }
    }
};
```

### トランスフォーム適用ロジック

```cpp
FTransform ApplyTransform(const FTransform& Source, const FVector& Offset, const FQuat& Rotation, const FVector& Scale)
{
    FTransform Result = Source;

    // 位置の適用
    if (bAbsoluteOffset)
    {
        Result.SetLocation(Source.GetLocation() + Offset);
    }
    else
    {
        // ローカル空間（回転された空間）でオフセットを適用
        const FTransform RotatedTransform(Source.GetRotation());
        Result.SetLocation(Source.GetLocation() + RotatedTransform.TransformPosition(Offset));
    }

    // 回転の適用
    if (bAbsoluteRotation)
    {
        Result.SetRotation(Rotation);
    }
    else
    {
        Result.SetRotation(Source.GetRotation() * Rotation);
    }

    // スケールの適用
    if (bAbsoluteScale)
    {
        Result.SetScale3D(Scale);
    }
    else
    {
        Result.SetScale3D(Source.GetScale3D() * Scale);
    }

    return Result;
}
```

### 非同期処理

```cpp
FPCGAsync::AsyncProcessingOneToOneRangeEx(
    &Context->AsyncState,
    PointData->GetNumPoints(),
    /*InitializeFunc=*/[](){},
    ProcessRangeFunc,
    /*bTimeSliceEnabled=*/false
);
```

## 使用例

### 例1: ランダムな位置オフセット

植物をランダムに配置する場合:

```
設定:
- bApplyToAttribute: false
- OffsetMin: (-50, -50, 0)
- OffsetMax: (50, 50, 0)
- bAbsoluteOffset: false
- 他はデフォルト

結果:
- 各ポイントがローカルXY平面上で±50ユニットランダムにオフセット
- Z軸（高さ）は変更なし
```

### 例2: ランダムな回転

岩をランダムに回転させる場合:

```
設定:
- bApplyToAttribute: false
- RotationMin: (0, 0, 0)
- RotationMax: (0, 360, 0)
- bAbsoluteRotation: false
- 他はデフォルト

結果:
- 各ポイントがZ軸周りに0-360度ランダムに回転
- 自然な配置を実現
```

### 例3: ランダムなスケール変化

樹木のサイズをランダムにする場合:

```
設定:
- bApplyToAttribute: false
- ScaleMin: (0.7, 0.7, 0.7)
- ScaleMax: (1.3, 1.3, 1.3)
- bUniformScale: true
- bAbsoluteScale: false
- 他はデフォルト

結果:
- 各ポイントが70%から130%の範囲でランダムにスケール
- 均一スケールなので縦横比を維持
```

### 例4: 高さ方向のみスケール

建物の高さをランダムにする場合:

```
設定:
- bApplyToAttribute: false
- ScaleMin: (1, 1, 0.8)
- ScaleMax: (1, 1, 1.5)
- bUniformScale: false
- bAbsoluteScale: false
- 他はデフォルト

結果:
- XY軸は変更なし（スケール1.0）
- Z軸のみ80%から150%にランダムスケール
- 幅は同じで高さが異なる建物
```

### 例5: 絶対位置の設定

特定の高さに配置する場合:

```
設定:
- bApplyToAttribute: false
- OffsetMin: (0, 0, 100)
- OffsetMax: (0, 0, 100)
- bAbsoluteOffset: true
- 他はデフォルト

結果:
- すべてのポイントがZ=100の位置に移動
- XY座標はそのまま
```

### 例6: 属性のトランスフォーム変更

メタデータ属性のトランスフォームを変更する場合:

```
設定:
- bApplyToAttribute: true
- AttributeName: "CustomTransform"
- OffsetMin: (0, 0, 0)
- OffsetMax: (10, 10, 10)
- 他はデフォルト

結果:
- "CustomTransform"属性の値が変更される
- ポイント自体のトランスフォームは変更されない
```

### 例7: ランダムな傾き

岩や倒木に傾きを付ける場合:

```
設定:
- bApplyToAttribute: false
- RotationMin: (-15, 0, 0)
- RotationMax: (15, 360, 0)
- bAbsoluteRotation: false
- 他はデフォルト

結果:
- Pitch（X軸回転）: ±15度のランダムな傾き
- Yaw（Z軸回転）: 0-360度のランダムな向き
- Roll（Y軸回転）: 変更なし
```

### 例8: 完全なランダム化

完全にランダムな配置とスケール:

```
設定:
- bApplyToAttribute: false
- OffsetMin: (-100, -100, 0)
- OffsetMax: (100, 100, 50)
- RotationMin: (-10, 0, -5)
- RotationMax: (10, 360, 5)
- ScaleMin: (0.5, 0.5, 0.5)
- ScaleMax: (1.5, 1.5, 1.5)
- bUniformScale: true
- bRecomputeSeed: true

結果:
- 位置: XY±100、Z 0-50のランダムオフセット
- 回転: Pitch±10度、Yaw 0-360度、Roll±5度
- スケール: 50%-150%のランダムスケール
- シード: 新しい位置から再計算
```

## パフォーマンス考慮事項

### 計算量

- **時間計算量**: O(N) - Nは入力ポイント数
- **空間計算量**: O(N) - 出力ポイント数は入力と同じ

### ランダム生成

- 各ポイントに対して`FRandomStream`が初期化されます
- ポイントのシードとコンテキストのシードを組み合わせて決定論的なランダム値を生成
- 同じ入力とシードで常に同じ結果が得られます

### 最適化

1. **非同期処理**: `FPCGAsync::AsyncProcessingOneToOneRangeEx`を使用
2. **プロパティ割り当て**: 必要なプロパティのみを割り当て
3. **条件分岐**: 属性モードとポイントモードで処理を分岐
4. **メタデータ遅延エントリ**: 属性モードでメタデータの効率的な処理

### 推奨事項

- 大量のポイントを処理する場合でも、パフォーマンスは良好です
- 属性モードは、ポイントのトランスフォームを保持したい場合に有効
- シードの再計算は追加コストがありますが、通常は無視できる程度

## 関連ノード

- **Duplicate Point**: ポイントを複製してトランスフォームオフセットを適用
- **Projection**: ポイントを表面に投影
- **Extents Modifier**: ポイントの範囲を変更
- **Reset Point Center**: ポイントの中心位置を調整

## 注意事項

1. **ランダム値の決定性**: 同じシードで常に同じ結果が得られます
2. **範囲の指定**: MinとMaxが同じ場合、固定値として適用されます
3. **属性型の検証**: 属性モードでは、指定された属性がTransform型である必要があります
4. **空間データの変換**: 入力はSpatial Dataですが、内部的にPoint Dataに変換されます
5. **シードの使用**: `UseSeed() = true`により、このノードはシードシステムを使用します

## 技術仕様

### エレメント特性

- **実行ループモード**: `SinglePrimaryPin` - プライマリピンごとに1回実行
- **ベースポイントデータサポート**: はい - `UPCGBasePointData`のサブクラスをサポート
- **シードの使用**: はい - ランダム値生成にシードを使用
- **非同期処理**: はい - `FPCGAsync::AsyncProcessingOneToOneRangeEx`を使用

### データフロー

```
入力Spatial Data → Point Data変換 → ランダム値生成 → トランスフォーム適用 → 出力Point Data
                                      ↓
                         ポイントモード / 属性モード
                                      ↓
                       Transform / MetadataEntry更新
                                      ↓
                            オプション: Seed再計算
```

### ランダム値生成の詳細

```cpp
FRandomStream RandomSource(PCGHelpers::ComputeSeed(ContextSeed, PointSeed));
// ↓
各成分について FRandRange(Min, Max) を呼び出し
// ↓
決定論的だが擬似ランダムな値を生成
```

## 高度な使用例

### プロシージャル森林生成

```
1. Points Grid → グリッド状にポイント生成
2. Transform Points → 位置ランダム化（OffsetMin/Max）
3. Transform Points → 回転ランダム化（RotationMin/Max）
4. Transform Points → スケールランダム化（ScaleMin/Max）
5. Static Mesh Spawner → 樹木メッシュ配置
```

### 建物の多様性

```
1. Get Actor Data → 建物の配置ポイント取得
2. Transform Points → 高さランダム化（ScaleMin/Max、Z軸のみ）
3. Transform Points → 回転ランダム化（Yaw 0-360）
4. Static Mesh Spawner → 建物メッシュ配置
```
