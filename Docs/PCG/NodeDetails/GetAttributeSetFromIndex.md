# Get Attribute Set from Index ノード

## 概要
Get Attribute Set from Indexノードは、アトリビュートセットから指定したインデックスの単一エントリを抽出し、新しいアトリビュートセットとして出力するノードです。

**実装クラス**: `UPCGAttributeGetFromIndexSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGAttributeGetFromIndexElement.cpp`

## 機能詳細

### 主な機能
1. **インデックスベースの抽出**: 指定したインデックスのエントリを取得
2. **属性の保持**: すべてのアトリビュート定義を保持しつつ、値のみを抽出

## ピン構成
- **入力ピン**:
  - `In` (Param型、必須): アトリビュートセット
- **出力ピン**:
  - `Out` (Param型): 指定インデックスのエントリを持つアトリビュートセット

## プロパティ

### Index
**型**: `int32`
**デフォルト値**: `0`
**説明**: 抽出するエントリのインデックス（0から開始）。入力アトリビュートセットのエントリ数を超える場合はエラーが出力されます。
**オーバーライド可能**: はい

## 実装の詳細

### ExecuteInternalメソッド
```cpp
bool FPCGAttributeGetFromIndexElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGAttributeGetFromIndexSettings* Settings = Context->GetInputSettings<UPCGAttributeGetFromIndexSettings>();
    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);
    const int32 Index = Settings->Index;

    for (const FPCGTaggedData& Input : Inputs)
    {
        const UPCGParamData* Param = Cast<const UPCGParamData>(Input.Data);
        if (!Param || !Param->Metadata) continue;

        const UPCGMetadata* ParamMetadata = Param->Metadata;
        const int64 ParamItemCount = ParamMetadata->GetLocalItemCount();

        // インデックスの範囲チェック
        if (Index >= ParamItemCount)
        {
            PCGE_LOG(Warning, GraphAndLog, 
                FText::Format(LOCTEXT("InvalidParamIndex", "Unable to retrieve entry {0} because there are {1} entries in the AttributeSet"), 
                Index, ParamItemCount));
            continue;
        }

        // 新しいアトリビュートセットを作成
        UPCGParamData* SubParam = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
        
        // アトリビュート定義を追加
        SubParam->Metadata->AddAttributes(ParamMetadata);

        // 指定インデックスのエントリをコピー
        const PCGMetadataEntryKey OriginalEntryKey = Index;
        PCGMetadataEntryKey SingleEntryKey = SubParam->Metadata->AddEntry();
        SubParam->Metadata->SetAttributes(OriginalEntryKey, ParamMetadata, SingleEntryKey);

        FPCGTaggedData& TaggedData = Context->OutputData.TaggedData.Emplace_GetRef(Input);
        TaggedData.Data = SubParam;
    }

    return true;
}
```

## 使用例

### 例1: 最初のエントリの取得
```
1. Index = 0に設定
2. 複数エントリを持つアトリビュートセットを入力
3. 出力: 最初のエントリのみを持つアトリビュートセット
```

### 例2: 特定インデックスの値の抽出
```
1. Load Data Tableノードで複数行のデータテーブルをロード
2. Get Attribute Set from Indexノードで特定の行（例: Index = 3）を抽出
3. Add Attributeノードで他のデータに値を適用
```

### 例3: ランダムエントリの選択
```
1. Attribute Reduceノードで最大インデックス値を取得
2. Attribute Maths Opノードでランダムインデックスを計算
3. Get Attribute Set from Indexノードで該当エントリを抽出
```

## パフォーマンス考慮事項

1. **軽量な処理**: 単一エントリのコピーのみで非常に高速
2. **メモリ**: 新しいアトリビュートセットを作成しますが、1エントリのみなので最小限
3. **インデックスの検証**: 毎回インデックスの範囲チェックが行われます

## 関連ノード

- **Filter Elements By Index**: インデックス範囲でフィルタリング
- **Filter Attribute Elements**: アトリビュート値でフィルタリング
- **Attribute Reduce**: アトリビュート値の集約（最大・最小など）

## 注意事項

1. **インデックス範囲**: インデックスがエントリ数を超える場合、警告が出力され、そのデータはスキップされます
2. **0ベース**: インデックスは0から開始します（最初のエントリはIndex = 0）
3. **単一エントリ**: 常に1つのエントリのみを持つアトリビュートセットが出力されます
4. **タグの継承**: 入力データのタグが出力にも引き継がれます
