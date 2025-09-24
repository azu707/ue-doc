# Attribute Remap

- **日本語名**: 属性の再マッピング
- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeRemapSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGAttributeRemap.h:18`

## 概要

属性値を新しい最小値と最大値のレンジへスケーリングします。<br><span style='color:gray'>(Rescales attribute values into a new min/max range.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | リマップ対象の属性。 |
| `InRangeMin` | `double` | `0.f` | 入力値レンジの下限。同値の場合は出力範囲の平均値にマップされます。 |
| `InRangeMax` | `double` | `1.f` | 入力値レンジの上限。 |
| `OutRangeMin` | `double` | `0.f` | 出力レンジの下限。 |
| `OutRangeMax` | `double` | `1.f` | 出力レンジの上限。 |
| `bClampToUnitRange` | `bool` | `false` | 出力値を 0〜1 にクランプします。 |
| `bIgnoreValuesOutsideInputRange` | `bool` | `false` | 入力範囲外の値は変換せずに残します。 |
| `bAllowInverseRange` | `bool` | `false` | 入出力の上下関係が逆転する設定（例: [0,1]→[1,0]）を許可します。 |
