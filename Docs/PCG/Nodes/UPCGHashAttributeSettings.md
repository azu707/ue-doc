# Hash Attribute

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGHashAttributeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGHashAttribute.h:11`

## 概要

属性値をハッシュ化し、安定した識別子を生成します。<br><span style='color:gray'>(Hashes attribute values to produce stable identifiers.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | ハッシュ化する属性。出力は 64bit 整数です。 |
