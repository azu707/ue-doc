# Attribute Remap

## 概要
Attribute Remapノードは、属性値を指定された入力範囲から出力範囲に再マッピングします。Density Remapノードの後継として、任意の数値属性に対して範囲変換を行うことができます。

## 機能詳細
このノードは数値属性の値を別の範囲に線形変換します。正規化、スケーリング、値の反転など、幅広い用途で使用されます。

### 主な機能
- **範囲変換**: 入力範囲[InMin, InMax]の値を出力範囲[OutMin, OutMax]に線形変換
- **逆範囲サポート**: MinがMaxより大きい範囲（反転）をサポート
- **クランプ**: 0-1の範囲にクランプするオプション
- **範囲外の扱い**: 入力範囲外の値を無視するオプション

### 処理フロー
1. 入力属性から値を取得
2. 入力範囲内での正規化位置を計算
3. 出力範囲に変換
4. オプションに応じてクランプまたは範囲外を無視
5. 結果を出力属性に書き込み

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 再マッピングする入力属性を選択

### InRangeMin
- **型**: double
- **デフォルト値**: 0.0
- **PCG_Overridable**: あり
- **説明**: 入力範囲の最小値
- **特記**: InRangeMin == InRangeMax の場合、その値は出力範囲の平均値にマッピングされます

### InRangeMax
- **型**: double
- **デフォルト値**: 1.0
- **PCG_Overridable**: あり
- **説明**: 入力範囲の最大値
- **特記**: InRangeMin == InRangeMax の場合、その値は出力範囲の平均値にマッピングされます

### OutRangeMin
- **型**: double
- **デフォルト値**: 0.0
- **PCG_Overridable**: あり
- **説明**: 出力範囲の最小値

### OutRangeMax
- **型**: double
- **デフォルト値**: 1.0
- **PCG_Overridable**: あり
- **説明**: 出力範囲の最大値

### bClampToUnitRange
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 有効にすると、出力値を0-1の範囲にクランプします

### bIgnoreValuesOutsideInputRange
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 有効にすると、入力範囲外の値は変換されず、元の値のまま維持されます

### bAllowInverseRange
- **型**: bool
- **デフォルト値**: false（新しいノードではtrue）
- **PCG_Overridable**: あり
- **説明**: MinがMaxより大きい逆範囲を許可します（例: [0.0, 1.0] -> [1.0, 0.0]）

## 使用例

### 値の正規化（0-1の範囲に変換）
```
// 高度を0-1の範囲に正規化
InputSource: Elevation
InRangeMin: 0.0
InRangeMax: 100.0
OutRangeMin: 0.0
OutRangeMax: 1.0
結果: 0-100の高度が0-1の範囲に変換される
```

### 値の反転
```
// 密度を反転（高い値を低く、低い値を高く）
InputSource: Density
InRangeMin: 0.0
InRangeMax: 1.0
OutRangeMin: 1.0
OutRangeMax: 0.0
bAllowInverseRange: true
結果: 密度値が反転される（0.8 -> 0.2など）
```

### 範囲の拡大
```
// 0-1の範囲を0-10に拡大
InputSource: Factor
InRangeMin: 0.0
InRangeMax: 1.0
OutRangeMin: 0.0
OutRangeMax: 10.0
結果: 小さな値が大きな範囲にスケールアップされる
```

### 特定範囲のみ変換
```
// 0.3-0.7の範囲のみを0-1に変換、範囲外は無視
InputSource: Value
InRangeMin: 0.3
InRangeMax: 0.7
OutRangeMin: 0.0
OutRangeMax: 1.0
bIgnoreValuesOutsideInputRange: true
結果: 0.3-0.7の値のみ変換され、それ以外は元の値のまま
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: 事前設定された変換として提供されます
- **GroupPreconfiguredSettings**: `false` - プリセットをグループ化しない
- **HasFlippedTitleLines**: `false` - タイトル行を反転しない
- **デフォルト値型**: EPCGMetadataTypes::Double

### 再マッピング計算式
```
// 基本的な線形補間
Alpha = (Value - InRangeMin) / (InRangeMax - InRangeMin)
Output = OutRangeMin + Alpha * (OutRangeMax - OutRangeMin)

// InRangeMin == InRangeMax の場合
Output = (OutRangeMin + OutRangeMax) / 2.0

// bClampToUnitRange が true の場合
Output = Clamp(Output, 0.0, 1.0)

// bIgnoreValuesOutsideInputRange が true の場合
if (Value < InRangeMin || Value > InRangeMax)
    Output = Value  // 元の値を維持
```

### サポートされる入力型
数値型（int32, int64, float, double）をサポートします。

## 注意事項

1. **ゼロ除算**: InRangeMin == InRangeMax の場合、特別な処理が行われ、出力範囲の平均値にマッピングされます
2. **逆範囲**: bAllowInverseRangeが無効の場合、MinがMaxより大きい範囲はエラーになる可能性があります
3. **クランプの優先順位**: bClampToUnitRangeは最終出力にのみ適用されます
4. **範囲外の扱い**: bIgnoreValuesOutsideInputRangeが有効な場合、範囲外の値は変換されません
5. **Density Remapからの移行**: このノードはDensity Remapの後継です（Density Remapはバージョン5.5で非推奨）

## 関連ノード
- **Density Remap**: 非推奨（このノードで置き換え）
- **Attribute Maths Op**: 数学演算（クランプ、補間など）
- **Attribute Cast**: 型変換
- **Attribute Normalize**: 正規化（このノードで実装可能）

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGAttributeRemap.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGAttributeRemap.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
