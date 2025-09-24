# Add Component

- **日本語名**: コンポーネントを追加
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGAddComponentSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAddComponent.h:25`

## 概要

指定されたターゲット アクタにコンポーネントを付加します<br><span style='color:gray'>(Adds component(s) to specified target actor(s).)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bUseClassAttribute` | `bool` | `false` | 属性からコンポーネント クラスを取得するか、ノードで指定した固定クラスを使うかを切り替えます。 |
| `ClassAttribute` | `FPCGAttributePropertyInputSelector` | なし | クラスを属性から取得する場合のセレクタ。 |
| `TemplateComponentClass` | `TSubclassOf<UActorComponent>` | `nullptr` | 生成するコンポーネントのクラス。 |
| `bAllowTemplateComponentEditing` | `bool` | `false` | テンプレート コンポーネントの編集を許可するか。 |
| `TemplateComponent` | `TObjectPtr<UActorComponent>` | なし | 雛形として利用するコンポーネント インスタンス。 |
| `ActorReferenceAttribute` | `FPCGAttributePropertyInputSelector` | なし | どのアクタへ追加するかを示す参照属性。 |
| `ComponentReferenceAttribute` | `FPCGAttributePropertyOutputNoSourceSelector` | なし | 生成したコンポーネント参照を書き出す属性。 |
