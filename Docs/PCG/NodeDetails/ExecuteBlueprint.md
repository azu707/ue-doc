# Execute Blueprint

## 概要

Execute Blueprintノードは、カスタムBlueprint Elementを実行してPCGグラフ内でBlueprint（BP）ロジックを統合します。PCGBlueprintElementクラスを継承したBlueprintを指定し、そのロジックをPCGパイプラインで実行できます。

## 機能詳細

このノードは、Blueprint（ビジュアルスクリプティング）を使用してカスタムPCG処理を実装できる非常に柔軟なノードです。C++を使用せずに独自のPCGノードを作成できます。

### 処理フロー

1. **Blueprint Elementの指定**: `BlueprintElementType`にPCGBlueprintElementクラスを設定
2. **インスタンス化**: Blueprint Elementのインスタンスを作成
3. **実行**: BlueprintのExecute関数またはExecuteWithContext関数を呼び出し
4. **結果の出力**: Blueprintが生成したデータを出力

### Blueprint Element の実装

PCGBlueprintElementを継承したBlueprintクラスで、以下の関数を実装できます:

#### 主要な実行関数

**Execute** または **ExecuteWithContext**:
- メインの実行ロジック
- 入力データを処理して出力データを生成

#### ループ関数（オプション）

**Point Loop**:
- 各ポイントを順次処理
- PointLoopBody関数を実装

**Variable Loop**:
- 各ポイントから可変数のポイントを生成
- VariableLoopBody関数を実装

**Nested Loop**:
- 2つのポイントデータ間でネストループ
- NestedLoopBody関数を実装

**Iteration Loop**:
- 固定回数のループ
- IterationLoopBody関数を実装

## プロパティ

### BlueprintElementType
- **型**: `TSubclassOf<UPCGBlueprintElement>`
- **オーバーライド可能**: いいえ
- **説明**: 実行するBlueprintElementのクラス
  - PCGBlueprintElementを継承したBlueprintクラスを指定

### BlueprintElementInstance
- **型**: `UPCGBlueprintElement*`（Instanced）
- **オーバーライド可能**: いいえ（Blueprintのプロパティとして表示）
- **説明**: Blueprint Elementのインスタンス
  - Blueprintで定義したプロパティがここに表示される
  - `ShowOnlyInnerProperties`により、内部プロパティのみ表示

### CustomInputPins
- **型**: `TArray<FPCGPinProperties>`
- **説明**: カスタム入力ピンの定義
  - Blueprintで追加の入力ピンを定義可能

### CustomOutputPins
- **型**: `TArray<FPCGPinProperties>`
- **説明**: カスタム出力ピンの定義
  - Blueprintで追加の出力ピンを定義可能

### bHasDefaultInPin
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: デフォルトの入力ピンを持つかどうか

### bHasDefaultOutPin
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: デフォルトの出力ピンを持つかどうか

### bHasDynamicPins
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 動的ピンを有効にするかどうか
  - 有効な場合、出力ピンの型は入力ピンの型の和集合になる

### Blueprint Element のプロパティ

#### bIsCacheable
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 結果をキャッシュ可能かどうか
  - `true`: 同じ入力と設定で結果を再利用
  - `false`: 毎回実行（デフォルト）
- **注意**: 外部データへのアクセスや副作用がある場合は`false`

#### bComputeFullDataCrc
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 完全なデータCRCを計算するかどうか
  - キャッシュ不可だが結果が一貫している場合、下流のキャッシュに役立つ

#### bRequiresGameThread
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: ゲームスレッドでの実行が必要かどうか
  - `true`: メインスレッドでのみ実行
  - `false`: ワーカースレッドで実行可能

## 使用例

### 基本的なBlueprint Element

```blueprint
// PCGBlueprintElementを継承したBlueprint

Function: Execute
  Input: const FPCGDataCollection& Input
  Output: FPCGDataCollection& Output

  実装:
    - Inputから データを取得
    - カスタムロジックを実行
    - Outputにデータを追加
```

### Point Loop の使用

```blueprint
Function: PointLoopBody
  Input:
    - const FPCGPoint& InPoint
    - FPCGPoint& OutPoint
  Return: bool (ポイントを保持するか)

  実装:
    - InPointの属性を読み取る
    - 条件判定
    - OutPointを設定
    - true/falseを返す
```

### カスタム入力/出力ピン

```blueprint
Blueprint Element プロパティ:
  CustomInputPins:
    - Name: "Secondary"
      Type: PointData

  CustomOutputPins:
    - Name: "Accepted"
      Type: PointData
    - Name: "Rejected"
      Type: PointData
```

