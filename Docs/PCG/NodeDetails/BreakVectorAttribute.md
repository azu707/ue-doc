# Break Vector Attribute

## 概要
Break Vector Attributeノードは、ベクトル属性を個別の成分（X、Y、Z、W）に分解します。Vector2、Vector、Vector4型の属性を個別のスカラー属性に分割する際に使用されます。

## 機能詳細
このノードはベクトル型の属性を受け取り、各成分を個別の出力ピンとして提供します。ベクトルの個別成分にアクセスしたい場合に使用されます。

### 主な機能
- **ベクトル分解**: ベクトル属性を個別の成分に分解
- **複数出力**: X、Y、Z、W成分を個別の出力ピンで提供
- **型対応**: Vector2（X, Y）、Vector（X, Y, Z）、Vector4（X, Y, Z, W）をサポート

### 処理フロー
1. 入力ベクトル属性を取得
2. 各成分を抽出
3. 個別の成分を対応する出力ピンに出力

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 分解するベクトル属性を選択
- **サポートされる型**:
  - Vector2: X、Y成分
  - Vector: X、Y、Z成分
  - Vector4: X、Y、Z、W成分

## 使用例

### 位置ベクトルの分解
```
// 位置ベクトルを個別の座標に分解
InputSource: Position (Vector)
出力:
  X: X座標（スカラー）
  Y: Y座標（スカラー）
  Z: Z座標（スカラー）
```

### 高さの抽出
```
// 位置ベクトルからZ成分（高さ）のみを使用
InputSource: Location (Vector)
使用する出力: Z
結果: Z成分のみを他のノードで使用可能
```

### 2D座標の分解
```
// 2Dベクトルを分解
InputSource: UV (Vector2)
出力:
  X: U座標（スカラー）
  Y: V座標（スカラー）
```

### Vector4の分解
```
// 4成分ベクトルを分解
InputSource: ColorRGBA (Vector4)
出力:
  X: R成分（赤）
  Y: G成分（緑）
  Z: B成分（青）
  W: A成分（アルファ）
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **サポートされる型**: Vector2, Vector, Vector4
- **出力ピンラベル**:
  - PCGMetadataBreakVectorConstants::XLabel = "X"
  - PCGMetadataBreakVectorConstants::YLabel = "Y"
  - PCGMetadataBreakVectorConstants::ZLabel = "Z"
  - PCGMetadataBreakVectorConstants::WLabel = "W"
- **デフォルト値型**: EPCGMetadataTypes::Vector

### 出力構造
- **Vector2**: X、Y の2つの出力
- **Vector**: X、Y、Z の3つの出力
- **Vector4**: X、Y、Z、W の4つの出力

### 出力型
- すべての成分出力はdouble型（スカラー）

### 出力属性名
- デフォルトでは、BaseName_X、BaseName_Y、BaseName_Z、BaseName_Wの形式
- 例: Position_X、Position_Y、Position_Z

## 注意事項

1. **型の一致**: 入力はベクトル型（Vector2, Vector, Vector4）である必要があります
2. **成分数**: Vector2はX, Y、VectorはX, Y, Z、Vector4はX, Y, Z, Wを出力します
3. **未使用の出力**: すべての出力を使用する必要はありません（必要な成分のみ接続可能）
4. **パフォーマンス**: 1つの成分のみが必要な場合でも、すべての成分が計算されます
5. **属性名**: 出力属性名は入力属性名に基づいて自動生成されます

## 関連ノード
- **Make Vector Attribute**: 個別の成分からベクトルを作成（逆操作）
- **Break Transform Attribute**: トランスフォームを分解
- **Attribute Vector Op**: ベクトル演算
- **Attribute Select**: ベクトルの特定軸を選択

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBreakVector.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataBreakVector.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
