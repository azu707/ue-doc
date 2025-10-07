# Get Tags ノード

## 概要
Get Tagsノードは、入力データに付与されたタグを抽出し、アトリビュートセットとして出力するノードです。各タグが1つのエントリとなり、オプションで値付きタグ（`Tag:Value`形式）の値も抽出できます。

**実装クラス**: `UPCGGetTagsSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGGetDataInfo.cpp`

## 機能詳細

### 主な機能
1. **タグリストの抽出**: 入力データのすべてのタグをアトリビュートセットとして取得
2. **値付きタグのサポート**: `Tag:Value`形式のタグから値を抽出（オプション）
3. **複数入力対応**: 複数の入力データに対して個別のアトリビュートセットを生成

## ピン構成
- **入力ピン**:
  - `In` (Any型、必須): タグを持つPCGデータ
- **出力ピン**:
  - `Out` (Param型): タグ情報を含むアトリビュートセット

## プロパティ

### bExtractTagValues
**型**: `bool`
**デフォルト値**: `false`
**説明**: trueの場合、値付きタグ（`Tag:Value`形式）の値を`Values`アトリビュート（String型）として抽出します。

## 実装の詳細

### ExecuteInternalメソッド
```cpp
bool FPCGGetTagsElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGGetTagsSettings* Settings = Context->GetInputSettings<UPCGGetTagsSettings>();
    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    for (const FPCGTaggedData& Input : Inputs)
    {
        if (!Input.Data) continue;

        UPCGParamData* ParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
        
        // 'Attribute'アトリビュートを作成（タグ名を格納）
        FPCGMetadataAttribute<FString>* Attribute = 
            ParamData->Metadata->FindOrCreateAttribute<FString>(FName("Attribute"), FString(), false, false, true);

        // 'Values'アトリビュートを作成（オプション）
        FPCGMetadataAttribute<FString>* Values = nullptr;
        if (Settings->bExtractTagValues)
        {
            Values = ParamData->Metadata->FindOrCreateAttribute<FString>(FName("Values"), FString(), false, false, true);
        }

        // 各タグに対してエントリを作成
        for (const FString& Tag : Input.Tags)
        {
            PCG::Private::FParseTagResult TagData = PCG::Private::ParseTag(Tag);
            if (TagData.IsValid())
            {
                PCGMetadataEntryKey EntryKey = ParamData->Metadata->AddEntry();
                Attribute->SetValue(EntryKey, TagData.GetOriginalAttribute());

                if (Values)
                {
                    if (TagData.HasValue())
                    {
                        Values->SetValue(EntryKey, TagData.Value.GetValue());
                    }
                    else // Boolean属性と仮定
                    {
                        Values->SetValue(EntryKey, FString("true"));
                    }
                }
            }
        }

        FPCGTaggedData& Output = Outputs.Emplace_GetRef(Input);
        Output.Data = ParamData;
    }

    return true;
}
```

### タグ解析の仕組み
`PCG::Private::ParseTag`関数は、タグを以下のように解析します:
- **通常のタグ**: `TagName` → `TagData.GetOriginalAttribute() = "TagName"`, `TagData.HasValue() = false`
- **値付きタグ**: `TagName:Value` → `TagData.GetOriginalAttribute() = "TagName"`, `TagData.Value.GetValue() = "Value"`

## 使用例

### 例1: タグ名のリスト取得
```
1. bExtractTagValues = false（デフォルト）
2. タグ: "Enemy", "Level:5", "Health:100"を持つデータを入力
3. 出力:
   - Attribute: "Enemy"
   - Attribute: "Level"
   - Attribute: "Health"
```

### 例2: タグ値の抽出
```
1. bExtractTagValues = true
2. タグ: "Enemy", "Level:5", "Health:100"を持つデータを入力
3. 出力:
   - Attribute: "Enemy", Values: "true"
   - Attribute: "Level", Values: "5"
   - Attribute: "Health", Values: "100"
```

### 例3: タグフィルタリング
```
1. Get Tagsノードでタグリストを取得
2. Filter Attribute Elementsノードで特定のタグ名でフィルタリング
3. フィルタリングされたタグ情報を使用
```

## パフォーマンス考慮事項

1. **軽量な処理**: タグの解析とアトリビュート作成のみで非常に高速
2. **タグ数**: タグ数に比例してエントリ数が増加
3. **値抽出のコスト**: `bExtractTagValues`がtrueでも、追加コストは最小限

## 関連ノード

- **Data Tags To Attribute Set**: タグをアトリビュートに変換（値付きタグを自動的にアトリビュートとして設定）
- **Add Tags**: データにタグを追加
- **Delete Tags**: データからタグを削除
- **Filter Data By Tag**: タグに基づいてデータをフィルタリング

## 注意事項

1. **エントリ数**: 出力アトリビュートセットのエントリ数は、入力データのタグ数と等しくなります
2. **値の型**: すべての値は文字列として抽出されます（型変換は行われません）
3. **Boolean属性**: 値のないタグ（`TagName`のみ）は、Booleanと見なされ、値は"true"になります
4. **無効なタグ**: 解析できないタグはスキップされます
5. **複数入力**: 各入力データに対して個別のアトリビュートセットが出力されます
6. **Data Tags To Attribute Setとの違い**: Get Tagsはタグリストを生成、Data Tags To Attribute Setはタグを直接アトリビュートに変換
