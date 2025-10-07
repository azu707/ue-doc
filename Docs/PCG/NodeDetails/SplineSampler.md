# Spline Sampler

## 概要

**ノードタイプ**: Sampler
**クラス**: UPCGSplineSamplerSettings
**エレメント**: FPCGSplineSamplerElement

Spline Samplerノードは、スプライン上、スプライン周囲、またはスプラインで囲まれた内部領域にポイントを生成します。スプラインに沿った道路、フェンス、植生の配置など、多様な用途に対応する強力なサンプリングツールです。

## 機能詳細

Spline Samplerノードは、PCGスプラインデータから様々な方法でポイントを生成します。サンプリング次元（1D線上、2D面、3Dボリューム、内部領域）、サンプリングモード（分割、距離、サンプル数）、そして多数のオプション属性の計算機能を提供します。スプラインの形状に従ったポイント配置から、スプラインで囲まれた領域の充填まで、幅広い用途に対応します。

主な機能:
- 5つのサンプリング次元（OnSpline、OnHorizontal、OnVertical、OnVolume、OnInterior）
- 3つのサンプリングモード（Subdivision、Distance、NumberOfSamples）
- 豊富な属性計算（方向デルタ、曲率、セグメントインデックス、タンジェント、Alpha、距離など）
- 内部領域のポイント密度フォールオフカーブ
- バウンディングシェイプによる制限
- シードベースのランダムオフセット

## プロパティ構造体: FPCGSplineSamplerParams

### Dimension
- **型**: EPCGSplineSamplingDimension
- **デフォルト値**: OnSpline
- **説明**: サンプリングする次元を指定します
  - `OnSpline`: スプライン上（1D）
  - `OnHorizontal`: スプラインの水平断面（2D平面）
  - `OnVertical`: スプラインの垂直断面（2D平面）
  - `OnVolume`: スプライン周囲のボリューム（3D）
  - `OnInterior`: スプラインで囲まれた内部領域（2D塗りつぶし）

### Mode
- **型**: EPCGSplineSamplingMode
- **デフォルト値**: Subdivision
- **説明**: サンプリング方法を指定します
  - `Subdivision`: セグメントごとに指定された数のサブ分割でサンプリング
  - `Distance`: 指定された距離間隔でサンプリング
  - `NumberOfSamples`: スプライン全体を指定された数で均等分割してサンプリング
- **編集条件**: Dimension != OnInterior

### Fill
- **型**: EPCGSplineSamplingFill
- **デフォルト値**: Fill
- **説明**: 断面のサンプリング方法を指定します
  - `Fill`: 断面全体を塗りつぶす
  - `EdgesOnly`: エッジのみにサンプリング
- **編集条件**: Dimension != OnSpline && Dimension != OnInterior

### SubdivisionsPerSegment
- **型**: int32
- **デフォルト値**: 1
- **説明**: Subdivisionモード時の各スプラインセグメントあたりのサブ分割数
- **範囲**: 0以上
- **編集条件**: Mode == Subdivision && Dimension != OnInterior

### DistanceIncrement
- **型**: float
- **デフォルト値**: 100.0
- **説明**: Distanceモード時のサンプル間の距離（cm単位）
- **範囲**: 0.1以上
- **編集条件**: Mode == Distance && Dimension != OnInterior

### NumSamples
- **型**: int32
- **デフォルト値**: 8
- **説明**: NumberOfSamplesモード時のサンプル総数。スプライン全体に均等に配置されます
- **範囲**: 0以上
- **編集条件**: Mode == NumberOfSamples && Dimension != OnInterior

### NumPlanarSubdivisions
- **型**: int32
- **デフォルト値**: 8
- **説明**: 水平断面またはボリュームサンプリング時の平面方向のサブ分割数
- **範囲**: 0以上
- **編集条件**: Dimension == OnHorizontal || Dimension == OnVolume

### NumHeightSubdivisions
- **型**: int32
- **デフォルト値**: 8
- **説明**: 垂直断面またはボリュームサンプリング時の高さ方向のサブ分割数
- **範囲**: 0以上
- **編集条件**: Dimension == OnVertical || Dimension == OnVolume

### StartOffset
- **型**: float
- **デフォルト値**: 0.0
- **説明**: サンプリングを開始するスプラインに沿った距離（cm単位）
- **範囲**: 0以上
- **編集条件**: Mode != Subdivision && Dimension != OnInterior

