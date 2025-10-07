# Print String

## 概要
Print Stringノードは、指定されたメッセージをログ、グラフ、および/または画面に出力します。PCGグラフのデバッグと情報表示に使用される重要なツールです。

- **ノードタイプ**: Debug
- **クラス**: `UPCGPrintElementSettings`
- **エレメント**: `FPCGPrintElement`

## 機能詳細
このノードは、カスタマイズ可能なメッセージをさまざまな出力先に表示します。動的ピンをサポートし、柔軟なプレフィックス設定とログレベルの制御が可能です。

### 主な機能
- **複数の出力先**: ログ、ノード、画面への出力
- **可変ログレベル**: Log、Warning、Error、Displayから選択
- **プレフィックスのカスタマイズ**: オーナー、コンポーネント、グラフ、ノード名を自動付加
- **コンポーネント単位の出力**: 各PCGコンポーネントごとに個別のメッセージ
- **動的ピン**: 実行時にピンを追加可能
- **マネージドメッセージ**: グラフ上のメッセージはリソースとして管理され、再生成時に自動削除

### 処理フロー
1. 入力データを取得
2. プレフィックスを構築（オプション）
3. メッセージを組み立て
4. 指定された出力先にメッセージを送信
5. 入力データを出力にパススルー

## プロパティ

### PrintString
- **型**: FString
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: MultiLine, PCG_Overridable
- **説明**: ログ、グラフ、画面に出力するコアメッセージ

### Verbosity
- **型**: EPCGPrintVerbosity
- **デフォルト値**: Log
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 出力メッセージの詳細レベル
  - `NoLogging`: 出力しない
  - `Log`: 通常のログ
  - `Warning`: 警告
  - `Error`: エラー
  - `Display`: 表示メッセージ

### CustomPrefix
- **型**: FString
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: コアメッセージの前に追加されるカスタムプレフィックス

### bDisplayOnNode
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 警告またはエラーをこのノード上に表示するかどうか

### bPrintPerComponent
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: コンポーネントをキーハッシュの一部として使用し、このノードを持つ各コンポーネントごとにメッセージを出力します

### bPrintToScreen
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable（エディタのみ）
- **説明**: メッセージをエディタビューポートに出力するかどうか

### PrintToScreenDuration
- **型**: double
- **デフォルト値**: 15.0
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, EditCondition = bPrintToScreen, ClampMin = 0.0
- **説明**: 画面上のメッセージの表示時間（秒）

### PrintToScreenColor
- **型**: FColor
- **デフォルト値**: Cyan
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, EditCondition = bPrintToScreen
- **説明**: 画面上のメッセージの色

### bPrefixWithOwner
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `bPrintPerComponent`
- **説明**: メッセージにコンポーネントのオーナー名をプレフィックスとして追加

### bPrefixWithComponent
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `bPrintPerComponent`
- **説明**: メッセージにコンポーネント名をプレフィックスとして追加

### bPrefixWithGraph
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **表示条件**: `bPrintPerComponent`
- **説明**: メッセージにグラフ名をプレフィックスとして追加

### bPrefixWithNode
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: メッセージにノード名をプレフィックスとして追加

### bEnablePrint
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: このノードの機能を有効にします。無効にすると出力をバイパスします

## 使用例

### 基本的なログ出力
```
// シンプルなメッセージをログに出力
PrintString: "Point generation completed"
Verbosity: Log
結果: ログに "Point generation completed" が出力される
```

### 警告メッセージ
```
// 警告としてメッセージを出力
PrintString: "Point count is low"
Verbosity: Warning
bDisplayOnNode: true
結果: ログに警告が表示され、ノードにも警告アイコンが表示される
```

### 画面へのデバッグ表示
```
// ビューポートにメッセージを表示
PrintString: "Current iteration: 5"
bPrintToScreen: true
PrintToScreenDuration: 10.0
PrintToScreenColor: Green
結果: 10秒間、緑色のメッセージがビューポートに表示される
```

### コンテキスト情報付きメッセージ
```
// 詳細なプレフィックス付きメッセージ
PrintString: "Processing started"
bPrefixWithOwner: true
bPrefixWithComponent: true
bPrefixWithGraph: true
bPrefixWithNode: true
結果: "[Owner][Component][Graph][Node] Processing started" のように出力
```

