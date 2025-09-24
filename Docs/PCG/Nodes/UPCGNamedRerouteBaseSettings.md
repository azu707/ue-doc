# Reroute

- **日本語名**: 再ルーティング
- **カテゴリ**: Reroute (リルート) — 4件
- **実装クラス**: `UPCGNamedRerouteBaseSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGReroute.h:54`

## 概要

名前付きリルートの宣言と使用ノードが共有する共通機能を提供します。<br><span style='color:gray'>(Provides shared functionality for named reroute declaration and usage nodes.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| なし | — | — | 基底クラスなので個別に設定するプロパティはありません。 |

## 実装メモ

- `CanUserEditTitle()` を `true` に上書きし、宣言・使用ノードともに名前をユーザーが自由に変更できるようにします。<br><span style='color:gray'>(The base class unlocks title editing for both declaration and usage nodes.)</span>
- その他の挙動は `UPCGRerouteSettings` から継承しており、動的ピンやパススルー動作を共有します。<br><span style='color:gray'>(All wiring behavior comes from the base reroute settings.)</span>