### EndOffset
- **型**: float
- **デフォルト値**: 0.0
- **説明**: サンプリングを終了するスプラインの終端からの距離（cm単位）
- **範囲**: 0以上
- **編集条件**: Mode != Subdivision && Dimension != OnInterior

### MaxRandomOffsetNormalized
- **型**: float
- **デフォルト値**: 0.0
- **説明**: 各サンプルポイントの最大ランダムオフセット。0.0はオフセットなし、1.0はDistanceIncrement / 2.0のオフセット（正規化値）
- **範囲**: 0以上
- **編集条件**: Mode != Subdivision && Dimension != OnInterior

### bFitToCurve
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、DistanceIncrementをスプライン長に合わせて調整し、均等に配置されるようにします。スプライン長がDistanceIncrementで割り切れない場合、最後のサンプルがスプライン終端に到達しない問題を解決します
- **編集条件**: Mode == Distance && Dimension != OnInterior

### InteriorSampleSpacing
- **型**: float
- **デフォルト値**: 100.0
- **説明**: OnInteriorモード時の各サンプルポイント間の間隔（cm単位）
- **範囲**: 0.1以上
- **編集条件**: Dimension == OnInterior

### InteriorBorderSampleSpacing
- **型**: float
- **デフォルト値**: 100.0
- **説明**: OnInteriorモード時のスプライン境界上のサンプル間隔。計算に使用され、小さい値ほど高価ですが精度が向上します
- **範囲**: 0.1以上
- **編集条件**: Dimension == OnInterior && !bTreatSplineAsPolyline

### bTreatSplineAsPolyline
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、スプラインポイントを使用してポリラインを形成します。スプラインに沿った多数のサンプルポイントを計算する代わりに使用します。スプラインが直線的な場合により正確です
- **編集条件**: Dimension == OnInterior

### InteriorOrientation
- **型**: EPCGSplineSamplingInteriorOrientation
- **デフォルト値**: Uniform
- **説明**: 内部ポイントの向きを決定します
  - `Uniform`: 均一な向き
  - `FollowCurvature`: スプラインの曲率に従う
- **編集条件**: Dimension == OnInterior

### bProjectOntoSurface
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、サンプルポイントをスプライン境界で定義される可能なサーフェスに投影します
- **編集条件**: Dimension == OnInterior

### InteriorDensityFalloffCurve
- **型**: FRuntimeFloatCurve
- **デフォルト値**: 空のカーブ
- **説明**: スプラインからの距離に基づいて各サンプルの密度を定義します。X軸は境界までの正規化距離（0-1）、Y軸は密度値
- **編集条件**: Dimension == OnInterior

### 属性計算オプション

#### bComputeDirectionDelta
- **型**: bool
- **デフォルト値**: false
- **説明**: スプライン上の次のポイントへのデルタ角度を計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### NextDirectionDeltaAttribute
- **型**: FName
- **デフォルト値**: "NextDirectionDelta"
- **説明**: 次のポイントへのデルタ角度を含む属性名。現在のポイントのUp方向に対する角度
- **編集条件**: bComputeDirectionDelta && Dimension != OnInterior

#### bComputeCurvature
- **型**: bool
- **デフォルト値**: false
- **説明**: スプラインに沿った曲率を計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### CurvatureAttribute
- **型**: FName
- **デフォルト値**: "Curvature"
- **説明**: 曲率を含む属性名。曲率半径は1/Curvatureで定義され、ワールド単位にスケールする必要がある場合があります
- **編集条件**: bComputeCurvature && Dimension != OnInterior

#### bComputeSegmentIndex
- **型**: bool
- **デフォルト値**: false
- **説明**: スプラインセグメントインデックスを計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### SegmentIndexAttribute
- **型**: FName
- **デフォルト値**: "SegmentIndex"
- **説明**: スプラインセグメントインデックスを含む属性名
- **編集条件**: bComputeSegmentIndex && Dimension != OnInterior

#### bComputeSubsegmentIndex
- **型**: bool
- **デフォルト値**: false
- **説明**: スプライン上のポイントのサブセグメントインデックスを計算し、属性に書き込みます
- **編集条件**: Mode == Subdivision && Dimension != OnInterior

