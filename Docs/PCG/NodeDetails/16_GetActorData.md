# Get Actor Data

## 概要

Get Actor Dataノードは、選択されたアクターからPCG互換のデータコレクションを構築するための基本的なノードです。このノードはアクターのコンポーネント（プリミティブ、スプライン、ボリュームなど）を解析し、PCGで利用可能なデータとして抽出します。

**ノードタイプ**: Spatial
**クラス**: `UPCGDataFromActorSettings`
**エレメント**: `FPCGDataFromActorElement`

## 機能詳細

このノードは、指定されたアクターから複数の方法でデータを取得できます:

1. **コンポーネント解析モード**: アクターのコンポーネント（プリミティブ、スプライン、ボリューム）を解析してデータを抽出
2. **シングルポイントモード**: アクターの位置とバウンドを持つ単一ポイントを生成
3. **プロパティモード**: アクタープロパティからデータコレクションを取得
4. **PCGコンポーネントモード**: 他のPCGコンポーネントの生成出力をコピー
5. **アクター参照モード**: アクター参照のみを持つエントリを生成
6. **コンポーネント参照モード**: アクター内の各コンポーネントのエントリを生成

## プロパティ

### ActorSelector (FPCGActorSelectorSettings)
データ収集のために選択するアクターを記述します。
- **型**: `FPCGActorSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### ComponentSelector (FPCGComponentSelectorSettings)
データ収集のために選択するコンポーネントを記述します。
- **型**: `FPCGComponentSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### Mode (EPCGGetDataFromActorMode)
発見されたアクターからどのようなデータを収集するかを指定します。
- **型**: `EPCGGetDataFromActorMode`
- **デフォルト値**: `ParseActorComponents`
- **カテゴリ**: Data Retrieval Settings
- **オプション**:
  - `ParseActorComponents`: プリミティブ、スプライン、ボリュームなどの関連コンポーネントを解析
  - `GetSinglePoint`: アクターの変換とバウンドを持つ単一ポイントを生成
  - `GetDataFromProperty`: アクタープロパティからデータコレクションを取得
  - `GetDataFromPCGComponent`: 他のPCGコンポーネントの生成出力をコピー
  - `GetDataFromPCGComponentOrParseComponents`: PCGコンポーネントからのデータ取得を試み、失敗した場合はコンポーネント解析にフォールバック
  - `GetActorReference`: アクター参照のみを含むエントリを生成
  - `GetComponentsReference`: アクター内の各コンポーネントのエントリを生成

### bIgnorePCGGeneratedComponents (bool)
PCGによって生成されたコンポーネントを無視します。
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == ParseActorComponents || Mode == GetComponentsReference`

### bAlsoOutputSinglePointData (bool)
アクター位置に単一ポイントデータも出力します。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == GetDataFromPCGComponent || Mode == GetDataFromPCGComponentOrParseComponents`

### bComponentsMustOverlapSelf (bool)
ソースコンポーネントのバウンドとオーバーラップするコンポーネントからのみデータを取得します。
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == GetDataFromPCGComponent || Mode == GetDataFromPCGComponentOrParseComponents`

### bGetDataOnAllGrids (bool)
パーティション化されたPCGコンポーネントがある場合、特定のグリッドサイズではなく、すべてのグリッドサイズからデータを取得します。
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == GetDataFromPCGComponent || Mode == GetDataFromPCGComponentOrParseComponents`

### AllowedGrids (int32)
パーティション化されたPCGコンポーネントからデータを収集する際に考慮するグリッドサイズを選択します。
- **型**: `int32` (ビットマスク)
- **デフォルト値**: `EPCGHiGenGrid::Uninitialized`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `!bGetDataOnAllGrids && (Mode == GetDataFromPCGComponent || Mode == GetDataFromPCGComponentOrParseComponents)`

