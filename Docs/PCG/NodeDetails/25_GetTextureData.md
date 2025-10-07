# Get Texture Data

## 概要

Get Texture Dataノードは、テクスチャアセットまたはテクスチャコンポーネントから2Dテクスチャデータを取得し、PCGで利用可能な空間データとして提供するノードです。テクスチャのピクセル情報を使用して、カラー、高さ、密度などのデータをサンプリングできます。

**ノードタイプ**: Spatial
**クラス**: Get Texture Data専用のクラスは明示的に存在しない可能性（`UPCGDataFromActorSettings`またはカスタム実装を使用）
**関連クラス**: `UPCGTextureData`（データクラス）

## 機能詳細

Get Texture Dataノードは、以下のソースからテクスチャデータを取得できます:

1. **Texture Asset**: UTexture2Dアセットから直接データを取得
2. **Render Target**: レンダーターゲットからデータを取得
3. **Actor Components**: テクスチャを参照するコンポーネントから取得

テクスチャデータは、以下の用途で使用できます:
- **高さマップ**: テクスチャの輝度値を高さとして使用
- **密度マップ**: ピクセル値をポイント密度として使用
- **カラーマップ**: RGB情報を属性として使用
- **マスク**: アルファチャンネルをマスクとして使用

## プロパティ

現在のPCGプラグインでは、明示的な"Get Texture Data"ノードは見つかりませんでした。テクスチャデータの取得は以下の方法で行われます:

### 代替方法1: Texture Sampler
`UPCGTextureSamplerSettings`を使用してテクスチャデータをサンプリング

### 代替方法2: Sample Texture
既存のポイントデータに対してテクスチャをサンプリング

### 代替方法3: Get Actor Data経由
テクスチャコンポーネントを持つアクターからデータを取得

## 使用例

### 例1: Texture Samplerを使用
```
Texture Sampler:
  Texture = MyTexture2D
  Transform = (適切なワールド位置とスケール)
  → テクスチャベースのサーフェスデータを生成
```

### 例2: Sample Textureでポイントにカラーを適用
```
Surface Sampler -> Sample Texture (Texture = ColorMap) -> カラー属性付きポイント
```

### 例3: 高さマップとしてテクスチャを使用
```
Texture Sampler -> Surface Sampler -> テクスチャの輝度に基づいた高さのポイント生成
```

## 実装の詳細

### UPCGTextureData の構造

```cpp
UPCGTextureData
{
    // テクスチャ参照
    Texture: UTexture2D*                    // ソーステクスチャ

    // トランスフォーム
    Transform: FTransform                   // ワールド空間でのトランスフォーム
    Bounds: FBox                            // バウンディングボックス

    // サンプリング設定
    DensityFunction: EPCGTextureDensityFunction  // 密度の計算方法
    ColorChannel: EPCGTextureColorChannel   // 使用するカラーチャンネル
    TexelSize: FVector2D                    // テクセルサイズ

    // フィルタリング
    bUseAdvancedTiling: bool                // タイリング設定
    Tiling: FVector2D                       // タイリング倍率

    // メタデータ
    Metadata: UPCGMetadata*                 // テクスチャ属性
}
```

### Texture Samplerの使用

Texture Samplerノードは、テクスチャからサーフェスデータを生成する最も一般的な方法です:

```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGTextureSamplerSettings : public UPCGSettings
{
    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    TObjectPtr<UTexture2D> Texture;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    FTransform Transform;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    bool bUseAbsoluteDensity = false;

    // その他の設定...
};
```

### 密度関数のオプション

```cpp
enum class EPCGTextureDensityFunction : uint8
{
    Ignore,         // 密度を無視（常に1.0）
    Multiply,       // テクスチャ値を密度として乗算
    // その他のオプション
};
```

### カラーチャンネルの選択

```cpp
enum class EPCGTextureColorChannel : uint8
{
    Red,
    Green,
    Blue,
    Alpha,
    Luminance   // RGB平均値
};
```

### データ取得のフロー（Texture Sampler使用）

1. **テクスチャの読み込み**: UTexture2Dアセットをロード
2. **トランスフォーム設定**: ワールド空間での位置、回転、スケールを設定
3. **データ作成**: UPCGTextureDataを作成
4. **サンプリング設定**: 密度関数、カラーチャンネルなどを設定
5. **出力**: テクスチャデータをサーフェスデータとして出力

### Sample Textureの使用

既存のポイントデータに対してテクスチャ情報を適用:

