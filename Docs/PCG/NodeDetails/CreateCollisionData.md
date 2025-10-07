# Create Collision Data

## 概要
Create Collision Dataノードは、メッシュからコリジョンデータを作成し、PCGで使用可能な形式でラップするノードです。スタティックメッシュのコリジョン形状を取得し、空間クエリに使用できるデータに変換します。

## 機能詳細
このノードは`UPCGCreateCollisionDataSettings`クラスとして実装されており、以下の処理を行います:

- 指定された属性からスタティックメッシュを取得
- メッシュのコリジョン形状（Simple/Complex）を抽出
- PCGCollisionWrapperDataとして出力

## プロパティ

### CollisionAttribute
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **説明**: コリジョンメッシュを取得するための属性セレクターです。この属性は、UStaticMeshまたはFSoftObjectPathを含んでいる必要があります。
- **メタフラグ**: PCG_Overridable, PCG_DiscardPropertySelection, PCG_DiscardExtraSelection
- **Blueprint対応**: 読み書き可能

### CollisionQueryFlag
- **型**: EPCGCollisionQueryFlag
- **デフォルト値**: EPCGCollisionQueryFlag::Simple
- **カテゴリ**: Settings
- **説明**: コリジョンからの形状選択方法を制御します。
  - **Simple**: シンプルコリジョン形状を使用（高速）
  - **Complex**: コンプレックスコリジョン形状を使用（より正確だが低速）
- **メタフラグ**: PCG_Overridable, PCG_OverrideAliases="bUseComplexCollision"
- **Blueprint対応**: 読み書き可能
- **パフォーマンス警告**: Complex形状使用時のパフォーマンスに注意

### bWarnIfAttributeCouldNotBeUsed
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings (AdvancedDisplay)
- **説明**: 属性が使用できなかった場合に警告を表示するかどうかを制御します。
- **Blueprint対応**: 読み書き可能

### bSynchronousLoad
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings|Debug
- **説明**: デフォルトでは非同期ロードが使用されますが、trueに設定すると同期的にメッシュをロードします。
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. メッシュ参照を含む属性を持つポイントデータを入力
2. `CollisionAttribute`で対象の属性を指定
3. `CollisionQueryFlag`でSimpleまたはComplexコリジョンを選択
4. 出力されたコリジョンデータを空間クエリノードで使用

### 一般的な用途
- World Ray Hit Queryノードでのコリジョン検出
- World Volumetric Queryでの空間クエリ
- カスタムコリジョンシェイプを使用した高度な空間処理

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGCreateCollisionDataSettings : public UPCGSettings
```

### コンテキスト構造
```cpp
struct FPCGCreateCollisionContext : public FPCGContext, public IPCGAsyncLoadingContext
{
    struct InputMeshData
    {
        int InputIndex = INDEX_NONE;
        TArray<FSoftObjectPath> MeshPaths;
        TObjectPtr<UPCGCollisionWrapperData> Data = nullptr;
    };
    TArray<InputMeshData> PerInputData;
};
```

### 実行フロー
1. **PrepareDataInternal**: メッシュの非同期ロードを開始
2. **ExecuteInternal**: コリジョンデータの抽出と変換

### スレッド実行
- `CanExecuteOnlyOnMainThread`: true
- メッシュのロードとアクセスはメインスレッドで実行される必要があります

### 入力ピン
- ポイントデータまたはベースポイントデータを受け付ける
- `SupportsBasePointDataInputs`: true

### 出力ピン
- UPCGCollisionWrapperDataを出力

### 実行ループモード
- `ExecutionLoopMode`: SinglePrimaryPin

### ノードの特徴
- **ノード名**: CreateCollisionData
- **表示名**: Create Collision Data
- **カテゴリ**: Spatial
- **PostLoad**: 非推奨プロパティからの移行処理を実行

## 注意事項
- Complexコリジョンは正確ですが、パフォーマンスコストが高くなります
- 大量のメッシュを処理する場合、非同期ロードの完了待ちが発生します
- コリジョンデータが存在しないメッシュを指定すると、エラーまたは警告が発生します
- メインスレッドでの実行が必要なため、並列処理の恩恵は限定的です

## 関連ノード
- **World Ray Hit Query**: コリジョンデータを使用したレイキャストクエリ
- **World Volumetric Query**: 体積的なワールドクエリ
- **Bounds From Mesh**: メッシュからバウンド情報を取得
