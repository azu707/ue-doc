# Delete Tags ノード

## 概要

Delete Tagsノードは、PCGデータのタグをフィルタリングするノードです。指定されたタグを削除する、または指定されたタグのみを保持する、2つのモードで動作し、文字列マッチング演算子も選択できます。

**カテゴリ**: Generic
**クラス名**: `UPCGDeleteTagsSettings`
**エレメントクラス**: `FPCGDeleteTagsElement`

## 機能詳細

1. **2つの操作モード**: 選択タグの削除または保持
2. **3つのマッチング演算子**: 完全一致、部分一致、ワイルドカード
3. **一括フィルタリング**: 複数のタグを同時に処理
4. **動的ピン対応**: すべての入力ピンのデータを処理

## プロパティ

### Operation
- **型**: `EPCGTagFilterOperation`
- **デフォルト値**: `DeleteSelectedTags`
- **説明**: タグフィルタリングの操作モードを指定します。
  - `DeleteSelectedTags`: 指定されたタグを削除
  - `KeepOnlySelectedTags`: 指定されたタグのみ保持
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### Operator
- **型**: `EPCGStringMatchingOperator`
- **デフォルト値**: `Equal`
- **説明**: タグマッチングの方法を指定します。
  - `Equal`: 完全一致
  - `Substring`: 部分文字列一致
  - `Matches`: ワイルドカード一致（`*`, `?`）
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### SelectedTags
- **型**: `FString`
- **デフォルト値**: `""`（空文字列）
- **説明**: 追加または削除するタグのカンマ区切りリスト。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### bTokenizeOnWhiteSpace (非推奨)
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: **UE 5.5で非推奨**。空白をセパレータとして使用する古い動作。
- **非推奨バージョン**: 5.5

## 実装の詳細

### ExecuteInternalメソッドの処理フロー

1. **タグリストの解析**
   ```cpp
   const TArray<FString> FilterTags = PCGHelpers::GetStringArrayFromCommaSeparatedList(Settings->SelectedTags);
   TSet<FString> TagsToFilter(FilterTags);
   ```

2. **操作モードの判定**
   ```cpp
   const bool bKeepInFilter = (Settings->Operation == EPCGTagFilterOperation::KeepOnlySelectedTags);
   ```

3. **各入力データのタグフィルタリング**
   ```cpp
   for (const FString& Tag : Input.Tags)
   {
       bool bShouldKeep = false;

       if (Operator == Equal)
           bShouldKeep = TagsToFilter.Contains(Tag) == bKeepInFilter;
       else if (Operator == Substring)
           bShouldKeep = Algo::AnyOf(TagsToFilter, [&Tag](const FString& Filter) { return Tag.Contains(Filter); }) == bKeepInFilter;
       else if (Operator == Matches)
           bShouldKeep = Algo::AnyOf(TagsToFilter, [&Tag](const FString& Filter) { return Tag.MatchesWildcard(Filter); }) == bKeepInFilter;

       if (bShouldKeep)
           Output.Tags.Add(Tag);
   }
   ```

### マッチングロジックの詳細

#### Equal（完全一致）
```cpp
TagsToFilter.Contains(Tag) == bKeepInFilter
```
- タグが完全に一致する場合のみマッチ

#### Substring（部分一致）
```cpp
Algo::AnyOf(TagsToFilter, [&Tag](const FString& TagToFilter) {
    return Tag.Contains(TagToFilter);
}) == bKeepInFilter
```
- フィルタ文字列が対象タグに含まれる場合マッチ
- 例: フィルタ`"Build"`は`"Building"`にマッチ

#### Matches（ワイルドカード）
```cpp
Algo::AnyOf(TagsToFilter, [&Tag](const FString& TagToFilter) {
    return Tag.MatchesWildcard(TagToFilter);
}) == bKeepInFilter
```
- ワイルドカードパターンマッチング
- `*`: 任意の文字列
- `?`: 任意の1文字

## 使用例

### 特定のタグを削除

```
設定:
- Operation: DeleteSelectedTags
- Operator: Equal
- SelectedTags: "Temporary,Debug"

入力タグ: "Building", "Temporary", "Debug", "Residential"
出力タグ: "Building", "Residential"
```

### 特定のタグのみ保持

```
設定:
- Operation: KeepOnlySelectedTags
- Operator: Equal
- SelectedTags: "Final,Production"

入力タグ: "Final", "Temporary", "Production", "Debug"
出力タグ: "Final", "Production"
```

### 部分一致で削除

```
設定:
- Operation: DeleteSelectedTags
- Operator: Substring
- SelectedTags: "Debug"

入力タグ: "DebugInfo", "DebugMode", "Production"
出力タグ: "Production"
```

### ワイルドカードマッチング

```
設定:
- Operation: KeepOnlySelectedTags
- Operator: Matches
- SelectedTags: "Type_*,Category_*"

入力タグ: "Type_Building", "Category_Residential", "Debug", "Temporary"
出力タグ: "Type_Building", "Category_Residential"
```

### 複数条件の削除

```
設定:
- Operation: DeleteSelectedTags
- Operator: Substring
- SelectedTags: "Test,Debug,Temp"

入力タグ: "TestData", "DebugInfo", "TempFile", "Production"
出力タグ: "Production"
```

## パフォーマンス考慮事項

1. **TSetの使用**: 高速なルックアップ（O(1)）
2. **アルゴリズムの選択**:
   - `Equal`: 最速（ハッシュテーブル）
   - `Substring`: 線形検索が必要
   - `Matches`: ワイルドカードパターンマッチングのコスト
3. **タグ数の影響**: 大量のタグでもスケーラブル
4. **SinglePrimaryPinモード**: 効率的な実行ループ

## 注意事項

1. **操作モードの理解**
   - `DeleteSelectedTags`: ブラックリスト方式
   - `KeepOnlySelectedTags`: ホワイトリスト方式

2. **Operatorの選択**
   - `Equal`: 厳密な制御に最適
   - `Substring`: 柔軟だが予期しないマッチに注意
   - `Matches`: 強力だがパターン設計が重要

3. **大文字小文字の区別**
   - すべての比較は大文字小文字を区別します
   - `"Building"` ≠ `"building"`

4. **空のSelectedTags**
   - 空の場合、すべてのタグが保持または削除されます
   - 意図しない動作に注意

5. **ワイルドカードの制限**
   - `*`: 0文字以上の任意の文字列
   - `?`: 正確に1文字
   - 正規表現はサポートされません

## 関連ノード

- **Add Tags**: タグの追加
- **Replace Tags**: タグの置換
- **Filter By Tag**: タグに基づくデータフィルタリング
- **Data Attributes To Tags**: 属性からタグへの変換

## 技術的な詳細

### ノードタイトルの追加情報

```cpp
FString UPCGDeleteTagsSettings::GetAdditionalTitleInformation() const
{
    // ノードタイトルに操作とタグを表示
    // 例: "DeleteSelectedTags (Debug)" または "KeepOnlySelectedTags"
}
```
- 単一タグの場合、タグ名を括弧内に表示
- 複数タグの場合、操作名のみ表示

### EPCGTagFilterOperation列挙型

```cpp
enum class EPCGTagFilterOperation
{
    KeepOnlySelectedTags,  // ホワイトリスト
    DeleteSelectedTags     // ブラックリスト
};
```

### EPCGStringMatchingOperator列挙型

```cpp
enum class EPCGStringMatchingOperator
{
    Equal,      // ==
    Substring,  // Contains
    Matches     // MatchesWildcard
};
```
