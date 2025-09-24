# Execute Blueprint

- **カテゴリ**: Blueprint (ブループリント) — 1件
- **実装クラス**: `UPCGBlueprintSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGExecuteBlueprint.h:319`

## 概要

指定したブループリント実装を呼び出し、PCG からカスタム処理を実行します。<br><span style='color:gray'>(Invokes a user Blueprint so the PCG graph can run custom logic.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `BlueprintElementType` | `TSubclassOf<UPCGBlueprintElement>` | なし | 実行する Blueprint クラス。`UPCGBlueprintElement` を継承したクラスを指定します。 |
| `TrackedActorTags` | `TArray<FName>` | なし | 依存アクターのタグリスト。これらのタグを持つアクターの変更を追跡します。 |
| `bTrackActorsOnlyWithinBounds` | `bool` | `false` | true であれば、PCG コンポーネント境界外のアクター変化では再実行を発生させません（エディタ専用）。<br><span style='color:gray'>(If this is checked, found actors that are outside component bounds will not trigger a refresh. Only works for tags for now in editor.)</span> |
