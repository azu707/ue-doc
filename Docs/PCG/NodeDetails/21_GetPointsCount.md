# Get Points Count

## 概要

Get Points Countノードは、入力されたポイントデータ内のポイント数を取得し、その数値を属性として含むパラメータデータを出力するノードです。このノードは、ポイント数に基づいた条件分岐や計算を行う際に使用します。

**ノードタイプ**: Spatial
**クラス**: `UPCGNumberOfPointsSettings`
**エレメント**: `FPCGNumberOfPointsElement`
**基底クラス**: `UPCGNumberOfElementsBaseSettings`

## 機能詳細

Get Points Countノードは、以下の処理を行います:

1. 入力された各ポイントデータのポイント数を取得
2. 新しいパラメータデータを作成
3. 指定された属性名でポイント数を格納
4. 複数の入力がある場合、それぞれの入力に対してエントリを作成

このノードは、ポイント数を動的に取得してグラフの動作を制御する際に便利です。例えば:
- ポイント数が閾値を超えた場合の処理分岐
- ポイント数に基づいたスケーリング
- デバッグ情報としてのポイント数の確認

## プロパティ

### OutputAttributeName (FName)
ポイント数を格納する出力属性の名前を指定します。
- **型**: `FName`
- **デフォルト値**: `"NumEntries"`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

## 使用例

### 例1: ポイント数を取得して条件分岐
```
Surface Sampler -> Get Points Count -> Attribute Filter (NumEntries > 1000) -> 分岐処理
```

### 例2: カスタム属性名で出力
```
Get Points Count:
  OutputAttributeName = "TotalPoints"
```
出力: パラメータデータに"TotalPoints"属性が作成され、ポイント数が格納される

### 例3: 複数のポイントデータのポイント数を取得
```
入力1: 500ポイント
入力2: 1000ポイント
入力3: 750ポイント

出力: パラメータデータ（3エントリ）
  エントリ0: NumEntries = 500
  エントリ1: NumEntries = 1000
  エントリ2: NumEntries = 750
```

## 実装の詳細

### 入力ピン
- **In (Point)**: ポイントデータの入力
  - **型**: `EPCGDataType::Point`（DefaultPointInputPinProperties使用）
  - **複数接続**: 可能
  - **複数データ**: 可能

### 出力ピン
- **Out (Param)**: ポイント数を含むパラメータデータ
  - **型**: `EPCGDataType::Param`
  - **複数接続**: 可能
  - **複数データ**: 不可（すべての入力のエントリを含む単一のパラメータデータ）

### 出力属性

| 属性名 | 型 | 説明 | デフォルト値 | 補間可能 |
|--------|------|------|--------------|----------|
| NumEntries (またはカスタム名) | int32 | ポイント数 | 0 | はい |

### ExecuteInternal の処理フロー

```cpp
template <typename DataType>
bool FPCGNumberOfElementsBaseElement<DataType>::ExecuteInternal(FPCGContext* Context) const
{
    // 1. 設定を取得
    const UPCGNumberOfElementsBaseSettings* Settings = Context->GetInputSettings<...>();

    // 2. 入力データを取得
    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    UPCGParamData* OutputParamData = nullptr;
    FPCGMetadataAttribute<int32>* NewAttribute = nullptr;

    // 3. 各入力を処理
    for (int32 i = 0; i < Inputs.Num(); ++i)
    {
        const DataType* InputData = Cast<DataType>(Inputs[i].Data);

        if (!InputData)
        {
            // エラー: 正しい入力タイプではない
            continue;
        }

        // 4. 最初の入力時にパラメータデータと属性を作成
        if (!OutputParamData)
        {
            OutputParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
            NewAttribute = OutputParamData->Metadata->CreateAttribute<int32>(
                Settings->OutputAttributeName, 0,
                /*bAllowInterpolation=*/true,
                /*bOverrideParent=*/false);
        }

        // 5. 新しいエントリを追加してポイント数を設定
        NewAttribute->SetValue(
            OutputParamData->Metadata->AddEntry(),
            GetNum(InputData)
        );
    }

    // 6. 出力データを設定
    if (OutputParamData)
    {
        FPCGTaggedData& Output = Context->OutputData.TaggedData.Emplace_GetRef();
        Output.Data = OutputParamData;
        Output.Pin = PCGPinConstants::DefaultOutputLabel;
    }

    return true;
}
```

