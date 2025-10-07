# Attribute Transform Op

## 概要
Attribute Transform Opノードは、トランスフォーム属性に対して各種演算を実行します。トランスフォームの合成、反転、および3種類の補間モードをサポートしています。

## 機能詳細
このノードはFTransform型の属性に対してトランスフォーム演算を実行します。位置、回転、スケールを含む完全な空間変換の操作を提供します。

### 主な機能
- **トランスフォーム合成**: 2つのトランスフォームを合成
- **トランスフォーム反転**: 逆トランスフォームを計算
- **トランスフォーム補間**: 3種類の補間モード（Quat、Euler、DualQuat）

### 処理フロー
1. 入力属性からトランスフォーム値を取得
2. 指定されたトランスフォーム演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataTransformOperation（列挙型）
- **デフォルト値**: Compose
- **説明**: 実行するトランスフォーム演算のタイプを指定
- **選択肢**:
  - `Compose`: 2つのトランスフォームを合成（T1 * T2）
  - `Invert`: トランスフォームを反転（逆変換）
  - `Lerp`: 2つのトランスフォームを補間（3つの入力: T1, T2, Alpha）

### TransformLerpMode
- **型**: EPCGTransformLerpMode（列挙型）
- **デフォルト値**: QuatInterp
- **表示条件**: `Operation == Lerp`
- **説明**: Lerp演算で使用する補間モードを指定
- **選択肢**:
  - `QuatInterp`: Quaternion補間（最短経路または球面線形補間）
  - `EulerInterp`: Euler角補間（ローターまたはオイラー角補間）
  - `DualQuatInterp`: Dual Quaternion補間（螺旋またはスクリューモーション経路）

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力トランスフォーム属性

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation != Invert`
- **説明**: 2番目の入力トランスフォーム属性（Invert以外で使用）

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation == Lerp`
- **説明**: 3番目の入力属性（Lerpで使用するAlpha値、0.0-1.0）

## 使用例

### トランスフォームの合成
```
// 2つのトランスフォームを合成
InputSource1: BaseTransform (Transform)
InputSource2: OffsetTransform (Transform)
Operation: Compose
結果: BaseTransform * OffsetTransform の合成トランスフォーム
```

### 逆トランスフォームの計算
```
// トランスフォームを反転
InputSource1: Transform (Transform)
Operation: Invert
結果: Transformの逆変換
```

### トランスフォームの補間（Quaternion）
```
// 2つのトランスフォームを補間（最短経路）
InputSource1: StartTransform (Transform)
InputSource2: EndTransform (Transform)
InputSource3: BlendFactor (Float, 0.0-1.0)
Operation: Lerp
TransformLerpMode: QuatInterp
結果: StartとEndの間を球面線形補間したトランスフォーム
```

### トランスフォームの補間（Dual Quaternion）
```
// 2つのトランスフォームを補間（螺旋経路）
InputSource1: StartTransform (Transform)
InputSource2: EndTransform (Transform)
InputSource3: BlendFactor (Float, 0.0-1.0)
Operation: Lerp
TransformLerpMode: DualQuatInterp
結果: StartとEndの間を螺旋経路で補間したトランスフォーム
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` - 事前設定された演算タイプとして提供
- **デフォルト値型**: EPCGMetadataTypes::Transform

### サポートされる型
- FTransform型のみ

### 演算の詳細

#### Compose（合成）
- 2つのトランスフォームを合成: `Output = T1 * T2`
- 位置、回転、スケールすべてが合成される
- トランスフォームの順序に注意（非可換）

#### Invert（反転）
- 逆トランスフォームを計算: `Output = T1^-1`
- 単項演算
- T1 * T1^-1 = 単位トランスフォーム

#### Lerp（補間）
3種類の補間モード:

1. **QuatInterp（Quaternion補間）**:
   - 回転をQuaternionで補間（Slerp）
   - 最短経路を使用
   - 位置とスケールは線形補間

2. **EulerInterp（Euler角補間）**:
   - 回転をEuler角で補間
   - ローター補間
   - 位置とスケールは線形補間

3. **DualQuatInterp（Dual Quaternion補間）**:
   - Dual Quaternion補間
   - 螺旋またはスクリューモーション経路
   - 位置と回転が同時に補間される（より自然な動き）

### 入力要件
- **Invert**: 1つの入力
- **Compose**: 2つの入力
- **Lerp**: 3つの入力（T1, T2, Alpha）

### 補間モードの選択ガイド
- **QuatInterp**: 一般的な用途、最短経路での回転補間
- **EulerInterp**: Euler角での補間が必要な場合
- **DualQuatInterp**: より自然な螺旋モーション、リギングやアニメーションに適している

## 注意事項

1. **トランスフォームの順序**: Compose演算では順序が重要です（T1 * T2 ≠ T2 * T1）
2. **スケールの扱い**: スケールが0または負の値の場合、予期しない結果になる可能性があります
3. **Alpha範囲**: Lerp演算のAlpha値は通常0.0-1.0の範囲ですが、範囲外の値も許容されます
4. **補間の品質**: DualQuatInterpは計算コストが高いですが、より自然な補間を提供します
5. **逆トランスフォーム**: スケールが0の場合、逆トランスフォームは計算できません

## 関連ノード
- **Attribute Rotator Op**: ローテーター演算
- **Attribute Vector Op**: ベクトル演算
- **Break Transform Attribute**: トランスフォームを分解
- **Make Transform Attribute**: トランスフォームを作成
- **Transform Points**: ポイントをトランスフォームで変換

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataTransformOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataTransformOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
