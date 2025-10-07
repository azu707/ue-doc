# Get PCG Component Data

## 概要

Get PCG Component Dataノードは、選択されたアクター上の他のPCGコンポーネントからデータのコレクションを構築するノードです。他のPCGコンポーネントの生成済み出力を取得し、それを現在のPCGグラフで再利用できます。各出力には、収集元のグリッドサイズを示すタグが自動的に付与されます（"PCG_GridSize_"プレフィックス付き、例: "PCG_GridSize_12800"）。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetPCGComponentSettings`
**エレメント**: `FPCGDataFromActorElement`（基底クラスのエレメントを使用）
**基底クラス**: `UPCGDataFromActorSettings`

## 機能詳細

このノードの主な特徴:

1. **他のPCGコンポーネントからのデータ取得**: 同じアクターまたは他のアクター上のPCGコンポーネントの出力を取得
2. **グリッドサイズの自動タグ付け**: パーティション化されたPCGコンポーネントの場合、グリッドサイズ情報がタグとして追加される
3. **循環依存の防止**: コンポーネントは自身や実行コンテキスト内の他のコンポーネントからデータを取得できない
4. **データの再利用**: 既に生成されたPCGデータを別のグラフで利用可能

## プロパティ

基本的なプロパティは`UPCGDataFromActorSettings`から継承されます。Get PCG Component Data特有の動作:

### ActorSelector (FPCGActorSelectorSettings)
データを収集するPCGコンポーネントを持つアクターを選択します。
- **型**: `FPCGActorSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### ComponentSelector (FPCGComponentSelectorSettings)
どのPCGコンポーネントからデータを収集するかを選択します。
- **型**: `FPCGComponentSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### Mode (自動設定)
このノードでは、Modeは自動的に以下のいずれかに設定されます:
- `GetDataFromPCGComponent`: PCGコンポーネントからのみデータを取得
- `GetDataFromPCGComponentOrParseComponents`: PCGコンポーネントからの取得を試み、失敗した場合はコンポーネント解析にフォールバック

**注**: このノードではMode設定UIは非表示になっています（`DisplayModeSettings() = false`）

### bComponentsMustOverlapSelf (bool)
ソースコンポーネントのバウンドとオーバーラップするコンポーネントからのみデータを取得します。
- **型**: `bool`
- **デフォルト値**: `true`（基底クラス）
- **カテゴリ**: Data Retrieval Settings

### bGetDataOnAllGrids (bool)
パーティション化されたPCGコンポーネントがある場合、すべてのグリッドサイズからデータを取得します。
- **型**: `bool`
- **デフォルト値**: `true`（基底クラス）
- **カテゴリ**: Data Retrieval Settings

### AllowedGrids (int32)
`bGetDataOnAllGrids`がfalseの場合、収集対象とするグリッドサイズを選択します。
- **型**: `int32` (ビットマスク)
- **デフォルト値**: `EPCGHiGenGrid::Uninitialized`
- **カテゴリ**: Data Retrieval Settings

### ExpectedPins (TArray&lt;FName&gt;)
見つかったコンポーネントの出力ピン名と照合するピン名のリスト。
- **型**: `TArray<FName>`
- **カテゴリ**: Data Retrieval Settings
- **説明**: 名前が一致した場合、データは自動的に対応するピンに接続されます。一致しないデータは標準のOutピンに出力されます。

### bAlsoOutputSinglePointData (bool)
PCGコンポーネントデータに加えて、アクター位置の単一ポイントデータも出力します。
- **型**: `bool`
- **デフォルト値**: `false`（基底クラス）
- **カテゴリ**: Data Retrieval Settings

## 使用例

### 例1: 他のアクターのPCGデータを取得
```
Get PCG Component Data:
  ActorSelector.ActorSelection = ByTag
  ActorSelector.Tag = "DataSource"
  bGetDataOnAllGrids = true
  bComponentsMustOverlapSelf = true
```
出力タグ例: "PCG_GridSize_12800", "PCG_GridSize_6400"

### 例2: 特定のグリッドサイズのみを取得
```
Get PCG Component Data:
  ActorSelector.ActorSelection = ByName
  bGetDataOnAllGrids = false
  AllowedGrids = (12800 | 6400) // 特定のグリッドサイズのみ
