# Custom HLSL

## 概要

**Custom HLSL**ノードは、カスタムHLSLコンピュートシェーダーをGPU上で実行できる実験的なノードです。ユーザーが記述したHLSLコードを使用して、PCGデータをGPUで高速に処理できます。

**注意**: このノードは実験的機能（EXPERIMENTAL）であり、将来のバージョンで変更される可能性があります。

カテゴリ: GPU
クラス名: `UPCGCustomHLSLSettings`
エレメント: `FPCGCustomHLSLElement`

## 機能詳細

Custom HLSL ノードは、PCGシステムのGPUコンピュート機能を活用し、カスタムシェーダーコードを実行します。ポイントプロセッサ、ポイントジェネレータ、テクスチャプロセッサなど、複数のカーネルタイプをサポートします。

### 主な特徴

- カスタムHLSLコンピュートシェーダーの実行
- 複数のカーネルタイプ（Point Processor/Generator、Texture Processor/Generator、Custom）
- 動的な入出力ピン設定
- GPU専用属性とバッファのサポート
- シェーダーソースのライブ編集（エディタ内）
- 外部コンピュートソースアセットのサポート

## カーネルタイプ

### Point Processor
- **説明**: 最初の入力ピンの各ポイントに対してカーネルを実行
- **用途**: ポイントデータの変換、フィルタリング、属性計算
- **スレッド数**: 入力ポイント数

### Point Generator
- **説明**: 固定数のポイントを生成
- **用途**: 新しいポイントデータの生成
- **スレッド数**: `PointCount` プロパティで指定

### Texture Processor
- **説明**: 最初の入力ピンのテクスチャの各テクセルに対してカーネルを実行
- **用途**: テクスチャデータの処理
- **スレッド数**: 入力テクスチャのテクセル数

### Texture Generator
- **説明**: 固定サイズのテクスチャを生成
- **用途**: 新しいテクスチャデータの生成
- **スレッド数**: `NumElements2D` で指定

### Custom
- **説明**: カスタムスレッド数とバッファサイズで実行
- **用途**: 高度なカスタム処理
- **スレッド数**: ユーザー設定による

## プロパティ

### KernelType
- **型**: `EPCGKernelType` (enum)
- **デフォルト値**: `EPCGKernelType::PointProcessor`
- **カテゴリ**: Settings
- **説明**: カーネルのタイプを指定します。実行方法と自動設定に影響します。

### PointCount
- **型**: `int`
- **デフォルト値**: `256`
- **カテゴリ**: Settings
- **表示名**: "Num Elements"
- **条件**: `KernelType == PointGenerator`
- **説明**: Point Generator モードで生成するポイント数

### NumElements2D
- **型**: `FIntPoint`
- **デフォルト値**: `FIntPoint(64, 64)`
- **カテゴリ**: Settings
- **表示名**: "Num Elements"
- **条件**: `KernelType == TextureGenerator`
- **説明**: Texture Generator モードで生成するテクスチャのサイズ（幅 x 高さ）

### DispatchThreadCount
- **型**: `EPCGDispatchThreadCount` (enum)
- **デフォルト値**: `EPCGDispatchThreadCount::FromFirstOutputPin`
- **カテゴリ**: Settings|Thread Count
- **条件**: `KernelType == Custom`
- **説明**: ディスパッチするスレッド数の決定方法:
  - **FromFirstOutputPin**: 最初の出力ピンのデータ要素数に基づく
  - **Fixed**: 固定スレッド数（`FixedThreadCount` で指定）
  - **FromProductOfInputPins**: 複数の入力ピンの要素数の積

### ThreadCountMultiplier
- **型**: `int`
- **デフォルト値**: `1`
- **カテゴリ**: Settings|Thread Count
- **条件**: `KernelType == Custom && DispatchThreadCount != Fixed`
- **説明**: ディスパッチスレッド数に適用される乗数

### FixedThreadCount
- **型**: `int`
- **デフォルト値**: `1`
- **カテゴリ**: Settings|Thread Count
- **条件**: `KernelType == Custom && DispatchThreadCount == Fixed`
- **説明**: 固定スレッド数モードでのスレッド数

