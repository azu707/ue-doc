# Attribute Maths Op

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataMathsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMathsOpElement.h:50`

## 概要

数値属性に加算・減算・乗算などの演算を行います。<br><span style='color:gray'>(Applies arithmetic operations such as add, subtract, or multiply to attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Operation` | `EPCGMetadataMathsOperation` | `EPCGMetadataMathsOperation::Add` | 数値属性に対して実行する算術演算（加算、乗算、冪乗等）を指定します。 |
| `bForceRoundingOpToInt` | `bool` | `false` | 丸め系演算の結果を必ず int64 として格納したい場合に有効化します。 |
| `bForceOpToDouble` | `bool` | `false` | 入力が整数でも演算結果を double 型で保持したい場合にオンにします。 |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | 演算の第一入力。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 演算の第二入力。単項演算では未使用です。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 三項演算（Lerp など）で使用する第三入力。 |
