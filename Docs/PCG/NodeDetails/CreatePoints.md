# Create Points

## 概要
Create Pointsノードは、指定されたリストからポイントデータを作成するノードです。直接ポイントのリストを定義し、それをPCGで使用可能なポイントデータとして出力します。

## 機能詳細
このノードは`UPCGCreatePointsSettings`クラスとして実装されており、以下の処理を行います:

- 設定で定義されたポイントのリストを読み込み
- 指定された座標空間（ワールドまたはローカル）でポイントデータを生成
- オプションで、ボリューム外のポイントをカリング

## プロパティ

### PointsToCreate
- **型**: TArray<FPCGPoint>
- **カテゴリ**: Settings
- **説明**: 作成するポイントのリストです。各ポイントの位置、回転、スケール、密度などの属性を直接定義できます。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### CoordinateSpace
- **型**: EPCGCoordinateSpace
- **デフォルト値**: EPCGCoordinateSpace::World
- **カテゴリ**: Settings
- **説明**: ポイントの生成参照座標系を設定します。
  - **World**: ワールド空間座標
  - **LocalComponent**: ローカルコンポーネント空間
  - **OriginalComponent**: オリジナルコンポーネント空間
- **メタフラグ**: PCG_Overridable, PCG_OverrideAliases="GridPivot"
- **Blueprint対応**: 読み書き可能

### bCullPointsOutsideVolume
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、ボリューム外にあるポイントが削除されます。
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. `PointsToCreate`配列にポイントを追加
2. 各ポイントの Transform、BoundsMin/Max、Color、Density などを設定
3. `CoordinateSpace`で座標系を選択
4. ノードを実行すると、定義されたポイントが出力される

### 一般的な用途
- 固定位置にポイントを配置する場合
- テスト用のサンプルポイントセットの作成
- スクリプトやBlueprintから動的に生成されたポイントの入力
- 手動で配置したい特定のポイントセット

## 実装の詳細

### クラス構造
```cpp
UCLASS(BlueprintType, ClassGroup = (Procedural))
class UPCGCreatePointsSettings : public UPCGSettings
```

### 入力ピン
- オプションのボリューム入力（カリング用）

### 出力ピン
- ポイントデータ（DefaultPointOutputPinProperties）

### 実行エレメント
```cpp
class FPCGCreatePointsElement : public IPCGElement
{
    virtual void GetDependenciesCrc(...) const override;
    virtual bool IsCacheable(const UPCGSettings* InSettings) const override;
    virtual bool ShouldComputeFullOutputDataCrc(FPCGContext* Context) const override { return true; }
};
```

### ノードの特徴
- **ノード名**: CreatePoints
- **表示名**: Create Points
- **カテゴリ**: Spatial
- **キャッシュ可能**: 条件付き（設定により異なる）
- **完全CRC計算**: true（変更追跡の最適化）

### 依存関係
`GetDependenciesCrc`をオーバーライドして、座標空間とカリング設定に基づいた依存関係を計算します。

### PostLoad処理
非推奨の`GridPivot_DEPRECATED`プロパティから`CoordinateSpace`への移行処理を実行します。

## 注意事項
- ポイント数が多い場合、エディタでの編集が困難になる可能性があります
- 座標空間の設定を誤ると、意図しない位置にポイントが配置されます
- ボリュームカリングを使用する場合、適切なバウンディングボリュームが必要です
- ポイントデータは設定に直接保存されるため、大量のポイントはアセットサイズを増加させます

## 関連ノード
- **Create Points Grid**: グリッド状のポイントを自動生成
- **Create Points Sphere**: 球面上のポイントを自動生成
- **Transform Points**: 既存のポイントを変換
