# Get Attribute From Point Index

## 概要

Get Attribute From Point Indexノードは、指定されたインデックスのポイントから属性またはプロパティの値を取得し、パラメータデータとして出力するノードです。同時に、指定されたインデックスのポイント自体も別の出力ピンから出力されます。

**ノードタイプ**: Metadata
**クラス**: `UPCGAttributeGetFromPointIndexSettings`
**エレメント**: `FPCGAttributeGetFromPointIndexElement`

## 機能詳細

このノードは以下の処理を行います:

1. 入力ポイントデータから指定されたインデックスのポイントを特定
2. そのポイントから指定された属性/プロパティの値を抽出
3. 抽出した値をパラメータデータとして"Attribute"ピンに出力
4. 指定されたインデックスのポイント自体を"Point"ピンに出力

**注意**: 属性/プロパティが存在しない場合でも、ポイント自体は"Point"ピンから出力されます。

## プロパティ

### InputSource (FPCGAttributePropertyInputSelector)
取得する属性またはプロパティを指定します。
- **型**: `FPCGAttributePropertyInputSelector`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **説明**: ポイントのどの属性/プロパティから値を取得するかを選択

### Index (int32)
取得するポイントのインデックスを指定します。
- **型**: `int32`
- **デフォルト値**: `0`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **説明**: 0ベースのインデックス。範囲外の値はエラーになります

### OutputAttributeName (FPCGAttributePropertyOutputSelector)
出力パラメータデータに作成する属性の名前を指定します。
- **型**: `FPCGAttributePropertyOutputSelector`
- **デフォルト値**: `@Source`（新規オブジェクトの場合）
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **メタフラグ**: `PCG_DiscardPropertySelection`, `PCG_DiscardExtraSelection`
- **説明**:
  - `@Source`: 入力属性名と同じ名前を使用
  - カスタム名: 指定した名前で属性を作成

### 非推奨プロパティ

#### InputAttributeName_DEPRECATED (FName) [エディタ専用]
- **型**: `FName`
- **デフォルト値**: `NAME_None`
- **説明**: 旧バージョンとの互換性のためのプロパティ。PostLoadで`InputSource`に移行されます

## 使用例

### 例1: 最初のポイントの高さを取得
```
Point Data (100 points) -> Get Attribute From Point Index
  InputSource = "Height"
  Index = 0
  OutputAttributeName = "@Source"

出力:
  Attribute ピン: ParamData (Height = [最初のポイントのHeight値])
  Point ピン: PointData (1 point - インデックス0のポイント)
```

### 例2: 特定のインデックスのポイントと属性を取得
```
Get Attribute From Point Index:
  InputSource = "Density"
  Index = 50
  OutputAttributeName = "SelectedDensity"

出力:
  Attribute ピン: ParamData (SelectedDensity = [50番目のポイントのDensity値])
  Point ピン: PointData (1 point - インデックス50のポイント)
```

### 例3: カスタムプロパティの取得
```
Get Attribute From Point Index:
  InputSource = "$Transform.Position.Z"  // Transformプロパティの Z座標
  Index = 10
  OutputAttributeName = "ElevationAt10"

出力:
  Attribute ピン: ParamData (ElevationAt10 = [10番目のポイントのZ座標])
  Point ピン: PointData (1 point)
```

## 実装の詳細

### 入力ピン

| ピン名 | 型 | 必須 | 説明 |
|--------|------|------|------|
| In | Point | はい | ポイントデータの入力 |

### 出力ピン

| ピン名 | 型 | 説明 |
|--------|------|------|
| Attribute | Param | 抽出された属性値を含むパラメータデータ |
| Point | Point | 指定されたインデックスのポイント（1ポイント） |

### ExecuteInternal の処理フロー

```cpp
1. 入力設定を取得
2. 各入力ポイントデータについて:
   a. ポイントデータであることを確認
   b. インデックスが範囲内かチェック (0 <= Index < NumPoints)
   c. InputSourceを使用してアクセサーを作成
   d. 指定されたインデックスのポイントから値を取得
   e. 出力パラメータデータを作成
   f. 取得した値で属性を作成
   g. 指定されたインデックスのポイントを含む出力ポイントデータを作成
   h. 両方を出力
3. 処理完了
```

### 属性抽出のテンプレート処理

```cpp
auto ExtractAttribute = [](auto DummyValue) -> bool
{
    using AttributeType = decltype(DummyValue);
    AttributeType Value{};

    // アクセサーから値を取得
    Accessor->Get<AttributeType>(Value, PointKey);

    // パラメータデータに属性を作成
    FPCGMetadataAttribute<AttributeType>* NewAttribute =
        OutputParamData->Metadata->CreateAttribute<AttributeType>(
            OutputAttributeName, Value, /*bAllowInterpolation=*/true);

    // エントリを追加
    OutputParamData->Metadata->AddEntry();

    return true;
};

// 正しい型でコールバックを実行
PCGMetadataAttribute::CallbackWithRightType(
    Accessor->GetUnderlyingType(), ExtractAttribute);
```

### ポイント出力の最適化

