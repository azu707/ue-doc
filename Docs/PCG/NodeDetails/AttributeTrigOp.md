# Attribute Trig Op

## 概要
Attribute Trig Opノードは、数値属性に対して三角関数演算を実行します。基本的な三角関数（sin, cos, tan）、逆三角関数（asin, acos, atan, atan2）、および角度変換（度⇔ラジアン）をサポートしています。

## 機能詳細
このノードは数値属性に対して三角関数の計算を実行します。角度の計算、ベクトルの回転、周期的なパターン生成などに使用されます。

### 主な機能
- **基本三角関数**: Sin、Cos、Tan
- **逆三角関数**: Asin、Acos、Atan、Atan2
- **角度変換**: 度からラジアン、ラジアンから度

### 処理フロー
1. 入力属性から数値を取得
2. 指定された三角関数演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataTrigOperation（列挙型）
- **デフォルト値**: Acos
- **説明**: 実行する三角関数演算のタイプを指定
- **選択肢**:
  - `Acos`: 逆余弦（アークコサイン）
  - `Asin`: 逆正弦（アークサイン）
  - `Atan`: 逆正接（アークタンジェント）
  - `Atan2`: 2引数逆正接（Y, Xから角度を計算）
  - `Cos`: 余弦（コサイン）
  - `Sin`: 正弦（サイン）
  - `Tan`: 正接（タンジェント）
  - `DegToRad`: 度からラジアンに変換
  - `RadToDeg`: ラジアンから度に変換

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性
- **使用**:
  - 単項演算（Sin, Cos, Tan, Asin, Acos, Atan, DegToRad, RadToDeg）: 計算する値
  - Atan2: Y値

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation == Atan2`
- **説明**: 2番目の入力属性（Atan2のX値）

## 使用例

### 正弦波パターンの生成
```
// X座標からサイン波を生成
InputSource1: X (float)
Operation: Sin
結果: sin(X)の波形パターン
```

### 角度の正規化（度からラジアン）
```
// 度の値をラジアンに変換
InputSource1: AngleDegrees (float)
Operation: DegToRad
結果: 度の値をラジアン（0 to 2π）に変換
```

### ベクトルからの角度計算
```
// ベクトルの角度を計算（Atan2）
InputSource1: Y (float)
InputSource2: X (float)
Operation: Atan2
結果: atan2(Y, X)で角度を計算（-π to π）
```

### 逆余弦による角度取得
```
// 内積から角度を計算
InputSource1: DotProduct (float, -1 to 1)
Operation: Acos
結果: 2つのベクトル間の角度（ラジアン）
```

### ラジアンから度への変換
```
// ラジアンを度に変換
InputSource1: AngleRadians (float)
Operation: RadToDeg
結果: ラジアンを度（0 to 360）に変換
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` - 事前設定された演算タイプとして提供
- **デフォルト値型**: EPCGMetadataTypes::Double

### サポートされる型
- 数値型（float, double, int32, int64）
- ベクトル型（各成分に個別に適用）

### 三角関数の詳細

#### 基本三角関数
- **Sin**: 正弦関数、入力はラジアン、出力範囲[-1, 1]
- **Cos**: 余弦関数、入力はラジアン、出力範囲[-1, 1]
- **Tan**: 正接関数、入力はラジアン、出力範囲[-∞, ∞]

#### 逆三角関数
- **Asin**: 逆正弦、入力範囲[-1, 1]、出力範囲[-π/2, π/2]
- **Acos**: 逆余弦、入力範囲[-1, 1]、出力範囲[0, π]
- **Atan**: 逆正接、入力範囲[-∞, ∞]、出力範囲[-π/2, π/2]
- **Atan2**: 2引数逆正接、Atan2(Y, X)、出力範囲[-π, π]

#### 角度変換
- **DegToRad**: 度 × π / 180
- **RadToDeg**: ラジアン × 180 / π

### 入力要件
- **単項演算**: Sin, Cos, Tan, Asin, Acos, Atan, DegToRad, RadToDeg - 1つの入力
- **二項演算**: Atan2 - 2つの入力（Y, X）

## 注意事項

1. **角度の単位**: UnrealEngineではラジアンが標準です。度を使用する場合は変換が必要です
2. **入力範囲**: Asin/Acosは入力が[-1, 1]の範囲内である必要があります
3. **Tan の特異点**: Tanは±π/2で未定義（無限大）になります
4. **Atan2 の引数順序**: Atan2(Y, X)の順序に注意してください
5. **ベクトル属性**: ベクトル型の場合、各成分に個別に三角関数が適用されます

## 関連ノード
- **Attribute Maths Op**: 数学演算
- **Attribute Vector Op**: ベクトル演算（正規化、回転など）
- **Attribute Rotator Op**: ローテーター演算
- **Spatial Noise**: 周期的なパターン生成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataTrigOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataTrigOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
