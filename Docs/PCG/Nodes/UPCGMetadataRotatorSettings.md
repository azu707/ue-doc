# Attribute Rotator Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataRotatorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataRotatorOpElement.h:29`

## 概要

Rotator 属性に対して加算や補間などの演算を適用します。<br><span style='color:gray'>(Executes operations such as add or blend on rotator attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataRotatorOperation` | `EPCGMetadataRotatorOperation::Combine` | Rotator 属性同士の合成・補間など、適用する演算を指定します。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 演算の第一入力ローテータ。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二入力ローテータ。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 三番目の入力。Lerp など一部演算で使用します。 |
