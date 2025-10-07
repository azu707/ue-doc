# Save PCG Data Asset

## 概要

Save PCG Data Assetノードは、PCGグラフで生成されたデータをPCGデータアセット(.uasset)としてディスクに保存するノードです。このノードを使用することで、計算コストの高い処理結果をアセットとして保存し、後で再利用したり、他のプロジェクトやチームメンバーと共有したりできます。

保存されたデータアセットは、Load PCG Data Assetノードで読み込むことができます。

## 機能詳細

このノードは以下の処理を実行します:

1. **入力データの収集**: 指定されたピンからデータを収集
2. **データコレクションの作成**: 収集したデータをFPCGDataCollectionにパッケージング
3. **アセットのエクスポート**: カスタムエクスポーターを使用してデータをアセット化
4. **メタデータの保存**: アセットの説明と色情報を保存(エディタのみ)
5. **ファイルの作成/更新**: 新規作成または既存アセットの更新

### データコレクションの構造

保存されるデータは`FPCGDataCollection`として構造化されます:
- **TaggedData**: ピン名、タグ、実際のデータを含む配列
- **Description**: アセットの説明(エディタ用)
- **Color**: ノードの色(エディタ用)

## プロパティ

### Pins
- **型**: `TArray<FPCGPinProperties>`
- **カテゴリ**: Data
- **説明**: 保存するデータを受け取る入力ピンのリスト。デフォルトではSuper::InputPinProperties()の値で初期化されます。カスタムピンを追加して、複数のデータソースを保存できます。

### CustomDataCollectionExporterClass
- **型**: `TSubclassOf<UPCGDataCollectionExporter>`
- **カテゴリ**: Data
- **デフォルト値**: `nullptr`
- **説明**: カスタムエクスポーターのクラス。指定しない場合、デフォルトの`UPCGDataCollectionExporter`が使用されます。カスタムエクスポートロジックが必要な場合に使用します。

### Params
- **型**: `FPCGAssetExporterParameters`
- **カテゴリ**: Data
- **オーバーライド可能**: Yes (PCG_Overridable)
- **表示**: ShowOnlyInnerProperties
- **説明**: アセットエクスポートのパラメータ。以下を含みます:
  - **AssetPath**: 保存先のパッケージパス
  - **AssetName**: アセット名
  - **bReplaceExisting**: 既存アセットを上書きするか
  - その他のエクスポートオプション

### AssetDescription
- **型**: `FString`
- **カテゴリ**: Data
- **オーバーライド可能**: Yes (PCG_Overridable)
- **説明**: アセットの説明テキスト。Load PCG Data Assetノードのツールチップに表示されます。

### AssetColor
- **型**: `FLinearColor`
- **カテゴリ**: Data
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: White
- **説明**: アセットに関連付けられた色。Load PCG Data Assetノードのタイトルバーの色として使用されます。

## 使用例

### 基本的な使用方法

1. PCGグラフでデータを生成
2. Save PCG Data Assetノードを追加
3. 生成されたデータをノードの入力ピンに接続
4. `Params.AssetPath`と`Params.AssetName`を設定
5. `AssetDescription`と`AssetColor`を設定(オプション)
6. グラフを実行してアセットを生成

### 単一データの保存

```
[Point Sampler] → [Save PCG Data Asset]
                   (AssetPath = "/Game/PCG/Data/")
                   (AssetName = "SampledPoints")
                   (AssetDescription = "サンプリングされたポイントデータ")
```

### 複数データの保存

カスタムピンを追加して複数のデータを保存:

```
Pins[0] = "Points" (Point)
Pins[1] = "Meshes" (Spatial)
Pins[2] = "Metadata" (Param)

[Point Generator] → Points
[Mesh Sampler]    → Meshes    → [Save PCG Data Asset]
[Statistics]      → Metadata
```

保存されたアセットをロードすると、3つの出力ピン(Points, Meshes, Metadata)が生成されます。

### プリセットの保存

異なる設定のプリセットをアセットとして保存:

```
[Create Preset A] → [Save PCG Data Asset] (AssetName = "PresetA")
[Create Preset B] → [Save PCG Data Asset] (AssetName = "PresetB")
[Create Preset C] → [Save PCG Data Asset] (AssetName = "PresetC")
```

### 動的なアセット名

```
[Generate Data] → [Save PCG Data Asset]
                   (Params.AssetName = オーバーライド可能)

実行時に異なる名前でアセットを保存できます。
```

### 典型的なユースケース

- **結果のキャッシング**: 計算コストの高い処理結果を保存して再利用
- **データライブラリの構築**: 様々なバリエーションをアセットとして蓄積
- **チーム共有**: 生成されたデータを他のチームメンバーと共有
- **バージョン管理**: 異なるバージョンのデータを別々のアセットとして保存
- **プリセット管理**: 事前定義された設定をアセット化
- **パイプライン統合**: DCC→PCG→アセット→ゲームのワークフロー

## 実装の詳細

### クラス構成

#### UPCGDataCollectionExporter
- 継承: `UPCGAssetExporter`
- デフォルトのエクスポーター実装
- データコレクションをPCGデータアセットに変換
- 更新機能なし(常に新規作成)

#### UPCGSaveDataAssetSettings
- 継承: `UPCGSettings`
- ピン構成: カスタム入力ピン、出力ピンなし

#### FPCGSaveDataAssetElement
- 継承: `IPCGElement`
- メインスレッドでのみ実行可能

### 重要な実装ポイント

1. **エクスポーターの選択**:
   ```cpp
   UPCGDataCollectionExporter* Exporter = nullptr;
   if (Settings->CustomDataCollectionExporterClass)
   {
       Exporter = NewObject<UPCGDataCollectionExporter>(GetTransientPackage(),
                                                         Settings->CustomDataCollectionExporterClass);
   }
   if (!Exporter)
   {
       Exporter = NewObject<UPCGDataCollectionExporter>();
   }
   ```

2. **データの収集**:
   入力ピンのリストに基づいて、対応するTaggedDataのみを収集:
   ```cpp
   for (const FPCGTaggedData& TaggedData : Context->InputData.TaggedData)
   {
       if (InputPins.FindByPredicate([&TaggedData](const FPCGPinProperties& Pin) {
           return TaggedData.Pin == Pin.Label;
       }))
       {
           Exporter->Data.TaggedData.Add(TaggedData);
       }
   }
   ```

3. **メタデータの設定**:
   ```cpp
   #if WITH_EDITOR
   Exporter->AssetDescription = Settings->AssetDescription;
   Exporter->AssetColor = Settings->AssetColor;
   #endif
   ```

4. **アセットの作成**:
   ```cpp
   UPCGAssetExporterUtils::CreateAsset(Exporter, Settings->Params, Context);
   ```

### エクスポートプロセス

```
入力データ (Context->InputData)
    ↓
入力ピンに一致するTaggedDataをフィルタ
    ↓
FPCGDataCollection (Exporter->Data)
    ↓
UPCGDataCollectionExporter::ExportAsset
    ↓
UPCGDataAsset (.uasset)
    ├─ Data (FPCGDataCollection)
    ├─ Name (AssetName)
    ├─ Description (AssetDescription)
    └─ Color (AssetColor)
```

### UPCGDataCollectionExporterの実装

```cpp
bool UPCGDataCollectionExporter::ExportAsset(const FString& PackageName, UPCGDataAsset* Asset)
{
    Asset->Data = Data;
    #if WITH_EDITOR
    Asset->Description = FText::FromString(AssetDescription);
    Asset->Color = AssetColor;
    #endif
    return true;
}
```

このメソッドは、エクスポーター内のデータをアセットにコピーします。カスタムエクスポーターでは、この動作をオーバーライドできます。

### カスタムエクスポーターの作成

カスタムエクスポートロジックが必要な場合:

1. `UPCGDataCollectionExporter`を継承したクラスを作成
2. `ExportAsset`メソッドをオーバーライド
3. オプションで`UpdateAsset`メソッドを実装(既存アセットの更新)
4. `CustomDataCollectionExporterClass`に設定

