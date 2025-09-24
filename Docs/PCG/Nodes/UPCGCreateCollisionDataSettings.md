# Create Collision Data

- **日本語名**: コリジョンデータを作成
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGCreateCollisionDataSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateCollisionData.h:12`

## 概要

ポイントに選択されたメッシュのコリジョンが存在するかのような、ボリュメトリック表現を作成します<br><span style='color:gray'>(Creates a volumetric representation of the points as if they had their selected mesh collision.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `CollisionAttribute` | `FPCGAttributePropertyInputSelector` | なし | 各ポイントが参照するメッシュ／コリジョン情報を指す属性セレクタ。ここで指定した形状をボリューム化します。 |
| `CollisionQueryFlag` | `EPCGCollisionQueryFlag` | `EPCGCollisionQueryFlag::Simple` | コリジョン形状の取得方法（シンプル／複雑）を切り替えます。複雑形状は精度が高い反面処理負荷が増えます。 |
| `bWarnIfAttributeCouldNotBeUsed` | `bool` | `true` | 属性が見つからずコリジョンを生成できなかった場合に警告を表示します。 |
| `bSynchronousLoad` | `bool` | `false` | 参照メッシュを同期ロードします。即時処理が必要なケースに限定して有効化してください。 |
