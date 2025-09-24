# World Ray Hit Query

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGWorldRayHitSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGWorldQuery.h:49`

## 概要

サーフェスのように動作するワールド内のコリジョンに一般的なアクセス (レイキャストに基づく) を許可します<br><span style='color:gray'>(Allows generic access (based on raycasts) to collisions in the world that behaves like a surface.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `CollisionShape` | `FPCGCollisionShape` | なし | ライントレースまたはスイープに使用する衝突形状と各種パラメータ。 |
| `QueryParams` | `FPCGWorldRayHitQueryParams` | なし | レイヒット判定の詳細設定（チャネル、複数ヒットの許可など）。 |
