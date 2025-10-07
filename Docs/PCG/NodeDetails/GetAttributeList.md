# Get Attribute List ノード

## 概要
Get Attribute Listノードは、入力データのメタデータに含まれるすべてのアトリビュート名をリストとして抽出し、アトリビュートセットとして出力するノードです。各アトリビュート名が1つのエントリとなり、オプションで型情報やデフォルト値も取得できます。

**実装クラス**: `UPCGGetAttributesSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGGetDataInfo.cpp`

## 機能詳細

### 主な機能
1. **アトリビュート名の抽出**: 入力データの全アトリビュート名を取得
2. **型情報の取得**: オプションで各アトリビュートの型を取得
3. **デフォルト値の取得**: オプションで各アトリビュートのデフォルト値を文字列として取得

## ピン構成
- **入力ピン**:
  - `In` (Any型、必須): アトリビュート情報を抽出するPCGデータ
- **出力ピン**:
  - `Out` (Param型): アトリビュート情報を含むアトリビュートセット

## プロパティ

### bGetType
**型**: `bool`
**デフォルト値**: `false`
**説明**: trueの場合、各アトリビュートの型を`Type`アトリビュート（Name型）として出力に追加します。

### bGetDefaultValue
**型**: `bool`
**デフォルト値**: `false`
**説明**: trueの場合、各アトリビュートのデフォルト値を`DefaultValue`アトリビュート（String型）として出力に追加します。

## 実装の詳細

### ExecuteInternalメソッド
```cpp
bool FPCGGetAttributesElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGGetAttributesSettings* Settings = Context->GetInputSettings<UPCGGetAttributesSettings>();
    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    for (const FPCGTaggedData& Input : Inputs)
    {
        const UPCGMetadata* InputMetadata = Input.Data->ConstMetadata();
        if (!InputMetadata) continue;

        UPCGParamData* ParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
        
        // アトリビュート名と型を取得
        TArray<FName> AttributeNames;
        TArray<EPCGMetadataTypes> AttributeTypes;
        InputMetadata->GetAttributes(AttributeNames, AttributeTypes);

        // 'Attribute'アトリビュートを作成
        FPCGMetadataAttribute<FName>* Attribute = 
            ParamData->Metadata->FindOrCreateAttribute<FName>(FName("Attribute"), NAME_None, false, false, true);

        FPCGMetadataAttribute<FName>* Types = nullptr;
        if (Settings->bGetType)
        {
            Types = ParamData->Metadata->FindOrCreateAttribute<FName>(FName("Type"), NAME_None, false, false, true);
        }

        FPCGMetadataAttribute<FString>* DefaultValues = nullptr;
        if (Settings->bGetDefaultValue)
        {
            DefaultValues = ParamData->Metadata->FindOrCreateAttribute<FString>(FName("DefaultValue"), FString(), false, false, true);
        }

        // 各アトリビュートに対してエントリを作成
        for (int AttributeIndex = 0; AttributeIndex < AttributeNames.Num(); ++AttributeIndex)
        {
            PCGMetadataEntryKey EntryKey = ParamData->Metadata->AddEntry();
            Attribute->SetValue(EntryKey, AttributeNames[AttributeIndex]);

            if (Types)
            {
                Types->SetValue(EntryKey, TypesEnum->GetNameByValue(static_cast<__underlying_type(EPCGMetadataTypes)>(AttributeTypes[AttributeIndex])));
            }

            if (DefaultValues)
            {
                // アクセサを使用してデフォルト値を文字列に変換
                FString DefaultValueString;
                if (AttributeAccessor && AttributeAccessor->Get<FString>(DefaultValueString, 0, AttributeKeys, ...))
                {
                    DefaultValues->SetValue(EntryKey, DefaultValueString);
                }
            }
        }
    }

    return true;
}
```

## 使用例

### 例1: アトリビュート名のリスト取得
```
1. ポイントデータをGet Attribute Listノードに接続
2. 出力: 各アトリビュート名が'Attribute'アトリビュートに格納されたアトリビュートセット
   例: Position, Color, Normal, Index など
```

### 例2: アトリビュート型の確認
```
1. bGetTypeをtrueに設定
2. 出力: 
   - Attribute: "Position", Type: "Vector"
   - Attribute: "Color", Type: "Vector4"
   - Attribute: "Index", Type: "Int32"
```

### 例3: デフォルト値の取得
```
1. bGetDefaultValueをtrueに設定
2. 出力:
   - Attribute: "Scale", DefaultValue: "1.000000"
   - Attribute: "Enabled", DefaultValue: "true"
```

## パフォーマンス考慮事項

1. **軽量な処理**: アトリビュート名と型の取得は非常に高速
2. **デフォルト値の取得コスト**: `bGetDefaultValue`がtrueの場合、型変換とアクセサ作成のコストが追加
3. **アトリビュート数**: 入力データのアトリビュート数に比例してエントリ数が増加

## 関連ノード

- **Get Tags**: データのタグリストを取得
- **Filter Attribute Elements**: アトリビュート名でフィルタリング
- **Delete Attributes**: 特定のアトリビュートを削除
- **Attribute Rename**: アトリビュート名を変更

## 注意事項

1. **エントリ数**: 出力アトリビュートセットのエントリ数は、入力データのアトリビュート数と等しくなります
2. **型の表記**: 型名はEnum値の名前として表記されます（例: "Float", "Vector", "Int32"）
3. **デフォルト値の文字列化**: すべてのデフォルト値は文字列に変換されます
4. **複数入力**: 入力ピンに複数のデータが接続されている場合、各データに対して個別のアトリビュートセットが出力されます
