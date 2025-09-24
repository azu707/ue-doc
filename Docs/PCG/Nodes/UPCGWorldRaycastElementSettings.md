# Proxy

- **日本語名**: プロキシ
- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGWorldRaycastElementSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGWorldRaycast.h:17`

## 概要

指定されたポイントからライン トレースまたはコリジョン形状を、指定された方向に沿ってキャストし、インパクトの位置を返します<br><span style='color:gray'>(Casts a line trace or collision shape sweep from provided points along a given direction returning the location of the impact.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `CollisionShape` | `FPCGCollisionShape` | なし | ラインチャネルもしくは任意形状によるスイープ設定。 |
| `RaycastMode` | `EPCGWorldRaycastMode` | `EPCGWorldRaycastMode::Infinite` | レイの方向・距離をどのように決定するかを指定します。 |
| `OriginInputAttribute` | `FPCGAttributePropertyInputSelector` | なし | レイの始点を決定する属性。 |
| `bOverrideRayDirections` | `bool` | `false` | 入力属性からレイ方向を取得します。 |
| `RayDirection` | `FVector` | `-FVector::UnitZ()` | 全レイに共通で使用する方向ベクトル。 |
| `RayDirectionAttribute` | `FPCGAttributePropertyInputSelector` | なし | ポイントごとにレイ方向を指定する属性。 |
| `EndPointAttribute` | `FPCGAttributePropertyInputSelector` | なし | レイ終点を直接指定する属性。 |
| `bOverrideRayLengths` | `bool` | `false` | 属性からレイ長さを取得します。 |
| `RayLength` | `double` | `100000.0` | 全レイに適用する長さ（cm）。 |
| `RayLengthAttribute` | `FPCGAttributePropertyInputSelector` | なし | レイ長さを定義する属性。 |
| `WorldQueryParams` | `FPCGWorldRaycastQueryParams` | なし | レイキャスト処理の詳細設定（コリジョンチャネルなど）。 |
| `bKeepOriginalPointOnMiss` | `bool` | `false` | レイがヒットしなかった場合でも元のポイント位置を保持します。 |
| `bUnbounded` | `bool` | `false` | バウンディングボリュームが無い場合はアクタ境界でサンプリング領域を制限します。 |
