# Create Constant

- **日本語名**: 定数を作成
- **カテゴリ**: Param (パラメータ) — 9件
- **実装クラス**: `UPCGCreateAttributeSetSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateAttribute.h:88`

## 概要

選択したメタデータ型の定数値を持つ属性セットを生成します。<br><span style='color:gray'>(Creates an attribute set containing a constant of the selected metadata type.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `AttributeTypes` | `FPCGMetadataTypesConstantStruct` | なし | 生成する定数属性の型。複数指定可。 |
| `OutputTarget` | `FPCGAttributePropertyOutputNoSourceSelector` | なし | 出力する属性名。属性セット内に新規エントリを作成します。 |
