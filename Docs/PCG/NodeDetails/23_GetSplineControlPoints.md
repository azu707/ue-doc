# Get Spline Control Points

## 概要

Get Spline Control Pointsノードは、スプラインデータから制御点を抽出し、ポイントデータとして出力するノードです。スプラインの各制御点の位置、タンジェント情報、およびメタデータを取得できます。これにより、スプラインの制御点に基づいた配置や処理が可能になります。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetSplineControlPointsSettings`
**エレメント**: `FPCGGetSplineControlPointsElement`

## 機能詳細

このノードは、入力されたスプライン（ポリラインデータ）から以下の情報を抽出します:

1. **制御点の位置とトランスフォーム**: 各制御点のワールド空間での位置、回転、スケール
2. **タンジェント情報**: 各制御点の到着タンジェント（Arrive Tangent）と出発タンジェント（Leave Tangent）
3. **メタデータ**: 元のスプラインデータに関連付けられたメタデータエントリ
4. **シード値**: 各ポイントに対して位置ベースのシード値を自動生成

クローズドスプラインとオープンスプラインの両方をサポートし、適切なポイント数を計算します。

## プロパティ

### ArriveTangentAttributeName (FName)
到着タンジェントを格納する属性の名前を指定します。
- **型**: `FName`
- **デフォルト値**: `PCGSplineSamplerConstants::ArriveTangentAttributeName`（通常は"ArriveTangent"）
- **カテゴリ**: Settings
- **編集可能**: はい

### LeaveTangentAttributeName (FName)
出発タンジェントを格納する属性の名前を指定します。
- **型**: `FName`
- **デフォルト値**: `PCGSplineSamplerConstants::LeaveTangentAttributeName`（通常は"LeaveTangent"）
- **カテゴリ**: Settings
- **編集可能**: はい

## 使用例

### 例1: スプラインの制御点に沿ってオブジェクトを配置
```
Get Spline Data -> Get Spline Control Points -> Static Mesh Spawner
→ 各制御点にメッシュが配置される
```

### 例2: カスタム属性名でタンジェント情報を取得
```
Get Spline Control Points:
  ArriveTangentAttributeName = "IncomingTangent"
  LeaveTangentAttributeName = "OutgoingTangent"

→ タンジェント情報がカスタム名で属性に格納される
```

### 例3: 制御点の間隔を分析
```
Get Spline Control Points -> Attribute Math (距離計算) -> 制御点間の距離を算出
```

## 実装の詳細

### 入力ピン
- **In (PolyLine)**: スプライン（ポリライン）データ
  - **型**: `EPCGDataType::PolyLine`
  - **必須**: はい
  - **複数接続**: 可能
  - **複数データ**: 可能

### 出力ピン
- **Out (Point)**: 制御点から生成されたポイントデータ
  - **型**: `EPCGDataType::Point`
  - **複数接続**: 可能
  - **複数データ**: 可能（各入力スプラインごとに個別のポイントデータ）

### 出力ポイントデータの構造

各出力ポイントには以下のプロパティが含まれます:

#### ネイティブプロパティ
| プロパティ | 型 | 説明 |
|------------|------|------|
| Transform | FTransform | 制御点のワールド変換 |
| Seed | int32 | 位置ベースで生成されたシード値 |
| Density | float | 常に1.0 |
| Steepness | float | 常に1.0 |
| MetadataEntry | PCGMetadataEntryKey | 元のスプラインのメタデータエントリキー |

#### 属性
| 属性名 | 型 | 説明 | 補間可能 |
|--------|------|------|----------|
| ArriveTangent | FVector | 制御点への到着タンジェント | はい |
| LeaveTangent | FVector | 制御点からの出発タンジェント | はい |

### ExecuteInternal の処理フロー

```cpp
bool FPCGGetSplineControlPointsElement::ExecuteInternal(FPCGContext* InContext) const
{
    // 1. 設定を取得
    const UPCGGetSplineControlPointsSettings* Settings = InContext->GetInputSettings<...>();

    // 2. 各入力ポリラインデータを処理
    for (const FPCGTaggedData& Input : InContext->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel))
    {
        const UPCGPolyLineData* PolylineData = Cast<const UPCGPolyLineData>(Input.Data);
        if (!PolylineData) continue;

        // 3. ポイント数を計算（クローズドかオープンかで異なる）
        const bool bIsClosed = PolylineData->IsClosed();
        const int32 NumPoints = bIsClosed ? PolylineData->GetNumSegments()
                                          : (PolylineData->GetNumSegments() + 1);

        // 4. 新しいポイントデータを作成
        UPCGBasePointData* PointData = FPCGContext::NewPointData_AnyThread(InContext);

        // 5. 元のデータからメタデータを初期化
        FPCGInitializeFromDataParams Params(PolylineData);
        PointData->InitializeFromDataWithParams(Params);

        // 6. ポイント配列を確保
        PointData->SetNumPoints(NumPoints);
        PointData->AllocateProperties(EPCGPointNativeProperties::Transform |
                                      EPCGPointNativeProperties::Seed |
                                      EPCGPointNativeProperties::MetadataEntry);

        // 7. デフォルト値を設定
        PointData->SetDensity(1.0f);
        PointData->SetSteepness(1.0f);

        // 8. タンジェント属性を作成
        FPCGMetadataAttribute<FVector>* LeaveTangentAttribute =
            CreateAttribute(Settings->LeaveTangentAttributeName, FVector::ZeroVector);
        FPCGMetadataAttribute<FVector>* ArriveTangentAttribute =
            CreateAttribute(Settings->ArriveTangentAttributeName, FVector::ZeroVector);

        // 9. 各制御点を処理
        for (int32 i = 0; i < NumPoints; ++i)
        {
            // トランスフォームを取得
            PointTransforms[i] = PolylineData->GetTransformAtDistance(i, 0);

            // シード値を計算
            PointSeeds[i] = PCGHelpers::ComputeSeedFromPosition(PointTransforms[i].GetLocation());

            // メタデータエントリを設定
            PointMetadataEntries[i] = MetadataEntries.IsValidIndex(i) ? MetadataEntries[i] : PCGInvalidEntryKey;

            // タンジェントを取得して設定
            FVector LeaveTangent, ArriveTangent;
            PolylineData->GetTangentsAtSegmentStart(i, ArriveTangent, LeaveTangent);

            if (LeaveTangentAttribute)
                LeaveTangentAttribute->SetValue(PointMetadataEntries[i], LeaveTangent);
            if (ArriveTangentAttribute)
                ArriveTangentAttribute->SetValue(PointMetadataEntries[i], ArriveTangent);
        }

        // 10. 出力データを追加
        InContext->OutputData.TaggedData.Emplace_GetRef(Input).Data = PointData;
    }

    return true;
}
```

### ポイント数の計算

スプラインがクローズドかオープンかによって、ポイント数が異なります:

```cpp
// オープンスプライン: セグメント数 + 1
//   例: 3セグメント = 4ポイント (始点 + 3つの終点)
//
//   P0 ---S0--- P1 ---S1--- P2 ---S2--- P3

