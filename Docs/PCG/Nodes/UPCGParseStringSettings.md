# Parse String

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGParseStringSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGParseString.h:13`

## 概要

文字列をパターン解析し、抽出したトークンを属性に変換します。<br><span style='color:gray'>(Parses strings with patterns and outputs extracted tokens as attributes.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | 解析対象の文字列属性。 |
| `TargetType` | `EPCGMetadataTypes` | `EPCGMetadataTypes::Integer32` | 文字列を変換する先の型（整数、浮動小数など）。 |
