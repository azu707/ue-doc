# Attribute Partition

## 概要
Attribute Partitionノードは、選択された属性の値に基づいてデータを分割し、異なる値を持つポイントを別々の出力データに分けます。グループ化やカテゴリ分けに使用され、GPUでの実行もサポートしています。

## 機能詳細
このノードは1つ以上の属性の値に基づいてポイントデータをパーティション（分割）します。同じ属性値の組み合わせを持つポイントが同じパーティションにグループ化されます。

### 主な機能
- **属性ベースのパーティショニング**: 複数の属性値の組み合わせでデータを分割
- **パーティションインデックス**: 各パーティションに一意のインデックスを割り当て可能
- **インデックスのみモード**: 実際には分割せず、インデックスのみを割り当てることも可能
- **GPU実行サポート**: GPUでの高速処理に対応
- **動的出力ピン**: パーティション数に応じて動的に出力ピンを生成

### 処理フロー
1. 指定された属性の値の組み合わせを取得
2. 一意の組み合わせごとにパーティションを作成
3. 各パーティションに一意のインデックスを割り当て（オプション）
4. パーティションごとにポイントをグループ化
5. 各パーティションを個別の出力データとして出力

## プロパティ

### PartitionAttributeSelectors
- **型**: TArray<FPCGAttributePropertyInputSelector>
- **デフォルト値**: 空のセレクター1つ
- **説明**: パーティション分割に使用する属性のリスト
- **使用**: 複数の属性を指定可能。すべての属性値の組み合わせで分割されます
- **TODO**: 配列のオーバーライドがサポートされたら PCG_Overridable を追加予定

### PartitionAttributeNames
- **型**: FString
- **PCG_Overridable**: あり
- **説明**: パーティション属性名の文字列（レガシー用）
- **TODO**: 配列オーバーライドがサポートされたら非推奨予定

### bTokenizeOnWhiteSpace (非推奨)
- **型**: bool
- **デフォルト値**: false
- **説明**: スペースを区切り文字として使用する古い動作を有効化
- **⚠️ 非推奨（5.5）**: この機能は非推奨です

### bAssignIndexPartition
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **表示名**: Output Partition Index
- **説明**: パーティションインデックスを追加属性として割り当てます

### bDoNotPartition
- **型**: bool
- **デフォルト値**: true
- **PCG_Overridable**: あり
- **表示条件**: `bAssignIndexPartition == true`
- **説明**: 有効にすると、実際には分割せず、パーティションインデックスのみを元のデータに割り当てます

### PartitionIndexAttributeName
- **型**: FName
- **デフォルト値**: "PartitionIndex"
- **PCG_Overridable**: あり
- **表示条件**: `bAssignIndexPartition == true`
- **説明**: パーティションインデックス属性の名前

## 使用例

### タイプ別の分割
```
// TypeID属性に基づいてポイントを分割
PartitionAttributeSelectors: [TypeID]
bAssignIndexPartition: false
bDoNotPartition: false
結果: TypeIDの値ごとに別々の出力データが生成される
```

### 複数属性による分割
```
// 生物群系とレイヤーの組み合わせで分割
PartitionAttributeSelectors: [BiomeType, Layer]
結果: 各(BiomeType, Layer)の組み合わせごとに出力が生成される
```

### インデックスのみ割り当て
```
// 分割せずにカテゴリインデックスのみ割り当て
PartitionAttributeSelectors: [Category]
bAssignIndexPartition: true
bDoNotPartition: true
PartitionIndexAttributeName: "CategoryIndex"
結果: 元のデータに"CategoryIndex"属性が追加され、各カテゴリに一意の番号が割り当てられる
```

### パーティションインデックス付き分割
```
// 分割してインデックスも付与
PartitionAttributeSelectors: [MaterialType]
bAssignIndexPartition: true
bDoNotPartition: false
PartitionIndexAttributeName: "PartitionID"
結果: MaterialTypeごとに分割され、各出力に"PartitionID"属性が追加される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGMetadataPartitionElement`（`IPCGElement`を継承）

### 特徴
- **GPU実行**: `DisplayExecuteOnGPUSetting()` が `true` - GPU実行オプションを表示
- **カーネル生成**: GPUコンピュートカーネルの生成をサポート
- **動的ピン**: `HasDynamicPins()` が `true` - 出力ピンが動的に生成
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### パーティショニングアルゴリズム
1. すべてのパーティション属性の値を読み取り
2. 一意の値の組み合わせを識別
3. 各組み合わせにインデックスを割り当て
4. ポイントを対応するパーティションに分類
5. 各パーティションを個別の出力データとして生成

### 出力構造
- **bDoNotPartition = false**: 各パーティションが個別の出力ピンから出力される
- **bDoNotPartition = true**: 元のデータに属性が追加されて単一の出力として出力される

## 注意事項

1. **パーティション数**: 一意の組み合わせが多いと、大量の出力データが生成されます
2. **メモリ使用**: パーティション数が多い場合、メモリ使用量が増加します
3. **属性の選択**: パーティション属性は離散値（整数、列挙型、文字列など）が適しています
4. **GPU実行**: 大規模データセットではGPU実行を検討してください
5. **インデックス範囲**: パーティションインデックスは0から始まる連番です

## 関連ノード
- **Filter Data By Attribute**: 特定の属性値でフィルタリング
- **Sort Attributes**: 属性値でソート
- **Partition by Actor Data Layers**: Data Layerによるパーティション
- **Select**: 条件分岐

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataPartition.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataPartition.cpp`
- **GPUカーネル**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataPartitionKernel.h`
