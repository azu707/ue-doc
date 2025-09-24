# Get Landscape Data

- **日本語名**: ランドスケープデータを取得
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGGetLandscapeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGTypedGetter.h:13`

## 概要

選択したアクタからランドスケープのコレクションをビルドします<br><span style='color:gray'>(Builds a collection of landscapes from the selected actors.)</span>

## 設定項目


「Get Actor Data」の共通プロパティに加えて、ランドスケープ専用の設定を提供します。

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SamplingProperties` | `FPCGLandscapeDataProps` | なし | ランドスケープのサンプリング解像度や取得チャンネル（高さ・レイヤー）を定義します。 |
| `bUnbounded` | `bool` | `true` | エディタ専用。PCG コンポーネントのグリッド境界ではなく、ランドスケープの実際の交差境界をキャッシュ準備に用います。 |
