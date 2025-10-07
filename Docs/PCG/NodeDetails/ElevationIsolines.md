# Elevation Isolines

## 概要

Elevation Isolinesノードは、サーフェスの標高等高線（Isolines）を計算します。指定された標高範囲と間隔で等高線を生成し、ポイントまたはスプラインとして出力できます。現在はZ-Up（Z軸が上）のサーフェスのみをサポートしています。

## 機能詳細

このノードは、サーフェスを離散化し、指定された標高（Z座標）で等高線を抽出します。地形の等高線マップの生成や、特定の高さでのスライスなどに使用できます。

### 処理フロー

1. **入力サーフェスの取得**: サーフェスデータを入力から取得
2. **サーフェスの離散化**: 指定された解像度でグリッド状に離散化
3. **等高線の抽出**: 各標高でマーチング・スクエア法などを使用して等高線を抽出
4. **出力データの生成**: ポイントまたはスプラインとして出力
5. **タグ付け**: オプションで同じ標高の等高線にタグを追加

### 出力モード

#### ポイント出力
- `bOutputAsSpline = false`（デフォルト）
- 等高線上のポイントを出力

#### スプライン出力
- `bOutputAsSpline = true`
- 等高線をスプラインとして出力
- 曲線または直線スプラインを選択可能

## プロパティ

### ElevationStart
- **型**: `double`
- **デフォルト値**: `0.0`
- **オーバーライド可能**: はい
- **説明**: 等高線の最小標高（cm単位）
  - この標高から等高線の生成を開始

### ElevationEnd
- **型**: `double`
- **デフォルト値**: `1000.0`
- **オーバーライド可能**: はい
- **説明**: 等高線の最大標高（cm単位）
  - この標高まで等高線を生成

### ElevationIncrement
- **型**: `double`
- **デフォルト値**: `100.0`
- **オーバーライド可能**: はい
- **説明**: 各等高線間の標高差（cm単位）
  - 例: 100cmの場合、0, 100, 200, 300...の標高で等高線を生成

### Resolution
- **型**: `double`
- **デフォルト値**: `100.0`
- **オーバーライド可能**: はい
- **説明**: サーフェス離散化のためのグリッド解像度（cm単位）
  - 1セルのサイズ
  - 小さいほど精度が高いが、計算コストも増加

### bAddTagOnOutputForSameElevation
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 同じ標高の出力データにタグ（整数）を追加するかどうか
  - 有効にすると、各標高レベルごとにグループ化が容易

### bProjectSurfaceNormal
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: サーフェス法線を投影するかどうか
  - `false`: Z-Up（Z軸が上）
  - `true`: その位置でのサーフェス法線を使用（Projectionノードの回転投影と同様）

### bOutputAsSpline
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: いいえ（エディタ設定のみ）
- **説明**: スプラインとして出力するか、ポイントとして出力するか
  - `false`: ポイント出力
  - `true`: スプライン出力

### bLinearSpline
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: スプラインが曲線か直線か
  - `false`: 曲線スプライン（スムーズ）
  - `true`: 直線スプライン（セグメント）
- **条件**: `bOutputAsSpline`が有効な場合のみ表示

## 使用例

### 基本的な等高線生成

```
Get Landscape Data
  → Elevation Isolines (Start=0, End=1000, Increment=100)
  → (100cm間隔で等高線ポイントを生成)
```

### 地形の等高線スプライン

```
Get Landscape Data
  → Elevation Isolines (bOutputAsSpline=true, Increment=50)
  → Spawn Spline Component (等高線を可視化)
```

### 特定標高範囲の抽出

```
Get Volume Data
  → Elevation Isolines (Start=200, End=400, Increment=50)
  → Static Mesh Spawner (特定の高さ範囲にのみオブジェクトを配置)
```

### 標高ごとのグループ化

```
Get Landscape Data
  → Elevation Isolines (bAddTagOnOutputForSameElevation=true)
  → Filter Data By Tag (特定の標高の等高線のみを選択)
```

### 典型的な用途

- **地形の可視化**: 等高線マップの生成
- **高さ制約の配置**: 特定の標高範囲にのみオブジェクトを配置
- **レベル分割**: 高さに基づいてレベルを層状に分割
- **道路計画**: 等高線に沿った道路の計画
- **段差の可視化**: 地形の傾斜や段差を等高線で表現

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGElevationIsolinesSettings : public UPCGSettings

// 実行エレメント
class FPCGElevationIsolinesElement : public IPCGElement
```

### ピン構成

**入力ピン**:
- カスタム入力ピン（サーフェスデータまたはベースポイントデータ）

**出力ピン**:
- カスタム出力ピン（ポイントまたはスプラインデータ）

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各入力サーフェスに対して個別に等高線を計算

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- サーフェス、ボリュームなどの暗黙的なポイントデータにも対応

### アルゴリズム

おそらくマーチング・スクエア法（Marching Squares）またはそれに類似したアルゴリズムを使用:
1. サーフェスを解像度に基づいてグリッド化
2. 各グリッドセルで標高をサンプリング
3. 指定された標高値を通過するエッジを検出
4. 検出されたエッジを接続して等高線を形成

### パフォーマンス考慮事項

- **解像度**: 小さい解像度（高精度）は計算コストが高い
- **標高範囲**: 広い範囲と小さいインクリメントは多数の等高線を生成
- **サーフェスサイズ**: 大きなサーフェスは処理時間が長い
- **スプライン出力**: ポイント出力よりやや処理時間が長い

### Z-Up制約

現在の実装はZ-Upサーフェスのみをサポート。将来的には他の方向のサーフェスもサポートされる可能性があります。

## 注意事項

1. **Z-Upのみ**: 現在はZ軸が上のサーフェスのみサポート
2. **単位**: すべての標高と解像度はセンチメートル（cm）単位
3. **解像度の選択**: 高精度が必要な場合は小さい解像度を、パフォーマンス優先の場合は大きい解像度を選択
4. **等高線の数**: `(ElevationEnd - ElevationStart) / ElevationIncrement`で等高線の数が決まる
5. **タグ**: `bAddTagOnOutputForSameElevation`を有効にすると、後続ノードでのフィルタリングが容易
6. **スプライン出力**: `bOutputAsSpline`はエディタ設定のみでオーバーライド不可

## 関連ノード

- **Get Landscape Data**: ランドスケープデータを取得
- **Surface Sampler**: サーフェスのサンプリング
- **Create Spline**: ポイントからスプラインを作成
- **Filter Data By Tag**: タグでデータをフィルタリング
- **Spawn Spline Component**: スプラインを可視化

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGElevationIsolines.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGElevationIsolines.cpp`
- **カテゴリ**: Spatial
