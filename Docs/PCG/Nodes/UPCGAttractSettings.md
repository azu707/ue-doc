# Attract

- **カテゴリ**: PointOps (ポイント操作) — 13件
- **実装クラス**: `UPCGAttractSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttractElement.h:26`

## 概要

最大距離と条件に基づいてソース ポイントをターゲット ポイントに引き寄せます<br><span style='color:gray'>(Attracts source points to target points based on a max distance and a criteria.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Mode` | `EPCGAttractMode` | `EPCGAttractMode::Closest` | 引き寄せ対象の決定方法。最近傍、属性最小／最大、属性インデックス指定から選択します。 |
| `AttractorIndexAttribute` | `FPCGAttributePropertyInputSelector` | なし | `Mode == EPCGAttractMode::FromIndex` のとき、ソースポイントが参照するターゲットインデックスを格納した属性。 |
| `Distance` | `double` | `100.0` | 最近傍・属性比較モードで探索する半径（最小 0.01）。ソースとターゲットが同一の場合も距離判定に使用します。 |
| `bRemoveUnattractedPoints` | `bool` | `false` | 対応するターゲットが見つからなかったソースポイントを出力から除去します。同一データをソース／ターゲットに用いる場合は効果が制限されます。 |
| `TargetAttribute` | `FPCGAttributePropertyInputSelector` | なし | `Mode` が `MinAttribute` または `MaxAttribute` のときに比較するターゲット属性。 |
| `bUseSourceWeight` | `bool` | `false` | ソース側の重み属性を使用して線形補間係数を決定します。 |
| `SourceWeightAttribute` | `FPCGAttributePropertyInputSelector` | なし | `bUseSourceWeight` 有効時に 0〜1 に正規化されるソース重み属性。 |
| `bUseTargetWeight` | `bool` | `false` | ターゲット側の重み属性を読み取り補間に反映します。 |
| `TargetWeightAttribute` | `FPCGAttributePropertyInputSelector` | なし | `bUseTargetWeight` 有効時に参照するターゲット重み属性。 |
| `Weight` | `double` | `1.0` | 重み属性を使わない場合の固定補間係数（-1〜1）。0.5 を超えるとターゲット寄りになります。 |
| `SourceAndTargetAttributeMapping` | `TMap<FPCGAttributePropertyInputSelector, FPCGAttributePropertyInputSelector>` | 既定で `Position` → `Position` を 1 件登録 | 補間または転写する属性の組。キーにソース、値にターゲットを指定します。 |
| `bOutputAttractIndex` | `bool` | `false` | マッチしたターゲットのインデックスを出力属性に記録します。 |
| `OutputAttractIndexAttribute` | `FPCGAttributePropertyOutputNoSourceSelector` | `AttractIndex` | `bOutputAttractIndex` 有効時にインデックスを書き込む属性名。 |

## 実装メモ

- ソースとターゲットの組み合わせは 1:1 または N:1 を想定しており、ターゲットピン複数接続時はソースと同数の入力が必要です。<br><span style='color:gray'>(The node validates cardinality: a single target is shared or each source entry must have its own target entry.)</span>
- 重み付けはソース・ターゲット双方から取得可能で、両方指定された場合は正規化した比率から補間係数を導きます。未指定側は固定値 `Weight` を使用します。<br><span style='color:gray'>(Weights are normalized per point; when both exist the ratio drives the lerp alpha, otherwise the scalar `Weight` applies.)</span>
- `bRemoveUnattractedPoints` を無効にし、かつ属性マッピングも指定しない場合、ノードは警告を出してソースをパススルーする設計です。<br><span style='color:gray'>(If no modifications would occur the element short-circuits, forwarding the source data.)</span>
