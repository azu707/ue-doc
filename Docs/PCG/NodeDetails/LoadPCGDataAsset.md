# Load PCG Data Asset

## 概要

Load PCG Data Assetノードは、PCGデータアセット(UPCGDataAsset)をロードし、その中に保存されているデータコレクションをPCGグラフで使用可能にするノードです。このノードを使用することで、事前に生成・保存されたPCGデータを再利用したり、複数のグラフ間でデータを共有したりできます。

PCGデータアセットには、複数のタグ付きデータ(TaggedData)を含むデータコレクションが保存されており、このノードはそれらをグラフに読み込みます。

## 機能詳細

このノードは以下の処理を実行します:

1. **データアセットのロード**: 指定されたPCGデータアセットを非同期/同期でロード
2. **動的ピンの更新**: アセット内のデータに基づいて出力ピンを自動生成
3. **入力からのロード**: オプションで入力ピンから動的にアセット参照を取得
4. **デフォルト値のオーバーライド**: 属性のデフォルト値を入力またはTag:Value形式で上書き
5. **タグ付けとインデックス**: 出力データに追加のタグやインデックスを付与
6. **データの複製**: デフォルト値を適用する場合、元のアセットデータを複製

### データアセットの構造

PCGデータアセットは以下の情報を含みます:
- **Data**: FPCGDataCollection - 複数のTaggedDataを含むコレクション
- **Name**: アセット名
- **Description**: アセットの説明(エディタのみ)
- **Color**: ノードの色(エディタのみ)

### 動的ピン

このノードは、読み込まれたアセット内のデータに基づいて出力ピンを自動的に生成します。各TaggedDataのピン名に対応する出力ピンが作成され、適切なデータタイプが設定されます。

## プロパティ

### Asset
- **型**: `TSoftObjectPtr<UPCGDataAsset>`
- **カテゴリ**: Data
- **オーバーライド可能**: Yes (PCG_Overridable)
- **説明**: ロードするPCGデータアセットへの参照。

### Pins (読み取り専用)
- **型**: `TArray<FPCGPinProperties>`
- **カテゴリ**: Data|Asset Info
- **表示**: VisibleAnywhere
- **説明**: アセットから自動生成された出力ピンのリスト。アセットを設定すると自動的に更新されます。

### AssetName (読み取り専用)
- **型**: `FString`
- **カテゴリ**: Data|Asset Info
- **表示**: VisibleAnywhere
- **説明**: ロードされたアセットの名前。アセットから自動的に取得されます。

### AssetDescription (読み取り専用、エディタのみ)
- **型**: `FText`
- **カテゴリ**: Data|Asset Info
- **表示**: VisibleAnywhere
- **説明**: アセットの説明テキスト。ノードのツールチップに表示されます。

### AssetColor (読み取り専用、エディタのみ)
- **型**: `FLinearColor`
- **カテゴリ**: Data|Asset Info
- **表示**: VisibleAnywhere
- **デフォルト値**: White
- **説明**: ノードのタイトルバーの色。アセットから取得されます。

### bLoadFromInput
- **型**: `bool`
- **カテゴリ**: Settings
- **デフォルト値**: `false`
- **説明**: `true`の場合、入力ピンからアセット参照を動的に取得します。`false`の場合、`Asset`プロパティで指定されたアセットをロードします。

### AssetReferenceSelector
- **型**: `FPCGAttributePropertyInputSelector`
- **カテゴリ**: Settings
- **表示条件**: `bLoadFromInput == true`
- **説明**: 入力データからアセット参照を取得するための属性セレクタ。

### InputIndexTag
- **型**: `FName`
- **カテゴリ**: Settings
- **表示条件**: `bLoadFromInput == true`
- **デフォルト値**: `NAME_None`
- **説明**: 出力データに入力インデックスをタグとして追加する場合のタグ名。例: `InputIndex:0`

### DataIndexTag
- **型**: `FName`
- **カテゴリ**: Settings
- **表示条件**: `bLoadFromInput == true`
- **デフォルト値**: `NAME_None`
- **説明**: 出力データにデータインデックスをタグとして追加する場合のタグ名。例: `DataIndex:2`

### bSetDefaultAttributeOverridesFromInput
- **型**: `bool`
- **カテゴリ**: Settings
- **デフォルト値**: `false`
- **説明**: `true`の場合、専用の入力ピン(DefaultAttributeOverridesIn)からデフォルト値のオーバーライドを取得します。

