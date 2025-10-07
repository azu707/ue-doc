# Filter Attribute Elements

## 概要
Filter Attribute Elementsノードは、属性値やプロパティに基づいて要素（ポイントや属性セット）をフィルタリングするノードです。"A op B" 形式の比較を行い、条件を満たす要素を出力します。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGAttributeFilteringSettings
- **エレメント**: FPCGAttributeFilterElement
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeFilter.h

## 機能詳細
このノードは`UPCGAttributeFilteringSettings`クラスとして実装されており、以下の処理を行います:

- 入力データの属性またはプロパティを指定された演算子で比較
- 定数値、他のデータの属性、またはプロパティとの比較が可能
- Spatial DataまたはAttribute Setの要素をフィルタリング
- 条件を満たす要素と満たさない要素を別々のピンに出力

### フィルタリングの例
- プロパティと定数の比較: `A.Density > 0.5`
- 属性と定数の比較: `A.aaa != "bob"`
- プロパティと属性の比較: `A.density >= B.bbb`
- プロパティとプロパティの比較: `A.density <= B.steepness`
- 属性と属性の比較: `A.aaa < B.bbb`
- 属性とプロパティの比較: `A.aaa == B.color`

## プロパティ

### Operator
- **型**: EPCGAttributeFilterOperator
- **デフォルト値**: Greater (>)
- **カテゴリ**: Settings
- **説明**: フィルタリングに使用する比較演算子を指定します。
  - **Greater (>)**: より大きい
  - **GreaterOrEqual (>=)**: 以上
  - **Lesser (<)**: より小さい
  - **LesserOrEqual (<=)**: 以下
  - **Equal (=)**: 等しい
  - **NotEqual (!=)**: 等しくない
  - **Substring**: 部分文字列を含む（文字列型のみ）
  - **Matches**: 正規表現にマッチ（文字列型のみ）
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### TargetAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: 比較対象となる入力データの属性またはプロパティを指定します。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bUseConstantThreshold
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、定数値と比較します。falseの場合は、別の入力ピンから比較値を取得します。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### ThresholdAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: 比較に使用する閾値の属性またはプロパティを指定します。`bUseConstantThreshold`がfalseの場合に有効です。
- **メタフラグ**: PCG_Overridable, EditCondition="!bUseConstantThreshold"
- **Blueprint対応**: 読み書き可能

### bUseSpatialQuery
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: ポイントデータの場合、サンプリングを使用するか、1対1の直接比較を行うかを制御します。Spatial Dataの場合は常にtrue、Attribute Setの場合は常にfalseです。
- **メタフラグ**: PCG_Overridable, EditCondition="!bUseConstantThreshold"
- **Blueprint対応**: 読み書き可能

### AttributeTypes
- **型**: FPCGMetadataTypesConstantStruct
- **カテゴリ**: Settings
- **説明**: `bUseConstantThreshold`がtrueの場合に使用する定数値を指定します。数値、ベクトル、文字列など、さまざまな型をサポートします。
- **メタフラグ**: PCG_NotOverridable, EditCondition="bUseConstantThreshold", ShowOnlyInnerProperties
- **Blueprint対応**: 読み書き可能

### bWarnOnDataMissingAttribute
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: 入力データまたはフィルタデータに指定された属性が存在しない場合に警告を出力するかどうかを制御します。
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 密度による基本的なフィルタリング
1. `TargetAttribute`を`Density`プロパティに設定
2. `Operator`を`Greater (>)`に設定
3. `bUseConstantThreshold`をtrueに設定
4. `AttributeTypes`で定数値を`0.5`に設定
5. 実行すると、密度が0.5より大きいポイントが`In Filter`ピンに出力されます

### 例2: 属性間の比較
1. `TargetAttribute`を比較したい属性（例: `Height`）に設定
2. `Operator`を適切な演算子（例: `GreaterOrEqual (>=)`）に設定
3. `bUseConstantThreshold`をfalseに設定
4. Filterピンに別のデータを接続
5. `ThresholdAttribute`を比較基準の属性（例: `MinHeight`）に設定
6. 実行すると、`Height >= MinHeight`の条件を満たすポイントがフィルタリングされます

