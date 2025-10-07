# Get Volume Data

## 概要

Get Volume Dataノードは、選択されたアクターからボリュームデータのコレクションを構築するノードです。ボリュームアクター（Box、Sphere、Capsuleなど）の形状情報を取得し、PCGで利用可能な空間データとして提供します。

**ノードタイプ**: Spatial
**クラス**: `UPCGGetVolumeSettings`
**エレメント**: `FPCGDataFromActorElement`（基底クラスのエレメントを使用）
**基底クラス**: `UPCGDataFromActorSettings`

## 機能詳細

Get Volume Dataノードは、以下のタイプのボリュームアクターからデータを取得できます:

1. **PCG Volume**: 専用のPCGボリュームアクター
2. **Blocking Volume**: コリジョンボリューム
3. **Box Volume**: ボックス形状のボリューム
4. **Sphere Volume**: 球形状のボリューム
5. **Capsule Volume**: カプセル形状のボリューム
6. **Custom Volumes**: カスタムボリュームアクター

ボリュームデータは、3D空間の領域を定義し、その境界内でのポイント生成、フィルタリング、マスキングなどに使用されます。

## プロパティ

このノードは`UPCGDataFromActorSettings`から継承されたプロパティを使用します。ボリュームデータ特有の設定は以下の通りです:

### ActorSelector (FPCGActorSelectorSettings)
ボリュームアクターを選択します。
- **型**: `FPCGActorSelectorSettings`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい

### Mode (自動設定)
このノードでは、常に`ParseActorComponents`モードが使用されます。
- **デフォルト値**: `EPCGGetDataFromActorMode::ParseActorComponents`
- **注**: モード設定UIは非表示

## 使用例

### 例1: レベル内のすべてのPCGボリュームからデータを取得
```
Get Volume Data:
  ActorSelector.ActorFilter = AllWorldActors
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = PCGVolume
```

### 例2: 特定のタグを持つボリュームのみを取得
```
Get Volume Data:
  ActorSelector.ActorFilter = ByTag
  ActorSelector.Tag = "ForestArea"
```

### 例3: PCGコンポーネントの境界内のボリュームのみを取得
```
Get Volume Data:
  ActorSelector.bMustOverlapSelf = true
  → PCGコンポーネントのバウンドと重なるボリュームのみが取得される
```

## 実装の詳細

### 入力ピン
- **オプション Input (Any)**: ベースポイントデータの入力をサポート（動的トラッキング用）

### 出力ピン
- **Out (Volume)**: ボリュームデータのコレクション
  - **型**: `EPCGDataType::Volume`
  - **複数接続**: 可能
  - **複数データ**: 可能（各ボリュームアクターごとに個別のデータ）

### データフィルター
```cpp
virtual EPCGDataType GetDataFilter() const override { return EPCGDataType::Volume; }
```

