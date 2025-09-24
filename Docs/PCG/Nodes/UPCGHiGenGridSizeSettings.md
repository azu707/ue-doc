# U Object

- **カテゴリ**: HierarchicalGeneration (階層生成) — 1件
- **実装クラス**: `UPCGHiGenGridSizeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGHiGenGridSize.h:12`

## 概要

ハイジェネレーション用のグリッドサイズを計算し、階層生成を制御します。<br><span style='color:gray'>(Computes hierarchical generation grid sizes for downstream stages.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `HiGenGridSize` | `EPCGHiGenGrid` | `Grid256` | 下流ノードへ伝播するハイジェネレーショングリッドの解像度。プリセット一覧から選択します。 |
| `bShowInputPin` | `bool` | `true` | 実行依存ピンを表示するかどうかを内部的に制御します。プリコンフィグ済み設定で入力を不要にすると `false` に設定されます。 |

## 実装メモ

- ノードはプリコンフィグされたグリッドサイズプリセットを提供し、選択内容に応じてタイトルに追加情報を表示します。<br><span style='color:gray'>(The node surface updates its title with the selected grid preset.)</span>
- `bShowInputPin` が `false` の場合、実行依存ピンを削除して完全なソースノードのように振る舞います。`ConvertNode` でプリセットを選ぶ際に切り替えられます。<br><span style='color:gray'>(Preconfigured conversions can hide the input pin to act as a pure constant.)</span>
- 実行時は現在のグリッドサイズを `EPCGHiGenGrid` と数値の両方で公開し、下流のハイジェネレータがループ範囲を決定できるようにします。<br><span style='color:gray'>(Downstream elements query both the enum and actual subdivision size.)</span>
