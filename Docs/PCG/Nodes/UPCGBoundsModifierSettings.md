# Bounds Modifier

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGBoundsModifierSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGBoundsModifier.h:23`

## 概要

ポイントバウンド (オプションでその急峻さ) に変換を適用します<br><span style='color:gray'>(Applies a transformation on the point bounds & optionally its steepness.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGBoundsModifierMode` | `Scale` | 境界の変更方法。設定値への置換、交差、包含、平行移動、スケールから選択します。 |
| `BoundsMin` | `FVector` | `(1,1,1)` | `Mode` に応じて下限ベクトルとして解釈されます。`Set`/`Intersect` では境界の最小値、`Translate` では移動量、`Scale` ではスケール係数。 |
| `BoundsMax` | `FVector` | `(1,1,1)` | `BoundsMin` と同様にモードに応じた上限／移動量／スケールを表します。 |
| `bAffectSteepness` | `bool` | `false` | ポイントの Steepness 値も調整するか。`Translate`/`Scale` などで演算方法が変わります。 |
| `Steepness` | `float` | `1.0` | `bAffectSteepness` が有効なときに使用される係数。モードにより最小・最大・加算・乗算で適用。 |

## 実装メモ

- `SetBoundsLoop` 内で `PCGPointHelpers::SetLocalBounds` を使いバウンディングボックスを再構築します。モードによりオーバーラップや和集合、単純平行移動、スケーリングが行われます。<br><span style='color:gray'>(Each mode reuses a loop that rewrites bounds min/max based on the supplied box or vectors.)</span>
- スティープネスを変更する場合、`Intersect` では最小、`Include` では最大、`Translate` では加算、`Scale` では乗算、`Set` では固定値が適用されます。<br><span style='color:gray'>(Steepness gets clamped after the respective operation per mode.)</span>
- 演算対象はコピー後のポイントデータで行われるため、入力を破壊せず差分を出力できます。大規模データでは `PointsPerChunk` で分割しマルチスレッド処理されます。<br><span style='color:gray'>(Processing occurs on cloned point data in chunks of ~65k for better parallelism.)</span>