### bMergeSinglePointData (bool)
すべての単一ポイントデータ出力を1つの単一ポイントデータにマージします。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == GetSinglePoint || Mode == GetActorReference || Mode == GetComponentsReference`

### ExpectedPins (TArray&lt;FName&gt;)
見つかったコンポーネントの出力ピンと照合するピン名を提供します。名前の比較が成功した場合、データは自動的に期待されるピンに接続されます。
- **型**: `TArray<FName>`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == GetDataFromPCGComponent || Mode == GetDataFromPCGComponentOrParseComponents`

### PropertyName (FName)
データコレクションを作成するための、見つかったアクターのプロパティ名。
- **型**: `FName`
- **デフォルト値**: `NAME_None`
- **カテゴリ**: Data Retrieval Settings
- **適用条件**: `Mode == GetDataFromProperty`

### bAlwaysRequeryActors (bool)
trueの場合、この要素をキャッシュに保存せず、常にアクターを再クエリして最新のデータを読み取ります。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Data Retrieval Settings

### bSilenceSanitizedAttributeNameWarnings (bool)
無効な文字を置き換えるために属性名がサニタイズされたという警告を抑制します。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Data Retrieval Settings (Advanced)

### bSilenceReservedAttributeNameWarnings (bool)
予約名と衝突するために属性名が拒否されたという警告を抑制します。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Data Retrieval Settings (Advanced)

### bTrackActorsOnlyWithinBounds (bool)
エディタ専用。チェックされている場合、コンポーネントバウンド外のアクターはリフレッシュをトリガーしません。
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Data Retrieval Settings
- **エディタ専用**: はい

## 使用例

### 例1: レベル内のすべてのスプラインアクターからデータを取得
```
ActorSelector.ActorFilter = AllWorldActors
ActorSelector.ActorSelection = ByClass
ActorSelector.ActorSelectionClass = SplineActor
Mode = ParseActorComponents
```

### 例2: 特定のタグを持つアクターから単一ポイントを生成
```
ActorSelector.ActorFilter = ByTag
ActorSelector.Tag = "PCGTarget"
Mode = GetSinglePoint
bMergeSinglePointData = true
```

### 例3: 他のPCGコンポーネントからデータをコピー
```
ActorSelector.ActorSelection = ByName
Mode = GetDataFromPCGComponent
bGetDataOnAllGrids = true
bComponentsMustOverlapSelf = true
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (Any)**: 収集されたPCGデータ（複数データ、複数接続可能）
- モードによって動的にピンが追加される場合があります

### 実行フロー

1. **PrepareDataInternal**: アクターの検索とロード処理の準備
2. **ExecuteInternal**:
   - アクターセレクターを使用してアクターを検索
   - 選択されたモードに応じてデータを処理:
     - `ParseActorComponents`: コンポーネントを反復処理し、PCGデータを抽出
     - `GetSinglePoint`: アクターごとに単一ポイントを作成
     - `GetDataFromPCGComponent`: PCGコンポーネントから生成済みデータをコピー
     - `GetDataFromProperty`: リフレクションを使用してプロパティからデータを取得
     - `GetActorReference`/`GetComponentsReference`: 参照データを作成
   - 出力データにタグと属性を適用

3. **動的依存関係**: ランドスケープやPCGコンポーネントデータを待機する必要がある場合、動的タスク依存関係を作成

### キャッシュ動作
- `bAlwaysRequeryActors`がfalseの場合、結果はキャッシュされます
- 動的トラッキングをサポート（アクターの変更を検出して再実行）
- フルCRCを計算してキャッシュの正確性を確保

### 注意事項
- コンポーネントは自身や実行コンテキスト内の他のコンポーネントからコンポーネントデータを取得できません（循環依存を作成する可能性があるため）
- メインスレッドでのみ実行可能（`CanExecuteOnlyOnMainThread = true`）
- ベースポイントデータ入力をサポート（`SupportsBasePointDataInputs = true`）

## 関連ノード
- Get Landscape Data
- Get Spline Data
- Get Volume Data
- Get Primitive Data
- Get PCG Component Data
