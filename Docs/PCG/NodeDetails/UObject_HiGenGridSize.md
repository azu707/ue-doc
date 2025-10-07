# U Object (HiGen Grid Size)

## 概要

**U Object (HiGen Grid Size)**ノードは、下流のノードの実行グリッドサイズを設定するノードです。階層的生成（Hierarchical Generation）を有効にし、単一のグラフを複数のグリッド階層で実行できるようにします。

カテゴリ: HierarchicalGeneration
クラス名: `UPCGHiGenGridSizeSettings`
エレメント: `FPCGHiGenGridSizeElement`

## 機能詳細

このノードは、PCGシステムの階層的生成機能の中核を担います。大規模なワールドを複数のグリッドレベルで処理することで、パフォーマンスを最適化し、詳細レベル（LOD）に基づいた生成を可能にします。

### 主な特徴

- 下流ノードの実行グリッドサイズを制御
- 階層的生成をサポート
- 動的ピン（入力/出力）
- プリコンフィグ設定で簡単に選択
- 入力ピンの表示/非表示を切り替え可能

## プロパティ

### HiGenGridSize
- **型**: `EPCGHiGenGrid` (enum)
- **デフォルト値**: `EPCGHiGenGrid::Grid256`
- **カテゴリ**: Settings
- **表示名**: "HiGen Grid Size"
- **説明**: 階層的生成グリッドサイズ。以下の値があります:
  - **Uninitialized**: 初期化されていない
  - **Unbounded**: 境界なし
  - **Grid256**: 256単位グリッド（25600cm = 256m）
  - **Grid512**: 512単位グリッド
  - **Grid1024**: 1024単位グリッド
  - **Grid2048**: 2048単位グリッド
  - **Grid4096**: 4096単位グリッド
  - **Grid8192**: 8192単位グリッド
  - **Grid16384**: 16384単位グリッド
  - **Grid32768**: 32768単位グリッド
  - その他のサイズ...

### bShowInputPin
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: このプロパティはユーザーから隠されており、Grid Sizeノードの動作を駆動します。入力ピンの表示を制御します。

## 入力ピン

### Input (動的、条件付き)
- **型**: 動的（任意のPCGデータ型）
- **条件**: `bShowInputPin = true`
- **説明**: 上流からのデータを受け取ります。

## 出力ピン

### Output (動的)
- **型**: 動的（入力と同じ型）
- **説明**: 入力データをそのまま出力し、下流のノードにグリッドサイズ設定を伝播します。

## 使用例

### 基本的な階層的生成

```
[GetLandscapeData] → [HiGen Grid Size: Grid2048] → [TreeSpawner]
                                                  → [HiGen Grid Size: Grid512] → [GrassSpawner]

// Grid2048: 広い範囲で木をスポーン（低密度）
// Grid512: 狭い範囲で草をスポーン（高密度）
```

### 詳細レベルの制御

```
[DataSource] → [HiGen Grid Size: Grid8192] → [DistantObjectsSpawner]
            → [HiGen Grid Size: Grid1024] → [MediumObjectsSpawner]
            → [HiGen Grid Size: Grid256]  → [DetailObjectsSpawner]
```

### プリコンフィグからの選択

エディタでは、ノードを配置する際にプリコンフィグメニューから直接グリッドサイズを選択できます:
- Grid 256
- Grid 512
- Grid 1024
- Grid 2048
- ...

## 実装の詳細

### GetGrid() メソッド

```cpp
EPCGHiGenGrid UPCGHiGenGridSizeSettings::GetGrid() const
{
    return HiGenGridSize;
}
```

現在のグリッド設定を返します。

### GetGridSize() メソッド

```cpp
uint32 UPCGHiGenGridSizeSettings::GetGridSize() const
{
    return PCGHiGenGrid::GridToGridSize(HiGenGridSize);
}
```

グリッドサイズを整数値（Unreal単位）で返します。

### GetCurrentPinTypes() メソッド

このノードは動的ピンを持ち、接続されたデータ型に基づいてピンタイプを調整します。

### ExecuteInternal メソッド

`FPCGHiGenGridSizeElement::ExecuteInternal` は以下を実行します:

1. **入力データの取得**: コンテキストから入力データを取得
2. **グリッド情報の設定**: 出力データにグリッドサイズ情報を設定
3. **データのパススルー**: 入力データを出力にコピー（データ自体は変更しない）
4. **ベースポイントデータのサポート**: ポイントデータを直接サポート

### 依存関係のCRC

`GetDependenciesCrc()` メソッドは、グリッドサイズ設定の変更を検出するためのCRCを計算します。

## プリコンフィグ設定

このノードは、すべてのグリッドサイズに対するプリコンフィグ設定を提供します:

```cpp
virtual TArray<FPCGPreConfiguredSettingsInfo> GetPreconfiguredInfo() const override;
virtual bool OnlyExposePreconfiguredSettings() const override { return true; }
```

エディタでは、プリコンフィグ設定のみが公開されます。

## 追加タイトル情報

`GetAdditionalTitleInformation()` メソッドは、ノードタイトルにグリッドサイズを表示します:

```
"HiGen Grid Size: 2048"
```

これにより、グラフエディタで各ノードのグリッドサイズを簡単に識別できます。

## パフォーマンス考慮事項

1. **グリッドサイズの選択**: 適切なグリッドサイズの選択がパフォーマンスに大きく影響します
   - 大きいグリッド: 広範囲をカバーするが、詳細が少ない
   - 小さいグリッド: 詳細が多いが、処理範囲が狭い

2. **階層化**: 複数のグリッドサイズを組み合わせることで、効率的な詳細レベル管理が可能

3. **データの重複**: 異なるグリッドサイズで同じデータソースを使用する場合、データの重複に注意

## 階層的生成の概念

### グリッドシステム

PCGの階層的生成は、ワールドを複数のグリッドレベルに分割します:

- **Grid 32768** (3276800cm = 32.768km): 超大規模な地形要素
- **Grid 16384** (1638400cm = 16.384km): 大規模な地形要素
- **Grid 8192** (819200cm = 8.192km): 大きな地形要素
- **Grid 4096** (409600cm = 4.096km): 中規模な地形要素
- **Grid 2048** (204800cm = 2.048km): 中規模な要素
- **Grid 1024** (102400cm = 1.024km): 小規模な要素
- **Grid 512** (51200cm = 512m): 詳細な要素
- **Grid 256** (25600cm = 256m): 非常に詳細な要素

### LODとの関係

階層的生成は、LOD（Level of Detail）システムと密接に関連しています:

- 遠景: 大きいグリッドサイズで粗い生成
- 中景: 中程度のグリッドサイズで中程度の詳細
- 近景: 小さいグリッドサイズで高い詳細

## エディタでの使用

### デフォルトノード名とタイトル

`GetDefaultNodeName()` と `GetDefaultNodeTitle()` は、選択されたグリッドサイズに基づいて動的にノード名とタイトルを生成します。

### ツールチップ

`GetNodeTooltipText()` は、階層的生成の概念を説明するツールチップを提供します。

## 変換とプリコンフィグ

### GetConversionInfo()

他のノードからこのノードへの変換情報を提供します。

### ConvertNode()

変換ロジックを実装し、プリコンフィグ情報に基づいてノード設定を更新します。

## プロパティ変更の検出

`GetChangeTypeForProperty()` メソッドは、`HiGenGridSize` プロパティの変更を検出し、適切な更新タイプ（構造的変更など）を返します。

## 実行依存ピン

`HasExecutionDependencyPin()` は `bShowInputPin` の値に基づいて true/false を返します。入力ピンが表示されている場合、実行依存があります。

## 関連ノード

このノードは階層的生成システムの中核であり、他の多くのノードと組み合わせて使用されます:

- **Get Landscape Data**: ランドスケープデータを階層的に取得
- **Spawn Actor**: 階層的にアクターをスポーン
- **Point Sampler**: グリッドサイズに応じたサンプリング
- すべてのPCGノード: このノードの下流で実行されるすべてのノードが影響を受けます

## 注意事項

- `HiGenGridSize` プロパティはプリコンフィグ設定からのみ変更することを推奨
- グリッドサイズの選択は、ワールドのスケールと詳細レベルの要件に基づいて行う
- 異なるグリッドサイズを組み合わせる場合、データの整合性に注意
- World Partitionシステムと連携して動作します

## ベストプラクティス

1. **大→小の階層**: 大きいグリッドから小さいグリッドへと階層化
2. **用途に応じた選択**: オブジェクトのサイズと重要性に基づいてグリッドサイズを選択
3. **パフォーマンステスト**: 実際のワールドでパフォーマンスをテストして最適なグリッドサイズを決定
4. **一貫性**: 類似のオブジェクトには同じグリッドサイズを使用

## まとめ

HiGen Grid Sizeノードは、PCGシステムの階層的生成機能を活用して、大規模なワールドで効率的にコンテンツを生成するための重要なツールです。適切なグリッドサイズの選択と階層化により、パフォーマンスと詳細レベルのバランスを最適化できます。
