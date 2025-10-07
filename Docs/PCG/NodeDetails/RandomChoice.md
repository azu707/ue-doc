# Random Choice

## 概要
Random Choiceノードは、ランダムにエントリを選択するノードです。固定数または割合でエントリを選択でき、選択されたエントリと破棄されたエントリは入力データと同じ順序で出力されます。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGRandomChoiceSettings
- **エレメント**: FPCGRandomChoiceElement
- **基底クラス**: UPCGSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGRandomChoice.h

## 機能詳細
このノードは`UPCGRandomChoiceSettings`クラスとして実装されており、以下の処理を行います:

- 固定数または割合でランダムにエントリを選択
- シード値を使用した再現可能なランダム選択
- カスタムシードソース属性のサポート
- 選択されたエントリと破棄されたエントリを別々のピンに出力
- 入力データの順序を保持

## プロパティ

### bFixedMode
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: trueに設定すると固定数のエントリを選択し、falseに設定すると割合でエントリを選択します。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### FixedNumber
- **型**: int
- **デフォルト値**: 1
- **カテゴリ**: Settings
- **説明**: 保持するエントリの数を定義します。`bFixedMode`がtrueの場合に使用されます。
- **メタフラグ**: PCG_Overridable, EditCondition="bFixedMode", ClampMin="0"
- **Blueprint対応**: 読み書き可能

### Ratio
- **型**: float
- **デフォルト値**: 0.5
- **カテゴリ**: Settings
- **説明**: 保持するエントリの割合を定義します。`bFixedMode`がfalseの場合に使用されます。0.0から1.0の範囲で指定します。
- **メタフラグ**: PCG_Overridable, EditCondition="!bFixedMode", ClampMin="0", ClampMax="1"
- **Blueprint対応**: 読み書き可能

### bOutputDiscardedEntries
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: デフォルトでは破棄されたエントリを出力します。不要な場合はこのオプションを無効にします。
- **Blueprint対応**: 読み書き可能

### bHasCustomSeedSource
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: 属性をシード生成のソースとして使用します。ポイントの$Seedプロパティと同様または置き換えとして機能します。属性セットではポイントのようなユニークなシードがデフォルトでないため、主に有用です。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### CustomSeedSource
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: 選択シードの生成元となる属性を指定します。
- **メタフラグ**: PCG_Overridable, EditCondition="bHasCustomSeedSource"
- **Blueprint対応**: 読み書き可能

### bUseFirstAttributeOnly
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: trueに設定すると、最初の要素の属性のみを使用して選択シードを生成します。falseの場合、すべての値を使用して計算されます。
- **メタフラグ**: PCG_Overridable, EditCondition="bHasCustomSeedSource"
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 固定数のポイントをランダム選択
1. `bFixedMode`をtrueに設定
2. `FixedNumber`を`10`に設定
3. 実行すると、入力から10個のポイントがランダムに選択されます

### 例2: 割合でポイントを選択
1. `bFixedMode`をfalseに設定
2. `Ratio`を`0.3`に設定
3. 実行すると、入力の30%のポイントがランダムに選択されます

### 例3: 破棄されたエントリを無視
1. `bFixedMode`をtrueに設定
2. `FixedNumber`を`5`に設定
3. `bOutputDiscardedEntries`をfalseに設定
4. 実行すると、選択された5つのエントリのみが出力され、破棄されたエントリは出力されません

### 例4: カスタム属性をシードソースとして使用
1. `bHasCustomSeedSource`をtrueに設定
2. `CustomSeedSource`をカスタム属性（例: `ID`）に設定
3. `bUseFirstAttributeOnly`をtrueに設定
4. 実行すると、指定された属性の値に基づいてシードが生成され、再現可能なランダム選択が行われます

### 例5: すべての属性値からシードを生成
1. `bHasCustomSeedSource`をtrueに設定
2. `CustomSeedSource`を属性に設定
3. `bUseFirstAttributeOnly`をfalseに設定
4. 実行すると、すべての属性値を組み合わせてシードが生成されます

### 例6: バリエーションの生成
1. 複数のランダム選択ノードを異なるシード値で使用
2. 各ノードで`Ratio`を`0.5`に設定
3. 異なるバリエーションのポイント配置を生成できます

### 例7: 段階的なフィルタリング
1. 最初のRandom Choiceで`Ratio`を`0.5`に設定
2. 2番目のRandom Choiceで`Ratio`を`0.5`に設定
3. 連結すると、最終的に元の25%のポイントが残ります

## 実装の詳細

### クラス構造
```cpp
UCLASS(BlueprintType)
class UPCGRandomChoiceSettings : public UPCGSettings
```

