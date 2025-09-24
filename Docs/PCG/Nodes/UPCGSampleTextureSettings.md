# Sample Texture

- **日本語名**: サンプルテクスチャ
- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGSampleTextureSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSampleTexture.h:24`

## 概要

各ポイントでテクスチャのカラーをサンプリングします<br><span style='color:gray'>(Samples color of texture at each point.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `TextureMappingMethod` | `EPCGTextureMappingMethod` | `EPCGTextureMappingMethod::Planar` | サンプル位置を UV として解釈するか、平面投影するかなどのマッピング方法。 |
| `UVCoordinatesAttribute` | `FPCGAttributePropertyInputSelector` | なし | テクスチャサンプル位置を指定する属性。 |
| `TilingMode` | `EPCGTextureAddressMode` | `EPCGTextureAddressMode::Wrap` | テクスチャの繰り返し／クランプ設定を上書きします。 |
| `DensityMergeFunction` | `EPCGDensityMergeOperation` | `EPCGDensityMergeOperation::Set` | サンプル値を既存密度とどのように合成するか。 |
| `bClampOutputDensity` | `bool` | `true` | 出力密度を 0〜1 にクランプします。 |
