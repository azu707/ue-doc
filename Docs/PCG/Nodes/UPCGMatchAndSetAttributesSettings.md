# Match And Set Attributes

- **日本語名**: 属性を照合および設定
- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMatchAndSetAttributesSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGMatchAndSetAttributes.h:47`

## 概要

属性セットからの値を入力データに、照合するか、ランダムに割り当てます。N (入力)：1 (一致データ) または N：N 構成をサポートします<br><span style='color:gray'>(Matches or randomly assigns values from the Attribute Set to the input data. Supports N (input):1 (match data), or N:N configurations.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bMatchAttributes` | `bool` | `false` | 属性セットの値を一致条件で選ぶか（true）、ランダムで選ぶか（false）を切り替えます。 |
| `InputAttribute` | `FPCGAttributePropertyInputSelector` | なし | ポイント側でマッチングに使用する属性。 |
| `MatchAttribute` | `FPCGAttributePropertyInputSelector` | なし | 属性セット側で比較する属性。 |
| `bKeepUnmatched` | `bool` | `true` | マッチしなかったポイントを残す (true) か削除する (false) か。 |
| `bFindNearest` | `bool` | `false` | 一致ではなく最近傍マッチを許可します。 |
| `MaxDistanceMode` | `EPCGMatchMaxDistanceMode` | `EPCGMatchMaxDistanceMode::NoMaxDistance` | 最近傍マッチの最大距離制御。 |
| `MaxDistanceForNearestMatch` | `FPCGMetadataTypesConstantStruct` | なし | 最近傍を採用する際の最大許容距離。 |
| `MaxDistanceInputAttribute` | `FPCGAttributePropertyInputSelector` | なし | ポイントごとに最大距離を指定する属性。 |
| `bUseInputWeightAttribute` | `bool` | `false` | ポイント側の重み属性を使って候補を重み付けします。 |
| `InputWeightAttribute` | `FPCGAttributePropertyInputSelector` | なし | [0,1] の重み値を持つ属性。 |
| `bUseWeightAttribute` | `bool` | `false` | 属性セット側の重みを考慮するか。 |
| `WeightAttribute` | `FPCGAttributePropertyInputSelector` | なし | 属性セットに含まれる重み属性。 |
| `bWarnIfNoMatchData` | `bool` | `true` | 属性セットが空の場合に警告を出すか。 |
| `bWarnOnAttributeCast` | `bool` | `true` | 型変換が発生した際の警告を出すか。 |
