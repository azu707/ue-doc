# Attribute Select

## 概要
Attribute Selectノードは、入力データのすべてのエントリ/ポイントから指定された属性に対して選択演算（最小、最大、中央値）を実行し、選択された値とポイントをParamDataとして出力します。

## 機能詳細
このノードはベクトル属性またはスカラー属性の指定された軸に対して選択演算を実行します。最小値、最大値、または中央値を持つポイントを見つけ、その値とポイントを出力します。

### 主な機能
- **選択演算**: 最小、最大、中央値を選択
- **軸指定**: ベクトル属性の特定の軸（X, Y, Z, W）またはカスタム軸を選択
- **属性とポイント出力**: 選択された値とそのポイントの両方を出力
- **スカラー/ベクトル対応**: スカラー属性とベクトル属性の両方をサポート

### 処理フロー
1. 入力属性から値を取得
2. ベクトルの場合、指定された軸に沿った値を計算
3. 選択演算（Min/Max/Median）を適用
4. 選択された値とそのポイントをParamDataとして出力

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 選択演算を実行する入力属性またはプロパティを選択

### OutputAttributeName
- **型**: FName
- **デフォルト値**: NAME_None（空）
- **説明**: 出力属性の名前を指定
- **特記**: NAME_Noneの場合、InputSource.GetName()が使用されます

### Operation
- **型**: EPCGAttributeSelectOperation（列挙型）
- **デフォルト値**: Min
- **PCG_Overridable**: あり
- **説明**: 実行する選択演算のタイプを指定
- **選択肢**:
  - `Min`: 最小値を選択
  - `Max`: 最大値を選択
  - `Median`: 中央値を選択（要素数が偶数の場合、Index = Num / 2のポイントを選択）

### Axis
- **型**: EPCGAttributeSelectAxis（列挙型）
- **デフォルト値**: X
- **PCG_Overridable**: あり
- **説明**: ベクトル属性の場合、どの軸を使用するかを指定
- **選択肢**:
  - `X`: X軸の値を使用
  - `Y`: Y軸の値を使用
  - `Z`: Z軸の値を使用
  - `W`: W軸の値を使用（Vector4の場合）
  - `CustomAxis`: カスタム軸ベクトルとの内積を使用

### CustomAxis
- **型**: FVector4
- **デフォルト値**: (0, 0, 0, 0)
- **PCG_Overridable**: あり
- **表示条件**: `Axis == CustomAxis`
- **説明**: カスタム軸ベクトルを指定。ベクトル属性との内積が計算されます

## 使用例

### 最高点の選択
```
// Y軸（高さ）が最大のポイントを選択
InputSource: Position (Vector)
OutputAttributeName: HighestPosition
Operation: Max
Axis: Y
結果: Y座標が最大のポイントとその位置が出力される
```

### 最も近いポイントの選択
```
// 原点からの距離が最小のポイントを選択
InputSource: Distance (float)
OutputAttributeName: ClosestDistance
Operation: Min
Axis: X (スカラーなので軸は無視される)
結果: 距離が最小のポイントとその距離値が出力される
```

### 中央値の密度を持つポイント
```
// 密度の中央値を持つポイントを選択
InputSource: Density
OutputAttributeName: MedianDensity
Operation: Median
結果: 密度の中央値を持つポイントとその密度が出力される
```

### カスタム方向への投影最大値
```
// カスタム方向への投影が最大のポイントを選択
InputSource: Position (Vector)
OutputAttributeName: MaxProjection
Operation: Max
Axis: CustomAxis
CustomAxis: (0.707, 0.707, 0, 0)  // 45度方向
結果: カスタム方向への投影が最大のポイントが選択される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGAttributeSelectElement`（`IPCGElement`を継承）

### 特徴
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`
- **2つの出力**:
  1. `Attribute`: 選択された属性値を含むParamData
  2. `Point`: 選択されたポイント（入力がPointDataの場合のみ）

### サポートされる型
- **スカラー属性**: float, double, int32, int64など
- **ベクトル属性**: Vector2, Vector, Vector4

### 選択アルゴリズム
1. **スカラー属性の場合**:
   - 直接値を比較

2. **ベクトル属性の場合**:
   - 指定された軸の成分を抽出（X, Y, Z, W）
   - CustomAxisの場合、ベクトルとの内積を計算
   - その値で比較

3. **Median演算**:
   - 値をソート
   - 要素数が奇数: 中央のインデックス（Num / 2）
   - 要素数が偶数: Index = Num / 2のポイントを選択（任意的に選択）

### 出力ピン
- **OutputAttributeLabel**: "Attribute" - 選択された属性値
- **OutputPointLabel**: "Point" - 選択されたポイント（PointDataの場合のみ）

## 注意事項

1. **中央値の偶数要素**: 要素数が偶数の場合、中央の2つのうち、Index = Num / 2のポイントが選択されます（平均ではありません）
2. **スカラーと軸**: スカラー属性の場合、Axis設定は無視されます
3. **カスタム軸の正規化**: CustomAxisは正規化されている必要があります（内積計算のため）
4. **出力名**: OutputAttributeNameが空の場合、入力属性名が使用されます
5. **Point出力**: Point出力は入力がPointDataの場合のみ提供されます

## 関連ノード
- **Attribute Reduce**: 集計演算（平均、合計など）
- **Sort Attributes**: 属性値でソート
- **Filter Data By Attribute**: 属性値でフィルタリング
- **Attribute Maths Op**: 数学演算

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeSelectElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGAttributeSelectElement.cpp`