### DefaultAttributeOverrides
- **型**: `TArray<FString>`
- **カテゴリ**: Settings
- **表示条件**: `!bSetDefaultAttributeOverridesFromInput`
- **説明**: Tag:Value形式のデフォルト値オーバーライドのリスト。例: `["Height:100", "Color:1,0,0"]`

### CommaSeparatedDefaultAttributeOverrides
- **型**: `FString`
- **カテゴリ**: (表示なし)
- **オーバーライド可能**: Yes (PCG_Overridable)
- **説明**: カンマ区切りのTag:Value形式文字列。提供された場合、`DefaultAttributeOverrides`は無視されます。

### bWarnIfNoAsset
- **型**: `bool`
- **カテゴリ**: Settings
- **デフォルト値**: `true`
- **説明**: アセットがnullまたはロードできない場合に警告を表示するかどうか。

### bTagOutputsBasedOnOutputPins (読み取り専用)
- **型**: `bool`
- **カテゴリ**: Settings
- **デフォルト値**: `true`
- **説明**: 出力データにピン名をタグとして追加するかどうか。アセットがロードされると自動的に`false`に設定されます。

### bSynchronousLoad
- **型**: `bool`
- **カテゴリ**: Settings|Debug
- **デフォルト値**: `false`
- **説明**: 同期ロードを強制するかどうか。デバッグ用。

## 使用例

### 基本的な使用方法

1. PCGデータアセットを事前に作成(Save PCG Data Assetノードなどを使用)
2. Load PCG Data Assetノードを追加
3. `Asset`プロパティにデータアセットを設定
4. アセットを設定すると、自動的に出力ピンが生成されます
5. 生成されたピンを他のノードに接続

### 入力からの動的ロード

```
[Get Actor Data] → [Load PCG Data Asset]
                     (bLoadFromInput = true)
                     (AssetReferenceSelector = "AssetPath")
```

入力データの`AssetPath`属性からアセット参照を取得してロードします。

### デフォルト値のオーバーライド(配列形式)

```
DefaultAttributeOverrides:
  - "BaseHeight:150.0"
  - "TreeDensity:0.8"
  - "Color:0.2,0.8,0.3"
```

ロードされたアセットのすべてのデータに対して、これらの属性のデフォルト値が設定されます。

### デフォルト値のオーバーライド(入力から)

```
[Create Attribute Set] → DefaultAttributeOverridesIn
  (Height = 200)         ↓
  (Density = 1.0)    [Load PCG Data Asset]
                      (bSetDefaultAttributeOverridesFromInput = true)
```

入力されたParamDataの属性値がデフォルト値としてアセットデータに適用されます。

### 複数アセットの一括ロード

```
[Create Points with Asset References] → [Load PCG Data Asset]
  (Each point has different asset)       (bLoadFromInput = true)
                                         (InputIndexTag = "Source")
                                         (DataIndexTag = "Index")
```

各入力に対して異なるアセットをロードし、タグで識別できます。

### 典型的なユースケース

- **プリセットデータの再利用**: 事前に生成したデータを複数のグラフで使用
- **バリエーション管理**: 異なるバリエーションをアセットとして保存し、必要に応じてロード
- **データキャッシング**: 計算コストの高いデータを事前計算してアセットとして保存
- **レベルデザイナーフレンドリー**: 技術者が作成したデータをアーティストが簡単に使用
- **動的コンテンツ**: ゲームプレイに応じて異なるアセットをロード

## 実装の詳細

### クラス構成

#### UPCGLoadDataAssetSettings
- 継承: `UPCGSettings`
- 動的ピンをサポート (`HasDynamicPins` = true)
- タイトル行を反転表示 (`HasFlippedTitleLines` = true)

#### FPCGLoadDataAssetContext
- 継承: `FPCGLoadObjectsFromPathContext`
- デフォルトプロバイダとタグ情報を保持

#### FPCGLoadDataAssetElement
- 継承: `IPCGElementWithCustomContext<FPCGLoadDataAssetContext>`
- メインスレッドでのみ実行

### 重要な実装ポイント

1. **動的ピンの更新**:
   `UpdateFromData`メソッドがアセットをロードし、その中のTaggedDataに基づいて`Pins`配列を構築します:
   ```cpp
   for (const FPCGTaggedData& TaggedData : Data.TaggedData)
   {
       // ピン名とデータタイプに基づいてピンを作成
       NewPins.Emplace(TaggedData.Pin, TaggedData.Data->GetDataType());
   }
   ```

