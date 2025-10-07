# Filter Elements By Index

## 概要
Filter Elements By Indexノードは、インデックスに基づいてポイントや属性セットの個別要素をフィルタリングするノードです。2つの入力モードを持ち、別の入力からインデックスを取得するか、ユーザー定義のインデックス範囲表現を使用してフィルタリングできます。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGFilterElementsByIndexSettings
- **エレメント**: FPCGFilterElementsByIndexElement
- **基底クラス**: UPCGSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterElementsByIndex.h

## 機能詳細
このノードは`UPCGFilterElementsByIndexSettings`クラスとして実装されており、以下の処理を行います:

- ポイントデータまたは属性セットの個別要素をインデックスでフィルタリング
- 2つの入力モード: 入力データからインデックスを取得 / ユーザー定義範囲表現を使用
- 負のインデックスをサポート（配列の末尾からのカウント）
- フィルタの反転機能（選択と除外の切り替え）
- 破棄された要素を別のピンに出力するオプション

## プロパティ

### bSelectIndicesByInput
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: trueに設定すると、2番目の入力ピンからインデックスを取得します。falseの場合は、`SelectedIndices`プロパティで定義された範囲表現を使用します。
- **Blueprint対応**: 読み書き可能

### IndexSelectionAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: フィルタリングに使用するインデックスを定義する属性を指定します。`bSelectIndicesByInput`がtrueの場合に有効です。
- **メタフラグ**: PCG_Overridable, EditCondition="bSelectIndicesByInput"
- **Blueprint対応**: 読み書き可能

### SelectedIndices
- **型**: FString
- **デフォルト値**: ":"
- **カテゴリ**: Settings
- **説明**: 含めるまたは除外する個別のインデックスまたはインデックス範囲を指定します。負の終了インデックスが許可されます。
  - 書式: `"0,2,4:5,7:-1"`のように、カンマ区切りで指定
  - 範囲は`start:end`の形式で指定（コロン区切り）
  - 負のインデックスは末尾からのカウント（-1は最後の要素）
  - 例: サイズ10の配列で`"0,2,4:5,7:-1"`は、インデックス0, 2, 4, 7, 8を含みます
- **メタフラグ**: PCG_Overridable, EditCondition="!bSelectIndicesByInput"
- **Blueprint対応**: 読み書き可能

### bOutputDiscardedElements
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、破棄された要素を`Outside Filter`ピンに出力します。
- **Blueprint対応**: 読み書き可能

### bInvertFilter
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、フィルタが反転し、指定されたインデックスが除外され、それ以外が含まれるようになります。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 特定のインデックスを選択（手動指定）
1. `bSelectIndicesByInput`をfalseに設定
2. `SelectedIndices`に`"0,2,4,6"`と入力
3. `bInvertFilter`をfalseに設定
4. 実行すると、インデックス0, 2, 4, 6のポイントが`In Filter`ピンに出力されます

### 例2: 範囲を選択
1. `bSelectIndicesByInput`をfalseに設定
2. `SelectedIndices`に`"10:20"`と入力
3. 実行すると、インデックス10から19までのポイントが選択されます

### 例3: 入力データからインデックスを取得
1. `bSelectIndicesByInput`をtrueに設定
2. 2番目の入力ピンにインデックスを含むデータを接続
3. `IndexSelectionAttribute`をインデックス値を持つ属性（例: `TargetIndex`）に設定
4. 実行すると、指定された属性の値に対応するインデックスのポイントが選択されます

### 例4: 負のインデックスで末尾を選択
1. `bSelectIndicesByInput`をfalseに設定
2. `SelectedIndices`に`"-5:-1"`と入力
3. 実行すると、最後の5要素が選択されます

### 例5: フィルタを反転
1. `bSelectIndicesByInput`をfalseに設定
2. `SelectedIndices`に`"0:10"`と入力
3. `bInvertFilter`をtrueに設定
4. 実行すると、インデックス0から9を除くすべての要素が選択されます

### 例6: 破棄された要素も出力
1. `SelectedIndices`に`"0:50"`と入力
2. `bOutputDiscardedElements`をtrueに設定
3. 実行すると、選択された要素が`In Filter`ピンに、破棄された要素が`Outside Filter`ピンに出力されます

### 例7: 属性セットのフィルタリング
1. 入力に属性セットを接続
2. `SelectedIndices`に`":10"`と入力（最初の10要素）
3. 実行すると、属性セットの最初の10要素のみが出力されます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGFilterElementsByIndexSettings : public UPCGSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のポイントデータまたは属性セット
- **Index Selection** (Optional): インデックスを定義するデータ（`bSelectIndicesByInput`がtrueの場合に使用）