#### SubsegmentIndexAttribute
- **型**: FName
- **デフォルト値**: "SubsegmentIndex"
- **説明**: サブセグメントインデックスを含む属性名。0の場合、そのポイントは実際のスプライン上のコントロールポイントです。Subdivisionモードのみ適用
- **編集条件**: bComputeSubsegmentIndex && Mode == Subdivision && Dimension != OnInterior

#### bComputeTangents
- **型**: bool
- **デフォルト値**: false
- **説明**: スプラインに沿った到着・出発タンジェントを計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### ArriveTangentAttribute
- **型**: FName
- **デフォルト値**: "ArriveTangent"
- **説明**: 到着タンジェントベクトルを含む属性名。コントロールポイントの場合は実際の到着タンジェント、それ以外は正規化されたタンジェント
- **編集条件**: bComputeTangents && Dimension != OnInterior

#### LeaveTangentAttribute
- **型**: FName
- **デフォルト値**: "LeaveTangent"
- **説明**: 出発タンジェントベクトルを含む属性名。コントロールポイントの場合は実際の出発タンジェント、それ以外は正規化されたタンジェント
- **編集条件**: bComputeTangents && Dimension != OnInterior

#### bComputeAlpha
- **型**: bool
- **デフォルト値**: false
- **説明**: スプラインに沿ったアルファ値を計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### AlphaAttribute
- **型**: FName
- **デフォルト値**: "Alpha"
- **説明**: ラインの終端までのポイントの進行度を表す[0,1]の値を含む属性名。各セグメントは等しいサイズの間隔を表します
- **編集条件**: bComputeAlpha && Dimension != OnInterior

#### bComputeDistance
- **型**: bool
- **デフォルト値**: false
- **説明**: スプラインに沿った距離を計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### DistanceAttribute
- **型**: FName
- **デフォルト値**: "Distance"
- **説明**: サンプルポイントでのスプラインに沿った距離を含む属性名
- **編集条件**: bComputeDistance && Dimension != OnInterior

#### bComputeInputKey
- **型**: bool
- **デフォルト値**: false
- **説明**: スプラインに沿った各ポイントの入力キーを計算し、属性に書き込みます
- **編集条件**: Dimension != OnInterior

#### InputKeyAttribute
- **型**: FName
- **デフォルト値**: "InputKey"
- **説明**: スプライン入力キーを含む属性名。[0, N]のfloat値で、Nはコントロールポイント数。各範囲[i, i+1]はスプラインセグメントi全体での0から1への補間を表します
- **編集条件**: bComputeInputKey && Dimension != OnInterior

### その他の設定

#### bUnbounded
- **型**: bool
- **デフォルト値**: false
- **説明**: Bounding Shape入力が提供されない場合、アクターバウンドを使用してサンプル生成ドメインを制限します。このオプションを有効にすると、アクターバウンドを無視してスプライン全体に生成します。大量のポイントが生成される可能性があるため注意が必要です
- **オーバーライド可能**: はい

#### PointSteepness
- **型**: float
- **デフォルト値**: 0.5
- **説明**: 各PCGポイントは、ワールド空間の離散化されたボリューメトリック領域を表します。ポイントのSteepness値[0.0-1.0]は、そのボリュームの「硬さ」または「柔らかさ」を確立します。0では、ポイントの中心から最大2倍のバウンドまで密度が線形に増加します。1では、ポイントのバウンドサイズのバイナリボックス関数を表します
- **範囲**: 0.0 - 1.0
- **オーバーライド可能**: はい
- **カテゴリ**: Settings|Points

#### SeedingMode
- **型**: EPCGSplineSamplingSeedingMode
- **デフォルト値**: SeedFromPosition
- **説明**: サンプルポイントのシード計算モードを制御します
  - `SeedFromPosition`: サンプル位置からシードを計算
  - `SeedFromIndex`: サンプルインデックスからシードを計算
- **カテゴリ**: Settings|Seeding

#### bSeedFromLocalPosition
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、ローカル位置を使用してサンプリングされたポイントをシードします。falseの場合はワールド位置を使用
- **編集条件**: SeedingMode == SeedFromPosition
- **カテゴリ**: Settings|Seeding