### 例3: 文字列マッチング
1. `TargetAttribute`を文字列属性（例: `Category`）に設定
2. `Operator`を`Substring`または`Matches`に設定
3. `bUseConstantThreshold`をtrueに設定
4. `AttributeTypes`で検索パターンを指定
5. 実行すると、指定されたパターンにマッチする要素がフィルタリングされます

### 例4: プロパティとプロパティの比較
1. `TargetAttribute`を`Steepness`プロパティに設定
2. `Operator`を`Lesser (<)`に設定
3. `bUseConstantThreshold`をfalseに設定
4. `ThresholdAttribute`を`Density`プロパティに設定
5. 実行すると、`Steepness < Density`の条件を満たすポイントがフィルタリングされます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGAttributeFilteringSettings : public UPCGSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータ（Spatial DataまたはAttribute Set）
- **Filter**: 比較に使用するデータ（`bUseConstantThreshold`がfalseの場合に使用）

### 出力ピン
- **In Filter**: フィルタ条件を満たす要素
- **Outside Filter**: フィルタ条件を満たさない要素

### 実行エレメント
```cpp
class FPCGAttributeFilterElement : public FPCGAttributeFilterElementBase
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
};
```

### ノードの特徴
- **ノード名**: AttributeFilter
- **表示名**: Filter Attribute Elements
- **カテゴリ**: Filter
- **実行ループモード**: SinglePrimaryPin
- **Base Point Data対応**: true（継承元のポイントデータをサポート）
- **動的ピン**: true（入力データの型に応じてピンが変化）

### 処理フロー
1. 入力データとフィルタデータを取得
2. ターゲット属性/プロパティのアクセサを作成
3. 閾値が定数の場合は値を取得、そうでない場合はフィルタデータからアクセサを作成
4. 各要素に対して指定された演算子で比較を実行
5. 条件を満たす要素を`In Filter`ピン、満たさない要素を`Outside Filter`ピンに振り分け

### コードスニペット
```cpp
// 比較演算子の適用（ヘルパー関数）
template <typename T>
bool ApplyCompare(const T& Input1, const T& Input2, EPCGAttributeFilterOperator Operation)
{
    if (Operation == EPCGAttributeFilterOperator::Equal)
    {
        return PCG::Private::MetadataTraits<T>::Equal(Input1, Input2);
    }
    else if (Operation == EPCGAttributeFilterOperator::NotEqual)
    {
        return !PCG::Private::MetadataTraits<T>::Equal(Input1, Input2);
    }
    // ... その他の演算子
}
```

### Preconfigured Settings
このノードは2つの事前構成設定を公開します:
- **Attribute Filter**: デフォルトの属性フィルタ
- **Point Filter**: ポイント専用フィルタ（異なるデフォルト値を持つ）

## パフォーマンス考慮事項

### 最適化のポイント
- **Spatial Query**: `bUseSpatialQuery`をfalseに設定すると、1対1の直接比較になり、高速化される場合があります
- **データ型**: 数値型の比較は文字列型の比較よりも高速です
- **データサイズ**: 大量のポイントをフィルタリングする場合、処理時間が増加します
- **属性アクセス**: 属性へのアクセスはプロパティアクセスよりもわずかにコストが高くなります

### パフォーマンス特性
- **時間計算量**: O(N)（N = 入力要素数）
- **空間計算量**: O(N)（フィルタリング結果の保存）
- **Spatial Query使用時**: 空間クエリのオーバーヘッドが追加されます

## 注意事項
- 比較する属性の型は互換性がある必要があります（暗黙的な型変換が行われる場合があります）
- 文字列の比較演算子（Substring、Matches）は文字列型の属性でのみ使用可能です
- `bWarnOnDataMissingAttribute`がtrueの場合、属性が存在しないとログに警告が出力されます
- Spatial Query使用時、フィルタデータがSpatial Dataでない場合はエラーになる可能性があります
- 非推奨の`bHasSpatialToPointDeprecation`フラグは、古いプロジェクトからの移行用です

## 関連ノード
- **Filter Attribute Elements by Range**: 範囲指定でのフィルタリング（2つの閾値を使用）
- **Filter Data By Attribute**: データ全体を属性の存在や値でフィルタリング
- **Density Filter**: 密度に特化したフィルタリング
- **Distance**: 距離による要素のフィルタリング
- **Attribute Compare Op**: 属性の比較演算
- **Select**: 条件に基づく属性の選択
