# Attribute Rotator Op

## 概要
Attribute Rotator Opノードは、ローテーター（回転）属性に対して各種演算を実行します。回転の合成、反転、補間、正規化、およびトランスフォームによる回転変換をサポートしています。

## 機能詳細
このノードはFRotatorおよびFQuaternion型の属性に対して回転演算を実行します。回転の組み合わせ、逆回転、補間などの操作を提供します。

### 主な機能
- **回転演算**: 合成、反転、補間、正規化
- **トランスフォーム演算**: トランスフォームによる回転変換と逆変換
- **補間オプション**: 最短経路での補間をサポート
- **単項/二項/三項演算**: 演算タイプに応じて必要な入力数が変化

### 処理フロー
1. 入力属性から回転値を取得
2. 指定された回転演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataRotatorOperation（列挙型）
- **デフォルト値**: Combine
- **説明**: 実行する回転演算のタイプを指定
- **回転演算（RotatorOp）**:
  - `Combine`: 2つの回転を合成（R1 * R2）
  - `Invert`: 回転を反転（逆回転）
  - `Lerp`: 2つの回転を補間（3つの入力: R1, R2, Alpha）
  - `Normalize`: 回転を正規化
- **トランスフォーム演算（TransformOp）**:
  - `TransformRotation`: トランスフォームで回転を変換
  - `InverseTransformRotation`: トランスフォームで回転を逆変換

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性（回転またはトランスフォーム）

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation != Invert`
- **説明**: 2番目の入力属性（Invert以外で使用）

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation == Lerp`
- **説明**: 3番目の入力属性（Lerpで使用するAlpha値、0.0-1.0）

## 使用例

### 回転の合成
```
// 2つの回転を合成
InputSource1: BaseRotation (Rotator)
InputSource2: AdditionalRotation (Rotator)
Operation: Combine
結果: BaseRotation * AdditionalRotation の合成回転
```

### 逆回転の計算
```
// 回転を反転
InputSource1: Rotation (Rotator)
Operation: Invert
結果: Rotationの逆回転
```

### 回転の補間
```
// 2つの回転を補間
InputSource1: StartRotation (Rotator)
InputSource2: EndRotation (Rotator)
InputSource3: BlendFactor (Float, 0.0-1.0)
Operation: Lerp
結果: StartRotationとEndRotationの間を補間した回転（最短経路）
```

### トランスフォームによる回転変換
```
// トランスフォームで回転を変換
InputSource1: Transform (Transform)
InputSource2: LocalRotation (Rotator)
Operation: TransformRotation
結果: Transformのワールド空間でLocalRotationを変換
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` - 事前設定された演算タイプとして提供
- **デフォルト値型**: RotatorまたはTransform（演算によって異なる）

### サポートされる型
- **回転演算**: FRotator, FQuat
- **トランスフォーム演算**: FTransform（InputSource1）、FRotator/FQuat（InputSource2）

### 演算の詳細

#### Combine（合成）
- 2つの回転を合成: `Output = R1 * R2`
- 回転の順序に注意（非可換）

#### Invert（反転）
- 逆回転を計算: `Output = R1^-1`
- 単項演算

#### Lerp（補間）
- 球面線形補間（Slerp）
- `RLerp(A, B, Alpha, bShortestPath)` を使用（Kismet Math Libraryより）
- bShortestPathがtrueの場合、最短経路で補間

#### Normalize（正規化）
- 回転を正規化
- Quaternionの場合、単位Quaternionに正規化

#### TransformRotation
- トランスフォームでローカル回転をワールド空間に変換
- `Transform.TransformRotation(LocalRotation)`

#### InverseTransformRotation
- トランスフォームでワールド回転をローカル空間に逆変換
- `Transform.InverseTransformRotation(WorldRotation)`

### 入力要件
- **Invert, Normalize**: 1つの入力
- **Combine, TransformRotation, InverseTransformRotation**: 2つの入力
- **Lerp**: 3つの入力（R1, R2, Alpha）

## 注意事項

1. **回転の順序**: Combine演算では回転の順序が重要です（R1 * R2 ≠ R2 * R1）
2. **Quaternion正規化**: Lerpやその他の演算後、Quaternionは自動的に正規化されます
3. **Alpha範囲**: Lerp演算のAlpha値は通常0.0-1.0の範囲ですが、範囲外の値も許容されます
4. **最短経路**: Lerp演算は最短経路を使用して補間されます
5. **型の互換性**: トランスフォーム演算ではInputSource1はTransform型、InputSource2はRotator/Quat型である必要があります

## 関連ノード
- **Attribute Transform Op**: トランスフォーム演算
- **Break Transform Attribute**: トランスフォームを分解
- **Make Rotator Attribute**: ローテーターを作成
- **Attribute Vector Op**: ベクトル演算

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataRotatorOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataRotatorOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
