# Get Primitive Data

## 概要

Get Primitive Dataノードは、選択されたアクターのプリミティブコンポーネントからプリミティブデータのコレクションを構築するノードです。スタティックメッシュコンポーネント、ダイナミックメッシュコンポーネント、スケルタルメッシュコンポーネントなど、UPrimitiveComponentから派生したコンポーネントを持つアクターからデータを抽出します。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetPrimitiveSettings`
**エレメント**: `FPCGDataFromActorElement`（基底クラスのエレメントを使用）
**基底クラス**: `UPCGDataFromActorSettings`

## 機能詳細

Get Primitive Dataノードは、以下のタイプのプリミティブコンポーネントからデータを取得できます:

1. **Static Mesh Components**: スタティックメッシュのジオメトリとトランスフォーム
2. **Dynamic Mesh Components**: ダイナミックメッシュのジオメトリ
3. **Skeletal Mesh Components**: スケルタルメッシュのジオメトリ
4. **Shape Components**: ボックス、球、カプセルなどのシェイプコンポーネント
5. **その他のプリミティブ**: UPrimitiveComponentから派生したカスタムコンポーネント

プリミティブデータは、メッシュのバウンド、トランスフォーム、およびジオメトリ情報を含む空間データとして提供されます。

## プロパティ

このノードは`UPCGDataFromActorSettings`から継承されたプロパティを使用します。プリミティブデータ特有の設定は以下の通りです:

### ActorSelector (FPCGActorSelectorSettings)
プリミティブコンポーネントを持つアクターを選択します。
- **型**: `FPCGActorSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### ComponentSelector (FPCGComponentSelectorSettings)
どのプリミティブコンポーネントを選択するかを指定します。
- **型**: `FPCGComponentSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### bIgnorePCGGeneratedComponents (bool)
PCGによって生成されたコンポーネントを無視します。
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Data Retrieval Settings

### Mode (自動設定)
このノードでは、常に`ParseActorComponents`モードが使用されます。
- **デフォルト値**: `EPCGGetDataFromActorMode::ParseActorComponents`
- **注**: モード設定UIは非表示

## 使用例

### 例1: レベル内のすべてのスタティックメッシュアクターからデータを取得
```
Get Primitive Data:
  ActorSelector.ActorFilter = AllWorldActors
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = StaticMeshActor
  bIgnorePCGGeneratedComponents = true
```

### 例2: 特定のタグを持つメッシュコンポーネントのみを取得
```
Get Primitive Data:
  ActorSelector.ActorFilter = ByTag
  ActorSelector.Tag = "ScatterTarget"
  ComponentSelector.ComponentClass = StaticMeshComponent
  ComponentSelector.bFilterByTag = true
  ComponentSelector.ComponentTag = "Detailed"
```

### 例3: 境界内のプリミティブのみを取得
```
Get Primitive Data:
  ActorSelector.bMustOverlapSelf = true
  bIgnorePCGGeneratedComponents = true
  → PCGコンポーネントのバウンド内のプリミティブのみが取得される
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (Primitive)**: プリミティブデータのコレクション
  - **型**: `EPCGDataType::Primitive`
  - **複数接続**: 可能
  - **複数データ**: 可能（各プリミティブコンポーネントごとに個別のデータ）

### データフィルター
```cpp
virtual EPCGDataType GetDataFilter() const override { return EPCGDataType::Primitive; }
```

### コンストラクタ
```cpp
UPCGGetPrimitiveSettings::UPCGGetPrimitiveSettings()
{
    // 基底クラスの設定を使用
    Mode = EPCGGetDataFromActorMode::ParseActorComponents;
}
```

### モード設定の非表示
```cpp
#if WITH_EDITOR
virtual bool DisplayModeSettings() const override { return false; }
#endif
```
このノードでは常にコンポーネント解析モードを使用するため、モード選択は非表示になっています。

### プリミティブデータの構造

各プリミティブコンポーネントから作成される`UPCGPrimitiveData`には以下の情報が含まれます:

```cpp
UPCGPrimitiveData
{
    // 基本プロパティ
    SourceComponent: UPrimitiveComponent*  // ソースコンポーネントへの参照
    Transform: FTransform                   // ワールド空間でのトランスフォーム
    Bounds: FBox                            // バウンディングボックス

    // メッシュ情報（利用可能な場合）
    VoxelSize: FVector                      // ボクセル化の解像度（サンプリング用）

    // メタデータ
    Metadata: UPCGMetadata*                 // コンポーネントの属性
}
```

