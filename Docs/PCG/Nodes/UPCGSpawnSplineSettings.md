# Spawn Spline Component

- **カテゴリ**: Spawner (スポナー) — 6件
- **実装クラス**: `UPCGSpawnSplineSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpawnSpline.h:16`

## 概要

ポイント列をもとにスプラインコンポーネントを生成・配置します。<br><span style='color:gray'>(Creates spline components from point data in the world.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SplineComponent` | `TSubclassOf<USplineComponent>` | `USplineComponent::StaticClass()` | 生成するスプラインコンポーネントのクラス。 |
| `bSpawnComponentFromAttribute` | `bool` | `false` | スプラインコンポーネントのクラスを属性から取得するか。 |
| `SpawnComponentFromAttributeName` | `FPCGAttributePropertyInputSelector` | なし | 属性ベースでコンポーネントクラスを取得する際のセレクタ。 |
| `TargetActor` | `TSoftObjectPtr<AActor>` | なし | コンポーネントを追加するターゲットアクタ。 |
| `PostProcessFunctionNames` | `TArray<FName>` | なし | 生成後に実行する `CallInEditor` 関数名リスト。 |
| `PropertyOverrideDescriptions` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | 生成したスプラインコンポーネントに適用するプロパティ上書き。 |
| `bOutputSplineComponentReference` | `bool` | `true` | 生成したコンポーネント参照を属性として出力します。 |
| `ComponentReferenceAttributeName` | `FName` | `PCGAddComponentConstants::ComponentReferenceAttribute` | 出力するコンポーネント参照属性名。 |