### 入力ピン
- **In** (Primary): ランダム選択の対象となるデータ

### 出力ピン
- **Chosen**: ランダムに選択されたエントリ
- **Discarded**: 破棄されたエントリ（`bOutputDiscardedEntries`がtrueの場合のみ出力）

### 実行エレメント
```cpp
class FPCGRandomChoiceElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
    virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: RandomChoice（動的に生成）
- **表示名**: Random Choice（動的に生成）
- **ツールチップ**: Random Choice（動的に生成）
- **カテゴリ**: Filter
- **シード使用**: true（`UseSeed`がtrueを返す）
- **実行ループモード**: SinglePrimaryPin
- **Base Point Data対応**: true
- **動的ピン**: true

### 処理フロー
1. 入力データを取得
2. シード値を決定:
   - `bHasCustomSeedSource`がtrueの場合、カスタム属性からシードを生成
   - `bUseFirstAttributeOnly`に基づいて、最初の属性のみまたはすべての属性を使用
   - それ以外の場合、ノードのシード設定を使用
3. ランダムストリームを初期化
4. 選択する数を計算:
   - `bFixedMode`がtrueの場合、`FixedNumber`を使用
   - falseの場合、`Ratio × エントリ数`を計算
5. ランダムにインデックスを選択（重複なし）
6. 選択されたインデックスのエントリを`Chosen`ピンに追加
7. `bOutputDiscardedEntries`がtrueの場合、残りのエントリを`Discarded`ピンに追加
8. 両方の出力は元の順序を保持

### ランダム選択アルゴリズム
```cpp
// 疑似コード
TSet<int> SelectedIndices;
FRandomStream RandomStream(Seed);

int NumToSelect = bFixedMode ? FixedNumber : FMath::RoundToInt(Ratio * TotalEntries);
NumToSelect = FMath::Min(NumToSelect, TotalEntries);

while (SelectedIndices.Num() < NumToSelect)
{
    int RandomIndex = RandomStream.RandRange(0, TotalEntries - 1);
    SelectedIndices.Add(RandomIndex);
}

// 選択されたインデックスを元の順序でソート
SelectedIndices.Sort();
```

### ピンラベル定数
```cpp
namespace PCGRandomChoiceConstants
{
    const FName ChosenEntriesLabel = TEXT("Chosen");
    const FName DiscardedEntriesLabel = TEXT("Discarded");
}
```

## パフォーマンス考慮事項

### 最適化のポイント
- **固定数モード**: 選択する数が少ない場合、効率的です
- **割合モード**: 大量のデータに対して一定の割合を選択する場合に便利です
- **シード生成**: カスタムシードソースを使用する場合、属性アクセスのオーバーヘッドがあります
- **破棄エントリの出力**: `bOutputDiscardedEntries`をfalseに設定すると、不要なデータコピーを回避できます

### パフォーマンス特性
- **時間計算量**: O(N + K)（N = 選択する数、K = 総エントリ数）
- **空間計算量**: O(N)（選択されたインデックスセットの保存）
- **ランダム生成**: O(N)（N個のランダム数を生成）
- **ソート**: O(N log N)（選択されたインデックスのソート、順序保持のため）

### 最悪ケース
- 選択する数が総数に近い場合、重複チェックに時間がかかる可能性があります
- `bUseFirstAttributeOnly`がfalseで大量の要素がある場合、シード計算のコストが増加します

## 注意事項
- 選択されたエントリと破棄されたエントリは入力データと同じ順序で出力されます
- `FixedNumber`が総エントリ数より大きい場合、すべてのエントリが選択されます
- `Ratio`が1.0の場合、すべてのエントリが選択されます
- `Ratio`が0.0の場合、何も選択されません
- シード値が同じ場合、同じ入力に対して同じ結果が得られます（再現性）
- カスタムシードソースを使用すると、同じ属性値を持つデータに対して一貫した選択が行われます
- `bUseFirstAttributeOnly`をtrueに設定すると、最初の要素のみがシード生成に使用されます
- ポイントデータの場合、デフォルトで各ポイントの`$Seed`プロパティが使用されます
- 属性セットの場合、`bHasCustomSeedSource`を使用してシードを定義することが推奨されます

## 関連ノード
- **Density Filter**: 密度に基づくフィルタリング
- **Filter Elements By Index**: インデックスによる要素のフィルタリング
- **Self Pruning**: 重複するポイントの削除
- **Sample**: サンプリングによる要素の選択
- **Mutate Seed**: シード値の変更
- **Generate Seed**: シード値の生成
- **Random Select**: ランダムな選択（ブループリント）
