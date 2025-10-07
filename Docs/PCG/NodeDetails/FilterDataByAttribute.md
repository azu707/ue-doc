# Filter Data By Attribute

## 概要
Filter Data By Attributeノードは、データが特定の属性を持っているか、または属性値が条件を満たすかどうかでデータコレクション全体をフィルタリングするノードです。属性の存在チェック、値の比較、範囲チェックの3つのモードを持ちます。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGFilterByAttributeSettings
- **エレメント**: FPCGFilterByAttributeElement
- **基底クラス**: UPCGFilterDataBaseSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByAttribute.h

## 機能詳細
このノードは`UPCGFilterByAttributeSettings`クラスとして実装されており、以下の処理を行います:

- 入力データコレクションを属性の存在、値、または値の範囲でフィルタリング
- 3つのフィルタモード: 存在チェック、値比較、範囲チェック
- データ全体をフィルタ（個別の要素ではなく、データ自体を振り分け）
- ポイントデータ、属性セット、その他のデータ型に対応

## プロパティ

### FilterMode
- **型**: EPCGFilterByAttributeMode
- **デフォルト値**: FilterByExistence
- **カテゴリ**: Settings
- **説明**: フィルタリングモードを指定します。
  - **FilterByExistence**: 特定の属性を持っているかどうかでフィルタ
  - **FilterByValue**: 属性値を比較してフィルタ
  - **FilterByValueRange**: 属性値が範囲内にあるかでフィルタ
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### Attribute
- **型**: FName
- **カテゴリ**: Settings
- **説明**: FilterByExistenceモードで検索する属性名を指定します。カンマ区切りで複数指定可能です。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByExistence"
- **表示名**: Attributes
- **Blueprint対応**: 読み書き可能

### MetadataDomain
- **型**: FName
- **デフォルト値**: PCGDataConstants::DefaultDomainName
- **カテゴリ**: Settings
- **説明**: FilterByExistenceモードで、存在チェックを行う対象ドメインを指定します。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByExistence"
- **Blueprint対応**: 読み書き可能

### Operator
- **型**: EPCGStringMatchingOperator
- **デフォルト値**: Equal
- **カテゴリ**: Settings
- **説明**: FilterByExistenceモードで属性名のマッチング方法を指定します。
  - **Equal**: 完全一致
  - **Substring**: 部分文字列を含む
  - **Matches**: 正規表現にマッチ
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByExistence"
- **Blueprint対応**: 読み書き可能

### bIgnoreProperties
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、プロパティ（$で示される）をフィルタから除外します。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByExistence"
- **Blueprint対応**: 読み書き可能

### FilterByValueMode
- **型**: EPCGFilterByAttributeValueMode
- **デフォルト値**: AnyOf
- **カテゴリ**: Settings
- **説明**: 値比較モードで、複数の値がある場合の評価方法を指定します。
  - **AnyOf**: いずれかの値が条件を満たせばtrue
  - **AllOf**: すべての値が条件を満たす必要がある
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode != EPCGFilterByAttributeMode::FilterByExistence"
- **Blueprint対応**: 読み書き可能

### TargetAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: FilterByValueまたはFilterByValueRangeモードで、比較対象となる属性またはプロパティを指定します。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode != EPCGFilterByAttributeMode::FilterByExistence"
- **Blueprint対応**: 読み書き可能

### FilterOperator
- **型**: EPCGAttributeFilterOperator
- **デフォルト値**: Greater
- **カテゴリ**: Settings
- **説明**: FilterByValueモードで使用する比較演算子を指定します。
  - Greater (>), GreaterOrEqual (>=), Lesser (<), LesserOrEqual (<=), Equal (=), NotEqual (!=), Substring, Matches
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByValue"
- **Blueprint対応**: 読み書き可能

### Threshold
- **型**: FPCGFilterByAttributeThresholdSettings
- **カテゴリ**: Settings
- **説明**: FilterByValueモードで使用する閾値設定です。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByValue"
- **Blueprint対応**: 読み書き可能

