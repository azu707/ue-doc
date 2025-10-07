# Hash Attribute

## 概要
Hash Attributeノードは、属性をハッシュ化して32ビット符号なし整数に変換します。結果は64ビット符号付き整数として表現されます。一意のID生成や値の高速比較に使用されます。

## 機能詳細
このノードは任意の型の属性値をハッシュ関数に通して整数値に変換します。同じ入力値は常に同じハッシュ値を生成します。

### 主な機能
- **ハッシュ化**: 任意の型の属性を整数ハッシュ値に変換
- **型非依存**: すべての属性型をサポート
- **決定論的**: 同じ入力は常に同じハッシュ値を生成
- **一意ID生成**: 文字列や複合値から一意の整数IDを生成

### 処理フロー
1. 入力属性から値を取得
2. 値をハッシュ関数で処理
3. 32ビットハッシュ値を生成
4. 64ビット符号付き整数として出力

## プロパティ

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: ハッシュ化する入力属性を選択
- **サポートされる型**: すべての型

## 使用例

### 文字列から一意IDを生成
```
// 文字列属性をハッシュ化して数値IDに変換
InputSource1: Name (String)
結果: 各ユニークな名前に対して一意の整数ハッシュ値
```

### ベクトルのハッシュ化
```
// 位置ベクトルをハッシュ化
InputSource1: Position (Vector)
結果: 位置に基づく整数ハッシュ値（同じ位置は同じハッシュ）
```

### 複合キーの生成
```
// 複数の属性を組み合わせてハッシュ化
1. Make Vector AttributeでX, Y, Zから複合ベクトルを作成
2. Hash Attributeでベクトルをハッシュ化
結果: 複合キーとしての一意ハッシュ値
```

### シード値の生成
```
// 属性からシード値を生成
InputSource1: ObjectID (String)
結果: オブジェクトIDに基づく決定論的なシード値
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **入力数**: 1つのオペランド（`GetOperandNum()` = 1）
- **サポートされる型**: すべての型（`IsSupportedInputType()` が常に `true`）
- **出力型**: Integer32（32ビット整数）
- **デフォルト値型**: String

### ハッシュアルゴリズム
- Unrealのハッシュ関数を使用
- 32ビット符号なし整数を生成
- 64ビット符号付き整数（int64）として表現

### 衝突について
- ハッシュ関数は衝突の可能性があります（異なる値が同じハッシュになる）
- 32ビットハッシュ空間（約43億の値）
- 一意性が重要な場合、元の値の保持も検討してください

## 注意事項

1. **ハッシュ衝突**: 異なる値が同じハッシュ値を生成する可能性があります
2. **非可逆**: ハッシュ値から元の値を復元することはできません
3. **決定論的**: 同じ入力は常に同じハッシュを生成します（シードに依存しない）
4. **負の値**: 出力は64ビット符号付き整数ですが、実際のハッシュ値は32ビット符号なしです
5. **浮動小数点の精度**: 微小な差異でも異なるハッシュ値が生成されます

## 関連ノード
- **Generate Seed**: シード値の生成（ハッシュも使用可能）
- **Attribute Cast**: 型変換
- **Attribute Partition**: 属性値でパーティション分割
- **Attribute Remove Duplicates**: 重複除去

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGHashAttribute.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGHashAttribute.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