```cpp
#if !WITH_EDITOR
    // エディタビルド以外では、接続されている場合のみポイントを出力
    if (Context->Node && Context->Node->IsOutputPinConnected(
        PCGAttributeGetFromPointIndexConstants::OutputPointLabel))
#endif
    {
        // ポイントデータを作成
        UPCGBasePointData* OutputPointData = FPCGContext::NewPointData_AnyThread(Context);

        // メタデータを初期化（空間データは継承しない）
        FPCGInitializeFromDataParams InitializeFromDataParams(PointData);
        InitializeFromDataParams.bInheritSpatialData = false;
        OutputPointData->InitializeFromDataWithParams(InitializeFromDataParams);

        // 1ポイントのみ設定
        OutputPointData->SetNumPoints(1);

        // ポイントデータをコピー
        FConstPCGPointValueRanges InRanges(PointData);
        FPCGPointValueRanges OutRanges(OutputPointData, /*bAllocate=*/false);
        OutRanges.SetFromValueRanges(0, InRanges, Index);

        // 出力
        OutputPoint.Data = OutputPointData;
    }
```

### デフォルト値の設定

```cpp
UPCGAttributeGetFromPointIndexSettings::UPCGAttributeGetFromPointIndexSettings()
{
    // 新しいオブジェクトの場合は @Source
    if (PCGHelpers::IsNewObjectAndNotDefault(this))
    {
        OutputAttributeName.SetAttributeName(PCGMetadataAttributeConstants::SourceAttributeName);
    }
    else
    {
        OutputAttributeName.SetAttributeName(NAME_None);
    }
}
```

### バージョン移行処理

```cpp
void UPCGAttributeGetFromPointIndexSettings::ApplyDeprecation(UPCGNode* InOutNode)
{
    if (DataVersion < FPCGCustomVersion::UpdateAttributePropertyInputSelector
        && (OutputAttributeName.GetName() == NAME_None))
    {
        // 以前の動作: None => SameName
        OutputAttributeName.SetAttributeName(PCGMetadataAttributeConstants::SourceNameAttributeName);
    }

    Super::ApplyDeprecation(InOutNode);
}

void UPCGAttributeGetFromPointIndexSettings::PostLoad()
{
    Super::PostLoad();

#if WITH_EDITOR
    // 非推奨プロパティからの移行
    if (InputAttributeName_DEPRECATED != NAME_None)
    {
        InputSource.SetAttributeName(InputAttributeName_DEPRECATED);
        InputAttributeName_DEPRECATED = NAME_None;
    }
#endif
}
```

### エラーハンドリング

| エラー条件 | メッセージ | 動作 |
|-----------|----------|------|
| 入力がポイントデータでない | "Input {InputIndex} is not a point data" | その入力をスキップ |
| インデックスが範囲外 | "Index for input {InputIndex} is out of bounds. Index: {Index}; Number of Points: {NumPoints}" | その入力をスキップ |
| 属性/プロパティが見つからない | "Cannot find attribute/property '{AttributeName}' in input {InputIndex}" | 属性出力はスキップ、ポイント出力は実行 |
| 属性作成失敗 | "Error while creating target attribute '{AttributeName}' for output {InputIndex}" | その入力をスキップ |

### ループモード

```cpp
virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override
{
    return EPCGElementExecutionLoopMode::SinglePrimaryPin;
}
```

各入力ポイントデータを個別に処理します。

### ベースポイントデータのサポート

```cpp
virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override { return true; }
```

UPCGBasePointDataおよびその派生クラス（ポイント、ポリライン、サーフェスなど）をサポートします。

## 使用上の注意

1. **インデックスの範囲**: インデックスは0ベースで、`0 <= Index < ポイント数`の範囲内である必要があります
2. **属性が存在しない場合**: 属性が見つからなくても、ポイント出力は実行されます
3. **ポイント出力の最適化**: 非エディタビルドでは、Pointピンが接続されていない場合、ポイント出力をスキップします
4. **OutputAttributeName設定**:
   - `@Source`: 入力属性名をそのまま使用
   - カスタム名: 指定した名前で新しい属性を作成
5. **プロパティパスのサポート**: `$Transform.Position.Z`のような深いプロパティパスもサポート

## パフォーマンス考慮事項

1. **単一ポイント取得**: 1つのインデックスのみを処理するため、非常に高速
2. **アクセサーの使用**: 効率的な属性アクセスのためにアクセサーシステムを使用
3. **ポイント出力の条件付き作成**: 接続されていない出力は作成しない（非エディタビルド）
4. **メモリ効率**: 出力ポイントデータは常に1ポイントのみ

## 関連ノード

- **Get Points Count**: ポイント数を取得（インデックスの範囲確認に有用）
- **Attribute Filter**: 条件に基づいてポイントをフィルタリング
- **Point Match And Set**: 複数ポイント間での属性マッチング
- **Copy Attributes**: 属性のコピー

## 応用例

### 例: 特定インデックスの値を全ポイントに適用
```
ポイントデータ -> Get Attribute From Point Index (Index=0) -> Copy Attributes
                                                                    ↑
                                                              元のポイントデータ
```

### 例: 先頭と末尾のポイントの比較
```
ポイントデータ -> Get Attribute From Point Index (Index=0) -> 比較処理
              -> Get Attribute From Point Index (Index=LastIndex) ↗
```
