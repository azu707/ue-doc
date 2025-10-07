# Export Selected Attributes

## 概要

Export Selected Attributesノードは、PCGデータから選択した属性やプロパティを指定したフォーマット(バイナリまたはJSON)でファイルにエクスポートするノードです。デバッグ、データ分析、外部ツールとの連携に使用できます。

**重要**: このノードは、従来の開発プラットフォーム(Windows、Linux、Mac)でのみ動作します。コンソールやモバイルプラットフォームでは実行されません。

## 機能詳細

このノードは以下の処理を実行します:

1. **属性の選択**: 入力データから指定された属性/プロパティを選択
2. **フォーマット選択**: Binary(バイナリ)またはJSON形式でエクスポート
3. **レイアウト選択**: JSONの場合、要素ごと(ByElement)または属性ごと(ByAttribute)のレイアウトを選択
4. **ファイル出力**: 指定されたディレクトリとファイル名でデータを保存
5. **カスタムバージョニング**: オプションでカスタムバージョン情報を含めることが可能

### エクスポート形式

#### Binary形式
- Unrealのアーカイブシステムを使用してバイナリデータを出力
- 拡張子: `.bin`
- 高速で効率的、但しバイナリ形式なので人間が読めない
- 属性ごとに配列としてシリアライズ

#### JSON形式
- 人間が読める構造化されたテキスト形式
- 拡張子: `.json`
- デバッグやデータ確認に適している
- 2つのレイアウトオプション:
  - **ByElement**: 各要素をオブジェクトとして、その中にすべての属性を含める
  - **ByAttribute**: 各属性をキーとして、その値の配列を持つ

## プロパティ

### Format
- **型**: `EPCGExportAttributesFormat` (Enum)
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `Binary`
- **オプション**:
  - `Binary`: バイナリ形式でエクスポート
  - `Json`: JSON形式でエクスポート
- **説明**: データをエクスポートする際のファイル形式を指定します。

### Layout
- **型**: `EPCGExportAttributesLayout` (Enum)
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `ByElement`
- **編集条件**: `Format != Binary`の場合のみ表示
- **オプション**:
  - `ByElement`: 要素を主データオブジェクトとして使用。各要素がすべての属性を含む
  - `ByAttribute`: 属性を主データオブジェクトとして使用。各属性グループが要素値を順次配列で含む
- **説明**: JSONエクスポート時のデータレイアウトを決定します。

### Path
- **型**: `FDirectoryPath`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **説明**: データを保存するディレクトリパス。指定されていない場合、エディタではダイアログが開きます。

### FileName
- **型**: `FString`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **説明**: エクスポートするファイル名(拡張子なし)。拡張子は自動的に付加されます。

### bExportAllAttributes
- **型**: `bool`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `true`
- **説明**:
  - `true`: 入力データのすべてのプロパティと属性を自動的にエクスポート
  - `false`: `AttributeSelectors`で指定された属性のみをエクスポート

### AttributeSelectors
- **型**: `TArray<FPCGAttributePropertyInputSelector>`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **表示条件**: `!bExportAllAttributes`の場合のみ表示
- **デフォルト値**: 1つの@Last要素を含む配列
- **説明**: エクスポートするデータソースとして使用する属性のリスト。指定されたもののみがエクスポートされます。

### bAddCustomDataVersion
- **型**: `bool`
- **カテゴリ**: Advanced
- **デフォルト値**: `false`
- **説明**: カスタムバージョン番号をエクスポートデータに含めるかどうか。

### CustomVersion
- **型**: `int32`
- **カテゴリ**: Advanced
- **表示条件**: `bAddCustomDataVersion == true`の場合のみ表示
- **デフォルト値**: `0`
- **説明**: エクスポートデータに含めるカスタムバージョン番号。

## 使用例

### 基本的な使用方法

1. Export Selected Attributesノードを追加
2. 入力データを接続
3. `Format`でエクスポート形式を選択
4. `Path`と`FileName`を設定
5. 必要に応じて`bExportAllAttributes`を調整し、特定の属性のみを選択
6. グラフを実行してファイルを生成

### JSONエクスポート例

**ByElementレイアウト**:
```json
{
  "Header": {
    "Export Version": 0
  },
  "Element [0]": {
    "$Position": [100.0, 200.0, 300.0],
    "$Rotation": [0.0, 0.0, 0.0, 1.0],
    "CustomAttribute": 42
  },
  "Element [1]": {
    "$Position": [150.0, 250.0, 350.0],
    "$Rotation": [0.0, 0.0, 0.0, 1.0],
    "CustomAttribute": 84
  }
}
```