#### Threshold.bUseConstantThreshold
- **型**: bool
- **デフォルト値**: true
- **説明**: trueに設定すると、定数値を閾値として使用します。

#### Threshold.ThresholdAttribute
- **型**: FPCGAttributePropertyInputSelector
- **説明**: 閾値として使用する属性またはプロパティを指定します（`bUseConstantThreshold`がfalseの場合）。

#### Threshold.AttributeTypes
- **型**: FPCGMetadataTypesConstantStruct
- **説明**: `bUseConstantThreshold`がtrueの場合に使用する定数値を指定します。

### MinThreshold
- **型**: FPCGFilterByAttributeThresholdSettingsRange
- **カテゴリ**: Settings
- **説明**: FilterByValueRangeモードで使用する最小閾値設定です。Thresholdと同じサブプロパティに加え、`bInclusive`プロパティを持ちます。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByValueRange"
- **Blueprint対応**: 読み書き可能

### MaxThreshold
- **型**: FPCGFilterByAttributeThresholdSettingsRange
- **カテゴリ**: Settings
- **説明**: FilterByValueRangeモードで使用する最大閾値設定です。MinThresholdと同じ構造を持ちます。
- **メタフラグ**: PCG_Overridable, EditCondition="FilterMode == EPCGFilterByAttributeMode::FilterByValueRange"
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: 属性の存在チェック
1. `FilterMode`を`FilterByExistence`に設定
2. `Attribute`に`"Category"`と入力
3. `Operator`を`Equal`に設定
4. 実行すると、"Category"属性を持つデータが`In Filter`ピンに、持たないデータが`Outside Filter`ピンに出力されます

### 例2: 複数属性の存在チェック
1. `FilterMode`を`FilterByExistence`に設定
2. `Attribute`に`"Height,Width,Depth"`と入力（カンマ区切り）
3. `Operator`を`Equal`に設定
4. 実行すると、これらの属性のいずれかを持つデータがフィルタリングされます

### 例3: パターンマッチングによる属性検索
1. `FilterMode`を`FilterByExistence`に設定
2. `Attribute`に`"Custom_*"`と入力
3. `Operator`を`Matches`に設定
4. 実行すると、"Custom_"で始まる属性を持つデータがフィルタリングされます

### 例4: 値による比較フィルタリング
1. `FilterMode`を`FilterByValue`に設定
2. `TargetAttribute`を比較したい属性（例: `Score`）に設定
3. `FilterOperator`を`Greater`に設定
4. `Threshold.bUseConstantThreshold`をtrueに設定
5. `Threshold.AttributeTypes`で定数値を`100`に設定
6. 実行すると、Score > 100のデータが`In Filter`ピンに出力されます

### 例5: 範囲フィルタリング
1. `FilterMode`を`FilterByValueRange`に設定
2. `TargetAttribute`を`Temperature`に設定
3. `MinThreshold.bUseConstantThreshold`をtrueに設定し、値を`15.0`に設定
4. `MinThreshold.bInclusive`をtrueに設定
5. `MaxThreshold.bUseConstantThreshold`をtrueに設定し、値を`25.0`に設定
6. `MaxThreshold.bInclusive`をtrueに設定
7. 実行すると、15.0 <= Temperature <= 25.0の範囲にあるデータがフィルタリングされます

### 例6: AnyOfとAllOfの使い分け
1. `FilterMode`を`FilterByValue`に設定
2. `FilterByValueMode`を`AllOf`に設定
3. 複数の値を持つ属性に対して、すべての値が条件を満たす場合のみフィルタを通過するように設定

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGFilterByAttributeSettings : public UPCGFilterDataBaseSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータコレクション
- **Filter**: 値比較に使用するデータ（値比較モードで`bUseConstantThreshold`がfalseの場合に使用）

### 出力ピン
- **In Filter**: フィルタ条件を満たすデータ
- **Outside Filter**: フィルタ条件を満たさないデータ

