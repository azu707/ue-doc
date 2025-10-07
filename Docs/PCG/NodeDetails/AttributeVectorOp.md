# Attribute Vector Op

## 概要
Attribute Vector Opノードは、ベクトル属性に対して各種ベクトル演算を実行します。外積、内積、距離、正規化、長さ、軸周り回転、およびトランスフォームによるベクトル変換をサポートしています。

## 機能詳細
このノードはベクトル型（Vector2, Vector, Vector4）の属性に対してベクトル演算を実行します。ベクトル計算、方向の操作、空間変換などに使用されます。

### 主な機能
- **ベクトル演算**: 外積、内積、距離、正規化、長さ、軸周り回転
- **トランスフォーム演算**: トランスフォームによる方向/位置の変換と逆変換

### 処理フロー
1. 入力属性からベクトル値を取得
2. 指定されたベクトル演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataVectorOperation（列挙型）
- **デフォルト値**: Cross
- **説明**: 実行するベクトル演算のタイプを指定
- **ベクトル演算（VectorOp）**:
  - `Cross`: 外積（クロス積）- 2つのベクトルに垂直なベクトルを計算
  - `Dot`: 内積（ドット積）- スカラー値を返す
  - `Distance`: 2つのベクトル間の距離
  - `Normalize`: ベクトルを正規化（単位ベクトルに）
  - `Length`: ベクトルの長さ（大きさ）
  - `RotateAroundAxis`: 軸周りの回転（ベクトル、軸、角度）
- **トランスフォーム演算（TransformOp）**:
  - `TransformDirection`: トランスフォームで方向ベクトルを変換（平行移動なし）
  - `TransformLocation`: トランスフォームで位置ベクトルを変換（平行移動あり）
  - `InverseTransformDirection`: トランスフォームで方向ベクトルを逆変換
  - `InverseTransformLocation`: トランスフォームで位置ベクトルを逆変換

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性（ベクトルまたはトランスフォーム）

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation != Normalize && Operation != Length`
- **説明**: 2番目の入力属性
- **使用**:
  - Cross, Dot, Distance: 2番目のベクトル
  - RotateAroundAxis: 回転軸ベクトル
  - Transform演算: 変換するベクトル

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation == RotateAroundAxis`
- **説明**: 3番目の入力属性（RotateAroundAxisの回転角度、ラジアン）

## 使用例

### 外積の計算
```
// 2つのベクトルの外積を計算
InputSource1: VectorA (Vector)
InputSource2: VectorB (Vector)
Operation: Cross
結果: VectorA × VectorB（VectorAとVectorBに垂直なベクトル）
```

### 内積の計算
```
// 2つのベクトルの内積を計算
InputSource1: VectorA (Vector)
InputSource2: VectorB (Vector)
Operation: Dot
結果: VectorA · VectorB（スカラー値）
```

### ベクトルの正規化
```
// ベクトルを単位ベクトルに正規化
InputSource1: Direction (Vector)
Operation: Normalize
結果: 長さ1の同じ方向のベクトル
```

### 2点間の距離
```
// 2つの位置間の距離を計算
InputSource1: PositionA (Vector)
InputSource2: PositionB (Vector)
Operation: Distance
結果: |PositionA - PositionB|の距離（スカラー値）
```

### 軸周りの回転
```
// ベクトルを軸周りに回転
InputSource1: Vector (Vector)
InputSource2: Axis (Vector, 正規化推奨)
InputSource3: Angle (Float, ラジアン)
Operation: RotateAroundAxis
結果: Axisを中心にAngle回転したVector
```

### トランスフォームで方向を変換
```
// ローカル方向をワールド方向に変換
InputSource1: Transform (Transform)
InputSource2: LocalDirection (Vector)
Operation: TransformDirection
結果: ワールド空間での方向ベクトル（平行移動なし）
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` - 事前設定された演算タイプとして提供
- **デフォルト値型**: EPCGMetadataTypes::Vector

### サポートされる型
- **ベクトル演算**: Vector2, Vector, Vector4
- **トランスフォーム演算**: Transform（InputSource1）、Vector（InputSource2）

### 演算の詳細

#### ベクトル演算

**Cross（外積）**
- 3Dベクトルのみ対応
- `Output = A × B`
- 結果は AとBに垂直なベクトル
- 右手系の座標系を使用

**Dot（内積）**
- `Output = A · B = |A| |B| cos(θ)`
- スカラー値を返す
- 0の場合、ベクトルは垂直

**Distance（距離）**
- `Output = |A - B|`
- 2つのベクトル間のユークリッド距離
- スカラー値を返す

**Normalize（正規化）**
- `Output = A / |A|`
- 長さ1の単位ベクトルに変換
- ゼロベクトルの場合、ゼロベクトルを返す

**Length（長さ）**
- `Output = |A| = sqrt(x² + y² + z²)`
- ベクトルの大きさ
- スカラー値を返す

**RotateAroundAxis（軸周り回転）**
- Axisを中心にVectorをAngle（ラジアン）回転
- Rodriguesの回転公式を使用
- Axisは正規化推奨

#### トランスフォーム演算

**TransformDirection**
- 方向ベクトルをワールド空間に変換
- 回転とスケールのみ適用（平行移動なし）
- `Transform.TransformVector(LocalDirection)`

**TransformLocation**
- 位置ベクトルをワールド空間に変換
- 回転、スケール、平行移動すべて適用
- `Transform.TransformPosition(LocalPosition)`

**InverseTransformDirection**
- ワールド方向をローカル空間に逆変換
- 回転とスケールの逆変換のみ

**InverseTransformLocation**
- ワールド位置をローカル空間に逆変換
- 完全な逆変換

### 入力要件
- **Normalize, Length**: 1つの入力
- **Cross, Dot, Distance, Transform演算**: 2つの入力
- **RotateAroundAxis**: 3つの入力（ベクトル、軸、角度）

## 注意事項

1. **外積の次元**: Cross演算は3Dベクトル（Vector）のみサポートします
2. **正規化のゼロベクトル**: ゼロベクトルの正規化はゼロベクトルを返します
3. **軸の正規化**: RotateAroundAxisの軸は正規化されている必要があります
4. **角度の単位**: RotateAroundAxisの角度はラジアンで指定します
5. **Transform演算の違い**: DirectionとLocationの違いに注意（平行移動の有無）

## 関連ノード
- **Attribute Maths Op**: 数学演算
- **Attribute Rotator Op**: ローテーター演算
- **Attribute Transform Op**: トランスフォーム演算
- **Break Vector Attribute**: ベクトルを成分に分解
- **Make Vector Attribute**: 成分からベクトルを作成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataVectorOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataVectorOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
