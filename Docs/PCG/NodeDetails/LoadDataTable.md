# Load Data Table

## 概要

Load Data Tableノードは、Unreal EngineのDataTableアセット全体を読み込み、各行をPCGのポイントデータまたはパラメータデータ(Param Data)に変換するノードです。DataTableの構造化されたデータをPCGシステムで大量に利用する場合に最適です。

このノードは「Data Table Row To Attribute Set」ノードとは異なり、単一の行ではなくDataTable全体を処理し、各行を個別のポイントまたはメタデータエントリとして出力します。

## 機能詳細

このノードは以下の処理を実行します:

1. **DataTableの非同期/同期ロード**: 指定されたDataTableアセットをロードします
2. **行構造の検証**: DataTableのRowStructを確認し、有効性をチェック
3. **出力形式の選択**: PointDataまたはParamDataとして出力
4. **属性マッピング**: DataTableのフィールドをPCGプロパティ/属性にマッピング
5. **アクセサの作成**: 各フィールドに対して読み書き用のアクセサを作成
6. **データの変換**: DataTableの各行を対応するPCGデータ要素に変換

### 出力タイプ

#### Point (ポイントデータ)
- 各行が1つのポイントとして扱われます
- ポイントプロパティ(Position, Rotation, Scaleなど)に直接マッピング可能
- メタデータ属性も同時に作成可能

#### Param (パラメータデータ)
- 各行が1つのメタデータエントリとして扱われます
- 属性のみで構成され、空間的な位置情報は持ちません
- 純粋なデータセットとして扱う場合に適しています

## プロパティ

### DataTable
- **型**: `TSoftObjectPtr<UDataTable>`
- **カテゴリ**: Settings
- **オーバーライド可能**: Yes (PCG_Overridable)
- **説明**: 読み込むDataTableアセットへの参照。ソフトオブジェクトポインタとして実装されており、必要になるまでロードされません。

### OutputType
- **型**: `EPCGExclusiveDataType` (Enum)
- **カテゴリ**: Settings
- **デフォルト値**: `Point`
- **有効な値**: `Point`, `Param`
- **説明**: 出力データの形式を指定します。
  - `Point`: ポイントデータとして出力(空間データ)
  - `Param`: パラメータデータとして出力(非空間データ)

### bSynchronousLoad
- **型**: `bool`
- **カテゴリ**: Settings|Debug
- **デフォルト値**: `false`
- **説明**: DataTableのロード方式を制御します。
  - `false` (デフォルト): 非同期ロード
  - `true`: 同期ロード(デバッグ用)

### AttributeMapping (継承元)
- **型**: `TMap<FString, FPCGAttributePropertyInputSelector>`
- **カテゴリ**: Settings
- **継承元**: `UPCGExternalDataSettings`
- **説明**: DataTableのフィールド名をPCGのプロパティ/属性にマッピングします。キーはDataTableフィールド名、値はPCGプロパティセレクタです。

## 使用例

### 基本的な使用方法

1. Load Data Tableノードを追加
2. `DataTable`プロパティにDataTableアセットを設定
3. `OutputType`を選択(PointまたはParam)
4. 必要に応じて`AttributeMapping`を設定
5. ノードを実行してデータを生成

### ポイントデータとしての使用

DataTableの構造:
```
| Name     | Position        | Scale  | Color       |
|----------|-----------------|--------|-------------|
| Tree_01  | (100, 200, 0)   | 1.5    | (0, 1, 0)   |
| Tree_02  | (300, 400, 0)   | 2.0    | (0, 0.8, 0) |
| Rock_01  | (500, 100, 0)   | 0.8    | (0.5, 0.5, 0.5) |
```

このDataTableをLoad Data Tableノードに渡すと:
- 3つのポイントが生成されます
- 各ポイントは対応する位置、スケール、色を持ちます
- `Name`はメタデータ属性として保存されます

### 属性マッピングの例

DataTableのフィールド名がPCGプロパティ名と異なる場合:

```
AttributeMapping:
  "PosX, PosY, PosZ" → "$Position" (複数フィールドを1つのプロパティに)
  "TreeType" → "Type" (フィールド名を変更)
  "Height" → "$Scale.Z" (スケールのZ成分のみに割り当て)
```

### 典型的なユースケース

- **配置データのインポート**: Excelやスプレッドシートで管理された配置データをPCGで使用
- **設定テーブル**: 大量の設定パラメータをDataTableで管理
- **バリエーションデータ**: 異なるバリエーションのパラメータセットをテーブルで定義
- **データ駆動型生成**: 外部で定義されたデータに基づいてコンテンツを生成

## 実装の詳細

### クラス構成

#### UPCGLoadDataTableSettings
- 継承: `UPCGExternalDataSettings`
- ピン構成: 入力ピンなし、動的な出力ピン1つ
- 出力ピンの型は`OutputType`に基づいて動的に決定されます

#### FPCGLoadDataTableElement
- 継承: `FPCGExternalDataElement`
- DataTableのロードと変換を実行
- 二段階の処理: PrepareLoad → ExecuteLoad

### 重要な実装ポイント

