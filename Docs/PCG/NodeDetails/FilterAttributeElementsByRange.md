# Filter Attribute Elements by Range

## 概要
Filter Attribute Elements by Rangeノードは、属性値やプロパティが指定された範囲内にあるかどうかで要素（ポイントや属性セット）をフィルタリングするノードです。最小値と最大値の2つの閾値を使用して範囲を定義し、条件を満たす要素を出力します。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGAttributeFilteringRangeSettings
- **エレメント**: FPCGAttributeFilterRangeElement
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeFilter.h

## 機能詳細
このノードは`UPCGAttributeFilteringRangeSettings`クラスとして実装されており、以下の処理を行います:

- 入力データの属性またはプロパティを指定された範囲と比較
- 最小値と最大値の定義に定数値、他のデータの属性、またはプロパティを使用可能
- Spatial DataまたはAttribute Setの要素をフィルタリング
- 範囲の境界値を含む/含まないを個別に設定可能

### フィルタリングの例
- プロパティと定数の範囲比較: `A.Density in [0.2, 0.5]`
- 属性と定数の範囲比較: `A.aaa in [0.4, 0.6]`
- プロパティと属性の範囲比較: `A.density in [B.bbmin, B.bbmax]`
- プロパティとプロパティの範囲比較: `A.density in [B.position.x, B.steepness]`
- 属性と属性の範囲比較: `A.aaa in [B.bbmin, B.bbmax]`
- 属性とプロパティの範囲比較: `A.aaa in [B.position, B.scale]`

## プロパティ

### TargetAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: 範囲比較の対象となる入力データの属性またはプロパティを指定します。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### MinThreshold
- **型**: FPCGAttributeFilterThresholdSettings
- **カテゴリ**: Settings
- **説明**: 範囲の最小値を定義する閾値設定です。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

#### MinThreshold.bInclusive
- **型**: bool
- **デフォルト値**: true
- **説明**: 最小閾値を範囲に含めるか（>=）、含めないか（>）を指定します。

#### MinThreshold.bUseConstantThreshold
- **型**: bool
- **デフォルト値**: false
- **説明**: trueに設定すると、定数値を最小閾値として使用します。

#### MinThreshold.ThresholdAttribute
- **型**: FPCGAttributePropertyInputSelector
- **説明**: 最小閾値として使用する属性またはプロパティを指定します（`bUseConstantThreshold`がfalseの場合）。

#### MinThreshold.bUseSpatialQuery
- **型**: bool
- **デフォルト値**: true
- **説明**: ポイントデータの場合、サンプリングを使用するかを制御します。

#### MinThreshold.AttributeTypes
- **型**: FPCGMetadataTypesConstantStruct
- **説明**: `bUseConstantThreshold`がtrueの場合に使用する定数値を指定します。

### MaxThreshold
- **型**: FPCGAttributeFilterThresholdSettings
- **カテゴリ**: Settings
- **説明**: 範囲の最大値を定義する閾値設定です。MinThresholdと同じサブプロパティを持ちます。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

#### MaxThreshold.bInclusive
- **型**: bool
- **デフォルト値**: true
- **説明**: 最大閾値を範囲に含めるか（<=）、含めないか（<）を指定します。

### bWarnOnDataMissingAttribute
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: 入力データまたはフィルタデータに指定された属性が存在しない場合に警告を出力するかどうかを制御します。
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 密度の範囲フィルタリング
1. `TargetAttribute`を`Density`プロパティに設定
2. `MinThreshold.bUseConstantThreshold`をtrueに設定し、値を`0.3`に設定
3. `MinThreshold.bInclusive`をtrueに設定
4. `MaxThreshold.bUseConstantThreshold`をtrueに設定し、値を`0.7`に設定
5. `MaxThreshold.bInclusive`をtrueに設定
6. 実行すると、密度が`0.3 <= Density <= 0.7`の範囲にあるポイントが`In Filter`ピンに出力されます

### 例2: 高度による地形フィルタリング
1. `TargetAttribute`をカスタム属性`Elevation`に設定
2. `MinThreshold.bUseConstantThreshold`をfalseに設定
3. FilterMinピンに最小高度データを接続
4. `MinThreshold.ThresholdAttribute`を`MinElevation`属性に設定
5. `MaxThreshold.bUseConstantThreshold`をfalseに設定
6. FilterMaxピンに最大高度データを接続
7. `MaxThreshold.ThresholdAttribute`を`MaxElevation`属性に設定
8. 実行すると、指定された高度範囲内のポイントがフィルタリングされます

### 例3: 排他的範囲フィルタリング
1. `TargetAttribute`を`Temperature`属性に設定
2. `MinThreshold.bUseConstantThreshold`をtrueに設定し、値を`10.0`に設定
3. `MinThreshold.bInclusive`をfalseに設定（10.0は含まない）
4. `MaxThreshold.bUseConstantThreshold`をtrueに設定し、値を`30.0`に設定
5. `MaxThreshold.bInclusive`をfalseに設定（30.0は含まない）
6. 実行すると、`10.0 < Temperature < 30.0`の範囲にある要素がフィルタリングされます