### 出力ピン
- **In Filter**: フィルタ条件を満たす要素
- **Outside Filter**: フィルタ条件を満たさない要素（`bOutputDiscardedElements`がtrueの場合のみ表示）

### 実行エレメント
```cpp
class FPCGFilterElementsByIndexElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* InContext) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: FilterElementsByIndex
- **表示名**: Filter Elements By Index
- **ツールチップ**: "Filters points or the elements of an attribute set based on a second input of points, attribute sets, or a user-defined index range expression."
- **カテゴリ**: Filter
- **Base Point Data対応**: true（継承元のポイントデータをサポート）
- **動的ピン**: true（入力データの型に応じてピンが変化）

### 処理フロー

#### 入力モード（bSelectIndicesByInput = true）
1. 主入力データ（ポイントまたは属性セット）を取得
2. インデックス選択入力データを取得
3. `IndexSelectionAttribute`で指定された属性からインデックス値を読み取り
4. 読み取ったインデックスセットを構築
5. `bInvertFilter`がtrueの場合、セットを反転
6. 各要素のインデックスをチェックし、セットに含まれるかを判定
7. 条件を満たす要素を`In Filter`ピン、満たさない要素を`Outside Filter`ピン（有効な場合）に振り分け

#### 範囲表現モード（bSelectIndicesByInput = false）
1. 主入力データ（ポイントまたは属性セット）を取得
2. `SelectedIndices`文字列をパースしてインデックスセットを構築
3. カンマで区切られた各トークンを処理:
   - コロンが含まれる場合は範囲として処理（`start:end`）
   - コロンが含まれない場合は個別のインデックスとして処理
   - 負のインデックスは配列サイズに基づいて正のインデックスに変換
4. `bInvertFilter`がtrueの場合、選択セットを反転
5. 各要素のインデックスをチェックし、選択セットに含まれるかを判定
6. 条件を満たす要素を`In Filter`ピン、満たさない要素を`Outside Filter`ピン（有効な場合）に振り分け

### インデックス範囲表現のパース例
- `"0"`: インデックス0のみ
- `"0,2,4"`: インデックス0, 2, 4
- `"0:5"`: インデックス0, 1, 2, 3, 4
- `":"`: すべてのインデックス（0から末尾まで）
- `":-1"`: インデックス0から末尾の1つ前まで
- `"-3:-1"`: 末尾から3番目から末尾まで
- `"0,2,4:7,9:-1"`: 複数の個別インデックスと範囲の組み合わせ

### 追加タイトル情報
```cpp
virtual FString GetAdditionalTitleInformation() const override;
```
ノードのタイトルに追加情報を表示し、現在の設定を視覚的に示します。

## パフォーマンス考慮事項

### 最適化のポイント
- **インデックスセット**: 内部的にセットまたはビットセットを使用することで、高速な検索が可能です
- **範囲表現**: 個別のインデックスよりも範囲指定の方が効率的です
- **入力モード**: 入力からインデックスを取得する場合、属性アクセスのオーバーヘッドがあります
- **要素数**: フィルタリングの時間は要素数に比例します

### パフォーマンス特性
- **時間計算量**:
  - 範囲表現モード: O(N + M)（N = 要素数、M = 指定されたインデックス/範囲の数）
  - 入力モード: O(N + K)（K = インデックス選択入力の要素数）
- **空間計算量**: O(L)（L = 選択されたインデックスの数）
- **パース処理**: O(M)（Mは`SelectedIndices`文字列の長さ）

## 注意事項
- このノードは個別の要素をフィルタリングします（データ全体ではなく）
- インデックスは0始まりです（最初の要素はインデックス0）
- 負のインデックスは末尾からのカウントです（-1は最後の要素、-2は最後から2番目）
- 範囲指定は`start:end`の形式で、endは含まれません（半開区間）
- 無効なインデックス（範囲外）は無視されます
- 空の`SelectedIndices`文字列（範囲表現モード）またはインデックス属性の欠如（入力モード）は何も選択しません
- `bInvertFilter`を使用すると、選択と除外を簡単に切り替えられます
- `bOutputDiscardedElements`をfalseに設定すると、破棄された要素は完全に削除されます
- ポイントデータと属性セットの両方をサポートします

## 関連ノード
- **Filter Data By Index**: データコレクション全体をインデックスでフィルタリング
- **Filter Attribute Elements**: 属性値で個別要素をフィルタリング
- **Random Choice**: ランダムに要素を選択
- **Density Filter**: 密度に基づく要素のフィルタリング
- **Array Get**: 配列から特定のインデックスの要素を取得
- **Slice**: データをスライス
- **Sample**: サンプリングによる要素の選択
