# Make Rotator Attribute

## 概要
Make Rotator Attributeノードは、1つ、2つ、または3つの軸ベクトル、あるいはオイラー角からローテーター（回転）を作成します。複数の構築方法をサポートし、柔軟な回転の生成を可能にします。

## 機能詳細
このノードはベクトルまたは角度値からFRotator型の属性を構築します。単一軸、2軸、3軸、またはオイラー角から回転を生成できます。

### 主な機能
- **単一軸回転**: X、Y、Zいずれかの軸から回転を作成
- **2軸回転**: 2つの軸から回転を作成（6つの組み合わせ）
- **3軸回転**: 3つの軸から完全な回転を作成
- **オイラー角**: Yaw、Pitch、Rollから回転を作成

### 処理フロー
1. 入力属性から軸ベクトルまたは角度値を取得
2. 指定された操作に基づいて回転を構築
3. 結果のローテーターを出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataMakeRotatorOp（列挙型）
- **デフォルト値**: MakeRotFromAxes
- **説明**: 回転の構築方法を指定
- **選択肢**:

  **単一軸からの回転**:
  - `MakeRotFromX`: X軸ベクトルから回転を作成
  - `MakeRotFromY`: Y軸ベクトルから回転を作成
  - `MakeRotFromZ`: Z軸ベクトルから回転を作成

  **2軸からの回転**:
  - `MakeRotFromXY`: XとY軸から回転を作成
  - `MakeRotFromYX`: YとX軸から回転を作成
  - `MakeRotFromXZ`: XとZ軸から回転を作成
  - `MakeRotFromZX`: ZとX軸から回転を作成
  - `MakeRotFromYZ`: YとZ軸から回転を作成
  - `MakeRotFromZY`: ZとY軸から回転を作成

  **3軸/角度からの回転**:
  - `MakeRotFromAxes`: Forward、Right、Up軸から回転を作成
  - `MakeRotFromAngles`: Yaw、Pitch、Roll（オイラー角）から回転を作成

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力（軸ベクトルまたは角度）
- **ピンラベル**: 操作によって変化（X, Y, Z, Forward, Yaw）

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: 2軸または3軸操作
- **説明**: 2番目の入力（軸ベクトルまたは角度）
- **ピンラベル**: 操作によって変化（Y, X, Z, Right, Pitch）

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation == MakeRotFromAxes || MakeRotFromAngles`
- **説明**: 3番目の入力（軸ベクトルまたは角度）
- **ピンラベル**: Up（軸）またはRoll（角度）

## 使用例

### 前方ベクトルから回転を作成
```
// 前方方向ベクトルから回転を作成
Operation: MakeRotFromX
InputSource1: ForwardDirection (Vector)
結果: ForwardDirectionを前方（X軸）とする回転
```

### 2つの軸から回転を作成
```
// 前方と右方向から回転を作成
Operation: MakeRotFromXY
InputSource1: Forward (Vector)
InputSource2: Right (Vector)
結果: ForwardとRightに基づく回転
```

### 完全な軸セットから回転を作成
```
// 3つの軸から完全な回転を作成
Operation: MakeRotFromAxes
InputSource1: Forward (Vector)
InputSource2: Right (Vector)
InputSource3: Up (Vector)
結果: 3軸で定義された完全な回転
```

### オイラー角から回転を作成
```
// Yaw、Pitch、Rollから回転を作成
Operation: MakeRotFromAngles
InputSource1: Yaw (Float, 度)
InputSource2: Pitch (Float, 度)
InputSource3: Roll (Float, 度)
結果: オイラー角で定義された回転
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true`
- **出力型**: FRotator（Rotator型）
- **動的ピンラベル**: 操作に応じてピンラベルが変化

### ピンラベル
操作によって動的に変化:
- 単一軸: X, Y, Z
- 2軸: 組み合わせに応じて（X+Y, Y+X, X+Z, など）
- 3軸: Forward, Right, Up
- 角度: Yaw, Pitch, Roll

### サポートされる入力型
- 軸ベクトル: Vector（FVector）
- 角度値: Float、Double（度単位）

### 回転構築の詳細

#### 単一軸回転
- 指定された軸を基準軸として使用
- 他の軸は自動的に計算される

#### 2軸回転
- 2つの軸から残りの軸を計算（外積を使用）
- 軸の順序が重要（優先軸が異なる）

#### 3軸回転
- 3つの軸を直接使用
- 軸が直交していない場合、正規化と直交化が行われる可能性がある

#### オイラー角
- Yaw（ヨー、Z軸周り）
- Pitch（ピッチ、Y軸周り）
- Roll（ロール、X軸周り）
- 度単位で指定

## 注意事項

1. **軸の正規化**: 入力軸ベクトルは正規化されている必要があります
2. **軸の直交性**: 2軸/3軸回転では、軸が互いに垂直であることが推奨されます
3. **角度の単位**: オイラー角は度単位で指定します（ラジアンではない）
4. **ジンバルロック**: オイラー角はジンバルロックの問題を持つ可能性があります
5. **軸の順序**: 2軸回転では順序が重要です（XY ≠ YX）

## 関連ノード
- **Break Transform Attribute**: トランスフォームから回転を抽出
- **Attribute Rotator Op**: ローテーター演算
- **Make Transform Attribute**: トランスフォームを作成
- **Attribute Vector Op**: ベクトル演算（軸の計算に使用）

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMakeRotator.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataMakeRotator.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
