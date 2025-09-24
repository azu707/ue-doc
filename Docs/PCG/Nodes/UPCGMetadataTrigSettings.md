# Attribute Trig Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataTrigSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataTrigOpElement.h:23`

## 概要

数値属性に三角関数を適用し、サインやコサイン値を得ます。<br><span style='color:gray'>(Evaluates trigonometric functions (sin/cos/etc.) on numeric attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataTrigOperation` | `EPCGMetadataTrigOperation::Acos` | 適用する三角関数（Sin/Cos/Tan 等）を指定します。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 演算する属性値。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 一部の演算で使用する第二入力。 |
