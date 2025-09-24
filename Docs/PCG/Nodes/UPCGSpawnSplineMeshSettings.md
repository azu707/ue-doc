# Spawn Spline Mesh

- **日本語名**: スプラインメッシュをスポーン
- **カテゴリ**: Spawner (スポナー) — 6件
- **実装クラス**: `UPCGSpawnSplineMeshSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpawnSplineMesh.h:24`

## 概要

指定されたスプラインに沿って各セグメントの USplineMeshComponent を作成します<br><span style='color:gray'>(Create a USplineMeshComponent for each segment along a given spline.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SplineMeshDescriptor` | `FSoftSplineMeshComponentDescriptor` | なし | スプラインメッシュコンポーネントの設定プリセット。 |
| `SplineMeshParams` | `FPCGSplineMeshParams` | なし | メッシュの引き延ばし設定や UV 調整などのパラメータ。 |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | メッシュを配置するターゲットアクタ。 |
| `PostProcessFunctionNames` | `TArray<FName>` | なし | スプラインメッシュ生成後に呼び出す関数一覧。 |
| `bSynchronousLoad` | `bool` | `false` | メッシュ／マテリアルを同期ロードします。 |
| `SplineMeshOverrideDescriptions` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | メッシュ記述子に適用するプロパティ上書き。 |
| `SplineMeshParamsOverride` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | メッシュパラメータに適用する上書き設定。 |