### ThreadCountInputPinLabels
- **型**: `TArray<FName>`
- **デフォルト値**: 空配列
- **カテゴリ**: Settings|Thread Count
- **表示名**: "Input Pins"
- **条件**: `KernelType == Custom && DispatchThreadCount == FromProductOfInputPins`
- **説明**: スレッド数計算に使用する入力ピンのラベル

### InputPins
- **型**: `TArray<FPCGPinProperties>`
- **デフォルト値**: デフォルトポイント入力ピン
- **カテゴリ**: Settings
- **説明**: カスタム入力ピンの配列。各ピンのラベル、型、許可されるデータタイプを定義

### OutputPins
- **型**: `TArray<FPCGPinPropertiesGPU>`
- **デフォルト値**: デフォルト出力ピン
- **カテゴリ**: Settings
- **説明**: カスタム出力ピンの配列。GPU専用の拡張プロパティを含む

### KernelSourceOverride (エディタのみ)
- **型**: `TObjectPtr<UComputeSource>`
- **デフォルト値**: `nullptr`
- **カテゴリ**: Settings
- **説明**: カーネルを外部のPCGコンピュートソースアセットでオーバーライド

### AdditionalSources (エディタのみ)
- **型**: `TArray<TObjectPtr<UComputeSource>>`
- **デフォルト値**: 空配列
- **カテゴリ**: Settings
- **説明**: カーネルで使用する追加のソースファイル

### bMuteUnwrittenPinDataErrors
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **説明**: 初期化されていないデータエラーをミュート

### ShaderFunctions (エディタのみ)
- **型**: `FString`
- **デフォルト値**: `"/** CUSTOM SHADER FUNCTIONS **/\n"`
- **説明**: ソースから呼び出せるオプショナルな関数。HLSLソースエディタウィンドウで編集

### ShaderSource (エディタのみ)
- **型**: `FString`
- **デフォルト値**: 空文字列
- **説明**: カーネル本体を形成するシェーダーコード。HLSLソースエディタウィンドウで編集

### InputDeclarations (エディタのみ、Transient)
- **型**: `FString`
- **説明**: 入力データアクセサ。HLSLソースエディタウィンドウで表示（自動生成）

### OutputDeclarations (エディタのみ、Transient)
- **型**: `FString`
- **説明**: 出力データアクセサ。HLSLソースエディタウィンドウで表示（自動生成）

### HelperDeclarations (エディタのみ、Transient)
- **型**: `FString`
- **説明**: ヘルパーデータと関数。HLSLソースエディタウィンドウで表示（自動生成）

## 入力ピン

動的に設定されます（`InputPins` プロパティで定義）。デフォルトではポイントデータ入力ピンが1つあります。

## 出力ピン

動的に設定されます（`OutputPins` プロパティで定義）。デフォルトではポイントデータ出力ピンが1つあります。

## 使用例

### 基本的なポイント変換

```hlsl
// KernelType = PointProcessor
// ShaderSource:

// 各ポイントの高さを2倍にする
void Execute(uint Index)
{
    float3 Position = ReadPosition(0, Index);
    Position.z *= 2.0;
    WritePosition(0, Index, Position);
}
```

### ポイント生成

```hlsl
// KernelType = PointGenerator
// PointCount = 100
// ShaderSource:

// グリッド状にポイントを生成
void Execute(uint Index)
{
    uint GridSize = 10;
    uint X = Index % GridSize;
    uint Y = Index / GridSize;

    float3 Position = float3(X * 100.0, Y * 100.0, 0.0);
    WritePosition(0, Index, Position);

    float Density = 1.0;
    WriteDensity(0, Index, Density);
}
```

### カスタム属性の計算

```hlsl
// KernelType = PointProcessor
// ShaderSource:

void Execute(uint Index)
{
    // 位置を読み取る
    float3 Position = ReadPosition(0, Index);

    // 原点からの距離を計算
    float Distance = length(Position);

    // カスタム属性として書き込む
    WriteFloat(0, Index, "DistanceFromOrigin", Distance);
}
```

## 実装の詳細

### CreateElement メソッド

正しく設定された Custom HLSL ノードは、`FPCGCustomHLSLElement` ではなく、コンピュートグラフエレメントに置き換えられます。`FPCGCustomHLSLElement::ExecuteInternal` は、ノードが正しく設定されていない場合のフォールバックとしてのみ呼び出されます。

