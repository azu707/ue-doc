# Attribute Compare Op

## 概要
Attribute Compare Opノードは、2つの属性値を比較し、比較結果をブール値として出力します。等価、不等価、大小関係など、6種類の比較演算をサポートしています。

## 機能詳細
このノードは2つの属性値に対して比較演算を実行し、結果をブール値（true/false）として出力します。フィルタリングや条件分岐の基礎となるノードです。

### 主な機能
- **等価比較**: 2つの値が等しいかどうかを判定
- **不等価比較**: 2つの値が異なるかどうかを判定
- **大小比較**: 大なり、大なりイコール、小なり、小なりイコールの判定
- **許容誤差**: 浮動小数点数の比較で許容誤差を設定可能

### 処理フロー
1. 2つの入力属性から値を取得
2. 指定された比較演算を適用
3. 結果（true/false）を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataCompareOperation（列挙型）
- **デフォルト値**: Equal
- **説明**: 実行する比較演算のタイプを指定
- **選択肢**:
  - `Equal`: 等しい（==）
  - `NotEqual`: 等しくない（!=）
  - `Greater`: 大なり（>）
  - `GreaterOrEqual`: 大なりイコール（>=）
  - `Less`: 小なり（<）
  - `LessOrEqual`: 小なりイコール（<=）

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性またはプロパティを選択（比較の左辺）

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 2番目の入力属性またはプロパティを選択（比較の右辺）

### Tolerance
- **型**: double
- **デフォルト値**: UE_DOUBLE_SMALL_NUMBER（非常に小さい値）
- **表示条件**: `Operation == Equal || Operation == NotEqual`
- **説明**: 等価/不等価比較で使用する許容誤差
- **使用**: 浮動小数点数の比較で、この範囲内の差を等しいとみなす

## 使用例

### 密度に基づくフィルタリング
```
// 密度が0.5より大きいポイントを選択
InputSource1: Density
InputSource2: 0.5 (定数値)
Operation: Greater
結果: Density > 0.5 の場合にtrueを返すブール属性
```

### 特定値の検出
```
// タイプIDが特定の値と一致するか確認
InputSource1: TypeID
InputSource2: 3 (検索するID)
Operation: Equal
結果: TypeID == 3 の場合にtrueを返すブール属性
```

### 範囲チェック（下限）
```
// 高度が最低値以上かチェック
InputSource1: Elevation
InputSource2: 10.0 (最低高度)
Operation: GreaterOrEqual
結果: Elevation >= 10.0 の場合にtrueを返すブール属性
```

### 除外条件
```
// 特定のカテゴリを除外
InputSource1: Category
InputSource2: ExcludedCategory
Operation: NotEqual
結果: 異なるカテゴリの場合にtrueを返すブール属性
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` を返すため、事前設定された比較演算として提供されます
- **出力型**: 常にブール型（EPCGMetadataTypes::Boolean）を出力
- **デフォルト値型**: EPCGMetadataTypes::Double（入力ピンのデフォルト値）

### サポートされる入力型
- 数値型（int32, int64, float, double）
- ベクトル型（Vector2, Vector, Vector4）
- 文字列型（String）
- その他の比較可能な型

### 演算実装
`FPCGMetadataCompareElement::DoOperation()` で実際の比較演算が実行されます。

### 許容誤差の適用
- Equal / NotEqual演算でのみ有効
- 浮動小数点数の比較で数値誤差を吸収
- `abs(A - B) <= Tolerance` の場合に等しいとみなす

## 注意事項

1. **浮動小数点の比較**: 浮動小数点数を等価比較する際は、必ずToleranceを適切に設定してください
2. **型の一貫性**: 比較する2つの値は互換性のある型である必要があります
3. **出力型**: 出力は常にブール型で、Filter By Attributeなどのフィルタノードと組み合わせて使用します
4. **文字列比較**: 文字列の比較は辞書順で行われます
5. **ベクトルの比較**: ベクトル型の大小比較は、成分ごとの比較ではなく、ベクトルの大きさ（長さ）で比較されます

## 関連ノード
- **Filter By Attribute**: 比較結果のブール属性を使ってフィルタリング
- **Attribute Boolean Op**: ブール値の論理演算（複数の比較結果を組み合わせる）
- **Attribute Maths Op**: 数学演算
- **Attribute Select**: 条件に基づいて値を選択

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataCompareOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataCompareOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
