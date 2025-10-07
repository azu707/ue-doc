# Spline to Segment（スプラインからセグメントへ）

## 概要

Spline to Segmentノードは、スプラインを入力として受け取り、接続された2つのコントロールポイントで定義される各セグメントをポイントデータとして出力するノードです。各ポイントは2つのコントロールポイントの中間に配置され、エクステントはその半分の差になります。

**ノードタイプ**: Spatial
**クラス名**: `UPCGSplineToSegmentSettings`, `FPCGSplineToSegmentElement`
**カテゴリ**: Grammar（文法/構造処理）

## 機能詳細

このノードは、スプラインの連続するコントロールポイントのペアから、セグメントを表すポイントを生成します。各セグメントポイントには、接線、角度、接続情報などの追加属性を付与できます。

### 主な特徴

- **セグメント化**: スプラインを個別のセグメントに分解
- **接線抽出**: 前後のセグメントとの接線を計算
- **角度計算**: 隣接セグメント間の角度を計算
- **接続情報**: セグメントの接続関係を属性として出力
- **時計回り情報**: 閉じたループの場合、向きを判定

## プロパティ

### bExtractTangents
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 前のセグメントと次のセグメントとの接線を抽出するかどうか

### bExtractAngles
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: 前の接線と次の接線との角度を抽出するかどうか。非閉鎖スプラインの端点では0になります

### bExtractConnectivityInfo
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: 前後のセグメントのインデックスを設定し、接続情報を保持するかどうか

### bExtractClockwiseInfo
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: スプラインポイントの順序が時計回りか反時計回りかを示すグローバル属性を出力するかどうか（閉じたループの場合のみ）

## 使用例

### 基本的な使用方法

```
Spline Data → Spline to Segment → Segment Points
```

### 実際のワークフロー例

1. **道路セグメント分析**
   - 道路スプラインを入力
   - Spline to Segmentでセグメントごとに分解
   - 各セグメントの角度に基づいて異なる道路タイプを配置

2. **壁の配置**
   - 建物の輪郭スプラインを作成
   - Spline to Segmentでセグメント化
   - 各セグメントの長さに応じた壁メッシュを配置

3. **フェンス生成**
   - フェンスラインのスプラインを作成
   - セグメントごとにポイントを生成
   - 接続情報を使用して角にポストを配置

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSplineToSegment.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Grammar/PCGSplineToSegment.cpp`

### 継承関係
- `UPCGSplineToSegmentSettings` ← `UPCGSettings`
- `FPCGSplineToSegmentElement` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **スプラインデータ取得**: 入力からスプラインデータを取得
2. **ポイントデータ作成**: 出力用のポイントデータを作成
3. **各セグメントの処理**:
   ```cpp
   controlPoints = spline.GetControlPoints()
   numSegments = IsClosed ? numPoints : numPoints - 1

   for i in 0..numSegments:
       p1 = controlPoints[i]
       p2 = controlPoints[(i + 1) % numPoints]

       // セグメントポイントの位置とエクステント
       center = (p1.Position + p2.Position) / 2
       extents = Abs(p2.Position - p1.Position) / 2

       // ポイント作成
       point.Transform.SetLocation(center)
       point.BoundsMin = -extents
       point.BoundsMax = extents

       // オプション属性の計算
       if (bExtractTangents):
           CalculateTangents(i, ...)
       if (bExtractAngles):
           CalculateAngles(i, ...)
       if (bExtractConnectivityInfo):
           SetConnectivityIndices(i, ...)

   if (bExtractClockwiseInfo && IsClosed):
       SetClockwiseGlobalAttribute(...)
   ```

### 出力属性

以下の属性が生成されます（設定に応じて）:

#### bExtractTangents = true の場合
- `PreviousTangent` (FVector): 前のセグメントとの接線方向
- `NextTangent` (FVector): 次のセグメントとの接線方向

#### bExtractAngles = true の場合
- `PreviousAngle` (float): 前のセグメントとの角度（度）
- `NextAngle` (float): 次のセグメントとの角度（度）

#### bExtractConnectivityInfo = true の場合
- `PreviousSegmentIndex` (int32): 前のセグメントのインデックス（-1 = なし）
- `NextSegmentIndex` (int32): 次のセグメントのインデックス（-1 = なし）

#### bExtractClockwiseInfo = true の場合（グローバル属性）
- `IsClockwise` (bool): スプラインが時計回りかどうか

### パフォーマンス特性

- **実行ループモード**: SinglePrimaryPin
- **計算コスト**: 低～中（コントロールポイント数に比例）
- **キャッシュ可能**: はい

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト)
  - タイプ: `EPCGDataType::Spline`

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: `EPCGDataType::Point`

### 技術的詳細

#### セグメント表現

各セグメントは以下のように表現されます:
```cpp
// ポイント位置 = 2つのコントロールポイントの中間
Transform.Location = (P1 + P2) / 2

// バウンズ = 2つのコントロールポイント間の半分の距離
BoundsMin = -Abs(P2 - P1) / 2
BoundsMax = Abs(P2 - P1) / 2
```

このバウンズ表現により、セグメントの長さと方向が保持されます。

#### 角度計算

```cpp
// 隣接セグメント間の角度
previousDir = Normalize(P[i] - P[i-1])
currentDir = Normalize(P[i+1] - P[i])
angle = ArcCos(Dot(previousDir, currentDir))
```

### 注意事項

1. **セグメント数**: 開いたスプラインでは（N-1）個、閉じたスプラインではN個のセグメントが生成されます
2. **端点の処理**: 開いたスプラインの端点では、片方の接線/角度のみが有効です
3. **時計回り判定**: XY平面上で判定されます（Z軸は無視）
4. **グローバル属性**: IsClockwiseはポイント属性ではなく、メタデータのグローバル属性です
5. **接続情報**: 閉じたスプラインでは、最後のセグメントが最初のセグメントに接続されます

### ユースケース

- **道路/パスセグメント**: 道路を個別のセグメントに分解して処理
- **壁/フェンス配置**: セグメントごとに異なる長さの構造物を配置
- **角度ベースの処理**: 急カーブと緩やかなカーブで異なる処理
- **モジュール配置**: セグメント長さに基づいたモジュラー配置
- **接続解析**: セグメント間の接続関係を分析

### Grammar系ノードとの連携

このノードはGrammar（文法）カテゴリに属し、以下のノードと組み合わせて使用されます:
- **Subdivide Segment**: セグメントをさらに細分化
- **Subdivide Spline**: スプライン全体を文法ルールで分割
