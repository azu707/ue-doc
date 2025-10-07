# Get Virtual Texture Data

## 概要

Get Virtual Texture Dataノードは、選択されたアクターからランタイムバーチャルテクスチャ（RVT）データのコレクションを構築するノードです。バーチャルテクスチャボリュームから高解像度のテクスチャ情報を効率的に取得し、PCGで利用可能な空間データとして提供します。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetVirtualTextureSettings`
**エレメント**: `FPCGDataFromActorElement`（基底クラスのエレメントを使用）
**基底クラス**: `UPCGDataFromActorSettings`

## 機能詳細

Get Virtual Texture Dataノードは、以下のタイプのバーチャルテクスチャコンポーネントからデータを取得できます:

1. **Runtime Virtual Texture Volume**: ランタイムバーチャルテクスチャボリューム
2. **Runtime Virtual Texture Component**: RVTコンポーネント
3. **Landscape with RVT**: RVTを使用するランドスケープ

バーチャルテクスチャは、大規模な高解像度テクスチャを効率的にストリーミングするシステムであり、PCGでは以下のデータを取得できます:
- **Base Color**: ベースカラー情報
- **Normal**: 法線情報
- **Height**: 高さ情報
- **Specular**: スペキュラー情報

## プロパティ

このノードは`UPCGDataFromActorSettings`から継承されたプロパティを使用します。バーチャルテクスチャデータ特有の設定は以下の通りです:

### ActorSelector (FPCGActorSelectorSettings)
バーチャルテクスチャコンポーネントを持つアクターを選択します。
- **型**: `FPCGActorSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **デフォルトクラス**: `ARuntimeVirtualTextureVolume`

### Mode (自動設定)
このノードでは、常に`ParseActorComponents`モードが使用されます。
- **デフォルト値**: `EPCGGetDataFromActorMode::ParseActorComponents`
- **注**: モード設定UIは非表示

## 使用例

### 例1: レベル内のすべてのRVTボリュームからデータを取得
```
Get Virtual Texture Data:
  ActorSelector.ActorFilter = AllWorldActors
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = RuntimeVirtualTextureVolume
```

### 例2: 特定のタグを持つRVTのみを取得
```
Get Virtual Texture Data:
  ActorSelector.ActorFilter = ByTag
  ActorSelector.Tag = "TerrainRVT"
```

