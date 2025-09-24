# Attribute Noise

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGAttributeNoiseSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeNoise.h:30`

## 概要

属性値にノイズを加算し、ランダムなゆらぎを付与します。<br><span style='color:gray'>(Adds procedural noise to attribute values.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource` | `FPCGAttributePropertyInputSelector` | なし | ノイズを適用する元の属性。 |
| `OutputTarget` | `FPCGAttributePropertyOutputSelector` | なし | ノイズ適用後の値を書き込む先。未指定の場合は元属性を上書きします。 |
| `Mode` | `EPCGAttributeNoiseMode` | `EPCGAttributeNoiseMode::Set` | ノイズをどのように合成するか（上書き・加算・乗算など）を選びます。<br><span style='color:gray'>(Attribute = (Original op Noise), Noise in [NoiseMin, NoiseMax])</span> |
| `NoiseMin` | `float` | `0.f` | 生成するノイズ値の下限。 |
| `NoiseMax` | `float` | `1.f` | 生成するノイズ値の上限。 |
| `bInvertSource` | `bool` | `false` | ノイズ適用前に属性値を 1−値 に反転します。<br><span style='color:gray'>(Attribute = 1 - Attribute before applying the operation)</span> |
| `bClampResult` | `bool` | `false` | 結果を 0〜1 にクランプします。密度にノイズを適用する場合は自動的に有効化されます。<br><span style='color:gray'>(Clamp the result between 0 and 1. Always applied if we apply noise to the density.)</span> |
| `bHasCustomSeedSource` | `bool` | `false` | 属性からカスタムシードを読み出すか。 |
| `CustomSeedSource` | `FPCGAttributePropertyInputSelector` | なし | シードを提供する属性。`bHasCustomSeedSource` が true のときに使用します。 |