// クローズドスプライン: セグメント数と同じ
//   例: 4セグメント = 4ポイント
//
//   P0 ---S0--- P1
//    |           |
//   S3          S1
//    |           |
//   P3 ---S2--- P2

const int32 NumPoints = bIsClosed ? PolylineData->GetNumSegments()
                                  : (PolylineData->GetNumSegments() + 1);
```

### タンジェントの取得

```cpp
// セグメント開始位置でのタンジェントを取得
// ArriveTangent: このポイントに到着する方向
// LeaveTangent: このポイントから出発する方向
void GetTangentsAtSegmentStart(int32 SegmentIndex, FVector& ArriveTangent, FVector& LeaveTangent);
```

### シード値の生成

```cpp
// 位置ベースでシード値を計算（再現性のある乱数生成用）
int32 Seed = PCGHelpers::ComputeSeedFromPosition(Transform.GetLocation());
```

これにより、同じ位置の制御点は常に同じシード値を持ちます。

### メタデータの継承

```cpp
FPCGInitializeFromDataParams Params(PolylineData);
PointData->InitializeFromDataWithParams(Params);
```

元のスプラインデータのメタデータ構造を継承し、スプラインに設定された属性が制御点にも引き継がれます。

### 属性作成のエラーハンドリング

```cpp
auto CreateAndValidateAttribute = [InContext, ElementsMetadataDomain]<typename T>(
    const FName AttributeName, T DefaultValue) -> FPCGMetadataAttribute<T>*
{
    FPCGMetadataAttribute<T>* Attribute = ElementsMetadataDomain->FindOrCreateAttribute<T>(
        AttributeName, DefaultValue,
        /*bAllowInterpolation=*/true,
        /*bOverrideParent=*/true);

    if (!Attribute)
    {
        PCGLog::Metadata::LogFailToCreateAttributeError<T>(AttributeName, InContext);
    }

    return Attribute;
};
```

属性の作成に失敗した場合、エラーログが記録されますが、処理は継続されます（他の属性は正常に作成される可能性があるため）。

### パフォーマンス考慮事項

1. **制御点数**: 制御点が少ないスプラインは高速に処理されます
2. **タンジェント計算**: 各制御点でタンジェントを計算する必要があります
3. **メモリ使用**: 各入力スプラインごとに新しいポイントデータが作成されます
4. **スレッドセーフ**: `NewPointData_AnyThread`を使用して任意のスレッドで実行可能

### 使用シナリオ

#### 1. 制御点への正確な配置
```
Get Spline Data -> Get Spline Control Points -> Static Mesh Spawner
→ スプラインの制御点にのみメッシュを配置（補間された位置ではなく）
```

#### 2. スプライン編集のデバッグ
```
Get Spline Control Points -> Debug Point (タンジェント情報を表示)
→ 制御点の位置とタンジェントを視覚化
```

#### 3. 制御点ベースの処理
```
Get Spline Control Points -> Attribute Filter (条件で制御点を選択) -> 特定の制御点のみ処理
```

#### 4. カスタムスプライン処理
```
Get Spline Control Points -> Blueprint (タンジェント情報を使用したカスタム処理)
```

## 注意事項

1. **制御点のみ**: このノードは制御点のみを抽出します。スプライン全体に沿ってポイントをサンプリングする場合は、Spline Samplerノードを使用してください。

2. **タンジェント属性**: タンジェント属性は、スプラインの形状を制御するために重要ですが、すべてのユースケースで必要とは限りません。

3. **クローズド vs オープン**: クローズドスプラインとオープンスプラインでポイント数が異なることに注意してください。

4. **メタデータエントリ**: 元のスプラインデータにメタデータエントリが設定されていない場合、`PCGInvalidEntryKey`が使用されます。

## 関連ノード
- Get Spline Data (スプラインデータの取得)
- Spline Sampler (スプライン全体のサンプリング)
- Create Spline (ポイントからスプラインを作成)
- Spline Direction (スプライン方向の計算)
