# Filter Data By Tag

## 概要
Filter Data By Tagノードは、タグ条件に基づいてデータコレクションをフィルタリングするノードです。指定されたタグを持つデータを保持または削除することができ、複数のタグをカンマ区切りで指定可能です。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGFilterByTagSettings
- **エレメント**: FPCGFilterByTagElement
- **基底クラス**: UPCGFilterDataBaseSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByTag.h

## 機能詳細
このノードは`UPCGFilterByTagSettings`クラスとして実装されており、以下の処理を行います:

- タグ条件に基づくデータコレクションのフィルタリング
- タグ付きデータの保持または削除
- 複数のタグ指定（カンマ区切り）
- 文字列マッチング演算子のサポート（完全一致、部分一致、正規表現）
- データ全体をフィルタ（個別の要素ではなく、データ自体を振り分け）

## プロパティ

### Operation
- **型**: EPCGFilterByTagOperation
- **デフォルト値**: KeepTagged
- **カテゴリ**: Settings
- **説明**: フィルタリング操作のタイプを指定します。
  - **KeepTagged**: 指定されたタグを持つデータを保持
  - **RemoveTagged**: 指定されたタグを持つデータを削除
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### Operator
- **型**: EPCGStringMatchingOperator
- **デフォルト値**: Equal
- **カテゴリ**: Settings
- **説明**: タグのマッチング方法を指定します。
  - **Equal**: 完全一致
  - **Substring**: 部分文字列を含む
  - **Matches**: 正規表現にマッチ
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### SelectedTags
- **型**: FString
- **デフォルト値**: 空文字列
- **カテゴリ**: Settings
- **説明**: フィルタリングに使用するタグのリストをカンマ区切りで指定します。
  - 例: `"Tag1,Tag2,Tag3"`
  - 空白は無視されます
  - 複数のタグを指定した場合、いずれかのタグにマッチすればフィルタ条件を満たします
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bTokenizeOnWhiteSpace (非推奨)
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: 非推奨のプロパティです。有効にすると、スペースを区切り文字として使用する古い動作になります。新しいノードでは無効にすることが推奨されます。
- **非推奨**: UE 5.5で非推奨
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 特定のタグを持つデータを保持
1. `Operation`を`KeepTagged`に設定
2. `Operator`を`Equal`に設定
3. `SelectedTags`に`"Vegetation"`と入力
4. 実行すると、"Vegetation"タグを持つデータが`In Filter`ピンに、持たないデータが`Outside Filter`ピンに出力されます

### 例2: 複数のタグでフィルタリング
1. `Operation`を`KeepTagged`に設定
2. `Operator`を`Equal`に設定
3. `SelectedTags`に`"Tree,Bush,Grass"`と入力
4. 実行すると、"Tree"、"Bush"、または"Grass"のいずれかのタグを持つデータが保持されます

### 例3: 特定のタグを持つデータを削除
1. `Operation`を`RemoveTagged`に設定
2. `Operator`を`Equal`に設定
3. `SelectedTags`に`"Debug,Temp"`と入力
4. 実行すると、"Debug"または"Temp"タグを持つデータが`Outside Filter`ピンに、それ以外が`In Filter`ピンに出力されます

### 例4: 部分一致でフィルタリング
1. `Operation`を`KeepTagged`に設定
2. `Operator`を`Substring`に設定
3. `SelectedTags`に`"Custom_"`と入力
4. 実行すると、"Custom_"を含むタグを持つすべてのデータが保持されます（例: "Custom_Building", "Custom_Road"など）

### 例5: 正規表現でフィルタリング
1. `Operation`を`KeepTagged`に設定
2. `Operator`を`Matches`に設定
3. `SelectedTags`に`"Level[0-9]+"`と入力
4. 実行すると、"Level0"、"Level1"、"Level2"などのタグを持つデータが保持されます

### 例6: 環境タイプでフィルタリング
1. `Operation`を`KeepTagged`に設定
2. `Operator`を`Equal`に設定
3. `SelectedTags`に`"Indoor,Underground"`と入力
4. 実行すると、屋内または地下のタグを持つデータのみが選択されます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGFilterByTagSettings : public UPCGFilterDataBaseSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータコレクション

### 出力ピン
- **In Filter**: フィルタ条件を満たすデータ
  - `KeepTagged`モード: 指定されたタグを持つデータ
  - `RemoveTagged`モード: 指定されたタグを持たないデータ
