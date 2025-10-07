# Sample Texture

## 概要

**ノードタイプ**: Sampler
**クラス**: UPCGSampleTextureSettings
**エレメント**: FPCGSampleTextureElement

Sample Textureノードは、各ポイントの位置でテクスチャの色をサンプリングし、その色情報をポイントの属性として適用します。テクスチャデータを使用してポイントの密度や色を制御するための強力なツールです。

## 機能詳細

Sample Textureノードは、入力ポイントの位置を使用してテクスチャから色情報をサンプリングします。サンプリング方法は2つあり、テクスチャデータの平面投影を使用する方法と、ポイントの明示的なUV座標を使用する方法があります。サンプリングした色情報は、ポイントの密度や色属性として適用できます。

主な機能:
- テクスチャデータからの色サンプリング
- 平面投影またはUV座標によるマッピング
- 密度への自動適用
- タイリングモード（Wrap/Clamp）のカスタマイズ
- メインスレッド実行による安全性

## プロパティ

### TextureMappingMethod
- **型**: EPCGTextureMappingMethod
- **デフォルト値**: Planar
- **説明**: サンプル位置の解釈方法を指定します
  - `Planar`: テクスチャデータからの平面投影を使用。テクスチャの設定に従って座標が変換されます
  - `UVCoordinates`: ポイントの明示的なUV座標を使用。0-1のUV空間として位置を扱います
- **オーバーライド可能**: はい

### UVCoordinatesAttribute
- **型**: FPCGAttributePropertyInputSelector
- **デフォルト値**: なし
- **説明**: テクスチャをサンプリングするためのサンプル位置を提供する属性。UV座標（通常はVector2D）を含む属性を指定します
- **オーバーライド可能**: はい
- **編集条件**: TextureMappingMethod == UVCoordinates
- **表示名**: "UV Coordinates Attribute"

### TilingMode
- **型**: EPCGTextureAddressMode
- **デフォルト値**: Wrap
- **説明**: テクスチャのUVをラップまたはクランプするようにタイリングをオーバーライドします
  - `Wrap`: UVが0-1の範囲を超えた場合、繰り返します
  - `Clamp`: UVが0-1の範囲を超えた場合、端の色を使用します
- **オーバーライド可能**: はい
- **編集条件**: TextureMappingMethod == UVCoordinates

### DensityMergeFunction
- **型**: EPCGDensityMergeOperation
- **デフォルト値**: Set
- **説明**: 初期データに対する密度計算の動作を制御します
  - `Set`: サンプリングした値で密度を設定（置き換え）
  - `Minimum`: 現在の密度とサンプリング値の小さい方を使用
  - `Maximum`: 現在の密度とサンプリング値の大きい方を使用
  - `Add`: サンプリング値を現在の密度に加算
  - `Subtract`: サンプリング値を現在の密度から減算
  - `Multiply`: サンプリング値を現在の密度に乗算
- **オーバーライド可能**: はい

### bClampOutputDensity
- **型**: bool
- **デフォルト値**: true
- **説明**: 出力密度を0-1の範囲にクランプするかどうかを制御します。falseの場合、密度が1を超えたり、0未満になったりする可能性があります
- **オーバーライド可能**: はい

## 入力ピン

### Point
- **型**: Point Data
- **説明**: サンプリング対象のポイント
- **ラベル**: "Point"

### BaseTexture
- **型**: Texture Data
- **説明**: サンプリングするテクスチャデータ
- **ラベル**: "BaseTexture"

## 出力ピン

### Out
- **型**: Point Data
- **説明**: テクスチャからサンプリングされた色と密度が適用されたポイント

## 使用例

### 例1: ハイトマップベースの密度制御
地形のハイトマップを使用してポイントの密度を制御する場合:
1. Surface Samplerで地形上にポイントを生成
2. Get Texture Dataでハイトマップをテクスチャデータとして取得
3. Sample Textureノードで接続:
   - TextureMappingMethod: Planar（地形の平面投影を使用）
   - DensityMergeFunction: Multiply（既存の密度に乗算）
   - bClampOutputDensity: true
4. 高い場所ほど密度が高くなり、ポイントが多く残ります

### 例2: マスクテクスチャによる配置制御
2Dマスクテクスチャを使用して特定のエリアにのみオブジェクトを配置する場合:
1. Create Points Gridでグリッドを生成
2. マスクテクスチャをPCGテクスチャデータとして用意
3. Sample Textureノードで:
   - TextureMappingMethod: Planar
   - DensityMergeFunction: Set（マスクで直接制御）
   - bClampOutputDensity: true
4. Density Filterで密度が高いポイントのみを残す
5. 白い領域にのみオブジェクトが配置されます