### シェーダーのコンパイル

`CreateKernels` メソッドは、シェーダーコードをコンパイルしてGPUカーネルを生成します:

1. **宣言の更新**: 入力/出力ピンに基づいてデータアクセサを生成
2. **ソースの結合**: ShaderFunctions + InputDeclarations + OutputDeclarations + HelperDeclarations + ShaderSource
3. **カーネルの作成**: コンパイルされたシェーダーからカーネルオブジェクトを生成
4. **エッジの設定**: ピン接続に基づいてデータフローエッジを設定

### データアクセサの自動生成

エディタは、ピン設定に基づいて以下のようなアクセサ関数を自動生成します:

```hlsl
// 入力ポイントデータの読み取り
float3 ReadPosition(uint PinIndex, uint ElementIndex);
float ReadDensity(uint PinIndex, uint ElementIndex);
float ReadFloat(uint PinIndex, uint ElementIndex, String AttributeName);

// 出力ポイントデータの書き込み
void WritePosition(uint PinIndex, uint ElementIndex, float3 Position);
void WriteDensity(uint PinIndex, uint ElementIndex, float Density);
void WriteFloat(uint PinIndex, uint ElementIndex, String AttributeName, float Value);
```

## パフォーマンス考慮事項

1. **GPU実行**: すべての計算がGPUで実行されるため、大量のデータ処理で大幅な高速化が期待できます
2. **データ転送**: CPUとGPU間のデータ転送がボトルネックになる可能性があります
3. **シェーダーのコンパイル**: 初回実行時やコード変更時にコンパイルオーバーヘッドが発生します
4. **スレッドグループの最適化**: 適切なスレッド数の設定がパフォーマンスに影響します
5. **メモリアクセスパターン**: 連続的なメモリアクセスがパフォーマンス向上につながります

## プリコンフィグ設定

このノードは複数のプリコンフィグテンプレートを提供します:
- Point Processor
- Point Generator
- Texture Processor
- Texture Generator
- Custom

これらのテンプレートは、異なるユースケースに合わせた初期設定を提供します。

## シェーダーソースエディタ

エディタでは、専用のHLSLソースエディタウィンドウが提供され、以下が可能です:
- **シェーダーコードの編集**: シンタックスハイライト付き
- **宣言の表示**: 自動生成されたアクセサ関数の確認
- **エラー表示**: コンパイルエラーの即座のフィードバック
- **外部ソースの管理**: 追加ソースファイルの追加/削除

## 関連ノード

- **Generate Grass Maps**: 別のGPU実行ノード
- **Point From Mesh**: CPUでのポイント生成
- **Execute Blueprint**: カスタムロジックの実行（CPU）

## 注意事項

- このノードは**実験的機能**です
- オーバーライド可能なパラメータはサポートされていません (`HasOverridableParams` が false)
- シードを使用します (`UseSeed` が true)
- すべての入力ピンが実行に必要です (`IsInputPinRequiredByExecution` が true)
- エディタのみの機能（シェーダー編集）はランタイムでは使用できません

## デバッグとトラブルシューティング

### シェーダーコンパイルエラー

コンパイルエラーは、エディタのアウトプットログに詳細が表示されます。一般的なエラー:
- 構文エラー
- 未定義の関数や変数
- 型の不一致

### データの初期化エラー

`bMuteUnwrittenPinDataErrors = false` の場合、書き込まれていない出力データがエラーとして報告されます。すべての出力ピンデータを適切に初期化してください。

### パフォーマンスの問題

- スレッド数が多すぎる/少なすぎる場合、パフォーマンスが低下する可能性があります
- GPUプロファイラを使用してボトルネックを特定してください

## ベストプラクティス

1. **小さく始める**: シンプルなカーネルから始めて、徐々に複雑にする
2. **プリコンフィグを活用**: 適切なテンプレートから開始する
3. **エラー処理**: すべての出力データを初期化する
4. **コメント**: 複雑なシェーダーコードにはコメントを追加する
5. **外部ソース**: 再利用可能なコードは外部ソースファイルに分離する
