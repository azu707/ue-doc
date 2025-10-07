# Make Vector Attribute

## 概要
Make Vector Attributeノードは、個別のスカラー値または小さいベクトルから、Vector2、Vector、Vector4型の属性を構築します。柔軟な構築オプションをサポートします。

## 機能詳細
このノードは個別の成分値を組み合わせて、ベクトル型の属性を作成します。出力型と構築方法を選択できます。

### 主な機能
- **3つの出力型**: Vector2、Vector、Vector4を作成可能
- **柔軟な構築方法**: スカラー値のみ、またはベクトルとスカラーの組み合わせ
- **動的入力**: 構築方法に応じて必要な入力数が変化

### 処理フロー
1. 出力型と構築方法を選択
2. 必要な入力値を取得
3. 指定された方法でベクトルを構築
4. 結果を出力属性に書き込み

## プロパティ

### OutputType
- **型**: EPCGMetadataTypes（列挙型）
- **デフォルト値**: Vector2
- **有効値**: Vector2、Vector、Vector4
- **説明**: 作成するベクトルの型を指定

### MakeVector3Op
- **型**: EPCGMetadataMakeVector3（列挙型）
- **デフォルト値**: ThreeValues
- **表示条件**: `OutputType == Vector`
- **説明**: Vector（3D）の構築方法を指定
- **選択肢**:
  - `ThreeValues`: 3つのスカラー値（X, Y, Z）
  - `Vector2AndValue`: Vector2とスカラー値（XY, Z）

### MakeVector4Op
- **型**: EPCGMetadataMakeVector4（列挙型）
- **デフォルト値**: FourValues
- **表示条件**: `OutputType == Vector4`
- **説明**: Vector4の構築方法を指定
- **選択肢**:
  - `FourValues`: 4つのスカラー値（X, Y, Z, W）
  - `Vector2AndTwoValues`: Vector2と2つのスカラー値（XY, Z, W）
  - `TwoVector2`: 2つのVector2（XY, ZW）
  - `Vector3AndValue`: Vectorとスカラー値（XYZ, W）

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力値
- **ピンラベル**: 構築方法によって変化（X, XY, XYZ）

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 2番目の入力値
- **ピンラベル**: 構築方法によって変化（Y, Z, ZW, W）

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 3番目の入力値（必要な場合のみ）
- **ピンラベル**: 構築方法によって変化（Z, W）

### InputSource4
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 4番目の入力値（Vector4の場合のみ）
- **ピンラベル**: W

## 使用例

### 個別のXYZ値からベクトルを作成
```
// 3つのスカラー値から3Dベクトルを作成
OutputType: Vector
MakeVector3Op: ThreeValues
InputSource1: X (Float, 例: 100)
InputSource2: Y (Float, 例: 200)
InputSource3: Z (Float, 例: 50)
結果: (100, 200, 50)のVector
```

### 2Dベクトルを作成
```
// 2つのスカラー値から2Dベクトルを作成
OutputType: Vector2
InputSource1: U (Float, 例: 0.5)
InputSource2: V (Float, 例: 0.7)
結果: (0.5, 0.7)のVector2
```

### Vector2とスカラーからVectorを作成
```
// 2Dベクトルと高さからVectorを作成
OutputType: Vector
MakeVector3Op: Vector2AndValue
InputSource1: XY (Vector2, 例: (10, 20))
InputSource2: Height (Float, 例: 5)
結果: (10, 20, 5)のVector
```

### 2つのVector2からVector4を作成
```
// 2つの2Dベクトルから4Dベクトルを作成
OutputType: Vector4
MakeVector4Op: TwoVector2
InputSource1: FirstPair (Vector2, 例: (1, 2))
InputSource2: SecondPair (Vector2, 例: (3, 4))
結果: (1, 2, 3, 4)のVector4
```

### RGBAカラーの作成
```
// 個別のRGBA値からVector4を作成
OutputType: Vector4
MakeVector4Op: FourValues
InputSource1: R (Float, 0-1)
InputSource2: G (Float, 0-1)
InputSource3: B (Float, 0-1)
InputSource4: A (Float, 0-1)
結果: RGBAカラーベクトル
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **動的オペランド数**: 構築方法に応じて1～4個の入力
- **出力型**: Vector2、Vector、Vector4
- **動的ピンラベル**: 構築方法に応じて変化

### ピンラベル定数
- `XLabel` = "X"
- `YLabel` = "Y"
- `ZLabel` = "Z"
- `WLabel` = "W"
- `XYLabel` = "XY"
- `ZWLabel` = "ZW"
- `XYZLabel` = "XYZ"

### サポートされる入力型
- スカラー値: Float、Double、Integer
- ベクトル値: Vector2、Vector（構築方法による）

### 入力数
- **Vector2**: 2つの入力（常にThreeValuesと同等）
- **Vector（ThreeValues）**: 3つの入力
- **Vector（Vector2AndValue）**: 2つの入力
- **Vector4（FourValues）**: 4つの入力
- **Vector4（Vector2AndTwoValues）**: 3つの入力
- **Vector4（TwoVector2）**: 2つの入力
- **Vector4（Vector3AndValue）**: 2つの入力

## 注意事項

1. **構築方法の選択**: 既存のデータ構造に応じて適切な構築方法を選択してください
2. **型の一致**: 入力の型が期待される型と一致することを確認してください
3. **ピンラベルの確認**: 構築方法によってピンラベルが変わるため注意が必要です
4. **スカラーからベクトル**: スカラー値を自動的にベクトルに展開する場合、Attribute Castも検討してください
5. **パフォーマンス**: 大量のデータに対して個別の成分から構築するのは非効率な場合があります

## 関連ノード
- **Break Vector Attribute**: ベクトルを成分に分解（逆操作）
- **Make Transform Attribute**: トランスフォームを作成
- **Make Rotator Attribute**: ローテーターを作成
- **Attribute Vector Op**: ベクトル演算
- **Attribute Cast**: 型変換（スカラーからベクトルへの変換など）

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMakeVector.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataMakeVector.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