#### bSeedFrom2DPosition
- **型**: bool
- **デフォルト値**: false
- **説明**: trueの場合、2D（XY）位置を使用してサンプリングされたポイントをシードします。falseの場合は3D位置を使用
- **編集条件**: SeedingMode == SeedFromPosition
- **カテゴリ**: Settings|Seeding

## 入力ピン

### Spline
- **型**: Spline Data / Poly Line Data
- **説明**: サンプリング元のスプラインデータ
- **ラベル**: "Spline"

### Bounding Shape（オプション）
- **型**: Spatial Data
- **説明**: サンプリング領域を制限するバウンディングシェイプ。提供されない場合、アクターバウンドが使用されます（bUnboundedがfalseの場合）
- **ラベル**: "Bounding Shape"

## 出力ピン

### Out
- **型**: Point Data
- **説明**: スプラインからサンプリングされたポイント

## 使用例

### 例1: スプラインに沿った道路の舗装
スプラインに沿って均等に舗装ブロックを配置する場合:
1. PCG Spline Componentでスプラインを作成
2. Spline Samplerノードで:
   - Dimension: OnSpline
   - Mode: Distance
   - DistanceIncrement: 100.0（舗装ブロックの間隔）
   - bComputeDistance: true（距離属性を取得）
3. Static Mesh Spawnerで舗装ブロックを配置

### 例2: フェンスの柱とレールの配置
スプラインに沿ってフェンスを配置する場合:
1. Spline Samplerノードで柱用ポイントを生成:
   - Dimension: OnSpline
   - Mode: Distance
   - DistanceIncrement: 200.0（柱の間隔）
   - bComputeSegmentIndex: true
   - bComputeTangents: true（向きを取得）
2. 別のSpline Samplerでレール用ポイントを生成:
   - Dimension: OnSpline
   - Mode: Subdivision
   - SubdivisionsPerSegment: 10（滑らかなレール）
3. それぞれをStatic Mesh Spawnerに接続

### 例3: スプライン周囲のボリュームサンプリング
パイプ周囲に植生を配置する場合:
1. Spline Samplerノードで:
   - Dimension: OnVolume
   - Mode: Distance
   - DistanceIncrement: 50.0
   - NumPlanarSubdivisions: 8（円周方向）
   - NumHeightSubdivisions: 4（半径方向）
2. パイプ周囲に3Dグリッド状のポイントが生成されます
3. Density Filterで間引いてランダムな配置に

### 例4: スプラインで囲まれた領域の塗りつぶし
閉じたスプラインの内部に草を配置する場合:
1. 閉じたスプラインを作成（始点と終点が接続）
2. Spline Samplerノードで:
   - Dimension: OnInterior
   - InteriorSampleSpacing: 50.0（草の密度）
   - bTreatSplineAsPolyline: true（直線的な境界の場合）
   - InteriorDensityFalloffCurve: 境界に近いほど密度を下げるカーブを設定
3. 内部領域全体にポイントが生成されます

### 例5: 曲率に基づいた配置
スプラインのカーブが急な場所により多くのポイントを配置する場合:
1. Spline Samplerノードで:
   - Dimension: OnSpline
   - Mode: Distance
   - DistanceIncrement: 100.0
   - bComputeCurvature: true
   - CurvatureAttribute: "Curvature"
2. Attribute Remapで曲率を密度にマッピング
3. Density Filterで密度に基づいてフィルタリング
4. カーブが急な場所により多くのポイントが残ります

## 実装の詳細

### 処理フロー

1. **入力の検証**: スプラインデータとオプションのバウンディングシェイプを取得
2. **次元とモードの決定**: Dimensionに基づいて適切なサンプリング関数を選択
3. **バウンドの計算**: bUnboundedがfalseの場合、バウンディングシェイプまたはアクターバウンドを計算
4. **サンプリングの実行**:
   - **OnSpline**: スプライン上に1Dサンプリング
   - **OnHorizontal/OnVertical**: スプラインに沿って2D断面をサンプリング
   - **OnVolume**: スプライン周囲に3Dボリュームをサンプリング
   - **OnInterior**: スプラインで囲まれた2D領域をサンプリング
5. **属性の計算**: 有効な属性計算オプションに基づいて追加属性を生成
6. **ランダムオフセットの適用**: MaxRandomOffsetNormalizedが0でない場合、シードベースのオフセットを適用
7. **シードの計算**: SeedingModeに基づいてポイントのシードを設定
8. **出力の生成**: 生成されたポイントデータを出力

