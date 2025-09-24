# Attribute Partition

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataPartitionSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataPartition.h:10`

## 概要

属性値ごとにメタデータを分割し、グループを形成します。<br><span style='color:gray'>(Partitions metadata into groups based on attribute values.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PartitionAttributeSelectors` | `TArray<FPCGAttributePropertyInputSelector>` | `{FPCGAttributePropertyInputSelector()}` | 入力データをグループ分けする際のキー属性群。複数指定すると複合キーになります。 |
| `PartitionAttributeNames` | `FString` | なし | 旧来の文字列表現。互換性維持のために残っており、新規ではセレクタの使用が推奨です。 |
| `bTokenizeOnWhiteSpace` | `bool` | `false` | 文字列属性を空白で分割し、複数キーとして扱います。 |
| `bAssignIndexPartition` | `bool` | `false` | 各グループにインデックス属性を追加します。 |
| `bDoNotPartition` | `bool` | `true` | 実際の分割を行わず、インデックス属性だけを元データへ付与します。 |
| `PartitionIndexAttributeName` | `FName` | `TEXT("PartitionIndex")` | 付与するインデックス属性の名称。 |
