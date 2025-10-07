# Attribute String Op

## 概要
Attribute String Opノードは、文字列属性に対して各種文字列操作を実行します。文字列の結合、置換、大文字/小文字変換、空白のトリミングをサポートしています。

## 機能詳細
このノードは文字列型の属性に対して文字列処理演算を実行します。テキストの操作や整形に使用されます。

### 主な機能
- **文字列結合**: 2つの文字列を連結
- **文字列置換**: 部分文字列を別の文字列に置換
- **大文字/小文字変換**: すべての文字を大文字または小文字に変換
- **空白のトリミング**: 先頭、末尾、または両端の空白を削除

### 処理フロー
1. 入力属性から文字列値を取得
2. 指定された文字列演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataStringOperation（列挙型）
- **デフォルト値**: Append
- **説明**: 実行する文字列演算のタイプを指定
- **選択肢**:
  - `Append`: 文字列を結合（Input1 + Input2）
  - `Replace`: 文字列を置換（Input1内のInput2をInput3に置換）
  - `ToUpper`: すべての文字を大文字に変換
  - `ToLower`: すべての文字を小文字に変換
  - `TrimStart`: 先頭の空白を削除
  - `TrimEnd`: 末尾の空白を削除
  - `TrimStartAndEnd`: 先頭と末尾の空白を削除

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力文字列属性

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 2番目の入力文字列属性
- **使用**:
  - Append: 結合する文字列
  - Replace: 検索する部分文字列

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation == Replace`
- **説明**: 3番目の入力文字列属性（置換後の文字列）

## 使用例

### 文字列の結合
```
// 2つの文字列を結合
InputSource1: FirstName (String)
InputSource2: LastName (String)
Operation: Append
結果: FirstName + LastName の連結文字列（例: "John" + "Doe" = "JohnDoe"）
```

### 文字列の置換
```
// 文字列内の部分文字列を置換
InputSource1: Text (String, "Hello World")
InputSource2: SearchText (String, "World")
InputSource3: ReplaceText (String, "PCG")
Operation: Replace
結果: "Hello PCG"
```

### 大文字への変換
```
// すべての文字を大文字に変換
InputSource1: Name (String, "item_name")
Operation: ToUpper
結果: "ITEM_NAME"
```

### 小文字への変換
```
// すべての文字を小文字に変換
InputSource1: Title (String, "TITLE")
Operation: ToLower
結果: "title"
```

### 空白のトリミング
```
// 前後の空白を削除
InputSource1: Label (String, "  Label  ")
Operation: TrimStartAndEnd
結果: "Label"
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` - 事前設定された演算タイプとして提供
- **サポートされる型**: String型のみ
- **デフォルト値型**: EPCGMetadataTypes::String
- **デフォルト値文字列**: 空文字列

### 演算の詳細

#### Append（結合）
- 2つの文字列を連結: `Output = Input1 + Input2`
- セパレータは含まれません（必要な場合は明示的に追加）

#### Replace（置換）
- Input1内のInput2をすべてInput3に置換
- 大文字小文字を区別
- すべての出現箇所を置換

#### ToUpper（大文字化）
- すべての文字を大文字に変換
- ロケールに依存しない変換

#### ToLower（小文字化）
- すべての文字を小文字に変換
- ロケールに依存しない変換

#### TrimStart（先頭トリミング）
- 先頭の空白文字（スペース、タブ、改行など）を削除

#### TrimEnd（末尾トリミング）
- 末尾の空白文字を削除

#### TrimStartAndEnd（両端トリミング）
- 先頭と末尾の両方の空白文字を削除

### 入力要件
- **ToUpper, ToLower, TrimStart, TrimEnd, TrimStartAndEnd**: 1つの入力（InputSource1）
- **Append**: 2つの入力（InputSource1, InputSource2）
- **Replace**: 3つの入力（InputSource1, InputSource2, InputSource3）

## 注意事項

1. **空文字列**: 空文字列も有効な入力として扱われます
2. **大文字小文字の区別**: Replace演算は大文字小文字を区別します
3. **空白の定義**: トリミング操作は標準的な空白文字（スペース、タブ、改行など）を対象とします
4. **ロケール**: ToUpperとToLowerはロケール非依存の変換を使用します
5. **特殊文字**: Unicode文字も正しく処理されます

## 関連ノード
- **Parse String**: 文字列を解析して値を抽出
- **Attribute Cast**: 文字列と他の型の相互変換
- **Attribute Compare Op**: 文字列の比較
- **Attribute Reduce**: 複数の文字列を結合（Join演算）

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataStringOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataStringOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
