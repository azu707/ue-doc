# Copy Points

- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGCopyPointsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCopyPoints.h:43`

## 概要

ソースとターゲットの各ポイント ペアについて、ノードの設定に応じてコピーを作成し、プロパティおよび属性を継承します<br><span style='color:gray'>(For each point pair from the source and the target, create a copy, inheriting properties & attributes depending on the node settings.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `RotationInheritance` | `EPCGCopyPointsInheritanceMode` | `EPCGCopyPointsInheritanceMode::Relative` | 出力回転をソース・ターゲットのどちらから継承するか、または相対で再計算するかを選択します。 |
| `bApplyTargetRotationToPositions` | `bool` | `true` | ターゲットポイントの回転をソース位置に適用し、出力位置を回転させます。 |
| `ScaleInheritance` | `EPCGCopyPointsInheritanceMode` | `EPCGCopyPointsInheritanceMode::Relative` | 出力スケールの継承方式。 |
| `bApplyTargetScaleToPositions` | `bool` | `true` | ターゲットスケールをソース位置に適用します。縮尺を揃えたい場合に有効です。 |
| `ColorInheritance` | `EPCGCopyPointsInheritanceMode` | `EPCGCopyPointsInheritanceMode::Relative` | 出力カラーの継承方式。 |
| `SeedInheritance` | `EPCGCopyPointsInheritanceMode` | `EPCGCopyPointsInheritanceMode::Relative` | 出力ポイントのシード値をどのように継承するか。相対モードでは新しい位置から再計算します。 |
| `AttributeInheritance` | `EPCGCopyPointsMetadataInheritanceMode` | `EPCGCopyPointsMetadataInheritanceMode::SourceFirst` | メタデータ属性の優先順位（ソース優先／ターゲット優先／マージ）を設定します。 |
| `TagInheritance` | `EPCGCopyPointsTagInheritanceMode` | `EPCGCopyPointsTagInheritanceMode::Both` | 出力データタグにソース・ターゲットのどちらを含めるか。 |
| `bCopyEachSourceOnEveryTarget` | `bool` | `true` | `true` でソース×ターゲットの全組み合わせを生成します。`false` なら 1 対 1（または 1:N/N:1）でコピーします。 |
| `bMatchBasedOnAttribute` | `bool` | `false` | 実験的機能。指定属性が一致するペアのみコピー対象にします（GPU 限定）。 |
| `MatchAttribute` | `FName` | `NAME_None` | 条件付きコピーで一致判定に使う属性名。 |
