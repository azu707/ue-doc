# Sort Data By Tag Value ノード

## 概要

Sort Data By Tag Valueノードは、データコレクション内の各データに付与されたタグの値（"Tag:Value"形式）に基づいて、データ全体をソートします。タグ値は文字列または数値として解釈され、指定されたタグを持たないデータは最後に配置されます。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSortTags.h`
**カテゴリ**: Generic (汎用)

## 機能詳細

1. **タグ値ソート**: "Tag:Value"形式のタグの値でデータをソート
2. **数値/文字列対応**: 値を数値または文字列として比較
3. **昇順/降順**: ソート順序の選択可能
4. **安定ソート**: 同じ値の要素の相対順序を保持
5. **タグなしデータの処理**: タグを持たないデータは末尾に配置
6. **型の自動判定**: すべての値が数値の場合、数値比較を使用

## プロパティ

### UPCGSortTagsSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **Tag** | FName | - | ソートに使用するタグ名 |
| **SortMethod** | EPCGSortMethod | Ascending | ソート順序（昇順/降順） |

### EPCGSortMethod 列挙型

| 値 | 説明 |
|----|------|
| **Ascending** | 昇順ソート |
| **Descending** | 降順ソート |

### ピン設定

#### 入力ピン
- **In** (動的): `EPCGDataType::Any` - ソート対象のデータコレクション

#### 出力ピン
- **Out**: `EPCGDataType::Any` - ソートされたデータコレクション

## タグ形式

### サポートされるタグ形式

1. **タグのみ**: `"Priority"` - ブーリアンタグとして扱われ、タグを持つデータが先頭
2. **タグ:値**: `"Priority:10"` - 値10を持つタグ
3. **タグ:数値**: `"Weight:3.14"` - 浮動小数点値
4. **タグ:文字列**: `"Category:High"` - 文字列値

### タグ値の比較ロジック

```
優先順位:
1. タグが存在する（タグのみの場合でも値あり扱い）
2. タグ値の比較:
   - すべて数値: 数値として比較
   - 文字列混在: 文字列として辞書順比較
3. タグが存在しない: 最後に配置
```

## 使用例

### 優先度に基づくソート

```
Data Collection with Tags:
- Data A: "Priority:High"
- Data B: "Priority:Medium"
- Data C: "Priority:Low"
- Data D: (タグなし)

[Sort Data By Tag Value]
- Tag: Priority
- SortMethod: Descending
    ↓
Result: A → B → C → D
```

### 数値タグでのソート

```
Data Collection with Tags:
- Data A: "LOD:0"
- Data B: "LOD:2"
- Data C: "LOD:1"

[Sort Data By Tag Value]
- Tag: LOD
- SortMethod: Ascending
    ↓
Result: A(0) → C(1) → B(2)
```

### ブーリアンタグのソート

```
Data Collection:
- Data A: "Featured"
- Data B: (タグなし)
- Data C: "Featured"

[Sort Data By Tag Value]
- Tag: Featured
- SortMethod: Descending
    ↓
Result: A → C → B (タグありが先頭)
```

## 実装の詳細

### ExecuteInternal メソッド概要

```cpp
bool FPCGSortTagsElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGSortTagsSettings* Settings = Context->GetInputSettings<UPCGSortTagsSettings>();

    const FString TargetTag = Settings->Tag.ToString();
    const bool bSortAscending = (Settings->SortMethod == EPCGSortMethod::Ascending);

    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    // 各入力データのタグを解析
    TMap<const FPCGTaggedData*, PCG::Private::FParseTagResult> TagResults;
    TArray<const FPCGTaggedData*> SortedInputs;
    bool bSortUsingNumericValues = true;

    for (const FPCGTaggedData& Input : Inputs)
    {
        SortedInputs.Add(&Input);

        // タグを検索して解析
        for (const FString& Tag : Input.Tags)
        {
            PCG::Private::FParseTagResult TagData = PCG::Private::ParseTag(Tag);
            if (TagData.IsValid() && TagData.GetOriginalAttribute() == TargetTag)
            {
                if (TagData.HasValue() && !TagData.HasNumericValue())
                {
                    // 文字列値が含まれる場合、文字列比較に切り替え
                    bSortUsingNumericValues = false;
                }
                TagResults.Add(&Input, MoveTemp(TagData));
                break;
            }
        }
    }

    // ソート実行（安定ソート）
    Algo::StableSort(SortedInputs, [&](const FPCGTaggedData* A, const FPCGTaggedData* B)
    {
        const PCG::Private::FParseTagResult& TagA = TagResults[A];
        const PCG::Private::FParseTagResult& TagB = TagResults[B];

        // 3段階の比較:
        // 1. タグの存在
        if (!TagA.IsValid() || !TagB.IsValid())
            return TagA.IsValid(); // タグありが先頭

        // 2. 値の存在（ブーリアンタグ vs 値付きタグ）
        if (!TagA.HasValue() || !TagB.HasValue())
            return TagA.HasValue(); // 値ありが先頭

        // 3. 値の比較（数値または文字列）
        if (bSortUsingNumericValues)
            return bSortAscending == (TagA.NumericValue < TagB.NumericValue);
        else
            return bSortAscending == (TagA.Value < TagB.Value);
    });

    // ソート結果を出力に転送
    for (const FPCGTaggedData* SortedInput : SortedInputs)
    {
        Context->OutputData.TaggedData.Add(*SortedInput);
    }

    return true;
}
```

### タグ解析

```cpp
struct FParseTagResult
{
    bool IsValid() const;          // タグが見つかったか
    bool HasValue() const;         // "Tag:Value"形式か
    bool HasNumericValue() const;  // 値が数値として解析可能か

