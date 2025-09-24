# Apply On Object

- **日本語名**: オブジェクトに適用
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGApplyOnActorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGApplyOnActor.h:16`

## 概要

プロパティ オーバーライドをターゲット オブジェクトに適用し、ターゲット オブジェクトに対して関数を実行します<br><span style='color:gray'>(Applies property overrides and executes functions on a target object.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ObjectReferenceAttribute` | `FPCGAttributePropertyInputSelector` | なし | 対象オブジェクト参照を含む属性。 |
| `PropertyOverrideDescriptions` | `TArray<FPCGObjectPropertyOverrideDescription>` | なし | ターゲット オブジェクトのプロパティを属性値で上書きします。 |
| `PostProcessFunctionNames` | `TArray<FName>` | なし | 適用後に呼び出す `CallInEditor` 対応関数リスト。 |
| `bSilenceErrorOnEmptyObjectPath` | `bool` | `false` | オブジェクト パスが空の場合のエラーを抑制します。 |
| `bSynchronousLoad` | `bool` | `false` | オブジェクトを同期ロードします。 |
