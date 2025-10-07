# Attribute Maths Op

## 概要
Attribute Maths Opノードは、数値型の属性に対して算術演算を実行します。単項、二項、三項演算をサポートし、加算、減算、乗算、除算、べき乗、クランプ、補間など、幅広い数学演算を提供します。

## 機能詳細
このノードは数値属性に対して様々な数学演算を実行します。演算の種類に応じて必要な入力数が変わり、事前設定されたプリセットとして各演算タイプが提供されます。

### 主な機能
- **単項演算**: 1つの入力値に対する演算（符号、小数部、切り捨て、丸め、平方根、絶対値、床、天井、1-X、インクリメント、デクリメント、符号反転）
- **二項演算**: 2つの入力値に対する演算（加算、減算、乗算、除算、最大値、最小値、べき乗、剰余、代入）
- **三項演算**: 3つの入力値に対する演算（クランプ、線形補間、乗加算）

### 処理フロー
1. 入力属性から数値を取得
2. 指定された数学演算を適用
3. 型変換オプションに従って出力型を決定
4. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataMathsOperation（列挙型、Bitflags）
- **デフォルト値**: Add
- **説明**: 実行する数学演算のタイプを指定
- **単項演算（UnaryOp）**:
  - `Sign`: 符号を返す（-1, 0, 1）
  - `Frac`: 小数部を返す
  - `Truncate`: 整数部を返す（0方向に切り捨て）
  - `Round`: 四捨五入
  - `Sqrt`: 平方根
  - `Abs`: 絶対値
  - `Floor`: 床関数（下方向に丸め）
  - `Ceil`: 天井関数（上方向に丸め）
  - `OneMinus`: 1 - X 演算
  - `Inc`: X + 1 演算（インクリメント）
  - `Dec`: X - 1 演算（デクリメント）
  - `Negate`: -X 演算（符号反転）
- **二項演算（BinaryOp）**:
  - `Add`: 加算（+）
  - `Subtract`: 減算（-）
  - `Multiply`: 乗算（*）
  - `Divide`: 除算（/）
  - `Max`: 最大値
  - `Min`: 最小値
  - `Pow`: べき乗（**）
  - `ClampMin`: 最小値でクランプ（Maxと同じ、非表示）
  - `ClampMax`: 最大値でクランプ（Minと同じ、非表示）
  - `Modulo`: 剰余（%）
  - `Set`: 代入（=）
- **三項演算（TernaryOp）**:
  - `Clamp`: 範囲でクランプ
  - `Lerp`: 線形補間
  - `MulAdd`: 乗加算（A + B * C）

### bForceRoundingOpToInt
- **型**: bool
- **デフォルト値**: false
- **表示条件**: `Operation == Round || Truncate || Floor || Ceil`
- **説明**: 丸め演算の場合、入力が浮動小数点数でも出力をint64に強制します

### bForceOpToDouble
- **型**: bool
- **デフォルト値**: false
- **表示条件**: `Operation == Divide || Sqrt || Pow || Lerp`
- **説明**: 浮動小数点結果を生成する演算で、入力が整数でも出力をdoubleに強制します

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性またはプロパティを選択
- **使用**: すべての演算で必須

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `(Operation & BinaryOp) || (Operation & TernaryOp)`
- **説明**: 2番目の入力属性またはプロパティを選択
- **使用**: 二項演算および三項演算で使用

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation & TernaryOp`
- **説明**: 3番目の入力属性またはプロパティを選択
- **使用**: 三項演算（Clamp、Lerp、MulAdd）で使用

## 使用例

### 密度の調整（乗算）
```
// ポイントの密度を2倍にする
InputSource1: Density
InputSource2: 2.0
Operation: Multiply
結果: 元の密度の2倍の値
```

### 範囲の正規化（クランプと除算）
```
// 値を0-1の範囲に正規化
1. Clamp操作で範囲を制限:
   InputSource1: Height
   InputSource2: 0.0 (最小値)
   InputSource3: 100.0 (最大値)
   Operation: Clamp

2. 除算で正規化:
   InputSource1: ClampedHeight
   InputSource2: 100.0
   Operation: Divide
   bForceOpToDouble: true (整数入力の場合)
```

### 線形補間によるブレンド
```
// 2つの値を補間
InputSource1: ValueA
InputSource2: ValueB
InputSource3: BlendFactor (0.0 - 1.0)
Operation: Lerp
結果: ValueAとValueBの間の補間値
```

### 距離の計算と正規化
```
// 距離の2乗から距離を計算
InputSource1: DistanceSquared
Operation: Sqrt
結果: 実際の距離値
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` を返すため、事前設定された演算タイプとして提供されます
- **サポートされる型**: 数値型（int32, int64, float, double）をサポート
- **デフォルト値型**: EPCGMetadataTypes::Double
- **型変換の柔軟性**: bForceRoundingOpToIntおよびbForceOpToDoubleオプションで出力型を制御可能

### 入力要件
- 単項演算: 1つの入力のみ必要
- 二項演算: 2つの入力が必要
- 三項演算: 3つの入力が必要

### 型の自動決定
- 通常、出力型は入力型に基づいて決定されます
- 丸め演算でbForceRoundingOpToIntが有効な場合、出力はint64になります
- 除算/平方根/べき乗/補間でbForceOpToDoubleが有効な場合、出力はdoubleになります

### 演算実装
`FPCGMetadataMathsElement::DoOperation()` で実際の数学演算が実行されます。

## 注意事項

1. **ゼロ除算**: 除算演算で0による除算に注意してください
2. **型のオーバーフロー**: 整数演算で結果がオーバーフローする可能性があります
3. **浮動小数点精度**: 浮動小数点演算では精度の問題が発生する可能性があります
4. **平方根の定義域**: 負の値の平方根は未定義です
5. **べき乗の範囲**: 大きな指数は非常に大きな値や無限大を生成する可能性があります
6. **三項演算の順序**: MulAddはA + B * Cの順序で計算されます（(A + B) * Cではない）

## 関連ノード
- **Attribute Boolean Op**: 論理演算を実行
- **Attribute Bitwise Op**: ビット演算を実行
- **Attribute Compare**: 属性の比較演算を実行
- **Attribute Remap**: 値の範囲を再マッピング

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMathsOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataMathsOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
