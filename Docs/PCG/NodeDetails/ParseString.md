# Parse String

## 概要
Parse Stringノードは、文字列を数値に変換します。文字列属性から整数、浮動小数点数、その他の数値型を抽出する際に使用されます。

## 機能詳細
このノードは文字列型の属性を解析し、指定された数値型に変換します。文字列が有効な数値表現でない場合、デフォルト値（通常は0）が使用されます。

### 主な機能
- **文字列から数値への変換**: 文字列を解析して数値型に変換
- **複数の数値型対応**: 整数、浮動小数点数などをサポート
- **柔軟な解析**: 様々な数値形式を認識

### 処理フロー
1. 入力文字列属性を取得
2. 文字列を解析して指定された型に変換
3. 変換結果を出力属性に書き込み

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 解析する文字列属性を選択
- **サポートされる型**: String

### TargetType
- **型**: EPCGMetadataTypes（列挙型）
- **デフォルト値**: Integer32
- **PCG_Overridable**: あり
- **説明**: 変換先の数値型を指定
- **サポートされる型**:
  - Integer32: 32ビット整数
  - Integer64: 64ビット整数
  - Float: 単精度浮動小数点数
  - Double: 倍精度浮動小数点数
  - その他の数値型

## 使用例

### 文字列から整数への変換
```
// 文字列を整数に変換
InputSource: NumberString (String, "42")
TargetType: Integer32
結果: 42（整数）
```

### 文字列から浮動小数点への変換
```
// 文字列を浮動小数点数に変換
InputSource: ValueString (String, "3.14159")
TargetType: Double
結果: 3.14159（double）
```

### データテーブルからの数値抽出
```
// データテーブルから読み込んだ文字列を数値に変換
1. Load Data Table → 文字列として属性を取得
2. Parse String → 数値に変換
結果: 計算に使用可能な数値データ
```

### CSVデータの処理
```
// CSVから読み込んだ文字列データを数値に変換
InputSource: CsvValue (String)
TargetType: Double
結果: 数値として処理可能
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **サポートされる入力型**: String型のみ
- **複数の出力型**: `HasDifferentOutputTypes()` が `true`
- **デフォルト値無効**: `DefaultValuesAreEnabled()` が `false`
- **タイトル行**: `HasFlippedTitleLines()` が `false`

### 解析の詳細

#### サポートされる文字列形式
- 整数: "42", "-100", "+25"
- 浮動小数点: "3.14", "-2.5", "1.23e-4"
- 符号付き: "+123", "-456"
- 指数表記: "1.5e10", "2.3E-5"

#### 変換失敗時の動作
- 無効な文字列の場合、デフォルト値（通常は0）が使用される
- 警告が発行される可能性がある

## 注意事項

1. **有効な文字列**: 入力文字列が有効な数値表現である必要があります
2. **範囲チェック**: 数値が変換先の型の範囲内にあることを確認してください
3. **小数点**: 整数型への変換では、小数部分は切り捨てられます
4. **ロケール**: 数値解析はロケールに依存する可能性があります（小数点記号など）
5. **空文字列**: 空文字列は通常0に変換されます

## 関連ノード
- **Attribute Cast**: 型変換（逆方向: 数値 → 文字列も可能）
- **Attribute String Op**: 文字列操作
- **Load Data Table**: 文字列データの読み込み
- **Hash Attribute**: 文字列からハッシュ値を生成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGParseString.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGParseString.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
