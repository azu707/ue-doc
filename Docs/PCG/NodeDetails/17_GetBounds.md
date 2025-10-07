# Get Bounds

## 概要

Get Boundsノードは、入力された空間データのバウンド（境界ボックス）を計算し、その最小値と最大値を属性として出力するノードです。このノードは空間データの範囲情報を取得し、パラメータデータとして利用可能にします。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetBoundsSettings`
**エレメント**: `FPCGGetBoundsElement`

## 機能詳細

Get Boundsノードは、入力された各空間データに対して以下の処理を行います:

1. 入力データが空間データ（UPCGSpatialData）であることを確認
2. データがバウンド（境界）を持つことを検証
3. バウンドの最小値（BoundsMin）と最大値（BoundsMax）を抽出
4. 新しいパラメータデータを作成し、BoundsMinとBoundsMaxを属性として追加
5. 入力タグを保持しながら結果を出力

無限バウンドを持つデータや無効なバウンドを持つデータはスキップされ、警告がログに記録されます。

## プロパティ

このノードには設定可能なプロパティはありません。すべての処理は自動的に行われます。

## 使用例

### 例1: ランドスケープのバウンドを取得
```
入力: Landscape Data
出力: Param Data with BoundsMin and BoundsMax attributes
```

### 例2: 複数のスプラインのバウンドを個別に取得
```
入力: Multiple Spline Data
出力: Multiple Param Data (one per spline) with BoundsMin and BoundsMax
```

### 例3: バウンド情報を使用して条件分岐
```
Get Bounds -> Attribute Filter (BoundsMax.Z > 1000) -> 高所のオブジェクトのみ処理
```

## 実装の詳細

### 入力ピン
- **In (Spatial)**: 空間データの入力
  - **必須**: はい
  - **型**: `EPCGDataType::Spatial`
  - **複数接続**: 可能
  - **複数データ**: 可能

### 出力ピン
- **Out (Param)**: バウンド情報を含むパラメータデータ
  - **型**: `EPCGDataType::Param`
  - **複数接続**: 可能
  - **複数データ**: 可能

### 出力属性

各出力パラメータデータには以下の属性が含まれます:

| 属性名 | 型 | 説明 | 補間可能 |
|--------|------|------|----------|
| BoundsMin | Vector | バウンドの最小座標 (X, Y, Z) | はい |
| BoundsMax | Vector | バウンドの最大座標 (X, Y, Z) | はい |

### ExecuteInternal の処理フロー

```cpp
1. すべての入力データを反復処理
2. 各入力について:
   a. UPCGSpatialDataにキャスト
   b. 空間データでない場合はスキップ
   c. IsBounded()でバウンドの有無を確認
   d. 無限バウンドの場合は警告を出してスキップ
   e. GetBounds()でバウンドを取得
   f. バウンドが無効な場合は警告を出してスキップ
   g. 新しいUPCGParamDataを作成
   h. BoundsMin属性を作成して値を設定
   i. BoundsMax属性を作成して値を設定
   j. メタデータエントリを追加
   k. 入力タグを保持して出力
3. 処理完了
```

### 特徴

- **シンプルな設計**: プロパティなし、入力をそのまま処理
- **非破壊的**: 入力データは変更されず、新しいパラメータデータが生成される
- **タグ保持**: 入力のタグが出力にも引き継がれる
- **エラーハンドリング**: 無限バウンドや無効なバウンドを適切に処理
- **スレッドセーフ**: `NewObject_AnyThread`を使用して任意のスレッドで実行可能
- **ループモード**: `SinglePrimaryPin`モード（プライマリピンの各データを個別に処理）

### ベースポイントデータのサポート
```cpp
virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override { return true; }
```
このノードはベースポイントデータの入力もサポートしており、ポイントデータのバウンドも計算できます。

### パフォーマンス考慮事項
- 各入力データに対して新しいUPCGParamDataオブジェクトを作成
- バウンド計算自体は`GetBounds()`メソッドに依存（通常は高速）
- 大量の入力データがある場合、メモリ使用量に注意

### エラーメッセージ

| メッセージ | 条件 | レベル |
|------------|------|--------|
| "Skipped unbounded spatial data." | 無限バウンドのデータを検出 | Warning |
| "Skipped spatial data that had invalid bounds." | 無効なバウンドを検出 | Warning |

## 関連ノード
- Get Actor Data (空間データの取得)
- Attribute Filter (バウンド属性でのフィルタリング)
- Attribute Math (バウンドサイズの計算)
- Make Concrete (空間データの具体化)
