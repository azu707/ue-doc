# Attribute Cast

## 概要
Attribute Castノードは、属性を別の型にキャストします。ブロードキャスト可能なキャスト（double -> FVectorなど）と構築可能なキャスト（double -> floatなど）の両方をサポートしています。

## 機能詳細
このノードは属性の型を変換し、異なる型の属性間でデータを変換する際に使用されます。数値型間の変換、ベクトル型への変換、文字列との変換などをサポートします。

### 主な機能
- **型変換**: 属性を指定された型に変換
- **ブロードキャスト**: スカラー値をベクトルや他の複合型に拡張
- **構築可能キャスト**: 型の暗黙的または明示的変換（double -> float、int -> doubleなど）
- **動的ピン**: 出力型に応じて動的にピンプロパティを変更

### 処理フロー
1. 入力属性から値を取得
2. 指定された出力型に変換
3. 結果を出力属性に書き込み

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 変換元の入力属性またはプロパティを選択

### OutputType
- **型**: EPCGMetadataTypes（列挙型）
- **デフォルト値**: Float
- **PCG_Overridable**: あり
- **説明**: 変換先の出力型を指定
- **サポートされる型**:
  - `Float`, `Double`, `Integer32`, `Integer64`
  - `Vector2`, `Vector`, `Vector4`
  - `Quaternion`, `Transform`, `Rotator`
  - `String`, `Boolean`, `Name`
  - その他のメタデータ型

### OutputTarget
- **型**: FPCGAttributePropertyOutputSelector
- **PCG_Overridable**: あり
- **PCG_DiscardPropertySelection**: あり
- **PCG_DiscardExtraSelection**: あり
- **説明**: 出力先の属性名を指定

## 使用例

### 整数から浮動小数点への変換
```
// 整数属性を浮動小数点数に変換
InputSource: Count (int32)
OutputType: Double
OutputTarget: CountAsDouble
結果: 整数値が倍精度浮動小数点数に変換される
```

### スカラー値からベクトルへのブロードキャスト
```
// スカラー値を3Dベクトルに拡張
InputSource: Scale (double)
OutputType: Vector
OutputTarget: UniformScale
結果: スカラー値が(X, X, X)のベクトルに変換される
```

### 文字列から数値への変換
```
// 文字列を数値に変換
InputSource: ValueString (String)
OutputType: Double
OutputTarget: NumericValue
結果: 文字列が数値に解析される
```

### ベクトルから文字列への変換
```
// ベクトルを文字列表現に変換
InputSource: Position (Vector)
OutputType: String
OutputTarget: PositionText
結果: ベクトルが文字列形式に変換される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGAttributeCastElement`（`IPCGElement`を継承）

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` を返し、事前設定された型変換として提供されます
- **動的ピン**: `HasDynamicPins()` が `true` で、出力型に応じてピンプロパティが動的に変更されます
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### サポートされる変換
1. **数値型間の変換**:
   - 整数 ↔ 浮動小数点
   - float ↔ double
   - 数値 → 文字列

2. **ブロードキャスト変換**:
   - スカラー → ベクトル（すべての成分に同じ値）
   - スカラー → トランスフォーム、回転など

3. **構造型の変換**:
   - ベクトル型間の変換（Vector2, Vector, Vector4）
   - 回転型の変換（Quaternion, Rotator）

4. **文字列変換**:
   - 任意の型 → 文字列
   - 文字列 → 数値（解析可能な場合）

## 注意事項

1. **型互換性**: すべての型変換が可能なわけではありません。無効な変換はエラーになります
2. **精度の損失**: 大きな型から小さな型への変換（double -> floatなど）では精度が失われる可能性があります
3. **文字列解析**: 文字列から数値への変換は、文字列が有効な数値形式である必要があります
4. **ブロードキャスト**: スカラーからベクトルへの変換では、すべての成分が同じ値になります
5. **オーバーフロー**: 範囲外の値を小さな型に変換するとオーバーフローが発生する可能性があります

## 関連ノード
- **Attribute Maths Op**: 数学演算（型変換も含む）
- **Break Vector Attribute**: ベクトルを個別の成分に分解
- **Make Vector Attribute**: 個別の成分からベクトルを作成
- **Break Transform Attribute**: トランスフォームを個別の成分に分解
- **Make Transform Attribute**: 個別の成分からトランスフォームを作成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGAttributeCast.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGAttributeCast.cpp`