### データ取得のフロー

1. **アクター検索**: `ActorSelector`設定に基づいてアクターを検索
2. **コンポーネント列挙**:
   ```cpp
   for (UActorComponent* Component : Actor->GetComponents())
   {
       if (UPrimitiveComponent* PrimitiveComp = Cast<UPrimitiveComponent>(Component))
       {
           // プリミティブコンポーネントを処理
       }
   }
   ```
3. **フィルタリング**:
   - `bIgnorePCGGeneratedComponents`が有効な場合、PCG生成コンポーネントをスキップ
   - `ComponentSelector`に基づいてコンポーネントをフィルタリング
   - バウンドチェック（`bMustOverlapSelf`が有効な場合）
4. **データ作成**: 各プリミティブコンポーネントに対して`UPCGPrimitiveData`を作成
5. **属性の抽出**: コンポーネントのプロパティをメタデータ属性として追加
6. **出力**: 作成されたプリミティブデータを出力ピンに追加

### コンポーネント属性の自動抽出

プリミティブコンポーネントから以下の属性が自動的に抽出されます（実装依存）:

- **Transform属性**: Location, Rotation, Scale
- **Bounds属性**: BoundsMin, BoundsMax, BoundsExtent
- **Material属性**: マテリアルスロット情報（利用可能な場合）
- **カスタムプロパティ**: コンポーネントタイプ固有のプロパティ

### PCG生成コンポーネントの除外

```cpp
if (bIgnorePCGGeneratedComponents && Component->ComponentTags.Contains(PCGHelpers::DefaultPCGTag))
{
    // PCGによって生成されたコンポーネントをスキップ
    continue;
}
```

### バウンドチェック

```cpp
if (ActorSelector.bMustOverlapSelf)
{
    const FBox ComponentBounds = PrimitiveComp->Bounds.GetBox();
    const FBox SelfBounds = SourceComponent->Bounds.GetBox();

    if (!ComponentBounds.Intersect(SelfBounds))
    {
        // バウンドが重なっていない場合はスキップ
        continue;
    }
}
```

### パフォーマンス考慮事項

1. **コンポーネント数**: 多数のプリミティブコンポーネントがある場合、処理時間が増加
2. **バウンドチェック**: `bMustOverlapSelf = true`で不要なコンポーネントをフィルタリングしてパフォーマンス向上
3. **動的トラッキング**: コンポーネントの変更を追跡する場合、オーバーヘッドが発生
4. **メッシュデータ**: 複雑なメッシュの場合、データ作成に時間がかかる可能性

### 動的トラッキング

```cpp
virtual bool CanDynamicallyTrackKeys() const override { return true; }
```

このノードは動的トラッキングをサポートしており、以下の変更を検出できます:
- アクターの追加・削除
- コンポーネントの追加・削除・変更
- トランスフォームの変更

## プリミティブデータの使用

取得したプリミティブデータは、以下のようなノードで使用できます:

### Surface Sampler
```
Get Primitive Data -> Surface Sampler -> ポイント生成
```
プリミティブのサーフェス上にポイントをサンプリング

### Projection
```
Points -> Projection (Target: Primitive Data) -> サーフェスに投影
```

### Difference/Intersection
```
Primitive Data -> Difference/Intersection -> 空間演算
```

### Bounds Modifier
```
Primitive Data -> Bounds Modifier -> バウンド調整
```

## 注意事項

1. **コンポーネントタイプ**: すべてのプリミティブコンポーネントがPCGで有用なデータを提供するわけではありません
2. **メモリ使用量**: 大量のプリミティブコンポーネントからデータを取得する場合、メモリ使用量に注意
3. **更新頻度**: 動的に変更されるプリミティブの場合、適切なキャッシュ戦略を検討
4. **LOD**: プリミティブのLOD設定は考慮されません（常に最高LODのデータを使用）

## 関連ノード
- Get Actor Data (基底クラス)
- Surface Sampler (プリミティブサーフェスのサンプリング)
- Projection (プリミティブへの投影)
- Get Spline Data (スプラインデータの取得)
- Get Volume Data (ボリュームデータの取得)