```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGSampleTextureSettings : public UPCGSettings
{
    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    TObjectPtr<UTexture2D> Texture;

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    FName OutputAttributeName = "TextureColor";

    UPROPERTY(BlueprintReadWrite, EditAnywhere, Category = Settings)
    EPCGTextureColorChannel ColorChannel = EPCGTextureColorChannel::Luminance;

    // その他の設定...
};
```

### テクスチャの座標変換

ワールド座標からUV座標への変換:

```cpp
FVector2D WorldToUV(const FVector& WorldPosition, const FTransform& TextureTransform)
{
    // ワールド座標をローカル座標に変換
    FVector LocalPos = TextureTransform.InverseTransformPosition(WorldPosition);

    // ローカル座標をUV座標に変換（0-1範囲）
    FVector2D UV;
    UV.X = (LocalPos.X + 0.5f); // -0.5~0.5 を 0~1 に変換
    UV.Y = (LocalPos.Y + 0.5f);

    return UV;
}
```

### テクスチャデータのサンプリング

```cpp
float SampleTexture(UTexture2D* Texture, const FVector2D& UV, EPCGTextureColorChannel Channel)
{
    // テクスチャからピクセル値を取得
    FColor PixelColor = Texture->GetPixelColor(UV);

    // 指定されたチャンネルの値を返す
    switch (Channel)
    {
        case EPCGTextureColorChannel::Red:
            return PixelColor.R / 255.0f;
        case EPCGTextureColorChannel::Green:
            return PixelColor.G / 255.0f;
        case EPCGTextureColorChannel::Blue:
            return PixelColor.B / 255.0f;
        case EPCGTextureColorChannel::Alpha:
            return PixelColor.A / 255.0f;
        case EPCGTextureColorChannel::Luminance:
            return (PixelColor.R + PixelColor.G + PixelColor.B) / (3.0f * 255.0f);
        default:
            return 1.0f;
    }
}
```

## パフォーマンス考慮事項

1. **テクスチャ解像度**: 高解像度テクスチャはメモリと処理時間を消費
2. **ミップマップ**: ミップマップを使用することで、遠距離でのサンプリングが効率化
3. **テクスチャ形式**: 圧縮テクスチャは読み込み時に展開が必要
4. **キャッシュ**: テクスチャデータはキャッシュされるため、再利用時は高速

## テクスチャデータの活用パターン

### 1. 密度マップとして使用
```
Texture Sampler -> Surface Sampler
→ テクスチャの明るい部分に高密度でポイント生成
```

### 2. 高さマップとして使用
```
Texture Sampler (高さマップ) -> Surface Sampler -> ポイント高さを調整
```

### 3. カラー情報の取得
```
Points -> Sample Texture -> カラー属性を追加
→ テクスチャのRGB値をポイント属性として格納
```

### 4. マスクとして使用
```
Texture Sampler (マスク) -> Density Filter -> マスク領域のみポイント生成
```

## トラブルシューティング

### テクスチャが正しくサンプリングされない

**原因**:
- トランスフォーム設定が正しくない
- UV座標の計算ミス
- テクスチャのインポート設定

**解決策**:
```
1. Transform設定を確認（位置、回転、スケール）
2. テクスチャのsRGB設定を確認
3. テクスチャ圧縮設定を確認（UserInterface2Dやデフォルト）
```

### パフォーマンスの問題

**原因**:
- 高解像度テクスチャ
- 多数のサンプリングポイント

**解決策**:
```
1. テクスチャ解像度を下げる
2. ミップマップを有効化
3. テクスチャ圧縮を使用
```

## 注意事項

1. **テクスチャの読み込み**: テクスチャはメモリにロードされるため、大きなテクスチャは注意
2. **座標系**: トランスフォーム設定が重要（ワールド座標とテクスチャUVのマッピング）
3. **フィルタリング**: テクスチャフィルタリング設定（Point, Bilinear, Trilinear）がサンプリング結果に影響
4. **ランタイム**: レンダーターゲットを使用する場合、ランタイムでの更新に対応

## 関連ノード
- Texture Sampler (テクスチャからサーフェスデータを生成)
- Sample Texture (ポイントにテクスチャ情報を適用)
- Surface Sampler (サーフェスからポイントを生成)
- Density Filter (密度に基づくフィルタリング)

## 追加情報

現在のPCGプラグインでは、専用の"Get Texture Data"ノードは実装されていない可能性があります。代わりに以下のノードを使用してください:

1. **Texture Sampler**: テクスチャから直接サーフェスデータを生成
2. **Sample Texture**: 既存のポイントにテクスチャ情報を適用
3. **カスタム実装**: プロジェクト固有の要件がある場合

これらのノードを組み合わせることで、テクスチャデータを効果的にPCGワークフローに統合できます。