### コードスニペット

**サンプリング次元の列挙型**:
```cpp
UENUM()
enum class EPCGSplineSamplingDimension : uint8
{
    OnSpline = 0,      // スプライン上（1D）
    OnHorizontal,      // 水平断面（2D）
    OnVertical,        // 垂直断面（2D）
    OnVolume,          // ボリューム（3D）
    OnInterior         // 内部領域（2D塗りつぶし）
};
```

**サンプリングモードの列挙型**:
```cpp
UENUM()
enum class EPCGSplineSamplingMode : uint8
{
    Subdivision = 0,   // セグメントごとの分割
    Distance,          // 距離間隔
    NumberOfSamples    // 均等配置
};
```

**ヘルパー関数**:
```cpp
namespace PCGSplineSamplerHelpers
{
    // スプライン上または周囲のボリュームでサンプリング
    void SampleLineData(FPCGContext* Context,
                       const UPCGPolyLineData* LineData,
                       const UPCGSpatialData* InBoundingShape,
                       const UPCGSpatialData* InProjectionTarget,
                       const FPCGProjectionParams& InProjectionParams,
                       const FPCGSplineSamplerParams& Params,
                       UPCGBasePointData* OutPointData);

    // スプラインで囲まれた2D領域をサンプリング
    void SampleInteriorData(FPCGContext* Context,
                           const UPCGPolyLineData* LineData,
                           const UPCGSpatialData* InBoundingShape,
                           const UPCGSpatialData* InProjectionTarget,
                           const FPCGProjectionParams& InProjectionParams,
                           const FPCGSplineSamplerParams& Params,
                           UPCGBasePointData* OutPointData);
}
```

## パフォーマンス考慮事項

1. **次元の複雑さ**:
   - OnSpline: 最も高速（1Dサンプリング）
   - OnHorizontal/OnVertical: 中程度（2Dサンプリング）
   - OnVolume: 高コスト（3Dサンプリング）
   - OnInterior: 変動（ポリゴン内部判定が必要）

2. **サンプリングモード**:
   - Subdivision: 固定コスト、予測可能
   - Distance: スプライン長に依存
   - NumberOfSamples: 固定コスト、予測可能

3. **属性計算のコスト**: 各属性計算オプションは追加のコストを発生させます。必要な属性のみを有効にしてください。

4. **内部サンプリングのコスト**: OnInteriorモードは、ポイントが多角形内にあるかどうかを判定するため、他のモードよりもコストが高くなります。InteriorSampleSpacingを大きくするとポイント数が減少します。

5. **bTreatSplineAsPolylineの最適化**: スプラインが直線的な場合、bTreatSplineAsPolylineをtrueにすることで、内部サンプリングのパフォーマンスが大幅に向上します。

6. **バウンディングシェイプ**: バウンディングシェイプを提供することで、不要な領域のサンプリングを避けることができます。

7. **FullOutputDataCrc**: このノードはShouldComputeFullOutputDataCrcを実装しており、変更伝播を最適化するために完全なCRCを計算します。

## 関連ノード

- **Get Spline Data**: スプラインアクターからスプラインデータを取得
- **Create Spline**: ポイントからスプラインを作成
- **Spline To Segment**: スプラインを個別のセグメントに分割
- **Surface Sampler**: サーフェス上にポイントを生成
- **Volume Sampler**: ボリューム内にポイントを生成
- **Projection**: ポイントをサーフェスに投影
- **Spline Direction**: スプラインの方向情報を計算

## 注意事項

- OnInteriorモードでは、スプラインは閉じている必要があります（始点と終点が接続）。開いたスプラインでは予期しない結果になります。
- 属性計算オプションは、OnInteriorモードでは使用できません。
- bUnboundedをtrueにすると、スプラインが非常に長い場合に大量のポイントが生成される可能性があります。
- InteriorDensityFalloffCurveは、X軸が[0,1]の範囲で定義される必要があります。
- シード使用をサポートしており、シード値によってランダムオフセットや内部サンプリングの動作が決定されます。
- Base Point Data入力をサポートしています。
- FullOutputDataCrcを計算して変更伝播を最適化します。
- 複数のスプライン入力がある場合、SinglePrimaryPinモードで各入力を順次処理します。
