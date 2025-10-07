# Filter Data By Index

## 概要
Filter Data By Indexノードは、ユーザー定義のインデックス範囲表現に基づいてデータコレクションをフィルタリングするノードです。個別のインデックスや範囲を指定して、データコレクションから特定の要素を選択または除外できます。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGFilterByIndexSettings
- **エレメント**: FPCGFilterByIndexElement
- **基底クラス**: UPCGFilterDataBaseSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByIndex.h

## 機能詳細
このノードは`UPCGFilterByIndexSettings`クラスとして実装されており、以下の処理を行います:

- インデックス範囲表現を使用したデータコレクションのフィルタリング
- 個別のインデックスや範囲を柔軟に指定可能
- 負のインデックスをサポート（配列の末尾からのカウント）
- フィルタの反転機能（選択と除外の切り替え）
- データ全体をフィルタ（個別の要素ではなく、データ自体を振り分け）

## プロパティ

### bInvertFilter
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、フィルタが反転し、指定されたインデックスが除外され、それ以外が含まれるようになります。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### SelectedIndices
- **型**: FString
- **デフォルト値**: 空文字列
- **カテゴリ**: Settings
- **説明**: 含めるまたは除外する個別のインデックスまたはインデックス範囲を指定します。負の終了インデックスが許可されます。
  - 書式: `"0,2,4:5,7:-1"`のように、カンマ区切りで指定
  - 範囲は`start:end`の形式で指定（コロン区切り）
  - 負のインデックスは末尾からのカウント（-1は最後の要素）
  - 例: サイズ10の配列で`"0,2,4:5,7:-1"`は、インデックス0, 2, 4, 7, 8を含みます
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 個別のインデックスを選択
1. `SelectedIndices`に`"0,2,4,6"`と入力
2. `bInvertFilter`をfalseに設定
3. 実行すると、データコレクションのインデックス0, 2, 4, 6のデータが`In Filter`ピンに出力されます

### 例2: 範囲を選択
1. `SelectedIndices`に`"0:5"`と入力
2. `bInvertFilter`をfalseに設定
3. 実行すると、インデックス0から5までのデータ（0, 1, 2, 3, 4を含む）が`In Filter`ピンに出力されます

### 例3: 複数の範囲と個別インデックスの組み合わせ
1. `SelectedIndices`に`"0,2:5,7,10:15"`と入力
2. `bInvertFilter`をfalseに設定
3. 実行すると、インデックス0, 2, 3, 4, 7, 10, 11, 12, 13, 14のデータが選択されます

### 例4: 負のインデックスを使用
1. `SelectedIndices`に`"7:-1"`と入力（配列のサイズが10の場合）
2. `bInvertFilter`をfalseに設定
3. 実行すると、インデックス7, 8, 9のデータ（最後の3要素）が選択されます

### 例5: 全範囲を選択
1. `SelectedIndices`に`":"`と入力
2. 実行すると、すべてのデータが選択されます（開始と終了を省略すると全範囲）

### 例6: フィルタを反転
1. `SelectedIndices`に`"0:5"`と入力
2. `bInvertFilter`をtrueに設定
3. 実行すると、インデックス0から4以外のすべてのデータが`In Filter`ピンに出力されます

### 例7: 最初と最後の要素を除外
1. `SelectedIndices`に`"0,-1"`と入力
2. `bInvertFilter`をtrueに設定
3. 実行すると、最初と最後の要素を除くすべてのデータが選択されます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGFilterByIndexSettings : public UPCGFilterDataBaseSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータコレクション

### 出力ピン
- **In Filter**: 指定されたインデックス条件を満たすデータ（`bInvertFilter`がfalseの場合は選択されたインデックス、trueの場合は選択されていないインデックス）
- **Outside Filter**: 指定されたインデックス条件を満たさないデータ

### 実行エレメント
```cpp
class FPCGFilterByIndexElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: FilterDataByIndex（動的に生成）
- **表示名**: Filter Data By Index（動的に生成）
- **ツールチップ**: Filter Data By Index（動的に生成）
- **カテゴリ**: Filter
- **Base Point Data対応**: true（継承元のポイントデータをサポート）
- **動的ピン**: true（入力データの型に応じてピンが変化）

### 処理フロー
1. 入力データコレクションを取得
2. `SelectedIndices`文字列をパースしてインデックスセットを構築
3. カンマで区切られた各トークンを処理:
   - コロンが含まれる場合は範囲として処理（`start:end`）
   - コロンが含まれない場合は個別のインデックスとして処理
   - 負のインデックスは配列サイズに基づいて正のインデックスに変換
4. `bInvertFilter`がtrueの場合、選択セットを反転
5. 各データのインデックスをチェックし、選択セットに含まれるかを判定
6. 条件を満たすデータを`In Filter`ピン、満たさないデータを`Outside Filter`ピンに振り分け

### インデックス範囲表現のパース例
- `"0"`: インデックス0のみ
- `"0,2,4"`: インデックス0, 2, 4
- `"0:5"`: インデックス0, 1, 2, 3, 4
- `":"`: すべてのインデックス（0から末尾まで）
- `":-1"`: インデックス0から末尾の1つ前まで
- `"-3:-1"`: 末尾から3番目から末尾まで
- `"0,2,4:7,9:-1"`: 複数の個別インデックスと範囲の組み合わせ

### 変更の影響範囲
```cpp
#if WITH_EDITOR
virtual EPCGChangeType GetChangeTypeForProperty(const FName& InPropertyName) const override
{
    return Super::GetChangeTypeForProperty(InPropertyName) | EPCGChangeType::Cosmetic;
}
#endif
```
プロパティの変更は構造的変更とコスメティック変更の両方として扱われます。

## パフォーマンス考慮事項

### 最適化のポイント
- **インデックス範囲**: 個別のインデックスよりも範囲指定の方が効率的です
- **パース処理**: `SelectedIndices`文字列は一度だけパースされ、結果がキャッシュされます
- **データ数**: フィルタリングの時間はデータコレクションのサイズに比例します
- **インデックスセット**: 内部的にセット（またはビットセット）を使用することで、高速な検索が可能です

### パフォーマンス特性
- **時間計算量**: O(N + M)（N = データ数、M = 指定されたインデックス/範囲の数）
- **空間計算量**: O(K)（K = 選択されたインデックスの数）
- **パース処理**: O(M)（Mは`SelectedIndices`文字列の長さ）

## 注意事項
- インデックスは0始まりです（最初の要素はインデックス0）
- 負のインデックスは末尾からのカウントです（-1は最後の要素、-2は最後から2番目）
- 範囲指定は`start:end`の形式で、endは含まれません（半開区間）
- 無効なインデックス（範囲外）は無視されます
- 空の`SelectedIndices`文字列は何も選択しません
- `bInvertFilter`を使用すると、選択と除外を簡単に切り替えられます
- このノードはデータコレクション全体をフィルタリングします（個別の要素ではなく）
- データコレクションの各データは1つのユニットとして扱われます

## 関連ノード
- **Filter Elements By Index**: 個別の要素（ポイントや属性セット要素）をインデックスでフィルタリング
- **Filter Data By Tag**: タグによるデータコレクションのフィルタリング
- **Filter Data By Type**: データ型によるフィルタリング
- **Filter Data By Attribute**: 属性によるフィルタリング
- **Array Get**: 配列から特定のインデックスの要素を取得
- **Slice**: データコレクションをスライス