- **Outside Filter**: フィルタ条件を満たさないデータ
  - `KeepTagged`モード: 指定されたタグを持たないデータ
  - `RemoveTagged`モード: 指定されたタグを持つデータ

### 実行エレメント
```cpp
class FPCGFilterByTagElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
    virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: FilterDataByTag（動的に生成）
- **表示名**: Filter Data By Tag（動的に生成）
- **ツールチップ**: Filter Data By Tag（動的に生成）
- **カテゴリ**: Filter
- **実行ループモード**: SinglePrimaryPin
- **Base Point Data対応**: true（継承元のポイントデータをサポート）
- **動的ピン**: true（入力データの型に応じてピンが変化）

### 処理フロー
1. 入力データコレクションを取得
2. `SelectedTags`文字列をパースしてタグリストを構築
   - カンマで区切ってタグを分割
   - 各タグの前後の空白を除去
3. 各データに対してタグチェックを実行:
   - データが持つすべてのタグを取得
   - 指定されたタグリストとマッチング演算子を使用して比較
   - いずれかのタグがマッチすれば条件を満たす
4. `Operation`設定に基づいて結果を解釈:
   - `KeepTagged`: マッチしたデータを`In Filter`に
   - `RemoveTagged`: マッチしたデータを`Outside Filter`に
5. 条件に応じてデータを適切なピンに振り分け

### タグマッチングロジック
```cpp
// 疑似コード
bool MatchesAnyTag(const TArray<FString>& DataTags, const TArray<FString>& SelectedTags, EPCGStringMatchingOperator Operator)
{
    for (const FString& DataTag : DataTags)
    {
        for (const FString& SelectedTag : SelectedTags)
        {
            if (MatchString(DataTag, SelectedTag, Operator))
            {
                return true; // いずれかのタグがマッチ
            }
        }
    }
    return false;
}
```

### 変更の影響範囲
```cpp
#if WITH_EDITOR
virtual EPCGChangeType GetChangeTypeForProperty(const FName& InPropertyName) const override
{
    return Super::GetChangeTypeForProperty(InPropertyName) | EPCGChangeType::Cosmetic;
}
#endif
```

### 非推奨機能の処理
```cpp
#if WITH_EDITOR
virtual void ApplyDeprecation(UPCGNode* InOutNode) override;
#endif
```
`bTokenizeOnWhiteSpace`プロパティの非推奨処理が実装されています。

## パフォーマンス考慮事項

### 最適化のポイント
- **タグ数**: データが持つタグの数とSelectedTagsの数の積が比較回数に影響します
- **演算子の選択**: `Equal`は最も高速で、`Matches`（正規表現）は最も遅くなります
- **タグ文字列**: 短いタグ名の方が比較が高速です
- **データ数**: フィルタリングの時間はデータコレクションのサイズに比例します

### パフォーマンス特性
- **時間計算量**:
  - Equal演算子: O(N × M × K)（N = データ数、M = データごとのタグ数、K = SelectedTagsの数）
  - Substring演算子: O(N × M × K × L)（L = タグの平均文字列長）
  - Matches演算子: O(N × M × K × R)（R = 正規表現の複雑さ）
- **空間計算量**: O(K)（SelectedTagsリストの保存）

## 注意事項
- タグ名は大文字小文字を区別します
- `SelectedTags`が空の場合、すべてのデータが`Outside Filter`に出力されます（`KeepTagged`モードの場合）
- 複数のタグを指定した場合、OR条件（いずれか一つがマッチすればOK）として扱われます
- AND条件（すべてのタグを持つ必要がある）を実現するには、複数のFilter Data By Tagノードを連結します
- `bTokenizeOnWhiteSpace`は非推奨のため、新しいノードでは使用しないでください
- タグはデータレベルで適用されます（個別の要素ではなく）
- 正規表現を使用する場合、パフォーマンスに影響する可能性があります

## 関連ノード
- **Filter Data By Attribute**: 属性によるデータコレクションのフィルタリング
- **Filter Data By Type**: データ型によるフィルタリング
- **Filter Data By Index**: インデックスによるフィルタリング
- **Add Tags**: データにタグを追加
- **Remove Tags**: データからタグを削除
- **Get Tags**: データからタグを取得
- **Branch On Tag**: タグに基づく分岐処理
