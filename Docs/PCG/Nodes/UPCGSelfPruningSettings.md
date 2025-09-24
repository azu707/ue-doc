# Self Pruning

- **カテゴリ**: Filter (フィルタ) — 11件
- **実装クラス**: `UPCGSelfPruningSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSelfPruning.h:126`

## 概要

自己干渉するポイントを除去し、集合を簡潔にします。<br><span style='color:gray'>(Prunes self-intersecting or redundant points to simplify the set.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Parameters` | `FPCGSelfPruningParameters` | なし | 自己交差を検出し除外するための閾値・トポロジ設定。 |
