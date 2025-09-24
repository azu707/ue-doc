# Subdivide Segment

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGSubdivideSegmentSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSubdivideSegment.h:14`

## 概要

各線分を細分化して新しい分割ポイントを生成します。<br><span style='color:gray'>(Subdivides each segment to create intermediate points.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `bModuleInfoAsInput` | `bool` | `false` | モジュール情報を入力属性から受け取り、設定を上書きします。 |
| `ModulesInfo` | `TArray<FPCGSubdivisionSubmodule>` | なし | サブディビジョンに使用するモジュールの固定リスト。 |
| `ModulesInfoAttributeNames` | `FPCGSubdivisionModuleAttributeNames` | なし | 入力属性からモジュール情報を参照する際の属性名。 |
| `GrammarSelection` | `FPCGGrammarSelection` | なし | 適用する生成ルールを符号化した文字列。 |
| `bUseSeedAttribute` | `bool` | `false` | ランダムシードを属性から取得するかどうか。 |
| `SeedAttribute` | `FPCGAttributePropertyInputSelector` | なし | シード値を読み取る属性。 |
| `bForwardAttributesFromModulesInfo` | `bool` | `false` | 入力モジュール情報に含まれる属性を出力へ転送します。 |
| `SymbolAttributeName` | `FName` | `PCGSubdivisionBase::Constants::SymbolAttributeName` | モジュール記号を出力する属性名。 |
| `bOutputSizeAttribute` | `bool` | `true` | 各モジュールのサイズ値を属性として出力します。 |
| `SizeAttributeName` | `FName` | `PCGSubdivisionBase::Constants::SizeAttributeName` | サイズ属性の名称。 |
| `bOutputScalableAttribute` | `bool` | `true` | モジュールがスケーラ可能かを示す属性を出力します。 |
| `ScalableAttributeName` | `FName` | `PCGSubdivisionBase::Constants::ScalableAttributeName` | スケーラビリティ属性の名称。 |
| `bOutputDebugColorAttribute` | `bool` | `false` | デバッグ用カラー属性を出力します。 |
| `DebugColorAttributeName` | `FName` | `PCGSubdivisionBase::Constants::DebugColorAttributeName` | デバッグカラー属性の名称。 |
| `SubdivisionAxis` | `EPCGSplitAxis` | `EPCGSplitAxis::X` | 分割を行うローカル軸。 |
| `bFlipAxisAsAttribute` | `bool` | `false` | 軸反転の有無を属性で制御します。 |
| `bShouldFlipAxis` | `bool` | `false` | 固定設定で軸を反転するか。 |
| `FlipAxisAttribute` | `FPCGAttributePropertyInputSelector` | なし | 軸反転フラグを読み取る属性。 |
| `bAcceptIncompleteSubdivision` | `bool` | `false` | 指定した文法で完全に埋まらない場合でも有効とみなします。 |
| `bOutputModuleIndexAttribute` | `bool` | `false` | 出力ポイントにモジュールインデックスを記録します。 |
| `ModuleIndexAttributeName` | `FName` | `TEXT("ModuleIndex")` | モジュールインデックス属性の名称。 |
| `bOutputExtremityAttributes` | `bool` | `false` | 最初と最後のポイントを示す属性を出力します。 |
| `IsFirstAttributeName` | `FName` | `TEXT("IsFirst")` | 最初のポイントを示す属性名。 |
| `IsFinalAttributeName` | `FName` | `TEXT("IsFinal")` | 最後のポイントを示す属性名。 |
| `bOutputExtremityNeighborIndexAttribute` | `bool` | `false` | 端点が参照する隣接モジュールのインデックスを出力します。 |
| `ExtremityNeighborIndexAttributeName` | `FName` | `TEXT("ExtremityNeighborIndex")` | 端点の隣接インデックス属性名。 |
