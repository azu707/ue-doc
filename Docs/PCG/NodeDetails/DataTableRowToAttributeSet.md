# Data Table Row To Attribute Set

## 概要

Data Table Row To Attribute Setノードは、Unreal EngineのDataTableアセットから特定の行を読み込み、その行のすべての列データをPCGアトリビュートセット(Param Data)として出力するノードです。DataTableの構造化されたデータをPCGシステムで利用可能な形式に変換します。

## 機能詳細

このノードは以下の処理を実行します:

1. **DataTableの非同期/同期ロード**: 指定されたDataTableアセットをロードします(デフォルトは非同期)
2. **行の取得**: `RowName`で指定された行をDataTableから検索します
3. **属性の自動生成**: 行内のすべてのプロパティを自動的にPCGメタデータの属性として作成します
4. **型変換**: DataTableの各フィールドタイプをPCGでサポートされている型に変換します
5. **ParamDataの出力**: すべての属性を含むParamDataとして出力します

### 処理フロー

1. **PrepareDataInternal**: DataTableアセットのロードをリクエストします
2. **ExecuteInternal**:
   - ロードされたDataTableから指定行を取得
   - 行のすべてのフィールドを反復処理
   - 各フィールドをメタデータ属性として設定
   - ParamDataオブジェクトを作成して出力

## プロパティ

### RowName
- **型**: `FName`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `NAME_None`
- **説明**: DataTableから取得する行の名前を指定します。この名前がDataTableの行名と一致する必要があります。

### DataTable
- **型**: `TSoftObjectPtr<UDataTable>`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **エイリアス**: PathOverride (旧バージョンとの互換性のため)
- **説明**: 読み込むDataTableアセットへの参照。ソフトオブジェクトポインタとして実装されており、必要になるまでロードされません。

### bSynchronousLoad
- **型**: `bool`
- **カテゴリ**: Settings|Debug
- **デフォルト値**: `false`
- **説明**: DataTableのロード方式を制御します。
  - `false` (デフォルト): 非同期ロード - パフォーマンスに優れていますが、ロード完了まで待機が必要
  - `true`: 同期ロード - すぐにロードされますが、メインスレッドをブロックする可能性があります

## 使用例

### 基本的な使用方法

1. DataTableアセットを用意し、構造体に基づいて行を定義
2. Data Table Row To Attribute Setノードを追加
3. `DataTable`プロパティにDataTableアセットを設定
4. `RowName`に取得したい行の名前を設定
5. 出力されたParamDataを他のPCGノードで使用

### 典型的なユースケース

- **設定データの読み込み**: レベル固有の設定値をDataTableから読み込む
- **パラメータセットの管理**: 複数の設定をDataTableで管理し、必要な設定を行名で選択
- **データ駆動型生成**: DataTableで定義されたパラメータに基づいてPCGグラフを動作させる

## 実装の詳細

### クラス構成

#### UPCGDataTableRowToParamDataSettings
- 継承: `UPCGSettings`
- 設定を保持し、エレメントを作成する責任を持ちます
- ピン構成: 入力ピンなし、Param型の出力ピン1つ

#### FPCGDataTableRowToParamDataContext
- 継承: `FPCGContext`, `IPCGAsyncLoadingContext`
- 非同期ロード機能をサポートするコンテキスト

#### FPCGDataTableRowToParamData
- 継承: `IPCGElementWithCustomContext<FPCGDataTableRowToParamDataContext>`
- 実際の処理を実行するエレメント
- メインスレッドでのみ実行可能 (`CanExecuteOnlyOnMainThread` = true)
- キャッシュ不可 (`IsCacheable` = false)

### 重要な実装ポイント

1. **動的トラッキング**: DataTableプロパティがピンでオーバーライドされた場合、動的トラッキングを登録し、DataTableの変更を検出します

2. **属性の自動作成**: `SetAttributeFromDataProperty`メソッドを使用して、DataTableのプロパティタイプを自動的にPCGメタデータ属性タイプに変換します

3. **エラーハンドリング**:
   - DataTableが無効な場合: 警告ログを出力して処理を続行
   - 指定された行が見つからない場合: エラーログを出力して処理を続行
   - サポートされていないプロパティタイプ: 警告ログを出力してその属性をスキップ

4. **非推奨プロパティの処理**: `PathOverride_DEPRECATED`から新しい`DataTable`プロパティへの移行をPostLoadで処理

### パフォーマンス考慮事項

- デフォルトで非同期ロードを使用し、ゲームスレッドのブロッキングを回避
- 小さなDataTableや即座にデータが必要な場合は`bSynchronousLoad = true`を使用
- DataTableの各フィールドを反復処理するため、大量の列を持つ行では処理時間が増加する可能性があります

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDataTableRowToParamData.h`
- **実装**: `/Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGDataTableRowToParamData.cpp`
