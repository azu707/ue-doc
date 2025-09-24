# Spline To Mesh

- **日本語名**: スプラインからメッシュ
- **カテゴリ**: DynamicMesh (ダイナミックメッシュ) — 9件
- **実装クラス**: `UPCGSplineToMeshSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGGeometryScriptInterop/Source/PCGGeometryScriptInterop/Public/Elements/PCGSplineToMesh.h:11`

## 概要

閉じたスプラインをメッシュに変換します<br><span style='color:gray'>(Converts a closed spline into a mesh.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ErrorTolerance` | `double` | `1.0` | スプライン曲線から三角形メッシュへ変換する際の許容誤差。小さくするとより細かい頂点を生成します。 |
| `FlattenMethod` | `EFlattenCurveMethod` | `EFlattenCurveMethod::DoNotFlatten` | 曲線を平面化するかどうか。平面化するモードでは押し出し・オフセット系の設定が有効になります。 |
| `Thickness` | `double` | `0.0` | メッシュを法線方向に押し出して厚みを付与します。0 でフラットなポリゴンを生成します。 |
| `bFlipResult` | `bool` | `false` | 生成メッシュの面向きを反転します。裏面がカリングされる状況で向きを調整したい場合に使用します。 |
| `OpenCurves` | `EOffsetOpenCurvesMethod` | `EOffsetOpenCurvesMethod::TreatAsClosed` | 開いたスプラインを平面化・オフセットする際の端部処理方法。閉じた曲線として扱うか、片側にオフセットするかなどを選びます。 |
| `CurveOffset` | `double` | `0.0` | 平面化後の曲線に適用するオフセット距離。正値で外側、負値で内側に移動します。 |
| `OffsetClosedCurves` | `EOffsetClosedCurvesMethod` | `EOffsetClosedCurvesMethod::OffsetOuterSide` | 閉じた曲線にオフセットを適用する際の扱い。外側のみ／内側のみ等を切り替えます。 |
| `EndShapes` | `EOpenCurveEndShapes` | `EOpenCurveEndShapes::Square` | 開いた曲線をオフセットした際の端形状（スクエア／ラウンドなど）を指定します。 |
| `JoinMethod` | `EOffsetJoinMethod` | `EOffsetJoinMethod::Square` | オフセット曲線のジョイント処理方法。角を丸めるか、ミタージョイントにするかなどを選択します。 |
| `MiterLimit` | `double` | `1.0` | `JoinMethod = Miter` の際に許容するミター長。大きくすると尖った角を維持し、小さくすると自動的にスクエアへ切り替わります。 |
