# Match And Set Attributes

## 概要
Match And Set Attributesノードは、提供された属性セットから一致するエントリを見つけ、そのエントリの属性を ポイントにコピーします。マッチング、重み付き選択、または両方の組み合わせが可能です。

## 機能詳細
このノードは属性セット（複数のエントリを持つ）から、ポイントの属性値に基づいて一致するエントリを見つけ、そのエントリの他の属性をポイントにコピーします。ランダム選択や重み付き選択もサポートします。

### 主な機能
- **属性マッチング**: ポイントの属性と属性セットの属性を比較して一致を検出
- **ランダム選択**: マッチングなしでランダムに属性セットからエントリを選択
- **重み付き選択**: 重み属性に基づいて選択確率を調整
- **最近傍検索**: 完全一致ではなく、最も近い値を持つエントリを選択
- **最大距離制御**: 最近傍検索での許容距離を制限

### 処理フロー
1. ポイントデータと属性セットデータを入力
2. マッチングまたはランダム選択でエントリを決定
3. 選択されたエントリの属性をポイントにコピー
4. 更新されたポイントデータを出力

## プロパティ

### bMatchAttributes
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 属性セット値の選択をポイント対属性セットのマッチングで行うか（true）、ランダムに行うか（false）を制御

### InputAttribute
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `bMatchAttributes == true`
- **説明**: ポイントデータから選択・マッチングする属性

### MatchAttribute
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **PCG_DiscardPropertySelection**: あり
- **表示条件**: `bMatchAttributes == true`
- **説明**: 属性セットから比較対象とする属性

### bKeepUnmatched
- **型**: bool
- **デフォルト値**: true
- **PCG_Overridable**: あり
- **表示条件**: `bMatchAttributes == true`
- **説明**: 属性セットに有効な一致がないポイントを、そのまま（デフォルト値で）保持するか、出力から削除するかを制御

### bFindNearest
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **表示条件**: `bMatchAttributes == true`
- **説明**: マッチング操作が最も近い一致を返すか、等価性のみでマッチングするかを制御

### MaxDistanceMode
- **型**: EPCGMatchMaxDistanceMode（列挙型）
- **デフォルト値**: NoMaxDistance
- **PCG_Overridable**: あり
- **表示条件**: `bFindNearest == true`
- **説明**: 最大距離の制御方法を指定
- **選択肢**:
  - `NoMaxDistance`: 最大距離制限なし
  - `UseConstantMaxDistance`: 定数の最大距離を使用
  - `AttributeMaxDistance`: 属性から最大距離を取得

### MaxDistanceForNearestMatch
- **型**: FPCGMetadataTypesConstantStruct
- **表示条件**: `bFindNearest && MaxDistanceMode == UseConstantMaxDistance`
- **説明**: エントリが最近傍マッチから選択されるための最大距離を設定する定数値

### MaxDistanceInputAttribute
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `bFindNearest && MaxDistanceMode == AttributeMaxDistance`
- **説明**: 最大距離を取得する属性

### bUseInputWeightAttribute
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 入力重み属性を使用してエントリ選択を行うかどうかを制御

### InputWeightAttribute
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `bUseInputWeightAttribute == true`
- **説明**: ポイントからの入力重み（[0, 1]範囲と想定）

### bUseWeightAttribute
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **表示名**: Use Match Weight
- **説明**: 属性セットの重み属性値で決定される重みを考慮するかどうかを制御

### WeightAttribute
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **PCG_DiscardPropertySelection**: あり
- **表示名**: Match Weight Attribute
- **表示条件**: `bUseWeightAttribute == true`
- **説明**: 属性セットから、いくつかのエントリの重みを増減する属性

### bWarnIfNoMatchData
- **型**: bool
- **デフォルト値**: true
- **AdvancedDisplay**: あり
- **説明**: 属性セットが提供されていない場合に警告を発し、何も返さないかどうかを制御

### bWarnOnAttributeCast
- **型**: bool
- **デフォルト値**: true
- **AdvancedDisplay**: あり
- **説明**: 属性キャストで警告を発するかどうかを制御

## 使用例

### タイプIDによるマッチング
```
// ポイントのTypeIDに基づいて属性セットから属性をコピー
bMatchAttributes: true
InputAttribute: TypeID (from points)
MatchAttribute: ID (from attribute set)
結果: TypeIDが一致するエントリの属性がポイントにコピーされる
```

### ランダム選択（バリエーション）
```
// 属性セットからランダムにエントリを選択
bMatchAttributes: false
bUseWeightAttribute: false
結果: 各ポイントに属性セットからランダムに選択された属性がコピーされる
```

### 重み付きランダム選択
```
// 重みに基づいてランダム選択
bMatchAttributes: false
bUseWeightAttribute: true
WeightAttribute: Probability
結果: Probability属性の重みに基づいて選択される
```

### 最近傍マッチング
```
// 最も近い値を持つエントリを選択
bMatchAttributes: true
InputAttribute: Temperature
MatchAttribute: ReferenceTemp
bFindNearest: true
MaxDistanceMode: UseConstantMaxDistance
MaxDistanceForNearestMatch: 10.0
結果: Temperature±10の範囲で最も近いReferenceTempを持つエントリを選択
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `TPCGTimeSlicedElementBase<FPCGMatchAndSetAttributesExecutionState, FPCGMatchAndSetAttributesIterationState>`

### 特徴
- **タイムスライシング**: 大規模データセットでのパフォーマンスのため、タイムスライシングをサポート
- **動的ピン**: `HasDynamicPins()` が `true`
- **シード使用**: `UseSeed()` - ランダム選択時にシードを使用
- **実行ループモード**: `SinglePrimaryPin`
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### ピン構造
- **入力ピン1**: ポイントデータまたはその他のPCGデータ
- **入力ピン2**: 属性セット（Attributeピン）
- **出力ピン**: 更新されたポイントデータ

### マッチングアルゴリズム
1. **完全一致**: InputAttribute == MatchAttributeの場合に選択
2. **最近傍**: bFindNearestが有効の場合、最小距離のエントリを選択
3. **最大距離**: 指定された最大距離内のエントリのみ考慮

### パーティショニング
内部的にFPCGMatchAndSetPartitionを使用して効率的なマッチングを実現

## 注意事項

1. **属性セットの提供**: Attributeピンに属性セットを接続する必要があります
2. **型の互換性**: InputAttributeとMatchAttributeの型が互換性がある必要があります
3. **重みの範囲**: 入力重みは[0, 1]の範囲と想定されます
4. **パフォーマンス**: 大規模な属性セットではパフォーマンスに影響する可能性があります
5. **未マッチポイント**: bKeepUnmatchedがfalseの場合、一致しないポイントは削除されます

## 関連ノード
- **Point Match And Set**: ポイント間のマッチングとコピー
- **Copy Attributes**: 属性のコピー
- **Attribute Select**: 属性の選択操作
- **Random Choice**: ランダム選択

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGMatchAndSetAttributes.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGMatchAndSetAttributes.cpp`
