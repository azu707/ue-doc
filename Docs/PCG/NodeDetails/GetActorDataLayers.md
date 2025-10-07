# Get Actor Data Layers

## 概要

**Get Actor Data Layers**ノードは、アクターのデータレイヤーを取得して属性として出力するノードです。World Partitionのデータレイヤーシステムと統合して動作します。

カテゴリ: DataLayers
クラス名: `UPCGGetActorDataLayersSettings`
エレメント: `FPCGGetActorDataLayersElement`

## 機能詳細

このノードは、入力ポイントの各アクター参照からデータレイヤー情報を抽出し、新しい属性として出力します。大規模なワールドでのレイヤーベースの処理に有用です。

## プロパティ

### ActorReferenceAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **カテゴリ**: Default
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 入力からアクターを解決するために使用するアクター参照属性

### DataLayerReferenceAttribute
- **型**: `FPCGAttributePropertyOutputSelector`
- **カテゴリ**: Default
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 出力として使用するデータレイヤー参照属性

## 入力ピン

動的に定義されます。通常、アクター参照を含むポイントデータまたは空間データ。

## 出力ピン

動的に定義されます。データレイヤー情報が属性として追加されたデータ。

## 使用例

```
[GetActorData] → [Get Actor Data Layers] → [PointsWithLayerInfo]

// 設定:
ActorReferenceAttribute = "ActorReference"
DataLayerReferenceAttribute = "DataLayer"

// 結果: 各ポイントに "DataLayer" 属性が追加される
```

## 実装の詳細

- メインスレッドでのみ実行（`CanExecuteOnlyOnMainThread` が true）
- キャッシュ不可（`IsCacheable` が false）
- ベースポイントデータをサポート（`SupportsBasePointDataInputs` が true）

## 関連ノード

- **Partition by Actor Data Layers**: データレイヤーでポイントを分割
- **Get Actor Data**: アクターデータの取得
