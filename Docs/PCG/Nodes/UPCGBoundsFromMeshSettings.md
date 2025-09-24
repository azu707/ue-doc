# Bounds From Mesh

- **日本語名**: メッシュの境界
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGBoundsFromMeshSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGBoundsFromMesh.h:16`

## 概要

メッシュからの最小/最大の境界を設定します<br><span style='color:gray'>(Sets bounds min/max from mesh(es).)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `MeshAttribute` | `FPCGAttributePropertyInputSelector` | なし | 境界計算に利用するメッシュを取得するための属性セレクタ。ポイントに格納したソフト参照やコンポーネント情報をここで指定します。 |
| `bSilenceAttributeNotFoundErrors` | `bool` | `false` | 必要な属性が入力データに存在しない場合でも警告を抑制します。大量のバリエーションを扱う検証時に便利です。 |
| `bSynchronousLoad` | `bool` | `false` | メッシュを同期ロードします。既定では非同期ロードなので、依存関係の確認やデバッグ時のみ `true` にするのが安全です。 |
