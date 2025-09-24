# Apply Hierarchy

- **日本語名**: 階層を適用
- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGApplyHierarchySettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGApplyHierarchy.h:24`

## 概要

ハイアラクキー生成の親子関係を適用し、親データから子データへ変換や継承を行います。<br><span style='color:gray'>(Applies hierarchical generation relationships, propagating transforms or metadata from parents to children.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PointKeyAttributes` | `TArray<FPCGAttributePropertyInputSelector>` | `ActorIndex`1件 | 子ポイントを一意に識別するキー群。現在は `int32` 型属性が必須です。 |
| `ParentKeyAttributes` | `TArray<FPCGAttributePropertyInputSelector>` | `ParentIndex`1件 | 親ポイントを示すキー群。`PointKeyAttributes` と同じ構造の属性を指定します。 |
| `HierarchyDepthAttribute` | `FPCGAttributePropertyInputSelector` | `HierarchyDepth` | 階層の深さを表す属性。深さでソート・処理順を決定します。 |
| `RelativeTransformAttribute` | `FPCGAttributePropertyInputSelector` | `RelativeTransform` | 親から子へ適用する相対変換を保持する属性。`FTransform` 型である必要があります。 |
| `ApplyParentRotation` | `EPCGApplyHierarchyOption` | `OptOutByAttribute` | 親の回転を適用する条件。常時／非適用／属性による opt-in/out を選択できます。 |
| `ApplyParentRotationAttribute` | `FPCGAttributePropertyInputSelector` | `IgnoreParentRotation` | `ApplyParentRotation` が属性駆動の際、適用・非適用を判定するブールまたは数値属性。 |
| `ApplyParentScale` | `EPCGApplyHierarchyOption` | `OptOutByAttribute` | 親のスケールを継承する条件。 |
| `ApplyParentScaleAttribute` | `FPCGAttributePropertyInputSelector` | `IgnoreParentScale` | `ApplyParentScale` が属性駆動のときに使用する属性。 |
| `ApplyHierarchy` | `EPCGApplyHierarchyOption` | `Always` | 階層計算全体を有効化する条件。属性による opt-in/out も可能です。 |
| `ApplyHierarchyAttribute` | `FPCGAttributePropertyInputSelector` | なし | `ApplyHierarchy` が属性駆動のときに参照する属性。 |
| `bWarnOnPointsWithInvalidParent` | `bool` | `true` | 親キーが見つからないポイントを検出した際に警告を出します。 |

## 実装メモ

- 入力点群はキー属性によって親子対応付けが行われ、深さ順に再帰的な変換が適用されます。親が見つからない場合は `InvalidParent` としてマーキングされ、オプションで警告を発します。<br><span style='color:gray'>(The executor builds parent maps from key arrays and walks depth partitions, optionally warning on missing parents.)</span>
- `EPCGApplyHierarchyOption` の `OptInByAttribute` は属性値が真のときに適用、`OptOutByAttribute` は偽のときのみ適用する反転評価として扱われます。<br><span style='color:gray'>(Opt-in attributes require a truthy value; opt-out treats truthy values as "skip" by inverting the result.)</span>
- 相対変換は `FTransform` として取得され、親チェーンを畳み込みながら最終的なワールド変換を算出します。親の回転・スケールの継承条件を個別に調整できるため、例えばワールドスケールのみ親から受け継ぎ回転は無視するといった使い方が可能です。<br><span style='color:gray'>(Relative transforms are composed along the hierarchy while honoring per-channel inheritance flags.)</span>