### 例4: 非対称な範囲設定
1. `TargetAttribute`を`Score`属性に設定
2. `MinThreshold.bInclusive`をtrueに設定（最小値を含む）
3. `MaxThreshold.bInclusive`をfalseに設定（最大値を含まない）
4. 実行すると、`MinValue <= Score < MaxValue`の半開区間でフィルタリングされます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGAttributeFilteringRangeSettings : public UPCGSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータ（Spatial DataまたはAttribute Set）
- **FilterMin**: 最小閾値の比較に使用するデータ（`MinThreshold.bUseConstantThreshold`がfalseの場合に使用）
- **FilterMax**: 最大閾値の比較に使用するデータ（`MaxThreshold.bUseConstantThreshold`がfalseの場合に使用）

### 出力ピン
- **In Filter**: フィルタ条件（範囲内）を満たす要素
- **Outside Filter**: フィルタ条件（範囲外）を満たさない要素

### 実行エレメント
```cpp
class FPCGAttributeFilterRangeElement : public FPCGAttributeFilterElementBase
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
};
```

### ノードの特徴
- **ノード名**: AttributeFilterRange
- **表示名**: Filter Attribute Elements by Range
- **カテゴリ**: Filter
- **実行ループモード**: SinglePrimaryPin（共通の基底クラスから継承）
- **Base Point Data対応**: true（継承元のポイントデータをサポート）
- **動的ピン**: true（入力データの型に応じてピンが変化）

### 処理フロー
1. 入力データと2つのフィルタデータ（MinとMax）を取得
2. ターゲット属性/プロパティのアクセサを作成
3. 最小閾値が定数の場合は値を取得、そうでない場合はFilterMinデータからアクセサを作成
4. 最大閾値が定数の場合は値を取得、そうでない場合はFilterMaxデータからアクセサを作成
5. 各要素に対して範囲チェックを実行
6. 範囲内の要素を`In Filter`ピン、範囲外の要素を`Outside Filter`ピンに振り分け

### コードスニペット
```cpp
// 範囲チェックの適用（ヘルパー関数）
template <typename T>
bool ApplyRange(const T& Input, const T& InMin, const T& InMax, bool bMinIncluded, bool bMaxIncluded)
{
    if constexpr (PCG::Private::MetadataTraits<T>::CanCompare)
    {
        return (bMinIncluded ?
                PCG::Private::MetadataTraits<T>::GreaterOrEqual(Input, InMin) :
                PCG::Private::MetadataTraits<T>::Greater(Input, InMin)) &&
               (bMaxIncluded ?
                PCG::Private::MetadataTraits<T>::LessOrEqual(Input, InMax) :
                PCG::Private::MetadataTraits<T>::Less(Input, InMax));
    }
    else
    {
        return false;
    }
}
```

### Preconfigured Settings
このノードは2つの事前構成設定を公開します:
- **Attribute Filter Range**: デフォルトの属性範囲フィルタ
- **Point Filter Range**: ポイント専用範囲フィルタ（異なるデフォルト値を持つ）

### ピンラベル
```cpp
namespace PCGAttributeFilterConstants
{
    const FName FilterLabel = TEXT("Filter");
    const FName FilterMinLabel = TEXT("FilterMin");
    const FName FilterMaxLabel = TEXT("FilterMax");
}
```

## パフォーマンス考慮事項

### 最適化のポイント
- **定数閾値**: 可能な限り定数閾値を使用すると、外部データの読み込みが不要になり高速化されます
- **Spatial Query**: `bUseSpatialQuery`をfalseに設定すると、1対1の直接比較になり高速化される場合があります
- **データ型**: 比較可能な数値型の使用が推奨されます
- **範囲の妥当性**: 最小値が最大値より大きい場合、すべての要素が除外されます

### パフォーマンス特性
- **時間計算量**: O(N)（N = 入力要素数）
- **空間計算量**: O(N)（フィルタリング結果の保存）
- **2つの比較演算**: 各要素に対して最小値と最大値の2回の比較が行われます

## 注意事項
- 比較する属性の型は比較可能（CanCompare）である必要があります
- 文字列型など、比較演算子が定義されていない型では範囲チェックが失敗します
- `MinThreshold.bInclusive`と`MaxThreshold.bInclusive`を個別に設定できるため、柔軟な範囲指定が可能です
- 最小値が最大値より大きい場合、すべての要素が範囲外として扱われます
- 非推奨の`bHasSpatialToPointDeprecation`フラグは、古いプロジェクトからの移行用です
- `bWarnOnDataMissingAttribute`がtrueの場合、属性が存在しないとログに警告が出力されます

## 関連ノード
- **Filter Attribute Elements**: 単一の閾値を使用した属性フィルタリング
- **Filter Data By Attribute**: データ全体を属性の存在や値でフィルタリング
- **Density Filter**: 密度に特化したフィルタリング
- **Density Remap**: 密度の範囲を再マッピング
- **Attribute Remap**: 属性値の範囲を再マッピング
- **Distance**: 距離による要素のフィルタリング
