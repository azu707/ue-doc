# NamedRerouteDeclaration

- **カテゴリ**: Reroute (リルート) — 4件
- **実装クラス**: `UPCGNamedRerouteDeclarationSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGReroute.h:66`

## 概要

名前付きリルートを宣言し、同名の使用ノードへ信号を配布します。<br><span style='color:gray'>(Declares a named reroute anchor that usage nodes can connect to elsewhere.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| なし | — | — | 宣言ノード自体にはユーザーが編集できるプロパティがありません。 |

## 実装メモ

- 出力には可視ピンと不可視ピンの 2 本が生成され、不可視ピンを通じて宣言と使用ノードの内部リンクを保持します。<br><span style='color:gray'>(Two output pins are created: the visible default output and an invisible link used to bridge usages.)</span>
- `GetConversionInfo` を通じて通常のリルートノードから命名宣言へ変換するプリセットが提供され、グラフ内で衝突しないタイトルが自動で割り当てられます。<br><span style='color:gray'>(Conversion helpers generate a unique title when turning a plain reroute into a named declaration.)</span>
- 生成された宣言は複数の使用ノードに共有でき、PCG 実行時には単に入力データを全使用ノードへ複製するパススルーとして振る舞います。<br><span style='color:gray'>(During execution the declaration forwards tagged data to each paired usage node.)</span>
