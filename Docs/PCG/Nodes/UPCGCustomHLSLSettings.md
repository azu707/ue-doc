# Custom HLSL

- **日本語名**: カスタムHLSL
- **カテゴリ**: GPU (GPU) — 2件
- **実装クラス**: `UPCGCustomHLSLSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Private/Compute/Elements/PCGCustomHLSL.h:39`

## 概要

[EXPERIMENTAL] GPU で実行される HLSL コンピュート シェーダーを生成します<br><span style='color:gray'>([EXPERIMENTAL] Produces a HLSL compute shader which will be executed on the GPU.)</span>

## 設定項目

### 基本

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `KernelType` | `EPCGKernelType` | `PointProcessor` | カーネルの役割を選択します。ポイント処理／生成、テクスチャ処理／生成、カスタムから選択でき、対応するピン型やスレッド計算式が変わります。 |
| `PointCount` | `int` | `256` | `KernelType == PointGenerator` のときに生成するポイント数。 |
| `NumElements2D` | `FIntPoint` | `(64,64)` | `KernelType == TextureGenerator` のときに生成するテクスチャ解像度。 |
| `bMuteUnwrittenPinDataErrors` | `bool` | `false` | GPU カーネルが出力ピンのデータを書き込まない場合のエラーログを抑制します。 |

### スレッド制御

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `DispatchThreadCount` | `EPCGDispatchThreadCount` | `FromFirstOutputPin` | `KernelType == Custom` のときのディスパッチ計算方法。固定値、出力ピン由来、ピン積算などから選びます。 |
| `ThreadCountMultiplier` | `int` | `1` | ディスパッチスレッド数に掛けられる倍率。`DispatchThreadCount` が固定値以外のカスタム時のみ有効です。 |
| `FixedThreadCount` | `int` | `1` | `DispatchThreadCount == Fixed` で使用するスレッド数。 |
| `ThreadCountInputPinLabels` | `TArray<FName>` | 空 | `DispatchThreadCount == FromProductOfInputPins` のとき、掛け合わせ対象となる入力ピン名リスト。 |

### ピン設定

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputPins` | `TArray<FPCGPinProperties>` | 1 つの `Point` 入力 | 入力ピン構成。ピン名・データ型・複数接続可否などを UI から編集できます。 |
| `OutputPins` | `TArray<FPCGPinPropertiesGPU>` | `Default` ラベルのポイント出力 1 つ | GPU 専用の出力ピン構成。各ピンに GPU アクセサが生成されます。 |

### エディタ専用

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `KernelSourceOverride` | `UComputeSource*` | `null` | 外部の `PCGComputeSource` アセットでカーネル全体を置き換えます。 |
| `AdditionalSources` | `TArray<UComputeSource*>` | 空 | カスタム HLSL の補助ソース群。インクルードするヘルパー関数を外部アセットとして読み込みます。 |
| `ShaderFunctions` | `FString` | `"/** CUSTOM SHADER FUNCTIONS **/\n"` | HLSL 補助関数定義を保持します（HLSL エディタから編集）。 |
| `ShaderSource` | `FString` | 空 | カーネル本体の HLSL コード。エディタ内の HLSL Source Editor で編集します。 |
| `InputDeclarations` / `OutputDeclarations` / `HelperDeclarations` | `FString` (Transient) | 空 | エディタのプレビュー用に生成される宣言テキスト。読み取り専用です。 |

## 実装メモ

- ノードは `IPCGNodeSourceTextProvider` を実装し、HLSL ソースコードをグラフアセット内に直列化します。`ShaderSource` が空でも、プリコンパイル済み `PCGComputeSource` を指定すれば UI は読み取り専用になります。<br><span style='color:gray'>(The node exposes shader text through `IPCGNodeSourceTextProvider`, allowing inline source or external compute sources.)</span>
- スレッド数は `KernelType == Custom` の場合のみ詳細制御が有効で、固定値ディスパッチ時は `FixedThreadCount` がそのまま GPU ディスパッチサイズになります。それ以外では出力ピンの要素数や `ThreadCountInputPinLabels` に基づく製品（積）が自動計算され、`ThreadCountMultiplier` で調整されます。<br><span style='color:gray'>(Thread counts default to output-driven sizes; custom kernels can override via multiplier or fixed constants.)</span>
- `InputPins`/`OutputPins` の変更はノード構造を再評価するため、エディタでは `UpdatePinSettings` により依存ピンの表示フラグや GPU アクセサ定義が即時更新されます。<br><span style='color:gray'>(Editing pin arrays triggers structural refreshes that regenerate accessor declarations.)</span>
