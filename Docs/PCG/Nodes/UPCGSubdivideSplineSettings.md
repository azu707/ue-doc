# Subdivide Spline

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGSubdivideSplineSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSubdivideSpline.h:16`

## 概要

スプラインを再サンプリングし、均等間隔の制御点を生成します。<br><span style='color:gray'>(Resamples a spline to produce evenly spaced control points.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bModuleInfoAsInput` | `bool` | `false` | モジュール情報を入力属性から取得します。 |
| `ModulesInfo` | `TArray<FPCGSubdivisionSubmodule>` | なし | 使用するモジュールの固定リスト。 |
| `ModulesInfoAttributeNames` | `FPCGSubdivisionModuleAttributeNames` | なし | モジュール情報を参照する属性名。 |
| `GrammarSelection` | `FPCGGrammarSelection` | なし | 適用する生成ルール。 |
| `bUseSeedAttribute` | `bool` | `false` | シード値を属性から取得するか。 |
| `SeedAttribute` | `FPCGAttributePropertyInputSelector` | なし | シード値を読み取る属性。 |
| `bForwardAttributesFromModulesInfo` | `bool` | `false` | 入力モジュール属性を出力へ転送します。 |
| `SymbolAttributeName` | `FName` | `PCGSubdivisionBase::Constants::SymbolAttributeName` | モジュール記号の属性名。 |
| `bOutputSizeAttribute` | `bool` | `true` | モジュールサイズを出力します。 |
| `SizeAttributeName` | `FName` | `PCGSubdivisionBase::Constants::SizeAttributeName` | サイズ属性名。 |
| `bOutputScalableAttribute` | `bool` | `true` | スケーラビリティ属性を出力します。 |
| `ScalableAttributeName` | `FName` | `PCGSubdivisionBase::Constants::ScalableAttributeName` | スケーラビリティ属性名。 |
| `bOutputDebugColorAttribute` | `bool` | `false` | デバッグカラー属性を出力します。 |
| `DebugColorAttributeName` | `FName` | `PCGSubdivisionBase::Constants::DebugColorAttributeName` | デバッグカラー属性名。 |
| `bAcceptIncompleteSubdivision` | `bool` | `false` | 文法でスプライン全体を埋められなくても許容します。 |
| `bModuleHeightAsAttribute` | `bool` | `false` | モジュール高さを属性から取得します。 |
| `ModuleHeight` | `double` | `100.0` | 固定モジュール高さ（cm）。 |
| `ModuleHeightAttribute` | `FPCGAttributePropertyInputSelector` | なし | 高さを読み取る属性。 |
| `bOutputModuleIndexAttribute` | `bool` | `false` | モジュールインデックス属性を出力します。 |
| `ModuleIndexAttributeName` | `FName` | `TEXT("ModuleIndex")` | モジュールインデックス属性名。 |
| `bOutputExtremityAttributes` | `bool` | `false` | 端点を示す属性を出力します。 |
| `IsFirstAttributeName` | `FName` | `TEXT("IsFirst")` | 最初のポイントを示す属性名。 |
| `IsFinalAttributeName` | `FName` | `TEXT("IsFinal")` | 最後のポイントを示す属性名。 |
| `ModulePlacementTolerance` | `double` | `0.01` | モジュール配置時の許容誤差（cm）。 |
