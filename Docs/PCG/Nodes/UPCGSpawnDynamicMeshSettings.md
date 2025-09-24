# Spawn Dynamic Mesh

- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGSpawnDynamicMeshSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGSpawnDynamicMesh.h:13`

## 概要

入力の各ダイナミック メッシュ データのダイナミック メッシュ コンポーネントをスポーンします<br><span style='color:gray'>(Spawn a dynamic mesh component for each dynamic mesh data in input.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | 生成した `UDynamicMeshComponent` をアタッチするアクター。未指定時は PCG コンポーネントの所有アクターにスポーンします。ソフト参照のためレベル外アクターも指示可能です。 |
| `PostProcessFunctionNames` | `TArray<FName>` | 空 | スポーン完了後にターゲットアクターへ呼び出す `CallInEditor` 対応のパラメータ無し関数名一覧。発光設定など追加処理を自動化できます。 |