### 例3: PCGコンポーネントの境界内のRVTのみを取得
```
Get Virtual Texture Data:
  ActorSelector.bMustOverlapSelf = true
  → PCGコンポーネントのバウンドと重なるRVTのみが取得される
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (VirtualTexture)**: バーチャルテクスチャデータのコレクション
  - **型**: `EPCGDataType::VirtualTexture`
  - **複数接続**: 可能
  - **複数データ**: 可能（各RVTコンポーネントごとに個別のデータ）

### データフィルター
```cpp
virtual EPCGDataType GetDataFilter() const override { return EPCGDataType::VirtualTexture; }
```

### コンストラクタ
```cpp
UPCGGetVirtualTextureSettings::UPCGGetVirtualTextureSettings()
{
    Mode = EPCGGetDataFromActorMode::ParseActorComponents;
    // その他の基底クラスの設定を使用
}
```

### デフォルトアクタークラス
```cpp
TSubclassOf<AActor> UPCGGetVirtualTextureSettings::GetDefaultActorSelectorClass() const override
{
    return ARuntimeVirtualTextureVolume::StaticClass();
}
```

### モード設定の非表示
```cpp
#if WITH_EDITOR
virtual bool DisplayModeSettings() const override { return false; }
#endif
```

### 出力ピンプロパティ

```cpp
TArray<FPCGPinProperties> UPCGGetVirtualTextureSettings::OutputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;
    PinProperties.Emplace(PCGPinConstants::DefaultOutputLabel, EPCGDataType::VirtualTexture,
        /*bAllowMultipleConnections=*/true, /*bAllowMultipleData=*/false);
    return PinProperties;
}
```

### バーチャルテクスチャデータの構造

各RVTコンポーネントから作成される`UPCGVirtualTextureData`には以下の情報が含まれます:

```cpp
UPCGVirtualTextureData
{
    // RVT参照
    VirtualTextureVolume: ARuntimeVirtualTextureVolume*  // ソースRVTボリューム
    VirtualTexture: URuntimeVirtualTexture*              // RVTアセット

    // トランスフォーム
    Transform: FTransform                   // ワールド空間でのトランスフォーム
    Bounds: FBox                            // バウンディングボックス

    // RVT設定
    TileSize: int32                         // タイルサイズ
    TileCount: FIntPoint                    // タイル数
    StreamingTexture: UTexture2D*           // ストリーミングテクスチャ

    // チャンネル情報
    bHasBaseColor: bool                     // ベースカラーチャンネルの有無
    bHasNormal: bool                        // 法線チャンネルの有無
    bHasSpecular: bool                      // スペキュラーチャンネルの有無
    bHasHeight: bool                        // 高さチャンネルの有無

    // メタデータ
    Metadata: UPCGMetadata*                 // RVT属性
}
```

### データ取得のフロー

1. **アクター検索**: `ActorSelector`設定に基づいてアクターを検索
2. **RVTコンポーネント列挙**:
   ```cpp
   for (UActorComponent* Component : Actor->GetComponents())
   {
       if (URuntimeVirtualTextureComponent* RVTComp = Cast<URuntimeVirtualTextureComponent>(Component))
       {
           // RVTコンポーネントを処理
       }
   }
   ```
3. **フィルタリング**:
   - バウンドチェック（`bMustOverlapSelf`が有効な場合）
4. **データ作成**: 各RVTコンポーネントに対して`UPCGVirtualTextureData`を作成
5. **チャンネル情報の抽出**: RVTの利用可能なチャンネルを確認
6. **出力**: 作成されたバーチャルテクスチャデータを出力ピンに追加

### RVTチャンネルの検出

```cpp
void DetectRVTChannels(URuntimeVirtualTexture* RVT, UPCGVirtualTextureData* Data)
{
    if (!RVT) return;

    // RVTマテリアルタイプからチャンネルを検出
    ERuntimeVirtualTextureMaterialType MaterialType = RVT->GetMaterialType();

    switch (MaterialType)
    {
        case ERuntimeVirtualTextureMaterialType::BaseColor:
            Data->bHasBaseColor = true;
            break;
        case ERuntimeVirtualTextureMaterialType::BaseColor_Normal_Specular:
            Data->bHasBaseColor = true;
            Data->bHasNormal = true;
            Data->bHasSpecular = true;
            break;
        case ERuntimeVirtualTextureMaterialType::WorldHeight:
            Data->bHasHeight = true;
            break;
        // その他のマテリアルタイプ
    }
}
```

### RVTデータのサンプリング

```cpp
// ワールド位置からRVTデータをサンプリング
FVector4 SampleVirtualTexture(UPCGVirtualTextureData* VTData, const FVector& WorldPosition)
{
    // ワールド座標をRVT UV座標に変換
    FVector2D UV = VTData->WorldToUV(WorldPosition);

    // RVTからデータを取得（GPU経由またはキャッシュ経由）
    FVector4 SampledData = VTData->SampleAtUV(UV);

    return SampledData;
}
```

### パフォーマンス考慮事項

1. **ストリーミング**: RVTはストリーミングシステムであり、必要な部分のみがロードされる
2. **GPU依存**: RVTのサンプリングはGPUで行われるため、CPU処理とは特性が異なる
3. **解像度**: RVTの解像度設定が処理時間とメモリ使用量に影響
4. **キャッシュ**: PCGはRVTデータをキャッシュして再利用する可能性がある

## バーチャルテクスチャデータの使用

取得したバーチャルテクスチャデータは、以下のようなノードで使用できます:

### Surface Sampler
```
Get Virtual Texture Data -> Surface Sampler -> RVT領域内にポイント生成
```

### Sample Texture (VRT対応)
```
Points -> Sample Virtual Texture -> RVTからカラー/高さ情報を取得
```

### Projection
```
Points -> Projection (Target: Virtual Texture Data) -> RVTサーフェスに投影
```

### Density Modifier
```
Get Virtual Texture Data -> Density Modifier -> RVT高さに基づいて密度調整
```

## RVTとPCGの統合パターン

### 1. ランドスケープRVTからのサンプリング
```
Get Virtual Texture Data (Landscape RVT) -> Surface Sampler
→ ランドスケープのRVT高さ情報を使用してポイント生成
```

### 2. ベースカラー情報の取得
```
Points -> Sample Virtual Texture (BaseColor) -> カラー属性を追加
→ RVTのベースカラーをポイント属性として格納
```

### 3. 法線情報を使用した配置調整
```
Points -> Sample Virtual Texture (Normal) -> Align to Normal
→ RVT法線に基づいてポイントの向きを調整
```

## トラブルシューティング

### RVTが検出されない

**原因**:
- RVTボリュームが正しく配置されていない
- RVTコンポーネントが有効化されていない
- バウンドが重なっていない

**解決策**:
```
1. RVTボリュームのBoundsを確認
2. RVTが有効化されているか確認（Enable Virtual Texture Support）
3. ActorSelector.bMustOverlapSelf を false に設定してテスト
```

### サンプリング結果が正しくない

**原因**:
- RVTが正しく初期化されていない
- RVTの解像度が低すぎる
- UV座標の変換ミス

**解決策**:
```
1. RVTのSize設定を確認
2. RVTのMaterialTypeが期待通りか確認
3. Transform設定を確認
```

### パフォーマンスの問題

**原因**:
- 高解像度RVT
- 多数のサンプリングポイント
- GPUオーバーヘッド

**解決策**:
```
1. RVTのSize設定を最適化
2. ポイント数を削減
3. サンプリング頻度を調整
```

## 注意事項

1. **RVTのセットアップ**: プロジェクト設定でRVTサポートを有効化する必要があります
2. **GPU依存**: RVTのサンプリングはGPUに依存するため、エディタとランタイムで動作が異なる可能性があります
3. **ストリーミング**: RVTはストリーミングシステムであり、すべてのデータが即座に利用可能とは限りません
4. **マテリアルタイプ**: RVTのマテリアルタイプによって利用可能なチャンネルが異なります

## 関連ノード
- Get Actor Data (基底クラス)
- Get Texture Data (通常のテクスチャデータ)
- Surface Sampler (サーフェスからポイント生成)
- Sample Texture (テクスチャサンプリング)
- Get Landscape Data (ランドスケープデータ)

## 追加情報

### RVTの設定

プロジェクトでRVTを使用するには:

1. **プロジェクト設定**: `Enable Virtual Texture Support`を有効化
2. **RVTボリューム配置**: レベルにRuntimeVirtualTextureVolumeを配置
3. **RVT設定**: RVTアセットを作成し、MaterialTypeとSizeを設定
4. **マテリアル設定**: RVTにレンダリングするマテリアルを設定

### PCGでの活用

RVTは大規模なワールドで特に有用です:
- **高解像度データ**: メモリを節約しながら高解像度テクスチャを使用
- **動的更新**: ランタイムでRVTを更新してPCG生成に反映
- **統合ワークフロー**: ランドスケープ、フォリッジ、RVTを統合した生成
