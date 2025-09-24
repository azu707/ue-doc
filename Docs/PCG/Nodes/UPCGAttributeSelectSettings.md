# Attribute Select

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeSelectSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeSelectElement.h:48`

## 概要

複数の属性から必要なものだけを選択し、他を除外します。<br><span style='color:gray'>(Passes through only the selected attributes and drops the rest.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 選択元となるベクトル／数値属性。 |
| `OutputAttributeName` | `FName` | `NAME_None` | 選択結果を書き込む属性。空の場合は入力を上書きします。 |
| `Operation` | `EPCGAttributeSelectOperation` | `EPCGAttributeSelectOperation::Min` | 抜き出す要素（最小値、最大値など）を指定します。 |
| `Axis` | `EPCGAttributeSelectAxis` | `EPCGAttributeSelectAxis::X` | ベクトルから抽出する軸。Custom を選ぶと `CustomAxis` を使用します。 |
| `CustomAxis` | `FVector4` | `FVector4::Zero()` | 任意軸を指定する場合の方向ベクトル。 |
