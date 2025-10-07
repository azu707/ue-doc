# Input Node / Output Node

## 概要

Input NodeとOutput Nodeは、PCGサブグラフのインターフェースを定義する特別なノードです。これらのノードは、サブグラフとメイングラフまたは他のサブグラフとの間でデータをやり取りするための入出力ポイントを提供します。

- **Input Node**: サブグラフへのデータ入力ポイントを定義
- **Output Node**: サブグラフからのデータ出力ポイントを定義

これらのノードは、サブグラフをモジュール化し、再利用可能なコンポーネントとして機能させるために不可欠です。

## 機能詳細

### 共通機能

1. **パススルー処理**: 入力データをそのまま出力にコピー
2. **カスタムピンの定義**: 複数のカスタムピンを追加可能
3. **ピンのプロパティ管理**: 各ピンのデータタイプ、必須/任意などを設定
4. **GPU対応**: GPUレジデントデータのサポート
5. **非キャッシュ**: 実行結果はキャッシュされません

### Input Node

- サブグラフの**出力ピン**としてカスタムピンを公開
- 親グラフからサブグラフへデータを渡す
- デフォルトピン: "In" (Spatialタイプ、高度なピン)

### Output Node

- サブグラフの**入力ピン**としてカスタムピンを公開
- サブグラフから親グラフへデータを渡す
- デフォルトピン: "Out" (Anyタイプ、高度なピン)

### 非推奨の従来型ピン

以前のバージョンでは、Input Nodeに以下の非推奨ピンが存在していました(互換性のため接続されていた場合のみ保持):
- **Input**: 汎用入力(非推奨: カスタムピンを使用推奨)
- **Actor**: アクターデータ(非推奨: Get Actor Dataノードを使用)
- **OriginalActor**: 元のアクターデータ(非推奨)
- **Landscape**: ランドスケープデータ(非推奨: Get Landscape Dataノードを使用)
- **Landscape Height**: ランドスケープ高さのみ(非推奨)

## プロパティ

### Pins
- **型**: `TArray<FPCGPinProperties>`
- **カテゴリ**: Settings
- **説明**: サブグラフのインターフェースとして公開されるカスタムピンのリスト。各ピンは以下を定義できます:
  - ピン名(Label)
  - データタイプ(AllowedTypes)
  - 複数接続の可否(bAllowMultipleConnections)
  - 複数データの可否(bAllowMultipleData)
  - ツールチップ
  - 必須/任意/高度(PinStatus)

### bIsInput (内部プロパティ)
- **型**: `bool`
- **説明**: このノードがInput Nodeか(`true`)、Output Nodeか(`false`)を示します。

### bHasAddedDefaultPin (内部プロパティ)
- **型**: `bool`
- **説明**: デフォルトピンが追加されたかどうかを追跡します。

## 使用例

### 基本的なサブグラフの作成

1. **サブグラフを作成**:
   - PCGグラフアセットを作成
   - Input NodeとOutput Nodeが自動的に追加されます

2. **カスタムピンを追加**:
   - Input Nodeの`Pins`配列にピンを追加
   - 例: "PointsIn" (Pointタイプ、必須)、"ParamsIn" (Paramタイプ、任意)

3. **処理ノードを追加**:
   - Input NodeとOutput Nodeの間に処理ノードを配置

4. **Output Nodeに接続**:
   - 処理結果をOutput Nodeのカスタムピンに接続
   - 例: "ProcessedPoints"、"Statistics"

5. **サブグラフを使用**:
   - メイングラフでSubgraphノードを追加
   - サブグラフを選択すると、定義したカスタムピンが表示されます

### カスタムピンの例

**Input Node**:
```
Pins[0]:
  Label = "Buildings"
  AllowedTypes = Spatial
  PinStatus = Required

Pins[1]:
  Label = "Density"
  AllowedTypes = Param
  PinStatus = Normal

Pins[2]:
  Label = "DebugOutput"
  AllowedTypes = Any
  PinStatus = Advanced
```

