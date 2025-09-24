# Point Match And Set

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGPointMatchAndSetSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointMatchAndSet.h:17`

## 概要

すべてのポイントに対して一致が見つかった (ある属性がある値と等しいなど) 場合に、そのポイント (別の属性など) に値を設定します<br><span style='color:gray'>(For all points, if a match is found (e.g. some attribute is equal to some value), sets a value on the point (e.g. another attribute).)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `MatchAndSetType` | `TSubclassOf<UPCGMatchAndSetBase>` | なし | 使用する Match & Set 実装クラスを指定します。 |
| `SetTarget` | `FPCGAttributePropertyOutputSelector` | なし | マッチ時に値を設定する属性またはプロパティ。 |
| `SetTargetType` | `EPCGMetadataTypes` | `EPCGMetadataTypes::Double` | `SetTarget` が属性の場合のデータ型。 |