    FString OriginalAttribute;     // タグ名
    TOptional<FString> Value;      // 文字列値
    TOptional<double> NumericValue;// 数値値
};

// 例:
// "Priority" → IsValid=true, HasValue=false
// "Priority:10" → IsValid=true, HasValue=true, NumericValue=10.0
// "Priority:High" → IsValid=true, HasValue=true, Value="High"
```

## パフォーマンス考慮事項

### 最適化のポイント

1. **安定ソート**: `Algo::StableSort` を使用
2. **タグキャッシュ**: 解析されたタグをマップにキャッシュ
3. **型判定の最適化**: すべて数値の場合は数値比較を使用

### パフォーマンスへの影響

- **処理時間**: O(n log n + m)、n=データ数、m=タグの総数
- **メモリ使用**: O(n)の追加メモリ（ソート用）

### ベストプラクティス

1. **タグの統一**: 同じタグ名と形式を一貫して使用
2. **数値タグ**: 数値比較が必要な場合は、すべて数値形式にする
3. **タグの付与**: ソート対象のデータには必ずタグを付与

## 関連ノード

- **Sort Attributes**: ポイントデータのアトリビュート値でソート
- **Add Tags**: データにタグを追加
- **Filter Data By Tag**: タグに基づくデータのフィルタリング
- **Data Attributes To Tags**: アトリビュートをタグに変換

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **タグ形式**: "Tag:Value"形式のタグを使用（コロンで区切られた形式）
2. **タグなしデータ**: 指定されたタグを持たないデータは常に最後に配置
3. **型の混在**: 数値と文字列が混在する場合、文字列として比較されます
4. **安定ソート**: 同じ値を持つデータの相対順序は保持されます

## トラブルシューティング

**問題**: データがソートされない
**解決策**: Tag パラメータが正しいタグ名を指定しているか確認（大文字小文字も一致させる）

**問題**: 数値が正しくソートされない
**解決策**: タグ値がすべて数値形式か確認（"10", "20" など）。文字列が混在すると文字列比較になります

**問題**: タグが認識されない
**解決策**: タグが "TagName:Value" 形式か確認。スペースなど不要な文字が含まれていないか確認

## 実用例

### LODレベルに基づくデータのソート

```
Data Collection:
- HighPolyMesh: "LOD:0"
- MidPolyMesh: "LOD:1"
- LowPolyMesh: "LOD:2"

[Sort Data By Tag Value: Tag=LOD, Ascending]
    ↓
[Process in LOD order]
```

### 優先度順の処理

```
Multiple Data Sources:
- CriticalData: "Priority:1"
- NormalData: "Priority:5"
- LowPriorityData: "Priority:10"

[Sort Data By Tag Value: Tag=Priority, Ascending]
    ↓
[Process high-priority first]
```

### カテゴリ別のグループ化

```
Mixed Data:
- DataA: "Category:Alpha"
- DataB: "Category:Beta"
- DataC: "Category:Alpha"

[Sort Data By Tag Value: Tag=Category, Ascending]
    ↓
[Grouped by category: Alpha, Alpha, Beta]
```