**ByAttributeレイアウト**:
```json
{
  "Header": {
    "Export Version": 0
  },
  "$Position": [
    [100.0, 200.0, 300.0],
    [150.0, 250.0, 350.0]
  ],
  "$Rotation": [
    [0.0, 0.0, 0.0, 1.0],
    [0.0, 0.0, 0.0, 1.0]
  ],
  "CustomAttribute": [42, 84]
}
```

### 典型的なユースケース

- **デバッグ**: PCGで生成されたポイントデータをファイルにエクスポートして検証
- **データ分析**: 外部ツール(Python、Excel等)で分析するためにデータを抽出
- **バックアップ**: 生成されたデータの特定のスナップショットを保存
- **ツール連携**: PCGデータを他のDCCツールやカスタムツールにインポート

## 実装の詳細

### クラス構成

#### UPCGExportSelectedAttributesSettings
- 継承: `UPCGSettings`
- ピン構成:
  - 入力: Anyタイプの必須入力ピン1つ
  - 出力: 依存関係のみの実行依存ピン1つ

#### FPCGExportSelectedAttributesElement
- 継承: `IPCGElement`
- メインスレッドでのみ実行可能 (`CanExecuteOnlyOnMainThread` = true)
- キャッシュ不可 (`IsCacheable` = false)

### 重要な実装ポイント

1. **プラットフォーム制限**: `#if PLATFORM_WINDOWS || PLATFORM_LINUX || PLATFORM_MAC`でコンパイル時に制限されており、サポートされていないプラットフォームでは何も実行しません。

2. **データタイプ別処理**:
   - **PointData**: Transform, Density, BoundsMin, BoundsMax, Color, Steepness, Seedなどのポイントプロパティを自動選択
   - **SplineData**: Position, Rotation, Scale, ArriveTangent, LeaveTangent, InterpTypeなどのスプラインプロパティを自動選択
   - **すべてのデータ**: メタデータ内のすべての属性を自動選択

3. **型別シリアライゼーション**:
   - **浮動小数点型** (float, double, FVector, FRotator, FTransform等): JSON数値型で精度を保持
   - **その他の型**: 文字列に変換してエクスポート(AllowBroadcast使用)

4. **カスタムバージョン管理**:
   - エクスポート時にバージョンGUIDと番号を記録
   - `FCustomExportVersion::LatestVersion`を使用してエクスポート形式のバージョンを管理
   - ユーザー定義のカスタムバージョンもオプションで追加可能

5. **エラーハンドリング**:
   - 入力データが空の場合: 静かに終了
   - ディレクトリが無効な場合: エラーログを出力
   - ファイル名が空の場合: エラーログを出力
   - アーカイブ/ファイル作成失敗: エラーログを出力

### JSONデータ構造

#### ヘッダー情報
すべてのJSONエクスポートにはヘッダーオブジェクトが含まれます:
- `Export Version`: PCGエクスポート形式のバージョン
- `Custom Data Version`: (オプション)ユーザー定義のバージョン番号

#### 浮動小数点型の変換
- `float/double`: 数値として直接出力
- `FVector2D`: `[X, Y]`配列
- `FVector`: `[X, Y, Z]`配列
- `FVector4/FQuat`: `[X, Y, Z, W]`配列
- `FRotator`: `[Pitch, Yaw, Roll]`配列
- `FTransform`: オブジェクト形式 `{"Translation": [...], "Rotation": [...], "Scale": [...]}`

### パフォーマンス考慮事項

- ファイルI/Oが発生するため、必ずメインスレッドで実行
- 大量のポイントや属性をエクスポートする場合、処理時間が長くなる可能性があります
- JSONは人間が読める形式ですが、バイナリより大きく、処理も遅い
- バイナリ形式はパフォーマンスが優れていますが、外部ツールでの読み込みには専用のパーサーが必要

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGExportSelectedAttributes.h`
- **実装**: `/Engine/Plugins/PCG/Source/PCG/Private/Elements/IO/PCGExportSelectedAttributes.cpp`

## 注意事項

1. このノードはエディタ承認済みプラットフォーム(Windows、Linux、Mac)でのみ動作します
2. ファイル書き込み権限が必要です
3. キャッシュされないため、毎回実行時にファイルが生成されます
4. 実行依存ピンのみを出力するため、データフローには影響しません