2. **デフォルト値のオーバーライド処理**:

   **入力から**:
   ```cpp
   const UPCGMetadata* DefaultMetadata = DefaultProvider->ConstMetadata();
   // 各属性をコピーしてデフォルト値として設定
   ```

   **Tag:Value文字列から**:
   ```cpp
   for (const PCG::Private::FParseTagResult& TagData : Context->DefaultValueTags)
   {
       PCG::Private::SetAttributeFromTag(TagData, Metadata, PCGInvalidEntryKey,
           ESetAttributeFromTagFlags::CreateAttribute | ESetAttributeFromTagFlags::SetDefaultValue);
   }
   ```

3. **データの複製**:
   デフォルト値を適用する場合、元のアセットを変更しないように、データを複製します:
   ```cpp
   UPCGData* DuplicateData = OriginalData->DuplicateData(Context);
   Context->OutputData.TaggedData[TaggedDataIndex].Data = DuplicateData;
   ```

4. **カーディナリティの検証**:
   デフォルトプロバイダの数は、0、1、または入力データ数と一致する必要があります:
   ```cpp
   if (DefaultProviders.Num() != 0 && DefaultProviders.Num() != 1 && DefaultProviders.Num() != Inputs.Num())
   {
       // エラー: カーディナリティが一致しない
   }
   ```

5. **動的トラッキング**:
   アセットプロパティがオーバーライドされた場合、または入力からロードする場合、動的トラッキングを有効にします。

6. **型の互換性チェック**:
   デフォルト値を適用する際、型の互換性を確認します:
   ```cpp
   if (!PCG::Private::IsBroadcastableOrConstructible(DefaultAttribute->GetTypeId(),
                                                      Attribute->GetTypeId()))
   {
       // 警告: 型の不一致
   }
   ```

### データフロー

```
PCG Data Asset (.uasset)
    ↓ (LoadSynchronous)
UPCGDataAsset
    ├─ Data (FPCGDataCollection)
    │   └─ TaggedData[]
    ├─ Name
    ├─ Description
    └─ Color
        ↓ (UpdateFromData)
Dynamic Output Pins
        ↓ (ExecuteInternal)
Output Data with Optional Defaults
```

### デフォルト値の適用順序

1. アセットの元のデータをロード
2. デフォルトプロバイダまたはTag:Valueリストを準備
3. 各TaggedDataに対して:
   - データを複製
   - デフォルト値を適用
     - 既存の属性: デフォルト値を上書き
     - 新しい属性: 作成してデフォルト値を設定
4. タグとインデックスを追加(必要に応じて)

### エラーハンドリング

1. **アセットがnull**:
   - `bWarnIfNoAsset`が`true`の場合: 警告を表示
   - 何も出力せず終了

2. **カーディナリティの不一致**:
   ```
   エラー: Invalid cardinality between 'In' and 'DefaultAttributeOverridesIn' pins
   ```

3. **型の不一致(デフォルト値)**:
   ```
   警告: Default value '...' does not have a compatible type ('...') to its original type ('...')
   ```

4. **Tag:Value解析失敗**:
   ```
   警告: Default Tag Value '...' failed to set its value to the target asset data
   ```

### パフォーマンス考慮事項

- アセットのロードはI/O操作のため、非同期ロードを推奨
- デフォルト値を適用する場合、すべてのデータを複製するため、メモリ使用量が増加
- 大量のTaggedDataを含むアセットの場合、処理時間が増加
- 入力からロードする場合、入力データの数に比例して処理時間が増加

### ノードの外観カスタマイズ

- **タイトル**: アセット名またはアセットパスのファイル名
- **サブタイトル**: ノードタイトル("Load PCG Data Asset")
- **ツールチップ**: アセットの説明
- **タイトルバーの色**: アセットで定義された色

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGLoadAssetElement.h`
- **実装**: `/Engine/Plugins/PCG/Source/PCG/Private/Elements/IO/PCGLoadAssetElement.cpp`

## 注意事項

1. **アセットの存在**: ロードするPCGデータアセットが存在し、有効であることを確認してください
2. **ピンの変更**: アセットを変更すると出力ピンが変更されるため、接続が切断される可能性があります
3. **デフォルト値の型**: デフォルト値を設定する属性の型が互換性があることを確認してください
4. **カーディナリティ**: デフォルトプロバイダを使用する場合、適切な数を提供してください
5. **メモリ使用量**: デフォルト値を適用する場合、データが複製されるためメモリ使用量に注意してください
6. **動的トラッキング**: アセットを変更すると、それを参照するすべてのグラフが再実行される可能性があります
