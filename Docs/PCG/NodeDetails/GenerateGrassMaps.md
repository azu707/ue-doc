# Generate Grass Maps

## 概要

**Generate Grass Maps**ノードは、ランドスケープの草マップをGPU上で生成するノードです。ランドスケープコンポーネントから草タイプデータを抽出し、テクスチャデータとして出力します。

カテゴリ: GPU
クラス名: `UPCGGenerateGrassMapsSettings`
エレメント: `FPCGGenerateGrassMapsElement`

## 機能詳細

このノードは、Unreal Engineのランドスケープシステムの草生成機能を活用し、草の重み情報をGPUで生成します。生成されたテクスチャデータは、PCGシステム内で草の配置や密度制御に使用できます。

### 主な特徴

- GPU上での草マップ生成
- 複数の草タイプの選択的生成
- 入力からの草タイプオーバーライド
- CPU読み戻しのスキップオプション
- ランドスケープコンポーネントの自動フィルタリング

## プロパティ

### SelectedGrassTypes
- **型**: `TArray<FString>`
- **デフォルト値**: 空配列
- **カテゴリ**: Settings
- **条件**: `!bOverrideFromInput`
- **説明**: 生成する草タイプを選択します。草タイプの名前を文字列の配列として指定します。

### bOverrideFromInput
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **説明**: 入力から草タイプをオーバーライドします。trueの場合、`GrassTypesAttribute` から草タイプを取得します。

### GrassTypesAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: なし
- **カテゴリ**: Settings
- **条件**: `bOverrideFromInput`
- **メタデータ**: `PCG_DiscardPropertySelection`, `PCG_DiscardExtraSelection`
- **説明**: 草タイプの文字列を取得する入力属性。`bOverrideFromInput` が true の場合に使用されます。

### bExcludeSelectedGrassTypes
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: トグルすると、選択された草タイプ以外のみを生成します。除外フィルタとして機能します。

### bSkipReadbackToCPU
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **説明**: テクスチャデータの初期化時に、生成されたテクスチャのCPU読み戻しをスキップします。GPU専用処理の場合、パフォーマンスが向上します。

## 入力ピン

動的に定義されます。通常、ランドスケープコンポーネントデータまたは空間データを受け取ります。

## 出力ピン

動的に定義されます。生成された草マップテクスチャデータを出力します。

## コンテキスト

### FPCGGenerateGrassMapsContext

このノードは専用のコンテキストクラスを使用します:

#### LandscapeGrassWeightExporter
- **型**: `FLandscapeGrassWeightExporter*`
- **デフォルト値**: `nullptr`
- **説明**: ランドスケープ草重みエクスポーター。ゲームスレッドでのみ存在する必要があります。

#### TextureDatas
- **型**: `TArray<TObjectPtr<UPCGTextureData>>`
- **説明**: 出力テクスチャデータオブジェクト

#### GrassMapHandle
- **型**: `TRefCountPtr<IPooledRenderTarget>`
- **デフォルト値**: `nullptr`
- **説明**: エクスポートされた結果のテクスチャ配列

#### SelectedGrassTypes
- **型**: `TArray<TTuple<TWeakObjectPtr<ULandscapeGrassType>, int32>>`
- **説明**: 生成用に選択された草タイプのリスト。テクスチャインデックスも保持します。配列は疎である可能性がありますが、実際に生成されるテクスチャ配列は常にすべての草タイプを含みます。

#### NumGrassTypes
- **型**: `int32`
- **デフォルト値**: `0`
- **説明**: ランドスケープコンポーネントで使用される草タイプの総数。生成用に選択されなかった草タイプも含みます。

#### LandscapeProxy
- **型**: `TWeakObjectPtr<ALandscapeProxy>`
- **説明**: ランドスケーププロキシへの弱参照

#### LandscapeComponents
- **型**: `TArray<TWeakObjectPtr<ULandscapeComponent>>`
- **説明**: 処理対象のランドスケープコンポーネント

#### GrassMapBounds
- **型**: `FBox`
- **デフォルト値**: `FBox(EForceInit::ForceInit)`
- **説明**: 草重みエクスポーターに渡されたすべてのランドスケープコンポーネントを含むワールド空間の境界

#### LandscapeComponentExtent
- **型**: `double`
- **デフォルト値**: `0.0`
- **説明**: 各ランドスケープコンポーネントの範囲（辺の長さ）

#### bLandscapeComponentsFiltered
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 受信したランドスケープコンポーネントを、指定された境界と重なるものにフィルタリングした場合true

#### bReadyToRender
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: ランドスケープコンポーネントがレンダリング準備完了の場合true

#### TexturesToStream
- **型**: `TArray<TObjectPtr<UTexture>>`
- **説明**: 草マップを生成する前にストリーミングを待機するテクスチャ

#### bTextureStreamingRequested
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: ランドスケープテクスチャでストリーミングが要求された場合true

#### bGenerationScheduled
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 草マップ生成がレンダースレッドでスケジュールされた場合true

## 使用例

### 基本的な使用方法

```
[GetLandscapeData] → [Generate Grass Maps]
                           ↓
                      [TextureData]
```

### 特定の草タイプの生成

```
// 設定:
SelectedGrassTypes = ["Grass_Short", "Grass_Tall"]
bExcludeSelectedGrassTypes = false

// これにより、Grass_Short と Grass_Tall の草マップのみが生成されます
```

### 草タイプの除外

```
// 設定:
SelectedGrassTypes = ["Grass_Unwanted"]
bExcludeSelectedGrassTypes = true

// これにより、Grass_Unwanted 以外のすべての草タイプが生成されます
```

### 入力からの草タイプ選択

```
[AttributeSet] → [Generate Grass Maps]
    ↓
 GrassTypeName = "Grass_Dynamic"

// 設定:
bOverrideFromInput = true
GrassTypesAttribute = "GrassTypeName"
```

## 実装の詳細

### ExecuteInternal メソッド

`FPCGGenerateGrassMapsElement::ExecuteInternal` は複数のフェーズで実行されます:

1. **ランドスケープコンポーネントのフィルタリング**: 入力境界と重なるコンポーネントを特定
2. **草タイプの選択**: 設定に基づいて生成する草タイプを決定
3. **テクスチャストリーミング**: 必要なランドスケープテクスチャのストリーミングを要求
4. **レンダリング準備**: コンポーネントがレンダリング可能になるまで待機
5. **草マップ生成のスケジュール**: レンダースレッドで草マップ生成をスケジュール
6. **完了待機**: 生成完了を待機
7. **テクスチャデータの作成**: 生成された草マップからPCGテクスチャデータを作成

### メインスレッド実行

`CanExecuteOnlyOnMainThread()` が true を返すため、このノードはメインスレッドでのみ実行されます。これは、`FLandscapeGrassWeightExporter` がゲームスレッドのスコープ内にのみ存在することを期待しているためです。

### 依存関係のCRC計算

`GetDependenciesCrc()` メソッドは、ランドスケープデータの変更を検出するための依存関係CRCを計算します。これにより、ランドスケープが変更された場合に草マップを再生成できます。

## パフォーマンス考慮事項

1. **GPU実行**: 草マップの生成はGPU上で行われるため、大規模なランドスケープでも高速です
2. **テクスチャストリーミング**: 必要なテクスチャがストリーミングされるまで待機するため、初回実行時に遅延が発生する可能性があります
3. **CPU読み戻し**: `bSkipReadbackToCPU = true` に設定すると、GPU専用処理でパフォーマンスが向上します
4. **コンポーネントフィルタリング**: 大規模なランドスケープでは、境界フィルタリングにより処理対象のコンポーネントを削減できます
5. **メモリ使用量**: 草マップテクスチャはメモリを消費するため、多数の草タイプを生成する場合は注意が必要です

## エディタでの使用

### 草タイプの選択

エディタでは、利用可能な草タイプのリストから選択できます。ランドスケープマテリアルで定義された草タイプが表示されます。

### プロパティの変更検出

`GetChangeTypeForProperty()` メソッドは、プロパティ変更時の適切な更新タイプを決定します。草タイプの選択変更は構造的な変更として扱われます。

## 草マップの詳細

### 草マップとは

草マップは、ランドスケープの各ポイントにおける草タイプの密度を表すグレースケールテクスチャです:
- **白（1.0）**: 最大密度
- **黒（0.0）**: 草なし
- **グレー（0.0-1.0）**: 部分的な密度

### 複数の草タイプ

ランドスケープは複数の草タイプを持つことができ、各草タイプには独自の草マップがあります。このノードは、選択された草タイプのマップを個別に生成します。

## 関連ノード

- **Custom HLSL**: 別のGPU実行ノード
- **Get Landscape Data**: ランドスケープデータの取得
- **Get Texture Data**: テクスチャデータの取得
- **Texture Sampler**: テクスチャからのサンプリング

## 注意事項

- すべての入力ピンが実行に必要です (`IsInputPinRequiredByExecution` が true)
- メインスレッドでのみ実行されます (`CanExecuteOnlyOnMainThread` が true)
- ランドスケープコンポーネントが必要です
- 草タイプはランドスケープマテリアルで定義されている必要があります
- 生成された草マップはテクスチャデータとして出力されます

## デバッグとトラブルシューティング

### 草マップが生成されない

- ランドスケープコンポーネントが入力に含まれているか確認
- 草タイプが正しく設定されているか確認
- ランドスケープマテリアルに草タイプが定義されているか確認

### パフォーマンスの問題

- `bSkipReadbackToCPU = true` を設定してCPU読み戻しをスキップ
- 必要な草タイプのみを選択
- 境界フィルタリングを使用して処理範囲を制限

### テクスチャストリーミングの遅延

- ランドスケープテクスチャのストリーミング設定を確認
- 必要なテクスチャが事前にロードされているか確認

## ベストプラクティス

1. **必要な草タイプのみ生成**: パフォーマンス向上のため、必要な草タイプのみを選択
2. **除外フィルタの活用**: 多数の草タイプがある場合、除外フィルタを使用
3. **GPU専用処理**: CPUでのテクスチャ使用が不要な場合、`bSkipReadbackToCPU = true` に設定
4. **境界の制限**: 大規模なランドスケープでは、処理範囲を制限してパフォーマンスを向上