### コンストラクタ
```cpp
UPCGGetVolumeSettings::UPCGGetVolumeSettings()
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

### 出力ピンプロパティ

```cpp
TArray<FPCGPinProperties> UPCGGetVolumeSettings::OutputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;
    PinProperties.Emplace(PCGPinConstants::DefaultOutputLabel, EPCGDataType::Volume,
        /*bAllowMultipleConnections=*/true, /*bAllowMultipleData=*/false);
    return PinProperties;
}
```

### ボリュームデータの構造

各ボリュームアクターから作成される`UPCGVolumeData`には以下の情報が含まれます:

```cpp
UPCGVolumeData
{
    // ボリューム参照
    Volume: AVolume*                        // ソースボリュームアクター
    BrushComponent: UBrushComponent*        // ブラシコンポーネント（形状定義）

    // トランスフォーム
    Transform: FTransform                   // ワールド空間でのトランスフォーム
    Bounds: FBox                            // バウンディングボックス

    // 形状情報
    VoxelSize: FVector                      // ボクセル化の解像度（サンプリング用）

    // メタデータ
    Metadata: UPCGMetadata*                 // ボリューム属性
}
```

### データ取得のフロー

1. **アクター検索**: `ActorSelector`設定に基づいてアクターを検索
2. **ボリュームアクター検証**:
   ```cpp
   for (AActor* Actor : FoundActors)
   {
       if (AVolume* VolumeActor = Cast<AVolume>(Actor))
       {
           // ボリュームアクターを処理
       }
       else if (APCGVolume* PCGVolumeActor = Cast<APCGVolume>(Actor))
       {
           // PCGボリュームアクターを処理
       }
   }
   ```
3. **フィルタリング**:
   - バウンドチェック（`bMustOverlapSelf`が有効な場合）
4. **データ作成**: 各ボリュームアクターに対して`UPCGVolumeData`を作成
5. **形状情報の抽出**: ブラシコンポーネントから形状データを取得
6. **出力**: 作成されたボリュームデータを出力ピンに追加

### ボリュームタイプの検出

```cpp
EPCGVolumeType DetectVolumeType(AVolume* Volume)
{
    if (Cast<ABoxVolume>(Volume))
        return EPCGVolumeType::Box;
    else if (Cast<ASphereVolume>(Volume))
        return EPCGVolumeType::Sphere;
    else if (Cast<ACapsuleVolume>(Volume))
        return EPCGVolumeType::Capsule;
    else if (Cast<APCGVolume>(Volume))
        return EPCGVolumeType::PCG;
    else
        return EPCGVolumeType::Custom;
}
```

### ポイント内包判定

ボリュームデータの主要な機能の1つは、ポイントがボリューム内にあるかどうかを判定することです:

```cpp
bool UPCGVolumeData::Contains(const FVector& WorldPosition) const
{
    if (!Volume || !BrushComponent)
        return false;

    // ワールド座標をローカル座標に変換
    FVector LocalPosition = Transform.InverseTransformPosition(WorldPosition);

    // ブラシコンポーネントの形状で内包判定
    return BrushComponent->EncompassesPoint(WorldPosition);
}
```

### 密度の計算

ボリュームの境界からの距離に基づいて密度を計算できます:

```cpp
float UPCGVolumeData::GetDensityAtPosition(const FVector& WorldPosition) const
{
    if (!Contains(WorldPosition))
        return 0.0f;

    // ボリューム境界からの距離を計算
    float DistanceToEdge = ComputeDistanceToEdge(WorldPosition);

    // 距離に基づいて密度を計算（例: 中心ほど高密度）
    float Density = FMath::Clamp(DistanceToEdge / MaxDistance, 0.0f, 1.0f);

    return Density;
}
```

### パフォーマンス考慮事項

1. **ボリュームの複雑さ**: 複雑な形状のボリュームは内包判定に時間がかかる
2. **ボリューム数**: 多数のボリュームを処理する場合、パフォーマンスに注意
3. **バウンドチェック**: `bMustOverlapSelf = true`で不要なボリュームをフィルタリング
4. **キャッシュ**: ボリュームデータはキャッシュされるため、再利用時は高速

## ボリュームデータの使用

取得したボリュームデータは、以下のようなノードで使用できます:

### Volume Sampler
```
Get Volume Data -> Volume Sampler -> ボリューム内にポイント生成
```

### Density Filter
```
Points -> Density Filter (Bounds: Volume Data) -> ボリューム内のポイントのみ残す
```

### Bounds Modifier
```
Points -> Bounds Modifier (Volume Data) -> ボリュームに基づいてバウンド調整
```

### Difference
```
Spatial Data -> Difference (Volume Data) -> ボリューム領域を除外
```

### Intersection
```
Spatial Data -> Intersection (Volume Data) -> ボリューム領域のみ残す
```

## ボリュームの活用パターン

### 1. 領域のマスキング
```
Get Volume Data (除外領域) -> Difference -> 指定領域外にのみ生成
```

### 2. 密度の変調
```
Get Volume Data -> Volume Sampler -> ボリューム内に高密度で生成
```

### 3. 複数領域の統合
```
Get Volume Data (複数ボリューム) -> Union -> 統合された領域
```

### 4. 階層的な領域定義
```
Get Volume Data (大領域) -> Intersection -> Get Volume Data (小領域) -> 重なり部分のみ
```

## トラブルシューティング

### ボリュームが検出されない

**原因**:
- アクターセレクター設定が正しくない
- ボリュームアクターが無効化されている
- バウンドが重なっていない

**解決策**:
```
1. ActorSelector.ActorFilter を確認
2. ボリュームアクターがレベルに配置されているか確認
3. ActorSelector.bMustOverlapSelf を false に設定してテスト
```

### ポイント生成が期待通りでない

**原因**:
- ボリュームの形状が正しくない
- トランスフォームが正しくない
- VoxelSize設定が適切でない

**解決策**:
```
1. ボリュームのBoundsを視覚的に確認
2. Transform設定を確認（特にスケール）
3. VoxelSizeを調整してサンプリング密度を変更
```

### パフォーマンスの問題

**原因**:
- 複雑なボリューム形状
- 多数のボリューム
- 高密度のサンプリング

**解決策**:
```
1. シンプルな形状のボリュームを使用（Box, Sphere）
2. bMustOverlapSelf = true で範囲を制限
3. VoxelSizeを大きくしてサンプリング密度を下げる
```

## 注意事項

1. **ボリュームの形状**: 複雑な形状のボリュームは、シンプルな形状（Box, Sphere）よりも処理が遅い
2. **トランスフォーム**: ボリュームのスケールは形状サイズに影響します
3. **PCGVolume vs Volume**: PCGVolumeは専用のPCGアクターで、追加機能があります
4. **動的変更**: ランタイムでボリュームを変更する場合、PCGグラフの再実行が必要

## PCGVolumeアクター

`APCGVolume`は、通常のVolumeアクターと比較して以下の利点があります:

### 追加機能
- **PCGコンポーネント統合**: PCGコンポーネントを直接持つことができる
- **自動バウンド**: PCGコンポーネントのバウンドを自動的に設定
- **グリッド統合**: パーティショニンググリッドとの統合

### 使用例
```cpp
APCGVolume* PCGVol = World->SpawnActor<APCGVolume>();
PCGVol->SetActorLocation(FVector(0, 0, 0));
PCGVol->SetActorScale3D(FVector(10, 10, 5));

// PCGコンポーネントを設定
UPCGComponent* PCGComp = PCGVol->GetPCGComponent();
PCGComp->SetGraph(MyPCGGraph);
```

## 関連ノード
- Get Actor Data (基底クラス)
- Volume Sampler (ボリューム内のサンプリング)
- Difference (ボリューム除外)
- Intersection (ボリューム交差)
- Union (ボリューム統合)
- Bounds Modifier (バウンド変更)