### カスタムプレフィックス
```
// カスタムプレフィックスを追加
PrintString: "Value out of range"
CustomPrefix: "[VALIDATION ERROR]"
Verbosity: Error
結果: "[VALIDATION ERROR] Value out of range" がエラーとして出力
```

### 条件付き出力
```
// 属性値に基づいて動的にメッセージを変更
PrintString: (属性から取得)
bEnablePrint: (条件に基づいて設定)
結果: 条件に応じてメッセージを出力
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（任意の型、複数接続可）: パススルーされるデータ
  - 動的ピン（オプション）
- **出力ピン**:
  - "Out"（任意の型）: 入力データをそのまま出力

### 処理の特徴
- **メインスレッド実行**: `CanExecuteOnlyOnMainThread()` が `true` を返す（画面出力のため）
- **キャッシュ不可**: `IsCacheable()` が `false` を返す
- **動的ピン**: `HasDynamicPins()` が `true` を返す
- **ベースポイントデータ対応**: `SupportsBasePointDataInputs()` が `true` を返す

### メッセージ管理
`UPCGManagedDebugStringMessageKey` を使用して、グラフ上のメッセージをマネージドリソースとして追跡します。これにより、再生成やクリーンアップ時にメッセージが自動的に削除されます。

### ハッシュキー
bPrintPerComponentが有効な場合、コンポーネントをハッシュキーの一部として使用し、各コンポーネントごとに個別のメッセージを管理します。

## パフォーマンス考慮事項

1. **出力頻度**: 頻繁に実行されるグラフでのPrint String使用は注意が必要
2. **画面出力**: bPrintToScreenは画面描画のオーバーヘッドがあります
3. **メッセージ管理**: 多数のコンポーネントでbPrintPerComponentを使用するとメモリ使用量が増加
4. **文字列構築**: 長いプレフィックスや複雑なメッセージは処理時間が増加
5. **ログ出力**: 大量のログ出力はI/Oボトルネックになる可能性があります

## 注意事項

1. **シッピングビルド**: デバッグノードはシッピングビルドでは機能しません
2. **パフォーマンス影響**: 最終ビルドではPrint Stringノードを削除または無効化することを推奨
3. **画面出力の制限**: bPrintToScreenはエディタでのみ利用可能
4. **ログのフラッディング**: 大量のメッセージはログを見づらくします
5. **文字列エンコーディング**: 特殊文字や非ASCII文字の扱いに注意

## デバッグワークフロー

### 1. 実行確認
ノードが実行されたことを確認するため、Print Stringを配置。

### 2. 値の確認
属性値や計算結果をPrint Stringで出力し、期待通りか確認。

### 3. 条件分岐のトレース
条件分岐の各パスにPrint Stringを配置し、どのパスが実行されたか確認。

### 4. エラー検出
異常な状態や予期しない値を検出した際にWarningやErrorを出力。

### 5. プロファイリング
各処理ステージにPrint Stringを配置し、実行順序と時間を把握。

## Verbosityレベルの使い分け

### Log
通常の情報メッセージ。デバッグや進捗状況の報告に使用。

### Warning
注意が必要な状況。データの欠落、範囲外の値など。

### Error
エラー状態。処理の失敗、無効なデータなど。

### Display
重要な情報メッセージ。ユーザーに確実に伝えたい情報。

### NoLogging
出力を完全に無効化。デバッグノードを残したまま出力を停止。

## トラブルシューティング

### メッセージが表示されない
- bEnablePrintが有効か確認
- Verbosityが適切に設定されているか確認
- ノードが実行されているか確認

### 画面に表示されない
- bPrintToScreenが有効か確認
- エディタで実行しているか確認
- ビューポートが表示されているか確認

### ログが見つからない
- Output Logウィンドウが開いているか確認
- ログレベルフィルタを確認
- カテゴリフィルタを確認

## 関連ノード
- **Debug**: データを可視化
- **Visualize Attribute**: 属性値を画面に表示
- **Print Grammar**: グラマーの解釈結果を出力
- **Sanity Check Point Data**: データの整合性をチェック

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPrintElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGPrintElement.cpp`
- **マネージドリソース**: `UPCGManagedDebugStringMessageKey`
