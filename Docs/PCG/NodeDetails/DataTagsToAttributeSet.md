# Data Tags To Attribute Set ノード

## 概要
Data Tags To Attribute Setノードは、データコレクションに付与されたタグをアトリビュートセットに変換するノードです。Get Actor Dataノードのシングルポイントオプションと同様の動作を行い、各入力データのタグ情報をアトリビュートセットとして抽出します。

**実装クラス**: `UPCGTagsToAttributeSetSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGConvertToAttributeSet.cpp`

## 機能詳細

### 主な機能
1. **データタグのアトリビュートセット化**: 入力データに付与されたタグをアトリビュートとして抽出
2. **値付きタグのサポート**: `TagName:Value`形式のタグから、タグ名と値を分離して抽出
3. **入力データごとの処理**: 各入力データに対して個別のアトリビュートセットを生成

### ピン構成
- **入力ピン**:
  - `In` (Any型、必須): タグを持つPCGデータ
- **出力ピン**:
  - `Out` (Param型): タグから生成されたアトリビュートセット

## プロパティ

このノードには設定可能なプロパティはありません。動作は完全に自動化されており、入力データのタグ情報のみに基づいて処理を行います。

## 実装の詳細

### ExecuteInternalメソッド（FPCGTagsToAttributeSetElement）
このメソッドは、入力データの各タグをアトリビュートに変換してアトリビュートセットを作成します。

```cpp
bool FPCGTagsToAttributeSetElement::ExecuteInternal(FPCGContext* Context) const
{
    TRACE_CPUPROFILER_EVENT_SCOPE(FPCGTagsToAttributeSetElement::Execute);
    check(Context);

    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);
    TArray<FPCGTaggedData>& Outputs = Context->OutputData.TaggedData;

    for (const FPCGTaggedData& Input : Inputs)
    {
        if (!Input.Data)
        {
            continue;
        }

        // 新しいParamDataを作成
        UPCGParamData* ParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
        check(ParamData && ParamData->Metadata);

        FPCGTaggedData& Output = Outputs.Emplace_GetRef(Input);
        Output.Data = ParamData;

        // 単一のエントリを追加
        PCGMetadataEntryKey EntryKey = ParamData->Metadata->AddEntry();

        // 各タグをアトリビュートとして設定
        for (const FString& DataTag : Input.Tags)
        {
            PCG::Private::SetAttributeFromTag(
                DataTag,
                ParamData->Metadata,
                EntryKey,
                PCG::Private::ESetAttributeFromTagFlags::CreateAttribute
            );
        }
    }

    return true;
}
```

### タグからアトリビュート設定の仕組み
`PCG::Private::SetAttributeFromTag`関数は、タグ文字列を解析してアトリビュートを作成します:

1. **通常のタグ**: `TagName`形式の場合、Boolean型のアトリビュートとして`true`値を設定
2. **値付きタグ**: `TagName:Value`形式の場合、適切な型を推測してアトリビュートを作成
   - 数値の場合: 整数または浮動小数点数として設定
   - それ以外: 文字列として設定

### 実行ループモード
```cpp
virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override
{
    return EPCGElementExecutionLoopMode::SinglePrimaryPin;
}
```

入力ピンの各データに対して個別に処理を実行します。

## 使用例

### 例1: アクタータグの抽出
Get Actor Dataノードからアクター情報を取得し、そのタグをアトリビュートセットに変換する場合:

1. Get Actor Dataノードでアクターを取得
2. Data Tags To Attribute Setノードに接続
3. アクターに付与されたタグ（例: `"Enemy"`, `"Level:5"`, `"Health:100"`）が以下のようにアトリビュートセットに変換される:
   - `Enemy`: Boolean = true
   - `Level`: Int32 = 5
   - `Health`: Int32 = 100

### 例2: フィルタリング後のタグ情報の保存
Filter Data By Tagノードでフィルタリングした後、通過したデータのタグ情報を保存する場合:

1. Filter Data By Tagノードでデータをフィルタリング
2. Data Tags To Attribute Setノードに接続
3. フィルタを通過したデータに付与されているすべてのタグがアトリビュートセットとして出力される

### 例3: タグベースのメタデータ作成
複数のデータにタグを付与し、そのタグ情報をメタデータとして活用する場合:

1. 各処理ノードでデータにタグを付与（Add Tagsノード使用）
2. Data Tags To Attribute Setノードで集約
3. 生成されたアトリビュートセットを後続の処理で使用（条件分岐、属性演算など）

## パフォーマンス考慮事項

### メモリ
- 軽量な処理: 各入力データに対して1つのアトリビュートセット（1エントリ）のみを作成
- タグ数に比例してアトリビュート数が増加

### 処理速度
- 高速: タグの解析とアトリビュート作成のみ
- タグ数が多い場合は、わずかに処理時間が増加

### 最適化のヒント
- タグ数を必要最小限に抑える
- 大量のデータを処理する場合は、事前にFilter Data By Tagで必要なデータのみに絞り込む
- 値付きタグは型推論のコストがあるため、明示的な型が必要な場合は他の方法（アトリビュート直接設定など）を検討

## 関連ノード

- **Get Tags**: データのタグリストをアトリビュートセットとして取得（値は抽出しない）
- **Add Tags**: データにタグを追加
- **Delete Tags**: データからタグを削除
- **Replace Tags**: データのタグを置換
- **Filter Data By Tag**: タグに基づいてデータをフィルタリング
- **Data Attributes To Tags**: アトリビュートをタグに変換（逆変換）

## 注意事項

1. **単一エントリ**: 各入力データに対して、常に1つのエントリを持つアトリビュートセットが作成されます。

2. **タグの解析**: 値付きタグ（`Name:Value`形式）の解析は自動的に行われますが、型推論が期待通りにならない場合があります。明示的な型制御が必要な場合は、他の方法を検討してください。

3. **タグの保持**: 入力データのタグは、出力アトリビュートセットのタグとしても引き継がれます。

4. **空のタグ**: タグが付与されていない入力データの場合でも、空のアトリビュートセット（エントリのみ、アトリビュートなし）が作成されます。

5. **Get Actor Dataとの関係**: このノードはGet Actor DataノードのSingle Pointオプションと似た動作をしますが、より汎用的で、任意のPCGデータのタグを処理できます。

6. **名前の重複**: 同じ名前のタグが複数ある場合、最後のタグの値が使用されます。
