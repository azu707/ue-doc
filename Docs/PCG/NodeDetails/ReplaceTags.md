# Replace Tags ノード

## 概要

Replace Tagsノードは、PCGデータの既存のタグを新しいタグに置き換えるノードです。1:1、N:1、N:Nのマッピングをサポートし、タグの名前変更や統合に使用できます。

**カテゴリ**: Generic
**クラス名**: `UPCGReplaceTagsSettings`
**エレメントクラス**: `FPCGReplaceTagsElement`

## 機能詳細

1. **タグの置換**: 既存タグを新しいタグに置き換え
2. **複数マッピングモード**: 1:1、N:1、N:Nマッピング対応
3. **タグの削除**: 置換先が空の場合は削除
4. **動的ピン対応**: すべての入力ピンのデータを処理

## プロパティ

### SelectedTags
- **型**: `FString`
- **デフォルト値**: `""`（空文字列）
- **説明**: 置き換えるタグのカンマ区切りリスト。これらのタグが見つかった場合、ReplacedTagsの対応するタグに置き換えられます。ReplacedTagsが空の場合、これらのタグは削除されます。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### ReplacedTags
- **型**: `FString`
- **デフォルト値**: `""`（空文字列）
- **説明**: SelectedTagsを置き換える新しいタグのカンマ区切りリスト。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### bTokenizeOnWhiteSpace (非推奨)
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: **UE 5.5で非推奨**。空白をセパレータとして使用する古い動作。
- **非推奨バージョン**: 5.5

## 実装の詳細

### マッピングモード

#### 1:1 マッピング (N:N)
```cpp
SelectedTags: "Tag1,Tag2,Tag3"
ReplacedTags: "NewTag1,NewTag2,NewTag3"

Tag1 → NewTag1
Tag2 → NewTag2
Tag3 → NewTag3
```

#### N:1 マッピング
```cpp
SelectedTags: "Tag1,Tag2,Tag3"
ReplacedTags: "NewTag"

Tag1 → NewTag
Tag2 → NewTag
Tag3 → NewTag
```

#### N:0 マッピング（削除）
```cpp
SelectedTags: "Tag1,Tag2"
ReplacedTags: ""

Tag1 → (削除)
Tag2 → (削除)
```

### ExecuteInternalメソッドの処理フロー

1. **タグリストの解析**
   ```cpp
   const TArray<FString> SelectedTags = PCGHelpers::GetStringArrayFromCommaSeparatedList(Settings->SelectedTags);
   const TArray<FString> ReplacedTags = PCGHelpers::GetStringArrayFromCommaSeparatedList(Settings->ReplacedTags);
   ```

2. **検証**
   ```cpp
   // 両方が空の場合は早期リターン
   if (SelectedTags.IsEmpty() && ReplacedTags.IsEmpty())
       return true;

   // 無効なマッピングのチェック
   if (ReplacedTags.Num() > 1 && SelectedTags.Num() != ReplacedTags.Num())
   {
       // エラー: 1:1, N:1, N:N のみサポート
       return true;
   }
   ```

3. **マッピングモードの決定**
   ```cpp
   const bool bNToNTagMapping = SelectedTags.Num() == ReplacedTags.Num();
   const bool bNToOneMapping = ReplacedTags.Num() == 1;
   ```

4. **タグの置換**
   ```cpp
   for (int i = 0; i < SelectedTags.Num(); ++i)
   {
       if (Input.Tags.Contains(SelectedTags[i]))
       {
           Output.Tags.Remove(SelectedTags[i]);

           if (bNToNTagMapping)
               Output.Tags.Add(ReplacedTags[i]);
           else if (bNToOneMapping)
               Output.Tags.Add(ReplacedTags[0]);
       }
   }
   ```

### バリデーション

サポートされるマッピング:
- ✅ `1:1` - 1つのタグを1つのタグに
- ✅ `N:1` - 複数のタグを1つのタグに
- ✅ `N:N` - 複数のタグを同じ数のタグに（順序対応）
- ✅ `N:0` - 複数のタグを削除
- ❌ `N:M` (N≠M, M>1) - 未サポート

