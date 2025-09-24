# Surface Sampler

- **カテゴリ**: Sampler (サンプラー) — 7件
- **実装クラス**: `UPCGSurfaceSamplerSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSurfaceSampler.h:101`

## 概要

Surface 入力をサンプリングし、Bounding Shape 入力内に存在する 2 次元ドメインでポイントを生成します<br><span style='color:gray'>(Generates points in two dimensional domain that sample the Surface input and lie within the Bounding Shape input.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PointsPerSquaredMeter` | `float` | `0.1` | 単位面積あたりの目標ポイント密度。デフォルトのグリッド作成ではこの値からセルサイズを算出し、値を大きくするとポイント間隔が狭くなります。0 以下に設定すると extents ベースの最小セルサイズのみが使用され、密度は extents によって制限されます。 |
| `PointExtents` | `FVector` | `FVector(50.0, 50.0, 50.0)` | 生成される各ポイントの半サイズ。X/Y の値が最小グリッドセルの大きさを定義し、Bounding Shape 判定や後段処理で使用されます。いずれかの軸を 0 以下にするとノードはポイント生成をスキップします。 |
| `Looseness` | `float` | `1.0` | グリッドセル内での配置許容量 (0〜1)。0 ではセル中心、1 ではセル全体をランダムに使用します。Legacy モードでは extents の膨張分に対して適用され、現行モードではセル内のランダムオフセット量を決定します。 |
| `bUnbounded` | `bool` | `false` | Bounding Shape 入力が無い場合でも、接続アクターの境界に制限されずサーフェス全体を対象とするかどうか。広大なランドスケープなどで true にすると大量のポイントが生成される恐れがあります。 |
| `bApplyDensityToPoints` | `bool` | `true` | グリッド密度や Bounding Shape による確率的フィルタリングをポイントの `Density` 属性に反映します。false にすると生成されたポイントは常に密度 1.0 を持ちます。 |
| `PointSteepness` | `float` | `0.5`* | ポイントが表すボリュームの硬さを 0〜1 で設定します。0 では密度が中心から線形に減衰し、1 では extents まで一様な「箱」分布になります。新規に作成したノードでは初期化時に 1.0 に設定されます。 |
| `bKeepZeroDensityPoints`† | `bool` | `false` | エディタ専用デバッグ。Bounding Shape によって密度 0 と判定されたポイントも保持し、後段で可視化・検証できるようにします。 |
| `bUseLegacyGridCreationMethod` | `bool` | `false` | 旧来のグリッド作成方式を使用します。true にするとセルサイズは `PointExtents` と `PointSteepness` から固定で求まり、`PointsPerSquaredMeter` はポイントの残存率を決める重みとして扱われます。通常はオフのまま使用することが推奨されます。 |

<small>* クラスのデフォルト値は 0.5 ですが、ユーザーが新規作成したインスタンスは 1.0 に初期化されます。</small><br>
<small>† `WITH_EDITORONLY_DATA` によりゲーム実行時には保存されません。</small>