1. **動的ピンタイプ**:
   `GetCurrentPinTypes`メソッドで、`OutputType`プロパティに基づいて出力ピンの型を動的に決定します。

2. **二段階処理**:
   - **PrepareLoad**:
     - DataTableのロード要求
     - RowStructの検証
     - ポイント/パラメータデータの作成
     - アクセサマッピングの構築
   - **ExecuteLoad**:
     - 実際のデータコピー
     - 行キーの作成
     - アクセサを使用したデータ転送

3. **アクセサパターン**:
   各DataTableフィールドに対して:
   ```cpp
   // 読み込みアクセサ(DataTable側)
   TUniquePtr<IPCGAttributeAccessor> DataAccessor =
       PCGAttributeAccessorHelpers::CreatePropertyAccessor(Field);

   // 書き込みアクセサ(PCGデータ側)
   TUniquePtr<IPCGAttributeAccessor> PointPropertyAccessor =
       PCGAttributeAccessorHelpers::CreateAccessor(OutData, PointPropertySelector);
   ```

4. **型の検証とブロードキャスト**:
   ```cpp
   if (!PCG::Private::IsBroadcastable(DataAccessor->GetUnderlyingType(),
                                       PointPropertyAccessor->GetUnderlyingType()))
   {
       // エラーログ: 型の不一致
   }
   ```

5. **ParamDataの特別処理**:
   ParamDataの場合、各エントリに対して属性値を初期化する必要があります:
   ```cpp
   for (int32 EntryIndex = 0; EntryIndex < DataTable->GetRowMap().Num(); ++EntryIndex)
   {
       const PCGMetadataEntryKey EntryKey = ParamData->Metadata->AddEntry();
       for (FPCGMetadataAttributeBase* Attribute : Attributes)
       {
           Attribute->SetValueFromValueKey(EntryKey, PCGDefaultValueKey);
       }
   }
   ```

6. **動的トラッキング**:
   DataTableプロパティがオーバーライドされた場合、動的トラッキングを登録してDataTableの変更を検出します。

### データフロー

```
DataTable (.uasset)
    ↓ (LoadSynchronous)
RowStruct + RowMap
    ↓ (CreatePropertyAccessor for each field)
Field Accessors
    ↓ (CreateAccessor for each mapped property)
PCG Property/Attribute Accessors
    ↓ (ExecuteLoad: Copy data using accessors)
PCG Point/Param Data
```

### エラーハンドリング

1. **DataTableがnullまたはロード失敗**:
   ```
   エラー: "Provided Data Table ('...') could not be loaded."
   ```

2. **RowStructが無効**:
   ```
   エラー: "Provided Data Table ('...') does not have a valid row definition."
   ```

3. **DataTableが空**:
   ```
   警告: "Provided Data Table ('...') is empty."
   ```

4. **サポートされていないフィールドタイプ**:
   ```
   エラー: "Provided Data Table ('...') property '...' is not of a supported type."
   ```

5. **プロパティ/属性の作成失敗**:
   ```
   エラー: "Unable to create/access point property/attribute '...'."
   ```

6. **型の不一致**:
   ```
   エラー: "Cannot convert input type '...' into output type '...'"
   ```

### パフォーマンス考慮事項

- DataTableのサイズ(行数×列数)に比例して処理時間が増加します
- 各フィールドに対してアクセサを作成するオーバーヘッドがあります
- 大量の行を持つDataTableの場合、PointDataのメモリ使用量が大きくなります
- アクセサを使用したデータコピーは型安全ですが、直接メモリコピーよりも若干遅い場合があります

### 出力ピンタイプの動的決定

`GetCurrentPinTypes`メソッドは、`EPCGExclusiveDataType`から`EPCGDataType`への変換を行います:

```cpp
EPCGExclusiveDataType → EPCGDataType
Point                 → EPCGDataType::Point
Param                 → EPCGDataType::Param
```

この変換により、グラフエディタで正しいピンタイプが表示されます。

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGDataTableElement.h`
- **実装**: `/Engine/Plugins/PCG/Source/PCG/Private/Elements/IO/PCGDataTableElement.cpp`

## Data Table Row To Attribute Setとの比較

| 特徴 | Load Data Table | Data Table Row To Attribute Set |
|------|----------------|--------------------------------|
| 処理対象 | DataTable全体 | 単一の行 |
| 出力 | 複数のポイント/エントリ | 1つのParamData |
| 用途 | 大量データのインポート | 特定の設定値の取得 |
| パフォーマンス | 行数に比例 | 一定 |
| 出力形式 | PointまたはParam | Paramのみ |

## 注意事項

1. **DataTableの構造**: RowStructにPCGでサポートされている型のみを使用してください
2. **属性マッピング**: フィールド名が一致しない場合は`AttributeMapping`を使用してください
3. **大規模データ**: 非常に大きなDataTableの場合、メモリとパフォーマンスに注意してください
4. **型の互換性**: DataTableのフィールド型とPCGプロパティ型が互換性があることを確認してください
5. **動的トラッキング**: DataTableを変更した場合、PCGグラフが自動的に再実行されます
