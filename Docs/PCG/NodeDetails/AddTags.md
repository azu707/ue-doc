# Add Tags ノード

## 概要

Add Tagsノードは、PCGの出力データに指定されたタグを追加するシンプルなノードです。タグはデータのフィルタリング、識別、分類に使用され、グラフ内の他のノードで特定のデータを選択するために利用できます。prefix（接頭辞）とsuffix（接尾辞）を使用して、タグ名を動的に構築することも可能です。

**カテゴリ**: Generic
**クラス名**: `UPCGAddTagSettings`
**エレメントクラス**: `FPCGAddTagElement`

## 機能詳細

このノードは以下の主要機能を提供します：

1. **複数タグの一括追加**: カンマ区切りで複数のタグを一度に追加
2. **Prefix/Suffixのサポート**: すべてのタグに共通の接頭辞/接尾辞を追加
3. **キー:バリュー形式のタグ対応**: タグをキー:バリュー形式で扱い、prefixとsuffixをキー部分にのみ適用
4. **動的ピン**: 入力されたすべてのピンのデータにタグを適用
5. **シングルプライマリピンモード**: 最も効率的な実行ループモードを使用

### 入力ピン

- **Input** (Any): タグを追加する任意のPCGデータ（動的ピン対応）

### 出力ピン

- **Output** (Any): タグが追加された入力データ

## プロパティ

### TagsToAdd
- **型**: `FString`
- **デフォルト値**: `""`（空文字列）
- **説明**: 追加するタグのカンマ区切りリスト。例: `"Building,Residential,TwoStory"`
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`
- **特記事項**:
  - カンマで区切られた各文字列が個別のタグとして処理されます
  - 空白は自動的にトリミングされます（最新バージョン）

### Prefix
- **型**: `FString`
- **デフォルト値**: `""`（空文字列）
- **説明**: すべてのタグに追加する共通の接頭辞。空にすることも可能です。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`
- **使用例**: `Prefix = "Type_"`で、タグ`"Building"`は`"Type_Building"`になります

### Suffix
- **型**: `FString`
- **デフォルト値**: `""`（空文字列）
- **説明**: すべてのタグに追加する共通の接尾辞。空にすることも可能です。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`
- **使用例**: `Suffix = "_01"`で、タグ`"Building"`は`"Building_01"`になります

### bIgnoreTagValueParsing
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: タグをキー:バリュー形式として解析するかどうかを制御します。
  - `false`: キー:バリュー形式と見なし、prefix/suffixはキー部分（コロンの前）にのみ適用されます
  - `true`: タグ全体にprefix/suffixを適用します
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### bTokenizeOnWhiteSpace (非推奨)
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: **UE 5.5で非推奨**。古いバージョンとの互換性のために残されています。
  - `true`: 空白をセパレータとして使用（旧動作）
  - `false`: カンマのみをセパレータとして使用（現在の動作）
- **非推奨バージョン**: 5.5
- **編集条件**: 非推奨フラグによって非表示

## 実装の詳細

### ExecuteInternalメソッド

このメソッドは非常にシンプルな処理フローを持ちます：

1. **入力データの取得**
   ```cpp
   Context->OutputData.TaggedData = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);
   ```
   - 入力データをそのまま出力データとしてコピー

2. **タグのパース**
   ```cpp
   const TArray<FString> TagsArray = PCGHelpers::GetStringArrayFromCommaSeparatedList(Settings->TagsToAdd);
   ```
   - カンマ区切りの文字列を配列に変換
   - 空白は自動的にトリミング

3. **各タグの処理**
   - タグがキー:バリュー形式（`Key:Value`）かどうかをチェック
   - `bIgnoreTagValueParsing`が`false`の場合：
     - コロン（`:`）の位置を検索
     - コロンが見つかった場合：
       ```cpp
       TagToAdd = Prefix + LeftSide + Suffix + RightSide;
       // 例: "Type_" + "Building" + "_01" + ":Residential"
       //     → "Type_Building_01:Residential"
       ```
     - コロンがない場合：
       ```cpp
       TagToAdd = Prefix + Tag + Suffix;
       ```
   - `bIgnoreTagValueParsing`が`true`の場合：
     - 常に全体にprefix/suffixを適用

4. **全出力データへのタグ追加**
   ```cpp
   for (FPCGTaggedData& OutputTaggedData : Context->OutputData.TaggedData)
   {
       OutputTaggedData.Tags.Add(TagToAdd);
   }
   ```
   - すべての出力データに同じタグセットを追加

### 実行ループモード

```cpp
virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override
{
    return EPCGElementExecutionLoopMode::SinglePrimaryPin;
}
```

- **SinglePrimaryPin**: 最も効率的なモード
- プライマリ入力ピン（Input）のデータのみを処理
- データの変更が不要な場合に最適

### 動的ピンのサポート

```cpp
virtual bool HasDynamicPins() const override { return true; }
```

- 入力ピンを動的に追加可能
- 複数の入力ソースからのデータすべてにタグを適用

## 使用例

### 基本的なタグ追加

**設定**:
- `TagsToAdd`: `"Building,Residential"`

**結果**:
- すべての出力データに`"Building"`と`"Residential"`タグが追加されます

### Prefix/Suffixの使用

**設定**:
- `TagsToAdd`: `"Building,Residential"`
- `Prefix`: `"Type_"`
- `Suffix`: `"_v1"`

**結果**:
- タグ: `"Type_Building_v1"`, `"Type_Residential_v1"`

### キー:バリュー形式のタグ

**設定**:
- `TagsToAdd`: `"Type:Building,Zone:Residential,Height:TwoStory"`
- `Prefix`: `"Asset_"`
- `bIgnoreTagValueParsing`: `false`（デフォルト）

**結果**:
- タグ: `"Asset_Type:Building"`, `"Asset_Zone:Residential"`, `"Asset_Height:TwoStory"`
- Prefixはキー部分（コロンの前）にのみ適用されます

### キー:バリュー解析の無効化

**設定**:
- `TagsToAdd`: `"Type:Building"`
- `Prefix`: `"Asset_"`
- `Suffix`: `"_01"`
- `bIgnoreTagValueParsing`: `true`

**結果**:
- タグ: `"Asset_Type:Building_01"`
- Prefix/Suffixがタグ全体に適用されます

### タグによるフィルタリングとの組み合わせ

```
1. Create Points Grid → グリッド生成
2. Add Tags (TagsToAdd: "GroundLevel") → タグ追加
3. Filter By Tag (Tag: "GroundLevel") → フィルタリング
4. Static Mesh Spawner → メッシュ配置
```

### 条件付きタグ付け

```
1. 入力データを2つのブランチに分岐
   - ブランチA: Add Tags (TagsToAdd: "Interior")
   - ブランチB: Add Tags (TagsToAdd: "Exterior")
