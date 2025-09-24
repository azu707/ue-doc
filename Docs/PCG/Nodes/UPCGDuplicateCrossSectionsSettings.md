# Duplicate Cross-Sections

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGDuplicateCrossSectionsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGDuplicateCrossSections.h:11`

## 概要

スプライン断面を複製して、文法生成用にバリエーションを増やします。<br><span style='color:gray'>(Duplicates spline cross-sections for additional grammar variations.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bModuleInfoAsInput` | `bool` | `false` | 入力属性セットからサブディビジョンモジュール情報を受け取り、設定を上書きします。 |
| `ModulesInfo` | `TArray<FPCGSubdivisionSubmodule>` | なし | 利用するモジュール定義の固定リスト。外部入力を使わない場合にここで構成を記述します。 |
| `ModulesInfoAttributeNames` | `FPCGSubdivisionModuleAttributeNames` | なし | 入力属性からモジュール情報を参照する際の属性名マッピング。 |
| `GrammarSelection` | `FPCGGrammarSelection` | なし | モジュール適用ルールを符号化した文字列。構文規則を切り替える際に使用します。 |
| `bUseSeedAttribute` | `bool` | `false` | サブディビジョンのランダムシードを属性から取得するかどうか。 |
| `SeedAttribute` | `FPCGAttributePropertyInputSelector` | なし | シード値を読み取る属性。整数へ変換できる値が必要です。 |
| `bForwardAttributesFromModulesInfo` | `bool` | `false` | 入力の ModulesInfo に含まれる属性を出力へ転送します。 |
| `SymbolAttributeName` | `FName` | `PCGSubdivisionBase::Constants::SymbolAttributeName` | 生成される記号（モジュールID）を格納する属性名。 |
| `bOutputSizeAttribute` | `bool` | `true` | モジュールごとのサイズ値を属性として出力するかどうか。 |
| `SizeAttributeName` | `FName` | `PCGSubdivisionBase::Constants::SizeAttributeName` | サイズ属性の名称。`bOutputSizeAttribute` が有効な場合に使用します。 |
| `bOutputScalableAttribute` | `bool` | `true` | モジュールがスケーラブルかを示す属性を出力するか。 |
| `ScalableAttributeName` | `FName` | `PCGSubdivisionBase::Constants::ScalableAttributeName` | スケーラブル属性の名称。 |
| `bOutputDebugColorAttribute` | `bool` | `false` | デバッグ用カラー属性を生成します。 |
| `DebugColorAttributeName` | `FName` | `PCGSubdivisionBase::Constants::DebugColorAttributeName` | デバッグカラー属性の名称。 |
| `bExtrudeVectorAsAttribute` | `bool` | `false` | 押し出しベクトルを固定値ではなく入力属性から取得します。 |
| `ExtrudeVector` | `FVector` | `(0.0, 0.0, 1000.0)` | 押し出し方向と距離の固定値。`bExtrudeVectorAsAttribute = false` の場合に使用されます。 |
| `ExtrudeVectorAttribute` | `FPCGAttributePropertyInputSelector` | なし | 押し出しベクトルを読み取る属性。 |
| `bOutputSplineIndexAttribute` | `bool` | `true` | 出力ポイントに元スプラインのインデックスを付与します。 |
| `SplineIndexAttributeName` | `FName` | `TEXT("SplineIndex")` | スプラインインデックス属性の名称。 |
