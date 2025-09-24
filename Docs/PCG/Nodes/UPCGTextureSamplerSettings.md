# Get Texture Data

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGTextureSamplerSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGTextureSampler.h:14`

## 概要

テクスチャをサンプリングして属性や密度を生成します。<br><span style='color:gray'>(Samples texture pixels to drive attributes or density.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Transform` | `FTransform` | `FTransform::Identity` | サンプリング前に適用するローカル変換。テクスチャ空間とワールド空間の対応を調整します。 |
| `bUseAbsoluteTransform` | `bool` | `false` | `true` にすると入力ポイントの変換ではなく、この `Transform` を絶対値として使用します。 |
| `TextureArrayIndex` | `int` | `0` | テクスチャが `UTexture2DArray` の場合に参照するスライス番号。 |
| `bUseDensitySourceChannel` | `bool` | `true` | サンプリング結果をポイント密度に適用するかを切り替えます。 |
| `ColorChannel` | `EPCGTextureColorChannel` | `EPCGTextureColorChannel::Alpha` | 読み取るカラー／アルファチャンネル。 |
| `Filter` | `EPCGTextureFilter` | `EPCGTextureFilter::Bilinear` | サンプル値を補間するフィルタ方法。<br><span style='color:gray'>(Method used to determine the value for a sample based on the value of nearby texels.)</span> |
| `TexelSize` | `float` | `50.0f` | `ToPointData` 呼び出し時に 1 テクセルを何 cm とみなすかを指定します。 |
| `bUseAdvancedTiling` | `bool` | `false` | テクスチャを単純にストレッチするのではなく、タイル繰り返し設定を使用します。 |
| `Tiling` | `FVector2D` | `(1.0, 1.0)` | タイリング倍率。X/Y 方向の繰り返し数を指定します。 |
| `CenterOffset` | `FVector2D` | `(0.0, 0.0)` | テクスチャ中心のオフセット。 |
| `Rotation` | `float` | `0` | サンプリング時に適用する回転角（度）。 |
| `bUseTileBounds` | `bool` | `false` | タイリング領域を明示的に指定するかどうか。 |
| `TileBoundsMin` | `FVector2D` | `(-0.5, -0.5)` | タイル領域の最小座標。`bUseTileBounds` 有効時に使用。 |
| `TileBoundsMax` | `FVector2D` | `(0.5, 0.5)` | タイル領域の最大座標。 |
| `bForceEditorOnlyCPUSampling` | `bool` | `false` | CPU 読み出し用に非圧縮テクスチャを複製して精度を高めます（エディタのみ）。 |
| `bSynchronousLoad` | `bool` | `false` | テクスチャを同期ロードします。既定は非同期ロードです。 |
| `bSkipReadbackToCPU` | `bool` | `false` | GPU から CPU への初期読み戻しを省略します。 |
| `Texture` | `TSoftObjectPtr<UTexture>` | `nullptr` | 参照するテクスチャアセット。ソフト参照のため遅延ロードが可能です。 |