2. Gather → 両ブランチを統合
3. タグに基づいて異なる処理を適用
```

## パフォーマンス考慮事項

1. **非常に軽量な処理**
   - データのコピーとタグ配列への追加のみ
   - 計算コストはほぼゼロ

2. **キャッシュ可能**
   - `IsCacheable()`はデフォルトの`true`を使用
   - 同じ入力とパラメータで結果がキャッシュされます

3. **メモリ効率**
   - データの実体は複製されません（参照のみ）
   - タグ文字列のみがメモリに追加されます

4. **スケーラビリティ**
   - データ量に関係なく一定時間で実行
   - 数百万のポイントでも影響なし

5. **動的ピンのオーバーヘッド**
   - 複数の入力ピンがある場合でも効率的に処理
   - ピン数による性能劣化はほぼ無視できるレベル

## 注意事項

1. **タグの命名規則**
   - タグ名には任意の文字を使用できますが、特殊文字（特にコロン）の使用には注意が必要です
   - キー:バリュー形式を使用する場合は、コロンを1つだけ含めることを推奨

2. **カンマのエスケープ**
   - カンマはセパレータとして使用されるため、タグ名にカンマを含めることはできません
   - 必要な場合は、複数のAdd Tagsノードを使用してください

3. **空白の扱い**
   - 最新バージョンでは、カンマの前後の空白は自動的にトリミングされます
   - `"Tag1, Tag2, Tag3"`は`"Tag1"`, `"Tag2"`, `"Tag3"`として処理されます

4. **非推奨機能**
   - `bTokenizeOnWhiteSpace`は使用しないでください
   - 古いグラフでのみ有効化されます

5. **タグの重複**
   - 同じタグを複数回追加しても、内部的には重複して保存されます
   - Filter By Tagノードは最初の一致で動作するため、通常は問題ありません

6. **オーバーライド可能性**
   - すべての主要プロパティは`PCG_Overridable`メタデータを持ちます
   - 属性やパラメータからタグを動的に設定可能です

## 関連ノード

- **Delete Tags**: 指定されたタグを削除
- **Replace Tags**: タグを置換
- **Filter By Tag**: タグに基づいてデータをフィルタリング
- **Data Attributes To Tags**: 属性値をタグに変換
- **Tags To Data Attributes**: タグを属性に変換
- **Sort Tags**: タグ値に基づいてデータをソート

## 技術的な詳細

### タグのデータ構造

```cpp
struct FPCGTaggedData
{
    const UPCGData* Data;
    TSet<FString> Tags;  // タグセット
    FPCGPinProperties Pin;
};
```

- タグは`TSet<FString>`として保存されます
- セット構造により、高速な検索と一意性が保証されます

### ヘルパー関数

```cpp
// カンマ区切りリストのパース（最新）
TArray<FString> PCGHelpers::GetStringArrayFromCommaSeparatedList(const FString& InCommaSeparatedString);

// 空白とカンマ区切りリストのパース（非推奨）
TArray<FString> PCGHelpers::GetStringArrayFromCommaSeparatedString(const FString& InCommaSeparatedString, FPCGContext* InContext);
```

### キー:バリュー解析のロジック

```cpp
int32 DividerPosition = INDEX_NONE;
if (!Settings->bIgnoreTagValueParsing && Tag.FindChar(':', DividerPosition))
{
    FString LeftSide = Tag.Left(DividerPosition);           // "Type"
    FString RightSide = Tag.RightChop(DividerPosition);     // ":Building"

    TagToAdd = Settings->Prefix + LeftSide + Settings->Suffix + RightSide;
    // "Asset_" + "Type" + "_v1" + ":Building"
    // → "Asset_Type_v1:Building"
}
```

### 非推奨機能の扱い

```cpp
#if WITH_EDITOR
void UPCGAddTagSettings::ApplyDeprecation(UPCGNode* InOutNode)
{
    if (DataVersion < FPCGCustomVersion::AttributesAndTagsCanContainSpaces)
    {
        bTokenizeOnWhiteSpace = true;  // 古いバージョンとの互換性
    }
}
#endif
```

- カスタムバージョンシステムにより、古いアセットの動作を維持
- 新しいノードでは常に`bTokenizeOnWhiteSpace = false`
