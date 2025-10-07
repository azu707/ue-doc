# Get Dynamic Mesh Data

## 概要

Get Dynamic Mesh Dataノードは、ダイナミックメッシュコンポーネントから空間データを取得するための特殊なノードです。このノードは、ランタイムで生成または変更されるメッシュデータをPCGシステムで利用可能にします。

**ノードタイプ**: Spatial
**クラス**: 該当なし（統合されていない可能性）
**エレメント**: 該当なし

## 機能詳細

現在のPCGプラグインの実装では、明示的な"Get Dynamic Mesh Data"ノードは見つかりませんでした。ダイナミックメッシュデータの取得は、以下のいずれかの方法で行われる可能性があります:

1. **Get Actor Data ノード経由**: `ParseActorComponents`モードでダイナミックメッシュコンポーネントを持つアクターを解析
2. **Get Primitive Data ノード経由**: プリミティブコンポーネントとしてダイナミックメッシュを取得
3. **カスタム実装**: プロジェクト固有のカスタムノードとして実装

## プロパティ

（明示的なノードが存在しないため、該当なし）

## 使用例

### 例1: Get Actor Dataを使用してダイナミックメッシュを取得
```
Get Actor Data:
  ActorSelector.ActorSelection = ByClass
  ActorSelector.ActorSelectionClass = DynamicMeshActor
  Mode = ParseActorComponents
```

### 例2: Get Primitive Dataを使用
```
Get Primitive Data:
  ActorSelector: 対象アクターを選択
  → Dynamic Mesh Componentもプリミティブとして取得される
```

## 実装の詳細

### 代替アプローチ

**Get Actor Data経由の取得**:
```cpp
// Get Actor Dataノードは以下のコンポーネントタイプを自動的に認識:
// - Static Mesh Component
// - Dynamic Mesh Component (UDynamicMeshComponent)
// - Spline Component
// - Volume Component
// など
```

**Get Primitive Data経由の取得**:
```cpp
// UPCGGetPrimitiveSettings
// GetDataFilter() returns EPCGDataType::Primitive
// ダイナミックメッシュコンポーネントはUPrimitiveComponentの派生クラスなので
// プリミティブデータとして取得可能
```

### カスタムノードの実装例

プロジェクトでダイナミックメッシュ専用のノードが必要な場合、以下のような実装が考えられます:

```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGGetDynamicMeshSettings : public UPCGDataFromActorSettings
{
    GENERATED_BODY()

public:
    virtual EPCGDataType GetDataFilter() const override
    {
        // カスタムフィルタリング
        return EPCGDataType::Primitive;
    }

    // Dynamic Mesh Component のみを対象とする追加フィルタリング
};
```

### 注意事項

1. **データタイプ**: ダイナミックメッシュは通常、Primitive DataまたはSurface Dataとして扱われます
2. **パフォーマンス**: ダイナミックメッシュは頻繁に更新される可能性があるため、キャッシュ戦略に注意
3. **メッシュ更新**: メッシュが更新された場合、PCGグラフの再実行が必要になる場合があります

## 関連ノード
- Get Actor Data
- Get Primitive Data
- Get Component Data (カスタム実装の場合)

## 追加情報

この機能がプロジェクトで必要な場合は、以下のオプションを検討してください:

1. **Get Primitive Dataの使用**: 最も簡単な方法
2. **Get Actor Dataのカスタマイズ**: Component Selectorを使用して特定のコンポーネントタイプをフィルタリング
3. **カスタムノードの作成**: プロジェクト固有の要件がある場合

注: このドキュメントはUnreal Engine 5.5の時点での情報に基づいています。将来のバージョンで専用ノードが追加される可能性があります。