### 実行エレメント
```cpp
class FPCGFilterByAttributeElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* Context) const override;
    virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: FilterDataByAttribute
- **表示名**: Filter Data By Attribute（モードによって動的に変化）
- **カテゴリ**: Filter
- **実行ループモード**: SinglePrimaryPin
- **Base Point Data対応**: true（継承元のポイントデータをサポート）
- **動的ピン**: true（入力データの型に応じてピンが変化）

### 処理フロー

#### FilterByExistenceモード
1. 入力データコレクションを取得
2. 指定された属性名パターンをパース
3. 各データに対して、指定されたドメインで属性の存在をチェック
4. マッチング演算子に基づいて属性名を評価
5. 条件を満たすデータを`In Filter`ピン、満たさないデータを`Outside Filter`ピンに振り分け

#### FilterByValueモード
1. 入力データコレクションと閾値データを取得
2. ターゲット属性のアクセサを作成
3. 閾値が定数の場合は値を取得、そうでない場合は閾値データからアクセサを作成
4. 各データの属性値を指定された演算子で比較
5. AnyOfまたはAllOfモードに基づいて評価
6. 条件を満たすデータを`In Filter`ピン、満たさないデータを`Outside Filter`ピンに振り分け

#### FilterByValueRangeモード
1. 入力データコレクションと2つの閾値データ（MinとMax）を取得
2. ターゲット属性のアクセサを作成
3. 最小閾値と最大閾値を取得または設定
4. 各データの属性値が範囲内にあるかチェック
5. AnyOfまたはAllOfモードに基づいて評価
6. 条件を満たすデータを`In Filter`ピン、満たさないデータを`Outside Filter`ピンに振り分け

### 構造体定義
```cpp
USTRUCT(BlueprintType)
struct FPCGFilterByAttributeThresholdSettings
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings, meta = (PCG_Overridable))
    bool bUseConstantThreshold = true;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    FPCGAttributePropertyInputSelector ThresholdAttribute;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    FPCGMetadataTypesConstantStruct AttributeTypes;
};

USTRUCT(BlueprintType)
struct FPCGFilterByAttributeThresholdSettingsRange : public FPCGFilterByAttributeThresholdSettings
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings, meta = (PCG_Overridable))
    bool bInclusive = false;
};
```

## パフォーマンス考慮事項

### 最適化のポイント
- **存在チェックモード**: 最も高速なモードです。値の比較が不要なため、大量のデータに対して効率的です
- **定数閾値**: 値比較モードで定数を使用すると、外部データの読み込みが不要になります
- **AnyOf vs AllOf**: AnyOfモードは条件が早期に満たされる可能性が高く、AllOfより高速な場合があります
- **属性アクセス**: プロパティアクセスは属性アクセスよりわずかに高速です

### パフォーマンス特性
- **FilterByExistence**: O(N × M)（N = データ数、M = 属性数）
- **FilterByValue**: O(N × K)（N = データ数、K = 要素数）
- **FilterByValueRange**: O(N × K × 2)（2回の比較が必要）

## 注意事項
- このノードはデータ全体をフィルタリングします（個別の要素ではなく）
- FilterByExistenceモードでは、属性名はカンマ区切りで複数指定できます
- プロパティ（$で始まる）とカスタム属性の両方をフィルタできます
- `bIgnoreProperties`をtrueに設定すると、プロパティが除外されます
- FilterByValueとFilterByValueRangeモードでは、比較可能な型である必要があります
- AnyOfモードでは、少なくとも1つの値が条件を満たせば通過します
- AllOfモードでは、すべての値が条件を満たす必要があります
- 範囲フィルタリングでは、最小値が最大値より大きい場合、すべてのデータが除外されます

## 関連ノード
- **Filter Attribute Elements**: 個別の要素をフィルタリング（データ全体ではなく）
- **Filter Attribute Elements by Range**: 要素の範囲フィルタリング
- **Filter Data By Type**: データ型によるフィルタリング
- **Filter Data By Tag**: タグによるフィルタリング
- **Filter Data By Index**: インデックスによるフィルタリング
- **Attribute Select**: 条件に基づく属性の選択
