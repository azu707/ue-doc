# Merge Points

- **日本語名**: ポイントをマージ
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGMergeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGMergeElement.h:10`

## 概要

複数のデータ ソースを 1 つのデータ出力にマージします<br><span style='color:gray'>(Merges multiple data sources into a single data output.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGMergeType` | `EPCGMergeType::KeepFirstPointOnConflict` | 複数データをマージする際の重複解決方法。最初のポイントを優先するか、属性をブレンドするかなどを設定します。 |