### ノードのカスタマイズ

```blueprint
Function: NodeTitleOverride
  Return: FName

Function: NodeColorOverride
  Return: FLinearColor

Function: NodeTypeOverride
  Return: EPCGSettingsType
```

### 典型的な用途

- **カスタムロジック**: C++を書かずに独自の処理を実装
- **プロトタイピング**: 迅速なアイデアの検証
- **ゲーム固有の処理**: プロジェクト固有のPCGノード
- **外部システム統合**: Blueprintから他のシステムにアクセス
- **条件分岐**: 複雑な条件に基づくデータ処理

## PCGBlueprintElement の主要関数

### Execute / ExecuteWithContext
メインの実行関数。入力データを処理して出力データを生成。

### ループヘルパー関数

#### PointLoop
全ポイントに対してPointLoopBodyを実行（1:1マッピング）

#### VariableLoop
全ポイントに対してVariableLoopBodyを実行（1:N マッピング）

#### NestedLoop
2つのポイントデータ間でNestedLoopBodyを実行（O×I マッピング）

#### IterationLoop
固定回数IterationLoopBodyを実行（N回）

### ユーティリティ関数

#### GetSeed
シードを取得

#### GetRandomStream
ランダムストリームを取得

#### GetContext
実行コンテキストを取得

## 実装の詳細

### クラス構成

```cpp
// Blueprintで実装する基底クラス
class UPCGBlueprintElement : public UObject (Abstract, Blueprintable)

// Execute Blueprintノードの設定クラス
class UPCGBlueprintSettings : public UPCGSettings

// 実行コンテキスト
struct FPCGBlueprintExecutionContext : public FPCGContext

// 実行エレメント
class FPCGExecuteBlueprintElement : public IPCGElement
```

### ピン構成

**入力ピン**:
- オプションのデフォルト入力ピン（`bHasDefaultInPin`）
- カスタム入力ピン（`CustomInputPins`）

**出力ピン**:
- オプションのデフォルト出力ピン（`bHasDefaultOutPin`）
- カスタム出力ピン（`CustomOutputPins`）

### Blueprintのライフサイクル

1. **PostLoad**: Blueprintの読み込み後
2. **Initialize**: 実行前の初期化
3. **Execute/ExecuteWithContext**: メイン実行
4. **PostExecute**: 実行後のクリーンアップ
5. **BeginDestroy**: 破棄時

### キャッシュとCRC

- **IsCacheable**: Blueprint Elementの`bIsCacheable`または`IsCacheableOverride`に依存
- **ShouldComputeFullDataCrc**: `bComputeFullDataCrc`に基づく

### マルチスレッディング

- **メインスレッド**: `bRequiresGameThread = true`の場合
- **ワーカースレッド**: `bRequiresGameThread = false`の場合可能
- **ループ関数**: 常にマルチスレッドセーフ（設計上）

### エディタ統合

#### Preconfigured Settings
- 事前設定された設定を提供可能
- ライブラリに複数のバリアントとして公開

#### Actor Tracking
- `TrackedActorTags`で特定のアクターを追跡
- アクターの変更でPCGを再実行

#### ダブルクリック
- ノードのダブルクリックでBlueprintを開く

## パフォーマンス考慮事項

- **Blueprint実行コスト**: C++より遅い
- **キャッシュ**: 可能な場合は`bIsCacheable = true`
- **ゲームスレッド**: 必要な場合のみ`bRequiresGameThread = true`
- **ループ関数**: 大量のポイントに対して効率的

## 注意事項

1. **パフォーマンス**: BlueprintはC++より遅いため、重い処理には不向き
2. **キャッシュ**: 副作用がある場合は`bIsCacheable = false`
3. **スレッド**: UIアクセスなどはゲームスレッドが必要
4. **ループ関数**: マルチスレッドセーフな実装が必要
5. **デバッグ**: Blueprintデバッガーを使用可能

## Blueprintの作成手順

1. PCGBlueprintElementを継承した新しいBlueprintクラスを作成
2. Execute関数またはループ関数を実装
3. 必要に応じてCustomInputPins/CustomOutputPinsを設定
4. PCGグラフにExecute Blueprintノードを追加
5. BlueprintElementTypeに作成したBlueprintクラスを設定
6. Blueprintのプロパティを調整

## 関連ノード

- **Subgraph**: サブグラフの実行（再利用可能なPCGグラフ）
- **Loop**: ループ処理
- **Apply On Object**: オブジェクトに対する処理適用

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGExecuteBlueprint.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGExecuteBlueprint.cpp`
- **カテゴリ**: Blueprint
