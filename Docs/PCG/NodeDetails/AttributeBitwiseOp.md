# Attribute Bitwise Op

## 概要
Attribute Bitwise Opノードは、整数型の属性に対してビット演算を実行します。And、Not、Or、Xorの4つのビット演算をサポートしており、ポイント属性やメタデータに対してビットマスク操作を行う際に使用されます。

## 機能詳細
このノードは整数値の属性に対してビットレベルの論理演算を実行します。事前設定されたプリセットとして提供され、各演算タイプ用のノードが個別に提供されます。

### 主な機能
- **ビット単位のAND演算**: 2つの整数値のビットごとのAND演算
- **ビット単位のNOT演算**: 整数値の各ビットを反転（単項演算）
- **ビット単位のOR演算**: 2つの整数値のビットごとのOR演算
- **ビット単位のXOR演算**: 2つの整数値のビットごとの排他的OR演算

### 処理フロー
1. 入力属性から整数値を取得
2. 指定されたビット演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataBitwiseOperation（列挙型）
- **デフォルト値**: And
- **説明**: 実行するビット演算のタイプを指定
- **選択肢**:
  - `And`: ビットごとのAND演算（両方のビットが1のときに1）
  - `Not`: ビット反転演算（各ビットを反転）
  - `Or`: ビットごとのOR演算（いずれかのビットが1のときに1）
  - `Xor`: ビットごとのXOR演算（ビットが異なるときに1）

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性またはプロパティを選択
- **使用**: すべての演算で必須

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation != EPCGMetadataBitwiseOperation::Not`
- **説明**: 2番目の入力属性またはプロパティを選択
- **使用**: And、Or、Xor演算で使用（Not演算では非表示）

## 使用例

### ビットマスクによるフラグの抽出
```
// ビット演算でフラグを確認
// Flags属性とマスク値でAND演算を行い、特定のフラグが立っているかチェック
InputSource1: Flags (整数属性)
InputSource2: 0b0010 (マスク値)
Operation: And
結果: フラグの2ビット目の状態を取得
```

### 複数フラグの結合
```
// 2つのフラグセットを結合
InputSource1: Flags1
InputSource2: Flags2
Operation: Or
結果: 両方のフラグが結合された値
```

### フラグの反転
```
// フラグを反転
InputSource1: Flags
Operation: Not
結果: すべてのビットが反転された値
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` を返すため、事前設定された演算タイプとして提供されます
- **サポートされる型**: 整数型のみサポート（int32, int64など）
- **デフォルト値型**: EPCGMetadataTypes::Integer32
- **デフォルト値文字列**: int32のゼロ値

### 入力要件
- Not演算: 1つの入力のみ必要
- And、Or、Xor演算: 2つの入力が必要
- 入力は整数型である必要があります

### 演算実装
`FPCGMetadataBitwiseElement::DoOperation()` で実際のビット演算が実行されます。

## 注意事項

1. **整数型限定**: このノードは整数型の属性のみをサポートします。浮動小数点数やその他の型には使用できません
2. **Not演算の特性**: Not演算は単項演算のため、InputSource2は非表示になります
3. **ビット幅**: 使用する整数型のビット幅（32ビットまたは64ビット）に注意してください
4. **符号付き整数**: 符号付き整数を使用する場合、最上位ビットは符号ビットとして扱われます

## 関連ノード
- **Attribute Boolean Op**: 論理演算（ブール値）を実行
- **Attribute Maths Op**: 算術演算を実行
- **Attribute Compare**: 属性の比較演算を実行

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBitwiseOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataBitwiseOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
