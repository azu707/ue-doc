# Create Surface From Spline

## 概要

Create Surface From Splineノードは、閉じたスプラインから2D投影による暗黙的なサーフェスを作成します。各スプラインは上から見た2D投影によって内部領域を定義し、その領域をサーフェスデータとして出力します。

## 機能詳細

このノードは、閉じたスプラインの内部領域を表す暗黙的なサーフェスを生成します。生成されたサーフェスは、スプラインの2D投影（上から見た形状）によって定義されます。

### 処理フロー

1. **入力検証**: 入力データがスプラインデータであることを確認
2. **閉じたスプラインチェック**: スプラインが閉じているかを検証（開いているスプラインはエラー）
3. **サーフェス生成**: `UPCGSplineInteriorSurfaceData`を作成し、スプラインの内部領域を表現
4. **出力**: 生成されたサーフェスデータを出力ピンに送信

### 重要な仕様

- **2D投影**: サーフェスはスプラインの上から見た2D投影で定義される
- **閉じたスプラインのみ**: 開いたスプラインからはサーフェスを作成できない
- **低解像度ポリライン**: デフォルトではスプラインは低解像度のポリラインで表現される
- **精度向上**: より高精度が必要な場合は、Spline Samplerで再サンプリングし、Create Splineノードでスプラインに戻すことが推奨される

## プロパティ

### エディタ専用プロパティ

#### bShouldDrawNodeCompact
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: ノードをコンパクト表示するかどうかを制御するエディタ専用設定

## 使用例

### 基本的な使用方法

1. **閉じたスプラインの準備**
   - Get Spline Dataノードなどで閉じたスプラインを取得
   - または、Create Splineノードで閉じたスプラインを作成

2. **サーフェス生成**
   - Create Surface From Splineノードにスプラインを接続
   - 出力されるサーフェスデータは、スプラインの内部領域を表現

3. **サンプリング**
   - Surface Samplerノードを接続してサーフェス内にポイントを生成

### 高精度サーフェスの作成

```
Get Spline Data
  → Spline Sampler (高密度サンプリング)
  → Create Spline (ポイントからスプラインを再構築)
  → Create Surface From Spline
  → Surface Sampler
```

### 典型的な用途

- **エリア定義**: 特定の領域を定義し、その内部にオブジェクトを配置
- **境界付きサンプリング**: 複雑な形状の境界内でポイントをサンプリング
- **ゾーン作成**: ゲームプレイゾーンやレベルデザインの領域定義

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGCreateSurfaceFromSplineSettings : public UPCGSettings

// 実行エレメント
class FPCGCreateSurfaceFromSplineElement : public IPCGElement
```

### ピン構成

**入力ピン**:
- **Label**: "In" (DefaultInputLabel)
- **Type**: `EPCGDataType::Spline`
- **Required**: はい
- **Multiple Connections**: 可
- **Multiple Data**: 可

**出力ピン**:
- **Label**: "Out" (DefaultOutputLabel)
- **Type**: `EPCGDataType::Surface`
- **Multiple Connections**: 可
- **Multiple Data**: 可

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各スプライン入力に対して個別にサーフェスを生成

### エラーハンドリング

1. **無効な入力データ**
   - スプラインデータでない入力はスキップされ、エラーログが出力される
   - メッセージ: "Invalid input. Must be a spline data."

2. **開いたスプライン**
   - 閉じていないスプラインはスキップされ、エラーログが出力される
   - メッセージ: "Unable to create an implicit surface from an open spline. Make sure your splines are closed."

### データ変換

- **入力**: `UPCGSplineData` (閉じたスプライン)
- **出力**: `UPCGSplineInteriorSurfaceData` (スプライン内部サーフェス)

### スレッドセーフティ

- `FPCGContext::NewObject_AnyThread`を使用してスレッドセーフにオブジェクトを生成
- 任意のスレッドで安全に実行可能

### パフォーマンス考慮事項

- **軽量な処理**: サーフェスデータは暗黙的な表現のため、生成コストは低い
- **実際のサンプリング**: 実際のポイント生成はSurface Samplerノードで行われる
- **低解像度表現**: デフォルトでは低解像度のポリラインを使用して処理を軽量化

### 既知の制約

- **2D投影の制限**: 回転したスプラインに対しては、ローカル空間での投影が正確でない場合がある（TODOコメントで将来の改善が示唆されている）
- **閉じたスプライン必須**: 開いたスプラインからはサーフェスを作成できない

## 注意事項

1. **閉じたスプライン**: スプラインは必ず閉じている必要があります
2. **2D投影**: サーフェスは上から見た2D投影で定義されるため、Z軸方向の形状は反映されません
3. **精度**: デフォルトの低解像度表現で精度が不足する場合は、Spline Samplerで再サンプリングしてください
4. **複数スプライン**: 複数のスプラインを入力すると、それぞれに対してサーフェスが生成されます

## 関連ノード

- **Get Spline Data**: スプラインデータを取得
- **Create Spline**: ポイントからスプラインを作成
- **Spline Sampler**: スプラインをサンプリングして高解像度化
- **Surface Sampler**: サーフェス上にポイントを生成
- **Clean Spline**: スプラインをクリーンアップ

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateSurfaceFromSpline.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGCreateSurfaceFromSpline.cpp`
- **カテゴリ**: Spatial
