# Get Graph Parameter

## 概要

**Get Graph Parameter**ノードは、PCGグラフで定義されたユーザーパラメータの値を取得するノードです。グラフインスタンスから指定されたパラメータの値を読み取り、属性セットとして出力します。

カテゴリ: GraphParameters
クラス名: `UPCGUserParameterGetSettings`
エレメント: `FPCGUserParameterGetElement`

## 機能詳細

このノードは、PCGグラフで定義されたユーザーパラメータを動的に取得し、グラフ実行時にパラメータ値をデータとして活用できるようにします。パラメータは事前に設定されたプロパティGUIDとプロパティ名によって識別され、グラフインスタンスから値を取得します。

### 主な特徴

- グラフインスタンスからパラメータ値を取得
- 構造体/オブジェクトのプロパティ抽出をサポート
- 属性名のサニタイズ機能
- プリコンフィグ設定による柔軟な選択
- 入力ピンなし（パラメータ取得のみ）

## プロパティ

### PropertyGuid
- **型**: `FGuid`
- **デフォルト値**: なし
- **説明**: 取得するプロパティの一意識別子。このGUIDはグラフパラメータの特定に使用されます。

### PropertyName
- **型**: `FName`
- **デフォルト値**: なし
- **説明**: 取得するプロパティの名前。エディタでの表示とデバッグに使用されます。

### bForceObjectAndStructExtraction
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **説明**: プロパティが構造体またはオブジェクトの場合、すべての互換性のあるプロパティを強制的に抽出します。メタデータでサポートされていない型の場合は自動的にtrueになります。現在、直接の子プロパティのみをサポートします（より深い階層はサポートされません）。

### bSanitizeOutputAttributeName
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **説明**: 出力属性名に特殊文字が含まれる場合、それらを削除します。これにより、属性名が他のノードで問題なく使用できるようになります。

## 入力ピン

このノードには入力ピンがありません。

## 出力ピン

動的に生成される出力ピンがあります。取得するパラメータの型に応じて、適切な属性セットが出力されます。

## 使用例

### 基本的な使用方法

1. PCGグラフでユーザーパラメータを定義します（例: `float MyParameter = 10.0`）
2. グラフエディタに「Get Graph Parameter」ノードを配置します
3. ノードのプリコンフィグメニューから取得したいパラメータを選択します
4. 出力を他のノードに接続して、パラメータ値を利用します

### 構造体プロパティの抽出

```cpp
// グラフパラメータとして定義された構造体
FVector MyVectorParameter = FVector(1.0, 2.0, 3.0);

// bForceObjectAndStructExtraction = true の場合
// 出力属性セットには以下が含まれます:
// - MyVectorParameter.X (float)
// - MyVectorParameter.Y (float)
// - MyVectorParameter.Z (float)
```

## 実装の詳細

### ExecuteInternal メソッド

`FPCGUserParameterGetElement::ExecuteInternal` は以下の処理を実行します:

1. **パラメータ情報の取得**: `PropertyGuid` と `PropertyName` を使用してグラフインスタンスからパラメータ情報を取得
2. **値の読み取り**: グラフインスタンスの PreTask データからパラメータ値を読み取り
3. **属性セットの生成**: 取得した値を属性セットとして出力データに変換
4. **構造体/オブジェクト抽出**: `bForceObjectAndStructExtraction` が true の場合、子プロパティを個別の属性として抽出
5. **属性名のサニタイズ**: `bSanitizeOutputAttributeName` が true の場合、出力属性名から特殊文字を削除

### スレッド安全性

このノードは**メインスレッドでのみ実行**されます (`CanExecuteOnlyOnMainThread` が true を返す)。これは、グラフパラメータへのアクセスがスレッドセーフではないためです。

### キャッシング

このノードは**キャッシュ不可**です (`IsCacheable` が false を返す)。これは、パラメータ値が実行時に変更される可能性があるためです。

### データの前処理要件

このノードは `RequiresDataFromPreTask()` で true を返します。これは、グラフパラメータ情報が事前処理タスクから提供される必要があることを示しています。

## パフォーマンス考慮事項

1. **メインスレッド実行**: グラフパラメータアクセスはメインスレッドでのみ実行されるため、大量のパラメータ取得がパフォーマンスに影響を与える可能性があります
2. **キャッシュ不可**: 毎回実行時に値を取得するため、頻繁に実行されるグラフでは注意が必要です
3. **構造体抽出**: `bForceObjectAndStructExtraction` を使用すると追加の処理が発生しますが、通常は無視できる程度です

## 関連ノード

- **Get Graph Parameter (Generic)**: より柔軟なパラメータ取得を提供する汎用版
- **Execute Blueprint**: ブループリントからパラメータを取得する別の方法
- **Get Actor Property**: アクターのプロパティを取得する類似ノード

## 注意事項

- このノードはエディタでコンパクト描画されます (`ShouldDrawNodeCompact` が true)
- ユーザーはノードタイトルを編集できます (`CanUserEditTitle` が true)
- プリコンフィグ設定のみが公開されます (`OnlyExposePreconfiguredSettings` が true)
- 実行依存ピンはありません (`HasExecutionDependencyPin` が false)
