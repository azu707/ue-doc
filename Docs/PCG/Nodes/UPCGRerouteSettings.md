# Reroute

- **日本語名**: 再ルーティング
- **カテゴリ**: Reroute (リルート) — 4件
- **実装クラス**: `UPCGRerouteSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGReroute.h:17`

## 概要

グラフの配線を整理するリルートノードで、データは変更されずに通過します。<br><span style='color:gray'>(Reroute node that tidies wiring while passing data unchanged.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| なし | — | — | このノードは設定パネルを持たず、ユーザーが変更できるプロパティはありません。 |

## 実装メモ

- `UPCGRerouteSettings` は `HasDynamicPins()` を `true` にし、入出力ピンの数は接続状況に応じて動的に増減します。<br><span style='color:gray'>(The node exposes dynamic pins so connections dictate how many wires it presents.)</span>
- 実行要素 `FPCGRerouteElement` は単に入力データをコピーして出力へ流し、GPU 常駐データにも対応しています。<br><span style='color:gray'>(Execution simply forwards tagged data, supporting GPU-resident payloads.)</span>
- 無効化は不可 (`CanBeDisabled` が `false`)、また実行依存ピンも持たないため、グラフ構造の整理専用ノードです。<br><span style='color:gray'>(The node cannot be disabled and has no execution dependency pin, purely acting as wiring aid.)</span>