### GetNum の実装

```cpp
int32 FPCGNumberOfPointsElement::GetNum(const UPCGBasePointData* InData) const
{
    return InData ? InData->GetNumPoints() : 0;
}
```

### テンプレート設計

このノードは、テンプレート基底クラス`FPCGNumberOfElementsBaseElement<DataType>`を使用しています:

```cpp
template <typename DataType>
class FPCGNumberOfElementsBaseElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override { return true; }

    virtual int32 GetNum(const DataType* InData) const = 0;
};
```

この設計により、ポイント数とエントリ数の両方のノードで共通のロジックを共有できます。

### エラーハンドリング

1. **型チェック**: 入力データが正しい型でない場合、エラーログを出力してスキップ
   ```cpp
   PCGE_LOG(Error, GraphAndLog,
       FText::Format(LOCTEXT("InputNotRightType", "Input {0} is not of the right input type, discarded"),
       FText::AsNumber(i)));
   ```

2. **属性作成失敗**: 属性の作成に失敗した場合、エラーログを出力して終了
   ```cpp
   PCGE_LOG(Error, GraphAndLog,
       FText::Format(LOCTEXT("AttributeFailedToBeCreated", "New Attribute {0} failed to be created."),
       FText::FromName(Settings->OutputAttributeName)));
   ```

### ベースポイントデータのサポート

```cpp
virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override { return true; }
```

このノードは、基底ポイントデータ（UPCGBasePointData）およびその派生クラスをサポートします:
- UPCGPointData
- UPCGPolyLineData
- UPCGSurfaceData
- など

### 出力データ構造

```cpp
UPCGParamData
{
    Metadata
    {
        Attribute: "NumEntries" (または指定された名前)
        {
            Type: int32
            AllowsInterpolation: true
        }

        Entries:
        [
            Entry 0: NumEntries = [入力1のポイント数]
            Entry 1: NumEntries = [入力2のポイント数]
            ...
        ]
    }
}
```

### パフォーマンス考慮事項

1. **高速処理**: `GetNumPoints()`は通常O(1)の操作（ポイント数はキャッシュされている）
2. **メモリ効率**: 単一のパラメータデータにすべてのエントリを格納
3. **スレッドセーフ**: `NewObject_AnyThread`を使用して任意のスレッドで実行可能

## 関連ノード

### Get Entries Count
`UPCGNumberOfEntriesSettings`は、パラメータデータのエントリ数を取得する姉妹ノードです:

```cpp
UCLASS(BlueprintType, ClassGroup = (Procedural))
class UPCGNumberOfEntriesSettings : public UPCGNumberOfElementsBaseSettings
{
    // ノード名: "GetEntriesCount"
    // ノードタイトル: "Get Entries Count"
    // 入力型: EPCGDataType::Param
    // 機能: パラメータデータのエントリ数を取得
};
```

### 他の関連ノード
- Attribute Filter (ポイント数に基づくフィルタリング)
- Attribute Math (ポイント数を使用した計算)
- Debug Print (ポイント数のデバッグ出力)

## 使用上の注意

1. **空のデータ**: ポイント数が0のデータも処理され、`NumEntries = 0`として出力されます
2. **複数入力**: 各入力ごとに個別のエントリが作成されるため、複数入力がある場合は出力パラメータデータに複数のエントリが含まれます
3. **属性名の衝突**: 既存のメタデータに同じ属性名が存在する場合、属性作成が失敗する可能性があります