```

### 例3: 名前付きピンとのマッチング
```
Get PCG Component Data:
  ExpectedPins = ["Trees", "Rocks", "Grass"]
  → ソースコンポーネントの"Trees"ピンのデータは"Trees"ピンに出力
  → その他のデータは"Out"ピンに出力
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (Any)**: 収集されたPCGコンポーネントデータ
  - **型**: `EPCGDataType::Any`
  - **複数接続**: 可能
  - **複数データ**: 可能
- **動的ピン**: `ExpectedPins`で指定された名前のピンが自動的に追加される

### データフィルター
```cpp
virtual EPCGDataType GetDataFilter() const override { return EPCGDataType::Any; }
```
すべてのデータタイプを受け入れます（PCGコンポーネントは任意のタイプのデータを出力できるため）。

### コンストラクタ
```cpp
UPCGGetPCGComponentSettings::UPCGGetPCGComponentSettings()
{
    // デフォルト設定（基底クラスから継承）
}
```

### モード設定の非表示
```cpp
#if WITH_EDITOR
virtual bool DisplayModeSettings() const override { return false; }
#endif
```

### グリッドサイズタグの自動付与

PCGコンポーネントからデータを取得する際、以下の形式でタグが自動的に追加されます:

```cpp
FString GridSizeTag = FString::Printf(TEXT("PCG_GridSize_%d"), GridSize);
// 例: "PCG_GridSize_12800"
```

これにより、どのグリッドサイズから取得されたデータかを識別できます。

### 循環依存の防止

```cpp
// 注意: コンポーネントは以下からデータを取得できません:
// 1. 自分自身
// 2. 実行コンテキスト内の他のコンポーネント
// これは循環依存を作成する可能性があるためです
```

実装では、以下のチェックが行われます:
- 自身のPCGコンポーネントをスキップ
- 現在の実行コンテキストに含まれるコンポーネントをスキップ

### データ収集のフロー

1. **アクター検索**: `ActorSelector`を使用して対象アクターを検索
2. **コンポーネント検索**: 各アクター上のPCGコンポーネントを検索
3. **フィルタリング**:
   - 自身と実行コンテキスト内のコンポーネントを除外
   - `bComponentsMustOverlapSelf`が有効な場合、バウンドチェック
   - `AllowedGrids`に基づいてグリッドサイズをフィルタリング
4. **データ取得**: 各コンポーネントの生成済みデータを取得
5. **タグ付け**: グリッドサイズタグを追加
6. **ピン振り分け**: `ExpectedPins`に基づいて適切な出力ピンに振り分け

### パフォーマンス考慮事項

1. **データの再利用**: PCGコンポーネントのキャッシュされた出力を再利用するため、再計算は不要
2. **バウンドチェック**: `bComponentsMustOverlapSelf = true`の場合、不要なデータの取得を回避
3. **グリッドフィルタリング**: `bGetDataOnAllGrids = false`で必要なグリッドのみを取得

### 動的依存関係

他のPCGコンポーネントの実行完了を待つ必要があるため、動的タスク依存関係が作成されます:

```cpp
// 基底クラスのProcessActors実装
TArray<FPCGTaskId> OutDynamicDependencies;
// ソースコンポーネントの実行完了を待機
```

### 出力データの構造

```cpp
FPCGTaggedData
{
    Data: UPCGData* (元のコンポーネントから取得)
    Tags: ["PCG_GridSize_XXXXX", ...その他のタグ]
    Pin: "Out" または ExpectedPinsで指定された名前
}
```

## 注意事項

### 循環依存に関する警告

以下のような設定は循環依存を引き起こすため、使用できません:

```cpp
// NG: 自分自身からデータを取得しようとする
ActorSelector.ActorFilter = Self

// NG: 相互に依存するコンポーネント
ComponentA -> Get PCG Component Data (ComponentB)
ComponentB -> Get PCG Component Data (ComponentA)
```

### 実行順序

PCGコンポーネント間の実行順序は自動的に管理されますが、以下の点に注意:

1. **データの可用性**: ソースコンポーネントが実行されていない場合、データは取得できません
2. **動的依存関係**: 自動的にタスク依存関係が設定されますが、複雑な依存関係は避けることを推奨

### グリッドサイズの管理

パーティション化されたPCGシステムで使用する場合:

1. **タグの確認**: 出力タグを確認して正しいグリッドサイズのデータが取得されているか確認
2. **フィルタリング**: 必要なグリッドサイズのみを取得してパフォーマンスを最適化

## 関連ノード
- Get Actor Data (基底クラス)
- Data From PCG Component (類似機能)
- Attribute Filter (グリッドサイズタグでのフィルタリング)
