# Attribute Compare Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataCompareSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataCompareOpElement.h:20`

## 概要

二つの属性値を比較し、条件判定結果を出力します。<br><span style='color:gray'>(Compares two attribute values and outputs the comparison result.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataCompareOperation` | `EPCGMetadataCompareOperation::Equal` | 2 つの属性値を比較する演算（等価、不等価、大小など）を選択します。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 比較の左辺となる属性。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 比較の右辺となる属性または定数値。 |
| `Tolerance` | `double` | `UE_DOUBLE_SMALL_NUMBER` | 浮動小数比較時の許容誤差。Equal/NotEqual 判定を安定させたいときに調整します。 |
