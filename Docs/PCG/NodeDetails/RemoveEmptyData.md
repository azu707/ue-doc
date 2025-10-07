# Remove Empty Data

## 概要
Remove Empty Dataノードは、入力ピン内の空のデータをすべて削除するノードです。データが空かどうかは、データのインデックスキーが存在するか、またはキーの数がゼロでないかで判定されます。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGRemoveEmptyDataSettings
- **エレメント**: FPCGRemoveEmptyDataElement
- **基底クラス**: UPCGSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGRemoveEmptyData.h
- **実装ファイル**: Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGRemoveEmptyData.cpp

## 機能詳細
このノードは`UPCGRemoveEmptyDataSettings`クラスとして実装されており、以下の処理を行います:

- 入力コレクション内の空のデータを検出して削除
- データのインデックスキーの存在と数に基づいて判定
- 空でないデータのみを出力ピンに転送
- すべてのデータ型に対応（Any型）

## プロパティ

このノードには設定可能なプロパティはありません。すべての動作は自動的に行われます。

## 使用例

### 例1: データクリーンアップ
1. 複数のデータソースを結合した後に配置
2. 実行すると、空のデータが自動的に削除され、有効なデータのみが通過します

### 例2: 条件付きデータ生成の後処理
1. 条件に応じてデータを生成するノード（生成されない場合もある）の後に配置
2. 実行すると、生成されなかった（空の）データが除外されます

### 例3: パイプラインの最適化
1. 長いパイプラインの途中に配置
2. 不要な空のデータを早期に削除し、後続のノードの処理を軽減します

### 例4: デバッグとバリデーション
1. データ生成パイプラインの最後に配置
2. 意図せず生成された空のデータを検出し、クリーンな出力を保証します

### 例5: 複数の入力の結合後
1. 複数のMergeやUnionノードの後に配置
2. 結合プロセスで生じた空のデータエントリを削除します

### 例6: フィルタリング後のクリーンアップ
1. フィルタノードの後に配置
2. フィルタリングの結果、要素がすべて削除されて空になったデータを除外します

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGRemoveEmptyDataSettings : public UPCGSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータコレクション（すべてのデータ型を受け入れ）

### 出力ピン
- **Out**: 空でないデータのみを含むコレクション（すべてのデータ型を出力可能）

### 実行エレメント
```cpp
class FPCGRemoveEmptyDataElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: RemoveEmptyData
- **表示名**: Remove Empty Data
- **ツールチップ**: "Remove all data in the input pin that is empty."
- **カテゴリ**: Filter
- **動的ピン**: true（入力データの型に応じてピンが変化）
- **必須ピン**: 入力ピンは必須

### 処理フロー
1. 入力データコレクションをデフォルト入力ピンから取得
2. 各入力データに対して以下をチェック:
   - データオブジェクトが存在するか（nullチェック）
   - データのインデックスキーを取得
   - キーが存在し、キー数が0より大きいか
3. 上記の条件を満たすデータのみを出力コレクションに追加
4. 出力コレクションをコンテキストに設定

### 空データの判定ロジック
```cpp
// 実装の抜粋
for (const FPCGTaggedData& Input : InContext->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel))
{
    if (!Input.Data)
    {
        continue; // nullデータは空とみなされる
    }

    // インデックスキーを取得
    const TUniquePtr<const IPCGAttributeAccessorKeys> Keys =
        PCGAttributeAccessorHelpers::CreateConstKeys(
            Input.Data,
            FPCGAttributePropertySelector::CreateExtraPropertySelector(EPCGExtraProperties::Index)
        );

    // キーが存在しないか、キー数が0の場合は空とみなす
    if (!Keys || Keys->GetNum() == 0)
    {
        continue;
    }

    // 空でないデータを出力に追加
    InContext->OutputData.TaggedData.Add(Input);
}
```

### インデックスキーについて
- インデックスキーは、データの要素にアクセスするためのキーです
- ポイントデータの場合、ポイント数を表します
- 属性セットの場合、エントリ数を表します
- その他のデータ型でも、要素数の指標として使用されます
- キーが存在しない、またはキー数が0の場合、データは空とみなされます

### パフォーマンス計測
```cpp
TRACE_CPUPROFILER_EVENT_SCOPE(FPCGRemoveEmptyDataElement::Execute);
```
実行時にCPUプロファイラーでパフォーマンスを計測できます。

## パフォーマンス考慮事項

### 最適化のポイント
- **軽量な処理**: 空チェックは非常に高速です（インデックスキーの取得のみ）
- **データコピーなし**: データ自体はコピーされず、参照のみが転送されます
- **早期リターン**: nullデータや空データは即座にスキップされます
- **インライン処理**: すべての処理が単一のループで完了します

### パフォーマンス特性
- **時間計算量**: O(N)（N = 入力データ数）
- **空間計算量**: O(1)（データの参照のみを保存）
- **空チェック**: O(1)（各データに対してインデックスキーの数を取得）

### パフォーマンスへの影響
- 大量の空データが存在する場合、このノードを使用することで後続の処理を大幅に最適化できます
- 入力が少数のデータのみで構成される場合、オーバーヘッドはほぼゼロです

## 注意事項
- このノードは空のデータを**削除**します（フィルタピンに移動するのではなく）
- 削除されたデータを取得する方法はありません
- データが空かどうかは、インデックスキーの存在と数で判定されます
- nullデータも空とみなされ、削除されます
- すべてのデータ型に対して機能します（Point、Spline、Volume、Attribute Setなど）
- タグ情報はそのまま保持されます
- データの順序は保持されます
- このノードは非破壊的です（元のデータは変更されません）

### 空と判定されるケース
- データオブジェクトがnullの場合
- インデックスキーが取得できない場合
- インデックスキーの数が0の場合
- ポイントデータでポイント数が0の場合
- 属性セットでエントリ数が0の場合

### 空でないと判定されるケース
- 少なくとも1つの要素（ポイント、エントリなど）を持つデータ
- インデックスキーが存在し、キー数が1以上の場合

## 関連ノード
- **Filter Data By Type**: データ型によるフィルタリング
- **Filter Data By Tag**: タグによるフィルタリング
- **Filter Data By Attribute**: 属性によるフィルタリング
- **Merge**: 複数のデータを結合
- **Union**: データの和集合
- **Get Points Count**: ポイント数を取得
- **Branch**: データの存在に基づく分岐
