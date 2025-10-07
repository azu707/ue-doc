# Get Graph Parameter (Generic)

## 概要

**Get Graph Parameter (Generic)**ノードは、PCGグラフで定義されたユーザーパラメータを手動で指定して取得できる汎用的なパラメータ取得ノードです。Get Actor PropertyやGet Property From Object Pathと同様に、パラメータパスと抽出設定を手動で構成できます。

カテゴリ: GraphParameters
クラス名: `UPCGGenericUserParameterGetSettings`
エレメント: `FPCGUserParameterGetElement`

## 機能詳細

このノードは、標準の「Get Graph Parameter」ノードよりも柔軟性が高く、プロパティパスを手動で指定してパラメータを取得できます。複数のパラメータソース（Current、Upstream、Root）から選択でき、エラー出力の制御も可能です。

### 主な特徴

- プロパティパスを手動で指定可能
- 複数のパラメータソースをサポート（Current/Upstream/Root）
- 出力属性名のカスタマイズ
- 構造体/オブジェクトのプロパティ抽出
- エラーメッセージの抑制オプション

## プロパティ

### PropertyPath
- **型**: `FString`
- **デフォルト値**: 空文字列
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 取得するプロパティのパス。例: "MyParameter" または "MyStruct.MyField"

### bForceObjectAndStructExtraction
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: プロパティが構造体またはオブジェクトの場合、すべての互換性のあるプロパティを強制的に抽出します。メタデータでサポートされていない型の場合は自動的にtrueになります。現在、直接の子プロパティのみをサポートします（より深い階層はサポートされません）。

### bSanitizeOutputAttributeName
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **説明**: 出力属性名に特殊文字が含まれる場合、それらを削除します。

### OutputAttributeName
- **型**: `FName`
- **デフォルト値**: `NAME_None`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 出力属性の名前を明示的に指定します。`NAME_None`の場合、プロパティ名から自動的に生成されます。

### Source
- **型**: `EPCGUserParameterSource` (enum)
- **デフォルト値**: `EPCGUserParameterSource::Current`
- **カテゴリ**: Settings
- **説明**: パラメータを取得するソースを指定します:
  - **Current**: 現在のグラフインスタンスからパラメータを取得
  - **Upstream**: 上流のグラフインスタンスからパラメータを取得
  - **Root**: ルートグラフインスタンスからパラメータを取得

### bQuiet
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **説明**: trueの場合、パラメータが見つからない場合のエラーメッセージを抑制します。デバッグ時やオプショナルなパラメータを扱う際に有用です。

## 入力ピン

このノードには入力ピンがありません。

## 出力ピン

動的に生成される出力ピンがあります。取得するパラメータの型に応じて、適切な属性セットが出力されます。

## 使用例

### 基本的な使用方法

```cpp
// PCGグラフパラメータ:
// float Density = 0.5;

// Get Graph Parameter (Generic) 設定:
PropertyPath = "Density"
Source = Current
OutputAttributeName = "DensityValue"

// 出力: 属性セットに "DensityValue" = 0.5 が含まれます
```

### 構造体プロパティの取得

```cpp
// PCGグラフパラメータ:
// FVector Offset = FVector(10, 20, 30);

// Get Graph Parameter (Generic) 設定:
PropertyPath = "Offset.X"
Source = Current
OutputAttributeName = "OffsetX"

// 出力: 属性セットに "OffsetX" = 10.0 が含まれます

// または、すべての子プロパティを抽出:
PropertyPath = "Offset"
bForceObjectAndStructExtraction = true

// 出力:
// - Offset.X = 10.0
// - Offset.Y = 20.0
// - Offset.Z = 30.0
```

### 上流グラフからのパラメータ取得

```cpp
// サブグラフ内で親グラフのパラメータを取得:
PropertyPath = "ParentParameter"
Source = Upstream

// これにより、サブグラフは親グラフで定義されたパラメータにアクセスできます
```

### オプショナルパラメータ

```cpp
// パラメータが存在しない場合でもエラーを出力しない:
PropertyPath = "OptionalParameter"
bQuiet = true

// パラメータが見つからない場合、エラーログを出力せずに空の結果を返します
```

## 実装の詳細

### ExecuteInternal メソッド

`FPCGUserParameterGetElement::ExecuteInternal` は以下の処理を実行します（標準版と同じエレメントを使用）:

1. **パラメータソースの決定**: `Source` 設定に基づいて適切なグラフインスタンスを選択
2. **プロパティパスの解析**: `PropertyPath` を解析してパラメータ情報を取得
3. **値の読み取り**: 指定されたグラフインスタンスからパラメータ値を読み取り
4. **属性セットの生成**: 取得した値を属性セットに変換し、`OutputAttributeName` を使用
5. **エラー処理**: `bQuiet` が false の場合、パラメータが見つからない場合にエラーを出力

### 追加タイトル情報

`GetAdditionalTitleInformation` メソッドは、ノードタイトルに `PropertyPath` を表示します。これにより、グラフエディタで各ノードが取得しているパラメータを簡単に識別できます。

### エディタでの変更検出

`GetChangeTypeForProperty` メソッドは、プロパティ変更時の適切な更新タイプを決定します。`PropertyPath` や `Source` の変更は構造的な変更とみなされます。

## パフォーマンス考慮事項

1. **メインスレッド実行**: グラフパラメータアクセスはメインスレッドでのみ実行されます
2. **キャッシュ不可**: パラメータ値は実行ごとに取得されます
3. **パスの解析**: プロパティパスの解析はわずかなオーバーヘッドを伴いますが、通常は無視できます
4. **ソース選択**: Upstream/Rootソースを使用する場合、グラフ階層の走査が必要になります

## 標準版との違い

| 機能 | Get Graph Parameter | Get Graph Parameter (Generic) |
|------|---------------------|-------------------------------|
| パラメータ選択 | プリコンフィグメニューから選択 | プロパティパスを手動入力 |
| パラメータソース | 常にCurrent | Current/Upstream/Root から選択 |
| 出力属性名 | 自動生成 | カスタマイズ可能 |
| エラー制御 | なし | bQuiet オプションあり |
| 柔軟性 | 低 | 高 |
| 使いやすさ | 高（UIから選択） | 中（手動入力が必要） |

## 関連ノード

- **Get Graph Parameter**: プリコンフィグされたパラメータ取得の標準版
- **Get Actor Property**: アクタープロパティを取得する類似の汎用ノード
- **Get Property From Object Path**: オブジェクトパスからプロパティを取得
- **Execute Blueprint**: ブループリント関数の実行とパラメータ取得

## 注意事項

- エディタでは `GetGenericGraphParameter` という内部名が使用されますが、表示名は "Get Graph Parameter" です
- プロパティパスの構文エラーは実行時にエラーとして報告されます
- データの前処理が必要です (`RequiresDataFromPreTask` が true)
- 実行依存ピンはありません (`HasExecutionDependencyPin` が false)