**Output Node**:
```
Pins[0]:
  Label = "GeneratedPoints"
  AllowedTypes = Point

Pins[1]:
  Label = "Statistics"
  AllowedTypes = Param
```

### サブグラフの使用

```
メイングラフ:
  [Get Actor Data] → Buildings (Subgraph: CityGenerator)
  [Create Param]  → Density
                     ↓
                   GeneratedPoints → [Static Mesh Spawner]
                   Statistics → [Debug Display]
```

### 複数データの処理

```
Input Node:
  Pins[0] = "MultipleInputs" (bAllowMultipleData = true)

サブグラフ内部:
  [Input Node] → [Loop] → [Process Each] → [Collect] → [Output Node]
```

### GPU対応サブグラフ

Input NodeとOutput Nodeは、GPUレジデントデータをサポートします。サブグラフがGPU処理を含む場合でも、データプロキシは適切に渡されます。ただし、トップレベルグラフのOutput Nodeは、GPUデータを読み戻す必要があります。

### 典型的なユースケース

- **モジュール化**: 再利用可能なロジックをサブグラフとしてカプセル化
- **複雑さの管理**: 大きなグラフを小さなサブグラフに分割
- **チーム開発**: 異なるチームメンバーが異なるサブグラフを開発
- **バージョン管理**: サブグラフごとに異なるバージョンを管理
- **テンプレート**: 共通パターンをサブグラフテンプレートとして作成

## 実装の詳細

### クラス構成

#### UPCGGraphInputOutputSettings
- 継承: `UPCGSettings`
- Input NodeとOutput Nodeの両方に使用されます
- `bIsInput`フラグで動作を切り替えます
- 隠しクラス(Hidden)、ブループリント不可(NotBlueprintable)

#### FPCGInputOutputElement
- 継承: `IPCGElement`
- 非常にシンプルな実装: 入力データを出力データにコピーするだけ
- キャッシュ不可 (`IsCacheable` = false)
- GPU対応 (`SupportsGPUResidentData`)

### 重要な実装ポイント

1. **パススルー処理**:
   ```cpp
   bool FPCGInputOutputElement::ExecuteInternal(FPCGContext* Context) const
   {
       Context->OutputData = Context->InputData;
       return true;
   }
   ```
   データは単純にコピーされ、変換は行われません。

2. **ピンの可視性制御**:
   - **Input Node**:
     - 入力ピン: `bInvisiblePin = true` (グラフエディタで非表示)
     - 出力ピン: `bInvisiblePin = false` (通常表示)
   - **Output Node**:
     - 入力ピン: `bInvisiblePin = false` (通常表示)
     - 出力ピン: `bInvisiblePin = true` (グラフエディタで非表示)

3. **GPU対応の判定**:
   ```cpp
   bool SupportsGPUResidentData(FPCGContext* InContext) const override
   {
       if (Settings->IsInput())
       {
           return true; // Input Nodeは常にGPU対応
       }
       else
       {
           // サブグラフのOutput Nodeは対応、トップグラフは非対応(読み戻し必要)
           return !Stack->IsCurrentFrameInRootGraph();
       }
   }
   ```

4. **ピン名の一意性保証**:
   `FixPinProperties`メソッドが、重複するピン名を自動的にリネームします:
   ```cpp
   // "CustomPin" → "CustomPin1", "CustomPin2", ...
   ```

5. **デフォルトピンの作成**:
   `SetInput(bool bInIsInput)`が呼ばれると、デフォルトピンが自動的に追加されます:
   - Input Node: "In" (Spatial)
   - Output Node: "Out" (Any)

6. **非推奨ピンの処理**:
   `ApplyDeprecationBeforeUpdatePins`が、接続されている非推奨ピンを保持します。

### ピンプロパティの管理

各ピンは`FPCGPinProperties`構造体で定義されます:

