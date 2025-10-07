# Point From Mesh（メッシュからポイント生成）

## 概要

Point From Meshノードは、指定されたStaticMeshへの参照を含む単一のポイントを生成するノードです。メッシュパスを属性として保持し、後続のメッシュスポーンノードで使用できます。

**ノードタイプ**: Spatial
**クラス名**: `UPCGPointFromMeshSettings`, `FPCGPointFromMeshElement`

## 機能詳細

このノードは入力を必要とせず、原点に1つのポイントを作成します。そのポイントには、選択されたStaticMeshへのSoftObjectPathを含む文字列属性が付加されます。これにより、PCGグラフ内でメッシュ参照を動的に扱うことが可能になります。

### 主な特徴

- **入力不要**: 入力ピンを持たない生成ノード
- **メッシュ参照の保持**: SoftObjectPathとして非同期ロード可能
- **動的トラッキング**: メッシュの変更を追跡可能
- **非同期/同期ロード**: ローディング方式を選択可能

## プロパティ

### StaticMesh
- **型**: `TSoftObjectPtr<UStaticMesh>`
- **デフォルト値**: None
- **説明**: 参照するStaticMeshアセット。SoftObjectPtrとして保持されるため、非同期ロードが可能
- **PCG_Overridable**: 可

### MeshPathAttributeName
- **型**: `FName`
- **デフォルト値**: `NAME_None`
- **説明**: StaticMeshへのSoftObjectPathを格納する文字列属性の名前。NAME_Noneの場合、属性は作成されません

### bSynchronousLoad
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: メッシュの読み込みを同期的に行うかどうか
  - `false`: 非同期ロード（推奨、パフォーマンス向上）
  - `true`: 同期ロード（デバッグ時など）

## 使用例

### 基本的な使用方法

```
Point From Mesh → Static Mesh Spawner
```

### 実際のワークフロー例

1. **動的メッシュ選択**
   - Point From Meshで特定のメッシュへの参照ポイントを作成
   - Attribute Modifyでポイント数を増やす
   - Static Mesh Spawnerでメッシュを配置

2. **メッシュリスト管理**
   - 複数のPoint From Meshノードで異なるメッシュを参照
   - Mergeで統合
   - ランダムまたは条件付きでメッシュを選択

3. **メッシュパスの動的処理**
   - Point From Meshでベースメッシュ参照を作成
   - String操作でパスを変更
   - バリエーションメッシュへの動的切り替え

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointFromMeshElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGPointFromMeshElement.cpp`

### 継承関係
- `UPCGPointFromMeshSettings` ← `UPCGSettings`
- `FPCGPointFromMeshElement` ← `IPCGElementWithCustomContext<FPCGPointFromMeshContext>`
- `FPCGPointFromMeshContext` ← `FPCGContext`, `IPCGAsyncLoadingContext`

### ExecuteInternal処理フロー

1. **非同期ロード準備** (PrepareDataInternal):
   - StaticMeshのSoftObjectPtrから非同期ロードを開始
   - `bSynchronousLoad`がtrueの場合は同期ロードを実行

2. **ポイント生成** (ExecuteInternal):
   - 原点に1つのポイントデータを作成
   - `MeshPathAttributeName`が有効な場合、文字列属性を追加
   - StaticMeshのSoftObjectPathを属性値として設定

3. **出力**: ポイントデータを出力

### 非同期ロード処理

```cpp
// PrepareDataInternal内
if (!bSynchronousLoad)
{
    // 非同期ロードをリクエスト
    Context->RequestAsyncLoad(StaticMesh);
}
else
{
    // 同期ロード
    StaticMesh.LoadSynchronous();
}
```

### パフォーマンス特性

- **メインスレッド実行**: アセットロードのため、メインスレッドで実行
- **非同期ロード**: デフォルトで非同期、パフォーマンス向上
- **キャッシュ可能**: デフォルト設定による
- **軽量処理**: 単一ポイント生成のみ

### 入出力仕様

- **入力ピン**: なし

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: `EPCGDataType::Point`

### 動的トラッキング

```cpp
virtual void GetStaticTrackedKeys(
    FPCGSelectionKeyToSettingsMap& OutKeysToSettings,
    TArray<TObjectPtr<const UPCGGraph>>& OutVisitedGraphs
) const override;

virtual bool CanDynamicallyTrackKeys() const override { return true; }
```

このノードはStaticMeshアセットの変更を追跡し、メッシュが更新された場合にグラフを再実行できます。

### 技術的詳細

#### メインスレッド実行の理由
```cpp
virtual bool CanExecuteOnlyOnMainThread(FPCGContext* Context) const override
{
    return true;
}
```

アセットのロードとPCG外部オブジェクトへのアクセスは、スレッドセーフではない可能性があるため、安全な実装としてメインスレッドで実行されます。

#### 属性の作成

MeshPathAttributeName が有効な場合:
```cpp
FString MeshPath = StaticMesh.ToSoftObjectPath().ToString();
Metadata->CreateStringAttribute(MeshPathAttributeName, MeshPath, /*bAllowsInterpolation=*/false);
```

### 注意事項

1. **入力不要**: このノードは入力ピンを持ちません
2. **単一ポイント**: 常に1つのポイント（原点）のみを生成します
3. **非同期ロード**: デフォルトで非同期ロード、必要に応じて同期ロードに切り替え可能
4. **メッシュ未指定時**: StaticMeshが未設定でも実行されますが、属性値は空になります
5. **メインスレッド**: アセットロードのため、必ずメインスレッドで実行されます

### ユースケース

- **動的メッシュ選択**: ブループリントやC++からメッシュを動的に変更
- **メッシュバリエーション**: 複数のメッシュ参照を生成し、後で選択
- **メッシュリスト作成**: 配置可能なメッシュのリストを作成
- **パス操作**: メッシュパスを文字列として扱い、動的に変更