### 例3: UV座標ベースのカラーサンプリング
メッシュのUV座標を使用してテクスチャから色を取得する場合:
1. メッシュからポイントを生成し、UV属性を持つポイントセットを用意
2. カラーテクスチャをPCGテクスチャデータとして用意
3. Sample Textureノードで:
   - TextureMappingMethod: UVCoordinates
   - UVCoordinatesAttribute: "UV"（メッシュのUV属性）
   - TilingMode: Wrap（またはClamp）
   - DensityMergeFunction: Set
4. ポイントはテクスチャの色を持ち、それをスポーンするメッシュの色として使用できます

### 例4: グラデーションテクスチャによる密度のグラデーション
グラデーションテクスチャを使用して密度を段階的に変化させる場合:
1. Surface Samplerで平面上にポイントを生成
2. グラデーションテクスチャ（左から右へ黒から白）を用意
3. Sample Textureノードで:
   - TextureMappingMethod: Planar
   - DensityMergeFunction: Multiply
   - bClampOutputDensity: true
4. ポイントの密度が位置に応じて段階的に変化します

## 実装の詳細

### 処理フロー

1. **入力の取得**: ポイントデータとテクスチャデータを入力から取得
2. **マッピング方法の決定**: TextureMappingMethodに基づいてサンプリング座標を計算
   - **Planar**: テクスチャデータの変換を使用して3D位置を2D UV座標にマッピング
   - **UVCoordinates**: 指定された属性から直接UV座標を取得
3. **テクスチャサンプリング**: 各ポイントについて、計算されたUV座標でテクスチャから色をサンプリング
4. **タイリングの適用**: TilingModeに基づいてUV座標をラップまたはクランプ
5. **密度の計算**: サンプリングした色の明度（または特定のチャンネル）から密度値を計算
6. **密度のマージ**: DensityMergeFunctionに基づいて既存の密度と新しい密度を結合
7. **クランプ**: bClampOutputDensityがtrueの場合、密度を0-1の範囲にクランプ
8. **色の適用**: サンプリングした色をポイントの色属性に適用
9. **出力の生成**: 更新されたポイントデータを出力

### コードスニペット

**テクスチャマッピング方法の列挙型**:
```cpp
UENUM()
enum class EPCGTextureMappingMethod : uint8
{
    Planar UMETA(DisplayName = "Planar From Texture Data"),
    UVCoordinates UMETA(DisplayName = "Use Explicit Points UV Coordinates")
};
```

**メインスレッド実行の要件**:
```cpp
// テクスチャのロードとPCG外のオブジェクトへのアクセスは
// スレッドセーフでない可能性があるため、メインスレッドで実行
virtual bool CanExecuteOnlyOnMainThread(FPCGContext* Context) const override
{
    return true;
}
```

**シングルプライマリピンループモード**:
```cpp
virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override
{
    return EPCGElementExecutionLoopMode::SinglePrimaryPin;
}
```

## パフォーマンス考慮事項

1. **メインスレッド実行**: このノードはメインスレッドでのみ実行されるため、大量のポイントを処理する場合は処理時間が長くなる可能性があります。

2. **テクスチャ解像度**: 高解像度のテクスチャを使用すると、サンプリングのコストが増加します。必要な品質に応じて適切な解像度を選択してください。

3. **UV座標の計算**: UVCoordinatesモードを使用する場合、属性アクセスのコストが追加されます。大量のポイントがある場合は、属性アクセスのパフォーマンスに注意してください。

4. **密度マージ操作**: SetやMultiplyは比較的高速ですが、より複雑な操作（AddやSubtract）はわずかにコストが高くなります。

5. **ポイント数の最適化**: テクスチャサンプリングは各ポイントで実行されるため、不要なポイントは事前にフィルタリングすることでパフォーマンスを向上させることができます。

## 関連ノード

- **Get Texture Data**: テクスチャアセットからPCGテクスチャデータを取得
- **Density Filter**: 密度に基づいてポイントをフィルタリング
- **Density Remap**: 密度の範囲を再マッピング
- **Surface Sampler**: サーフェス上にポイントを生成
- **Attribute Remap**: 属性値の範囲を変換
- **Point Match And Set**: ポイント間で属性をマッチングして設定

## 注意事項

- このノードはメインスレッドでのみ実行されます。大量のポイントを処理する場合は、処理時間に注意してください。
- テクスチャデータの変換行列は、Planarモードでのみ使用されます。
- UVCoordinatesモードを使用する場合、指定された属性がVector2D型であることを確認してください。
- bClampOutputDensityをfalseに設定すると、密度が1を超えたり負の値になったりする可能性があります。これは特定のワークフローで有用ですが、予期しない結果を招く可能性があります。
- Base Point Data入力をサポートしています。
- 複数のポイントデータ入力がある場合、SinglePrimaryPinモードで各入力を順次処理します。
