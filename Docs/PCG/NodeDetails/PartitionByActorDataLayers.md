# Partition by Actor Data Layers

## 概要

**Partition by Actor Data Layers**ノードは、アクターのデータレイヤーに基づいてポイントデータを分割するノードです。各データレイヤーごとに個別の出力を生成します。

カテゴリ: DataLayers
クラス名: `UPCGPartitionByActorDataLayersSettings`
エレメント: `FPCGPartitionByActorDataLayersElement`

## 機能詳細

このノードは、アクターが属するデータレイヤーに基づいてポイントを複数のグループに分割します。レイヤーベースの処理パイプラインを構築する際に有用です。

## プロパティ

### ActorReferenceAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: アクターを解決するために使用するアクター参照属性

### DataLayerReferenceAttribute
- **型**: `FPCGAttributePropertyOutputSelector`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: データレイヤーパーティション用の出力として使用するデータレイヤー参照属性

### IncludedDataLayers
- **型**: `FPCGDataLayerReferenceSelector`
- **カテゴリ**: Settings
- **説明**: 空の場合、すべてのデータレイヤーが含まれます。データレイヤーが指定されている場合、それらのみが含まれます。

### ExcludedDataLayers
- **型**: `FPCGDataLayerReferenceSelector`
- **カテゴリ**: Settings
- **説明**: 指定されたデータレイヤーを除外します。

## 入力ピン

動的に定義されます。アクター参照を含むデータ。

## 出力ピン

動的に定義されます。各データレイヤーごとに個別の出力。

## 使用例

```
[PointsWithActors] → [Partition by Actor Data Layers] → [Layer1]
                                                       → [Layer2]
                                                       → [Layer3]

// 設定:
ActorReferenceAttribute = "ActorReference"
IncludedDataLayers = (空 - すべて含む)
ExcludedDataLayers = "TemporaryLayer"
```

## 実装の詳細

- メインスレッドでのみ実行（`CanExecuteOnlyOnMainThread` が true）
- キャッシュ不可（`IsCacheable` が false）
- ベースポイントデータをサポート（`SupportsBasePointDataInputs` が true）

## プロパティ変更の検出

`GetChangeTypeForProperty()` メソッドは、IncludedDataLayers と ExcludedDataLayers の変更を適切に処理します。

## 関連ノード

- **Get Actor Data Layers**: アクターのデータレイヤーを取得
- **Partition by Attribute**: 属性でポイントを分割
