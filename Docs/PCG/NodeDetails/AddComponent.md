# Add Component ノード

## 概要

Add Componentノードは、PCGで生成されたポイントデータに基づいて、指定されたアクターにアクターコンポーネントを動的に追加するノードです。各ポイントのトランスフォーム情報を使用して、適切な位置にコンポーネントを配置し、PCGが管理するリソースとして登録します。

**カテゴリ**: Generic
**クラス名**: `UPCGAddComponentSettings`
**エレメントクラス**: `FPCGAddComponentElement`

## 機能詳細

このノードは以下の主要機能を提供します：

1. **コンポーネントの動的生成**: 入力ポイントごとにアクターコンポーネントを作成
2. **クラスまたはテンプレートベースの生成**: 固定クラスまたは属性ベースでコンポーネントタイプを選択可能
3. **ターゲットアクターの指定**: 専用ピンまたはデフォルト（PCGコンポーネントのオーナー）にコンポーネントを追加
4. **トランスフォームの適用**: ポイントデータのトランスフォーム情報をコンポーネントに適用
5. **コンポーネント参照の出力**: 生成されたコンポーネントへの参照を属性として出力

### 入力ピン

- **Input** (Point - 必須): コンポーネントを生成するためのポイントデータ
- **TargetActor** (Any - 詳細ピン): コンポーネントを追加するターゲットアクターのデータ

### 出力ピン

- **Output** (Point): 入力データのコピーにコンポーネント参照属性が追加されたデータ

## プロパティ

### bUseClassAttribute
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: コンポーネントクラスの選択方法を制御します。`true`の場合は属性から、`false`の場合は固定値から選択されます。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`

### ClassAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: デフォルト設定
- **説明**: コンポーネントクラスを取得する属性を指定します。
- **条件**: `bUseClassAttribute`が`true`の場合にのみ表示
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### TemplateComponentClass
- **型**: `TSubclassOf<UActorComponent>`
- **デフォルト値**: `nullptr`
- **説明**: 生成するコンポーネントのクラスを指定します。
- **条件**: `bUseClassAttribute`が`false`の場合にのみ表示
- **編集可能**: `EditAnywhere`, `BlueprintReadOnly`

### bAllowTemplateComponentEditing
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: テンプレートコンポーネントの編集を許可するかどうかを制御します。有効にすると、コンポーネントのプロパティをノード内で事前設定できます。
- **条件**: `bUseClassAttribute`が`false`の場合にのみ表示
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`

### TemplateComponent
- **型**: `TObjectPtr<UActorComponent>`
- **デフォルト値**: `nullptr`
- **説明**: 生成されるコンポーネントのテンプレートオブジェクトです。このテンプレートのプロパティが新しいコンポーネントにコピーされます。
- **条件**: `bUseClassAttribute`が`false`かつ`bAllowTemplateComponentEditing`が`true`の場合にのみ表示
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `Instanced`, `ShowInnerProperties`

### ActorReferenceAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: デフォルト設定
- **説明**: TargetActorピンから取得したデータ内で、アクター参照を導出するために使用される属性を指定します。
- **条件**: TargetActorピンが接続されている場合にのみ編集可能
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### ComponentReferenceAttribute
- **型**: `FPCGAttributePropertyOutputNoSourceSelector`
- **デフォルト値**: `"ComponentReference"`
- **説明**: 生成されたコンポーネントへの参照を書き込む属性名を指定します。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`, `PCG_DiscardPropertySelection`, `PCG_DiscardExtraSelection`

## 実装の詳細

### ExecuteInternalメソッド

このメソッドは以下のステップでコンポーネントを生成します：

1. **入力検証**
   - Inputピンからポイントデータを取得
   - TargetActorピンからターゲットアクターデータを取得（オプション）
   - TargetActorのカーディナリティを検証（1つまたは入力と同じ数）

2. **各入力データの処理**
   - トランスフォームアクセサーの作成（`$Transform`属性から）
   - クラスまたはテンプレートアクセサーの作成
   - ターゲットアクターアクセサーの作成（ピンから、またはPCGコンポーネントオーナーをデフォルトとして使用）

3. **出力データの準備**
   - 入力データを複製
   - コンポーネント参照属性を作成

4. **コンポーネントの追加**
   - `AddComponents`メソッドを呼び出してコンポーネントを生成

### AddComponentsメソッド

コンポーネントの実際の生成と追加を行います：

1. **チャンク単位での処理**
   - デフォルトチャンクサイズでデータを分割処理
   - 各チャンクでトランスフォーム、クラス、ターゲットアクター情報を取得

2. **コンポーネントの生成**
   ```cpp
   UActorComponent* Component = NewObject<UActorComponent>(
       TargetActor,
       ComponentClass,
       NAME_None,
       ObjectFlags,
       ComponentTemplate
   );
   ```

3. **コンポーネントの設定**
   - `RegisterComponent()`: コンポーネントを登録
   - `AddInstanceComponent()`: ターゲットアクターにコンポーネントを追加
   - シーンコンポーネントの場合：
     - ルートコンポーネントにアタッチ
     - ワールドトランスフォームを設定
   - PCGタグを追加（追跡用）

4. **リソース管理**
   - `UPCGManagedComponentList`に生成コンポーネントを追加
   - PCGコンポーネントの管理リソースに登録

### テンプレートコンポーネント管理（エディタのみ）

`RefreshTemplateComponent()`メソッド：
- `bAllowTemplateComponentEditing`が有効な場合にテンプレートコンポーネントを作成
- クラス変更時にテンプレートを再作成し、プロパティを保持
- Child Actor Componentの実装パターンと類似

## 使用例

### 基本的な使用方法

```
1. Create Points Grid ノードでグリッド状のポイントを生成
2. Add Component ノードに接続
3. TemplateComponentClass に UStaticMeshComponent などを設定
4. 実行すると各ポイント位置にコンポーネントが追加される
```

### 属性ベースのコンポーネント生成

```
1. ポイントデータに "ComponentClass" 属性を追加（FSoftClassPath型）
2. Add Component ノードで bUseClassAttribute を true に設定
3. ClassAttribute に "ComponentClass" を指定
4. 各ポイントの属性値に基づいて異なるコンポーネントタイプを生成
```

### カスタムターゲットアクターの使用

```
1. Get Actor Data ノードで特定のアクターを取得
2. Add Component ノードの TargetActor ピンに接続
3. 指定したアクターにコンポーネントが追加される
```

### テンプレートの使用

```
1. bAllowTemplateComponentEditing を true に設定
2. TemplateComponent のプロパティを編集（例：StaticMesh、Material等）
3. 生成されるすべてのコンポーネントが同じプロパティを持つ
```

## パフォーマンス考慮事項

1. **メインスレッド実行**
   - `CanExecuteOnlyOnMainThread()`が`true`を返すため、メインスレッドでのみ実行されます
   - 大量のコンポーネント生成は実行時間に影響します

2. **キャッシュ不可**
   - `IsCacheable()`が`false`を返すため、結果はキャッシュされません
   - ワールド状態を変更するため、常に再実行されます

3. **チャンク処理**
   - デフォルトチャンクサイズ（256エントリ）で分割処理
   - 大量のポイントでもメモリ効率的に処理

4. **中断可能な実行**
   - 各入力データ処理後に`ShouldStop()`をチェック
   - 長時間実行を回避し、エディタの応答性を維持

5. **プレビューモード対応**
   - プレビューモード時は`RF_Transient`フラグでコンポーネントを生成
   - ワールドに永続的な変更を加えません

## 注意事項

1. **カーディナリティの一致**
   - TargetActorピンのデータ数は1つまたは入力データと同数である必要があります
   - 不一致の場合はエラーが発生し、処理がスキップされます

2. **トランスフォーム属性の必須性**
   - 入力データには`$Transform`属性（またはプロパティ）が必要です
   - 欠落している場合は警告が表示され、その入力はスキップされます

3. **コンポーネントクラスの有効性**
   - 指定されたクラスパスが有効で、ロード可能である必要があります
   - 無効なクラスパスはコンポーネント生成をスキップします

4. **Blueprint対応**
   - Blueprint Generated Classに対応
   - Blueprintの再コンパイル時に自動的にイベントを処理

5. **リソース管理**
   - 生成されたコンポーネントはPCGManagedResourcesとして追跡されます
   - PCGの再生成時に自動的にクリーンアップされます

## 関連ノード

- **Static Mesh Spawner**: メッシュインスタンスの生成に特化（より高速）
- **Apply On Actor**: アクター自体のプロパティ変更
- **Get Actor Data**: ターゲットアクターの取得
- **Create Attribute**: コンポーネントクラス属性の作成

## 技術的な詳細

### コンテキスト構造

```cpp
struct FPCGAddComponentContext : public FPCGContext
{
    int32 CurrentInputIndex = 0;  // 現在処理中の入力データインデックス
};
```

### 定数

```cpp
namespace PCGAddComponentConstants
{
    const FName ComponentReferenceAttribute = TEXT("ComponentReference");
    const FName TargetActorPinLabel = TEXT("TargetActor");
}
```

### オブジェクトフラグ

- **プレビューモード**: `RF_Transient` - 一時的なオブジェクト
- **通常モード**: `RF_NoFlags` - 永続的なオブジェクト

### コンポーネントタグ

生成されたコンポーネントには以下のタグが自動的に追加されます：
- PCGコンポーネントの名前
- `PCGHelpers::DefaultPCGTag` (通常は "PCG Generated")
