# Get Attribute From Point Index

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeGetFromPointIndexSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeGetFromPointIndexElement.h:24`

## 概要

ポイントインデックスを指定して別データセットから属性を取得します。<br><span style='color:gray'>(Pulls attribute values from another dataset by point index.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 参照する属性。 |
| `Index` | `int32` | `0` | 取得したいポイントインデックス。 |
| `OutputAttributeName` | `FPCGAttributePropertyOutputSelector` | なし | 取得結果を書き出す属性名。 |
