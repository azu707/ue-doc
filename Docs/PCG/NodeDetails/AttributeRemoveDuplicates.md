# Attribute Remove Duplicates

## 概要
Attribute Remove Duplicatesノードは、指定された属性の値に基づいてデータから重複を削除します。同じ属性値の組み合わせを持つエントリから最初のものだけを保持し、残りを削除します。

## 機能詳細
このノードは指定された1つ以上の属性の値に基づいてパーティションを作成し、各パーティションから最初のエントリのみを保持することで重複を削除します。

### 主な機能
- **重複除去**: 指定された属性値の組み合わせが同じエントリを削除
- **複数属性対応**: 複数の属性を組み合わせて一意性を判定
- **最初のエントリを保持**: 各一意の組み合わせから最初のエントリのみを保持
- **動的ピン**: 出力ピンプロパティが動的に変更

### 処理フロー
1. 指定された属性の値を各エントリから取得
2. 属性値の組み合わせでパーティションを作成
3. 各パーティションから最初のエントリのみを選択
4. 選択されたエントリのみを含むデータを出力

## プロパティ

### AttributeSelectors
- **型**: TArray<FPCGAttributePropertyInputSelector>
- **デフォルト値**: 空のセレクター1つ
- **説明**: 重複除去の判定に使用する属性のリスト
- **使用**: 複数の属性を指定可能。すべての属性値の組み合わせで一意性を判定します
- **TODO**: 配列のオーバーライドがサポートされたら PCG_Overridable を追加予定

### AttributeNamesToRemoveDuplicates
- **型**: FString
- **PCG_Overridable**: あり
- **説明**: 重複除去に使用する属性名の文字列（レガシー用）
- **TODO**: 配列オーバーライドがサポートされたら非推奨予定

## 使用例

### タイプIDによる重複除去
```
// TypeID属性で重複を削除
AttributeSelectors: [TypeID]
結果: 各TypeIDの最初のエントリのみが保持される
```

### 複数属性による一意性判定
```
// 位置とカテゴリの組み合わせで重複を削除
AttributeSelectors: [Position, Category]
結果: 同じ(Position, Category)の組み合わせから最初のエントリのみが保持される
```

### 名前による重複除去
```
// 名前が同じエントリを削除
AttributeSelectors: [Name]
結果: 各ユニークな名前の最初のエントリのみが保持される
```

### 座標の重複除去
```
// X, Y座標の組み合わせで重複を削除（グリッドのスナップなど）
AttributeSelectors: [GridX, GridY]
結果: 各グリッドセルで最初のポイントのみが保持される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGAttributeRemoveDuplicatesElement`（`IPCGElement`を継承）

### 特徴
- **動的ピン**: `HasDynamicPins()` が `true` - 出力ピンプロパティが動的に変更
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### 重複除去アルゴリズム
1. 指定された属性の値を読み取り
2. 一意の値の組み合わせを識別（Attribute Partitionと同様）
3. 各一意の組み合わせグループから最初のエントリのみを選択
4. 選択されたエントリで新しいデータを構築

### Attribute Partitionとの関係
内部的にはAttribute Partitionと似たロジックを使用しますが、各パーティションから最初のエントリのみを保持する点が異なります。

## 注意事項

1. **順序依存**: 最初のエントリが保持されるため、入力データの順序が結果に影響します
2. **属性の選択**: 一意性を判定する属性は慎重に選択してください
3. **浮動小数点の比較**: 浮動小数点属性を使用する場合、微小な差異でも異なる値として扱われます
4. **パフォーマンス**: 多数の属性を指定すると処理が重くなる可能性があります
5. **空の属性リスト**: AttributeSelectorsが空の場合、重複除去は行われません

## 関連ノード
- **Attribute Partition**: 属性値でデータを分割
- **Filter Data By Attribute**: 属性値でフィルタリング
- **Sort Attributes**: 属性値でソート（順序制御に使用可能）
- **Self Pruning**: 空間的な重複を削除

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeRemoveDuplicates.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGAttributeRemoveDuplicates.cpp`
