# Get Spline Data

## 概要

Get Spline Dataノードは、選択されたアクターからスプライン（ポリライン）データのコレクションを構築するノードです。スプラインコンポーネントを持つアクターを検索し、それらのスプライン情報をPCGで利用可能なポリラインデータとして抽出します。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetSplineSettings`
**エレメント**: `FPCGDataFromActorElement`（基底クラスのエレメントを使用）
**基底クラス**: `UPCGDataFromActorSettings`

## 機能詳細

Get Spline Dataノードは、以下のタイプのスプラインコンポーネントからデータを取得できます:

1. **USplineComponent**: 標準のスプラインコンポーネント
2. **ULandscapeSplineControlPoint**: ランドスケープスプライン制御点
3. **ULandscapeSplineSegment**: ランドスケープスプラインセグメント
4. **カスタムスプライン**: スプラインインターフェースを実装したカスタムコンポーネント

スプラインデータには、スプラインのカーブ情報、長さ、制御点、タンジェントなどが含まれます。

## プロパティ

このノードは`UPCGDataFromActorSettings`から継承されたプロパティを使用します。スプラインデータ特有の設定は以下の通りです:

### ActorSelector (FPCGActorSelectorSettings)
スプラインコンポーネントを持つアクターを選択します。
- **型**: `FPCGActorSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### ComponentSelector (FPCGComponentSelectorSettings)
どのスプラインコンポーネントを選択するかを指定します。
- **型**: `FPCGComponentSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### Mode (自動設定)
このノードでは、常に`ParseActorComponents`モードが使用されます。
- **デフォルト値**: `EPCGGetDataFromActorMode::ParseActorComponents`
- **注**: モード設定UIは非表示

## 使用例

### 例1: レベル内のすべてのスプラインアクターからデータを取得
```
Get Spline Data:
  ActorSelector.ActorFilter = AllWorldActors
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = SplineActor
```

### 例2: 特定のタグを持つスプラインのみを取得
```
Get Spline Data:
  ActorSelector.ActorFilter = ByTag
  ActorSelector.Tag = "RoadSpline"
  ComponentSelector.bFilterByTag = true
  ComponentSelector.ComponentTag = "MainRoad"
```

### 例3: PCGコンポーネントの境界内のスプラインのみを取得
```
Get Spline Data:
  ActorSelector.bMustOverlapSelf = true
  → PCGコンポーネントのバウンドと重なるスプラインのみが取得される
```

### 例4: スプラインに沿ってポイントを生成
```
Get Spline Data -> Spline Sampler -> ポイント生成
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (PolyLine)**: スプライン（ポリライン）データのコレクション
  - **型**: `EPCGDataType::PolyLine`
  - **複数接続**: 可能
  - **複数データ**: 可能（各スプラインコンポーネントごとに個別のデータ）

### データフィルター
```cpp
virtual EPCGDataType GetDataFilter() const override { return EPCGDataType::PolyLine; }
```

### コンストラクタ
```cpp
UPCGGetSplineSettings::UPCGGetSplineSettings()
{
    Mode = EPCGGetDataFromActorMode::ParseActorComponents;
    // その他の基底クラスの設定を使用
}
```

### モード設定の非表示
```cpp
#if WITH_EDITOR
virtual bool DisplayModeSettings() const override { return false; }
#endif
```

このノードでは常にコンポーネント解析モードを使用するため、モード選択は非表示になっています。

### 出力ピンプロパティ

```cpp
TArray<FPCGPinProperties> UPCGGetSplineSettings::OutputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;
    PinProperties.Emplace(PCGPinConstants::DefaultOutputLabel, EPCGDataType::PolyLine,
        /*bAllowMultipleConnections=*/true, /*bAllowMultipleData=*/true);
    return PinProperties;
}
```

### スプラインデータの構造

各スプラインコンポーネントから作成される`UPCGPolyLineData`には以下の情報が含まれます:

```cpp
UPCGPolyLineData
{
    // 基本プロパティ
    SourceComponent: USplineComponent*      // ソーススプラインコンポーネント
    Transform: FTransform                   // ワールド空間でのトランスフォーム
    Bounds: FBox                            // バウンディングボックス

    // スプライン情報
    NumSegments: int32                      // セグメント数
    bClosed: bool                           // クローズドスプラインかどうか
    Length: float                           // 全体の長さ

    // 制御点情報
    VerticesEntryKeys: TArray<PCGMetadataEntryKey>  // 各制御点のメタデータキー

    // メタデータ
    Metadata: UPCGMetadata*                 // スプライン属性
}
```

### データ取得のフロー

1. **アクター検索**: `ActorSelector`設定に基づいてアクターを検索
2. **スプラインコンポーネント列挙**:
   ```cpp
   for (UActorComponent* Component : Actor->GetComponents())
   {
       if (USplineComponent* SplineComp = Cast<USplineComponent>(Component))
       {
           // スプラインコンポーネントを処理
       }
   }
   ```
3. **フィルタリング**:
   - `ComponentSelector`に基づいてコンポーネントをフィルタリング
   - バウンドチェック（`bMustOverlapSelf`が有効な場合）
4. **データ作成**: 各スプラインコンポーネントに対して`UPCGPolyLineData`を作成
5. **メタデータの抽出**: スプラインの属性をメタデータとして追加
6. **出力**: 作成されたスプラインデータを出力ピンに追加

### スプラインコンポーネントの属性

スプラインコンポーネントから以下の情報が自動的に抽出されます:

- **Transform**: スプラインのワールドトランスフォーム
- **Bounds**: スプライン全体のバウンディングボックス
- **Length**: スプラインの全長
- **Segments**: セグメント数
- **IsClosed**: クローズドスプラインかどうか
- **Control Points**: 制御点の位置、回転、スケール、タンジェント

### スプラインタイプのサポート

#### 標準スプライン
```cpp
USplineComponent* StandardSpline;
// 最も一般的なスプラインタイプ
// SplineActorやカスタムアクターに含まれる
```

#### ランドスケープスプライン
```cpp
ULandscapeSplineControlPoint* LandscapeControlPoint;
ULandscapeSplineSegment* LandscapeSegment;
// ランドスケープスプラインシステム用
// 道路、川などの地形に沿ったスプライン
```

#### カスタムスプライン
```cpp
// ISplineInterfaceを実装したカスタムコンポーネント
// プロジェクト固有のスプライン実装
```

### パフォーマンス考慮事項

1. **スプライン数**: 多数のスプラインコンポーネントがある場合、処理時間が増加
2. **バウンドチェック**: `bMustOverlapSelf = true`で不要なスプラインをフィルタリング
3. **複雑なスプライン**: 多数の制御点を持つスプラインの処理コストが高い
4. **動的トラッキング**: スプラインの変更を追跡する場合、オーバーヘッドが発生

### 動的トラッキング

```cpp
virtual bool CanDynamicallyTrackKeys() const override { return true; }
```

このノードは動的トラッキングをサポートしており、以下の変更を検出できます:
- スプラインアクターの追加・削除
- スプラインコンポーネントの変更
- 制御点の移動・追加・削除
- スプラインの形状変更

## スプラインデータの使用

取得したスプラインデータは、以下のようなノードで使用できます:

### Spline Sampler
```
Get Spline Data -> Spline Sampler -> スプラインに沿ったポイント生成
```
スプライン上に均等または距離ベースでポイントをサンプリング

### Get Spline Control Points
```
Get Spline Data -> Get Spline Control Points -> 制御点のみを抽出
```

### Projection
```
Points -> Projection (Target: Spline Data) -> スプラインに投影
```

### Create Surface From Spline
```
Get Spline Data -> Create Surface From Spline -> サーフェス生成
```

### Spline Mesh Spawner
```
Get Spline Data -> Spawn Spline Mesh -> スプラインメッシュの生成
```

## トラブルシューティング

### スプラインが検出されない

**原因**:
- アクターセレクター設定が正しくない
- スプラインコンポーネントが無効化されている
- バウンドが重なっていない

**解決策**:
```
1. ActorSelector.ActorFilter を確認
2. ActorSelector.bMustOverlapSelf を false に設定してテスト
3. コンポーネントセレクター設定を確認
```

### 空のスプラインデータが出力される

**原因**:
- スプラインに制御点がない
- スプラインコンポーネントが正しく初期化されていない

**解決策**:
```
1. スプラインエディタで制御点を確認
2. BeginPlayでスプラインが正しく構築されているか確認
```

### パフォーマンスの問題

**原因**:
- 多数のスプラインコンポーネントを処理している
- 複雑なスプライン（多数の制御点）

**解決策**:
```
1. bMustOverlapSelf = true で範囲を制限
2. ComponentSelector でタグフィルタリングを使用
3. ActorSelector で特定のアクタークラスのみを対象
```

## 注意事項

1. **スプラインの更新**: ランタイムでスプラインを変更する場合、PCGグラフの再実行が必要
2. **ランドスケープスプライン**: ランドスケープスプラインは専用の処理が必要な場合があります
3. **メモリ使用**: 大量のスプラインからデータを取得する場合、メモリ使用量に注意
4. **座標系**: スプラインデータはワールド空間で提供されます

## 関連ノード
- Get Actor Data (基底クラス)
- Spline Sampler (スプラインのサンプリング)
- Get Spline Control Points (制御点の抽出)
- Create Spline (ポイントからスプライン作成)
- Create Surface From Spline (スプラインからサーフェス作成)
- Spawn Spline Mesh (スプラインメッシュの生成)