## 使用例

### 基本的なタグの置換（1:1）

```
設定:
- SelectedTags: "OldTag"
- ReplacedTags: "NewTag"

入力タグ: "OldTag", "OtherTag"
出力タグ: "NewTag", "OtherTag"
```

### 複数タグの統合（N:1）

```
設定:
- SelectedTags: "Residential,Commercial,Industrial"
- ReplacedTags: "Urban"

入力タグ: "Residential", "LargeBuilding"
出力タグ: "Urban", "LargeBuilding"
```

### タグの一括変換（N:N）

```
設定:
- SelectedTags: "Type_A,Type_B,Type_C"
- ReplacedTags: "Category_1,Category_2,Category_3"

入力タグ: "Type_A", "Type_C", "Other"
出力タグ: "Category_1", "Category_3", "Other"
```

### タグの削除

```
設定:
- SelectedTags: "Debug,Temporary"
- ReplacedTags: ""

入力タグ: "Debug", "Temporary", "Production"
出力タグ: "Production"
```

### 条件付き名前変更

```
設定:
- SelectedTags: "Level_1,Level_2,Level_3"
- ReplacedTags: "Floor_1,Floor_2,Floor_3"

入力タグ: "Level_2", "Building"
出力タグ: "Floor_2", "Building"
```

## パフォーマンス考慮事項

1. **TSet::Contains**: 高速なタグ検索（O(1)）
2. **順次処理**: タグ数に対して線形時間
3. **軽量な操作**: タグの追加/削除のみ
4. **SinglePrimaryPinモード**: 最適化された実行ループ

## 注意事項

1. **マッピングの制限**
   - `N:M`（N≠Mかつ M>1）マッピングはエラー
   - 例: 3個のSelectedTagsに2個のReplacedTagsは不可

2. **順序の重要性（N:N）**
   - N:Nマッピングでは配列の順序が対応
   - `SelectedTags[0]` → `ReplacedTags[0]`
   - `SelectedTags[1]` → `ReplacedTags[1]`

3. **存在しないタグ**
   - SelectedTagsに指定されたタグが存在しない場合は無視
   - エラーは発生しません

4. **大文字小文字の区別**
   - タグ名は大文字小文字を区別
   - `"Building"` ≠ `"building"`

5. **重複タグ**
   - 同じタグを複数回置換しようとしても、最初の1回のみ適用

6. **空の設定**
   - 両方のプロパティが空の場合、データはそのまま転送

## 関連ノード

- **Add Tags**: 新しいタグを追加
- **Delete Tags**: タグのフィルタリングと削除
- **Filter By Tag**: タグに基づくデータフィルタリング

## 技術的な詳細

### ノードタイトルの追加情報

```cpp
FString UPCGReplaceTagsSettings::GetAdditionalTitleInformation() const
{
    // 例: "OldTag -> NewTag" または "Multiple -> NewTag"
    if (TagsToReplace.Num() == 1 && TagsToProcess.Num() == 1)
        return FString::Printf(TEXT("%s -> %s"), *TagsToReplace[0], *TagsToProcess[0]);
    else if (TagsToReplace.Num() > 1 || TagsToProcess.Num() > 1)
        return "Multiple -> ...";
}
```
- ノードグラフ上でマッピングを視覚的に表示
- 単一マッピングの場合は具体的な名前を表示

### エラーハンドリング

```cpp
if (ReplacedTags.Num() > 1 && SelectedTags.Num() != ReplacedTags.Num())
{
    PCGE_LOG(Error, GraphAndLog,
        LOCTEXT("InvalidMappingSupport",
            "Input only supports 1:1, N:1, and N:N mappings from source to replaced tags, Input data discarded."));
    return true;
}
```
- 無効なマッピングの場合はエラーログを出力
- 入力データはそのまま出力に転送される
