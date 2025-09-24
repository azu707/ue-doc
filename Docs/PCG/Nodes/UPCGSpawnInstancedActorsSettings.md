# Spawn Instanced Actors

- **日本語名**: インスタンス化アクタをスポーン
- **カテゴリ**: Spawner (スポナー) — 6件
- **実装クラス**: `UPCGSpawnInstancedActorsSettings`
- **定義**: `Engine/Plugins/Experimental/PCGInterops/PCGInstancedActorsInterop/Source/PCGInstancedActorsInterop/Public/Elements/PCGSpawnInstancedActors.h:17`

## 概要

入力データからのインスタンス化アクタをスポーンします。なお、このアクタ クラスは以前に登録済みである必要があり、このノードはランタイム時には機能しません<br><span style='color:gray'>(Spawns instanced actors from the input data. Note that the actor classes should be previously registered and that this node does not work at runtime.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bSpawnByAttribute` | `bool` | `false` | 入力属性でスポーンするアクタクラスを切り替えるか。 |
| `SpawnAttributeSelector` | `FPCGAttributePropertyInputSelector` | なし | アクタクラスを示す属性のセレクタ。`bSpawnByAttribute` 有効時に使用します。 |
| `ActorClass` | `TSubclassOf<AActor>` | なし | 属性を使わない場合にスポーンする固定アクタクラス。 |
| `bMuteOnEmptyClass` | `bool` | `false` | 属性が空などでクラス未指定のポイントがあっても警告を抑制します。 |
