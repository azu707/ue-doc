# Volume Sampler

- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGVolumeSamplerSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGVolumeSampler.h:65`

## 概要

ボリューム入力の 3 次元境界内に、バウンディング形状が存在する場合はその内部にポイントを生成します<br><span style='color:gray'>(Generates points in the three dimensional bounds of the Volume input and within the Bounding Shape input if provided.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `VoxelSize` | `FVector` | `PCGVolumeSampler::DefaultVoxelSize` | サンプリングに使用するボクセルの寸法。 |
| `bUnbounded` | `bool` | `false` | アクタ境界による制限を無効化し、入力ボリューム全域を生成対象にします。 |
| `PointSteepness` | `float` | `0.5f` | 出力ポイントの密度勾配。0 で滑らか、1 で鋭い影響になります。 |