```cpp
struct FPCGPinProperties
{
    FName Label;                          // ピン名
    EPCGDataType AllowedTypes;            // 許可されるデータタイプ
    bool bAllowMultipleConnections;       // 複数接続可能か
    bool bAllowMultipleData;              // 複数データ可能か
    FText Tooltip;                        // ツールチップ
    bool bAdvancedPin;                    // 高度なピンか
    bool bInvisiblePin;                   // 非表示か
    EPCGPinStatus PinStatus;              // 必須/通常/高度
    // ...
};
```

### 構造変更の検出

以下の変更は構造変更(Structural Change)として扱われ、グラフの再コンパイルをトリガーします:
- Input Nodeでピンが追加/削除された場合
- Input Nodeでピンの`PinStatus`(必須性)が変更された場合

Output Nodeのピン変更は、構造変更としては扱われません(コスメティック変更のみ)。

### エラーハンドリング

1. **ピン名が"None"の場合**:
   自動的に`DefaultNewCustomPinName`("NewPin")にリネームされます。

2. **重複するピン名**:
   自動的に番号が付加されます(例: "Pin", "Pin1", "Pin2")。

### パフォーマンス考慮事項

- **オーバーヘッド最小**: データコピーのみで、実質的な処理はありません
- **GPU最適化**: GPU-CPUデータ転送を最小化
- **キャッシュなし**: 毎回実行されますが、処理コストは無視できるレベル

### サブグラフのスタック

PCGはサブグラフの呼び出しスタックを管理します(`FPCGStack`)。これにより:
- 再帰的なサブグラフ呼び出しを追跡
- 現在のフレームがルートグラフかサブグラフかを判定
- GPUデータの適切な処理を決定

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCG/Source/PCG/Public/PCGInputOutputSettings.h`
- **実装**: `/Engine/Plugins/PCG/Source/PCG/Private/PCGInputOutputSettings.cpp`

## Input NodeとOutput Nodeの違い

| 特徴 | Input Node | Output Node |
|------|-----------|-------------|
| 役割 | サブグラフへの入力 | サブグラフからの出力 |
| カスタムピン | 出力ピンとして表示 | 入力ピンとして表示 |
| デフォルトピン | "In" (Spatial) | "Out" (Any) |
| 入力ピン可視性 | 非表示 | 表示 |
| 出力ピン可視性 | 表示 | 非表示 |
| 構造変更 | ピン追加/削除で発生 | 発生しない |
| GPU読み戻し | 不要 | トップグラフでは必要 |

## 注意事項

1. **ピン名の一意性**: 各ピンは一意の名前を持つ必要があります(自動的にリネームされます)
2. **データタイプの互換性**: 接続されるピンのデータタイプが互換性があることを確認してください
3. **必須ピン**: Input Nodeで必須ピンを設定した場合、サブグラフ使用時にそのピンへの接続が必要です
4. **非推奨ピンの使用回避**: 従来型ピン(Actor, Landscape等)は使用せず、専用のGetterノードを使用してください
5. **GPU処理**: サブグラフでGPU処理を使用する場合、データフローを慎重に設計してください
6. **ノード名の編集**: Input/Output Nodeのタイトルは編集できません(`CanUserEditTitle` = false)
7. **実行依存ピンなし**: これらのノードには実行依存ピンがありません(`HasExecutionDependencyPin` = false)

## ベストプラクティス

1. **明確なピン名**: ピンの目的を明確に示す名前を使用
2. **適切なデータタイプ**: できるだけ具体的なデータタイプを指定
3. **ツールチップの活用**: 各ピンにわかりやすいツールチップを設定
4. **必須ピンの最小化**: 本当に必要なピンのみを必須に設定
5. **高度なピンの活用**: 上級ユーザー向けのオプションは高度なピンに設定
6. **ドキュメント化**: サブグラフの目的と各ピンの役割をドキュメント化