例:
```cpp
UCLASS()
class UMyCustomExporter : public UPCGDataCollectionExporter
{
    GENERATED_BODY()

protected:
    virtual bool ExportAsset(const FString& PackageName, UPCGDataAsset* Asset) override
    {
        // カスタムロジック
        // データの前処理、最適化、検証など
        Asset->Data = ProcessData(Data);
        return true;
    }
};
```

### ピンのフィルタリング

Save PCG Data Assetノードは、定義された入力ピンに一致するTaggedDataのみを保存します。これにより、グラフ内の他のデータ(オーバーライドなど)が誤って保存されることを防ぎます。

### 出力ピンなし

このノードには出力ピンがありません(`OutputPinProperties`は空の配列を返します)。これは、ノードがデータフローの終端であり、副作用(アセットの作成)のみを持つためです。

### エラーハンドリング

エクスポートプロセス中のエラーは、`UPCGAssetExporterUtils::CreateAsset`内で処理されます:
- パッケージパスが無効な場合
- 書き込み権限がない場合
- アセット名が無効な場合
- 既存アセットの上書きが許可されていない場合

### パフォーマンス考慮事項

- アセットの作成はディスクI/Oを伴うため、メインスレッドで実行されます
- 大量のデータを保存する場合、時間がかかる可能性があります
- データはそのままコピーされるため、大きなデータセットではメモリ使用量が増加します
- 連続してアセットを保存する場合、ディスクI/Oがボトルネックになる可能性があります

### アセットの再利用

保存されたアセットは、Load PCG Data Assetノードで読み込むことができます:

```
[Save PCG Data Asset] → MyData.uasset
                             ↓
                    (別のグラフまたは後で)
                             ↓
                    [Load PCG Data Asset] → データの再利用
```

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCG/Source/PCG/Public/Elements/IO/PCGSaveAssetElement.h`
- **実装**: `/Engine/Plugins/PCG/Source/PCG/Private/Elements/IO/PCGSaveAssetElement.cpp`

## Load PCG Data Assetとの統合

Save PCG Data AssetとLoad PCG Data Assetは対になっています:

| Save側 | アセット | Load側 |
|--------|----------|--------|
| Pins配列 | → TaggedData → | 動的出力ピン |
| AssetDescription | → Description → | ノードツールチップ |
| AssetColor | → Color → | ノードタイトルバー色 |
| AssetName | → Name → | ノードタイトル |

## 注意事項

1. **パッケージパス**: `Params.AssetPath`は有効なコンテンツブラウザのパスである必要があります(例: `/Game/PCG/Data/`)
2. **アセット名**: `Params.AssetName`は有効なアセット名である必要があります(特殊文字を避ける)
3. **上書き**: `Params.bReplaceExisting`を`false`に設定すると、既存アセットは保護されます
4. **ピンの一致**: 入力ピンの名前がTaggedDataのピン名と一致することを確認してください
5. **エディタ専用データ**: Description と Colorはエディタでのみ保存・使用されます
6. **メモリ**: 大量のデータを保存する場合、メモリ使用量に注意してください
7. **バージョン管理**: 保存されたアセットはバージョン管理システムに追加してください
8. **読み取り専用**: 保存されたアセットを手動で編集することは推奨されません

## ベストプラクティス

1. **命名規則**: 一貫した命名規則を使用してアセットを整理
2. **フォルダ構造**: 論理的なフォルダ構造でアセットを管理
3. **説明の記入**: AssetDescriptionに詳細な説明を記入して、後で理解しやすくする
4. **色分け**: AssetColorを使用して、異なる種類のアセットを視覚的に区別
5. **バージョン番号**: アセット名にバージョン番号を含める(例: "TreeData_v1")
6. **ドキュメント化**: アセットの目的、生成方法、使用方法をドキュメント化
7. **定期的なクリーンアップ**: 不要になったアセットを定期的に削除
8. **テスト**: アセットを保存したら、Load PCG Data Assetで読み込んで検証
