# Apply On Object ノード

## 概要

Apply On Objectノードは、ターゲットオブジェクト（主にアクター）に対してプロパティのオーバーライドと関数の実行を行うノードです。PCGグラフから動的にオブジェクトの設定を変更し、特定の関数を呼び出すことで、アクターの状態を制御できます。

**カテゴリ**: Generic
**クラス名**: `UPCGApplyOnActorSettings`
**エレメントクラス**: `FPCGApplyOnObjectElement`

## 機能詳細

このノードは以下の主要機能を提供します：

1. **プロパティオーバーライド**: ターゲットオブジェクトのプロパティ値を動的に変更
2. **関数実行**: パラメータなしの関数をターゲットオブジェクト上で実行
3. **非同期/同期オブジェクトロード**: オブジェクト参照を非同期または同期でロード
4. **複数オブジェクトの一括処理**: 複数のターゲットオブジェクトに対して同じ操作を適用
5. **動的ピン対応**: Property Overridesピンで追加データを受け取り

### 入力ピン

- **In** (Any): ターゲットオブジェクトの参照を含むデータ（複数接続・複数データ対応）
- **Property Overrides** (Any): プロパティオーバーライドに使用する追加データ（複数接続・複数データ対応）

### 出力ピン

- **Out** (Any): 入力データをそのままパススルー

## プロパティ

### ObjectReferenceAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: デフォルト設定
- **説明**: Inピンに接続されたデータから、オブジェクト参照を取得するための属性を指定します。この属性値がオブジェクトのパスとして解釈されます。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`, `PCG_DiscardPropertySelection`, `PCG_DiscardExtraSelection`

### TargetActor (非推奨)
- **型**: `TSoftObjectPtr<AActor>`
- **デフォルト値**: `nullptr`
- **説明**: **UE 5.5で非推奨**。単一のターゲットアクターを指定していました。現在はInピンから直接データを渡す方式に変更されています。
- **非推奨バージョン**: 5.5
- **移行方法**: Get Actor Dataノードなどを使用してInピンにデータを渡します

### PropertyOverrideDescriptions
- **型**: `TArray<FPCGObjectPropertyOverrideDescription>`
- **デフォルト値**: 空配列
- **説明**: ターゲットオブジェクトに適用するプロパティオーバーライドのリストです。各要素には以下が含まれます：
  - **InputSource**: Property Overridesピンから取得する属性名
  - **PropertyTarget**: オブジェクト上のプロパティパス（例: `"Mobility"`, `"StaticMeshComponent.StaticMesh"`）
  - オーバーライドはポストプロセス関数の前に適用されます
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`

### PostProcessFunctionNames
- **型**: `TArray<FName>`
- **デフォルト値**: 空配列
- **説明**: ターゲットオブジェクト上で呼び出す関数名のリストです。
  - 関数はパラメータなしである必要があります
  - 関数には`CallInEditor`フラグが有効である必要があります
  - プロパティオーバーライドの後に実行されます
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`

### bSilenceErrorOnEmptyObjectPath
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: オブジェクトパスが空または抽出できない場合のエラーを抑制するかどうかを制御します。
  - `true`: エラーを表示しません
  - `false`: エラーログを出力します
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `AdvancedDisplay`

### bSynchronousLoad
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: オブジェクトのロード方法を制御します。
  - `false`: 非同期ロード（デフォルト、パフォーマンスが良い）
  - `true`: 同期ロード（デバッグ用、即座にロードが完了）
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`
- **カテゴリ**: Settings|Debug

## 実装の詳細

### PrepareDataInternalメソッド

オブジェクトのロード準備を行います：

```cpp
bool FPCGApplyOnObjectElement::PrepareDataInternal(FPCGContext* Context) const
{
    FPCGLoadObjectsFromPathContext* ThisContext = static_cast<FPCGLoadObjectsFromPathContext*>(Context);
    return ThisContext->InitializeAndRequestLoad(
        PCGPinConstants::DefaultInputLabel,
        Settings->ObjectReferenceAttribute,
        {},
        /*bPersistAllData=*/false,
        Settings->bSilenceErrorOnEmptyObjectPath,
        Settings->bSynchronousLoad
    );
}
```

- `FPCGLoadObjectsFromPathContext`を使用してオブジェクトロードを管理
- 非同期ロードの場合、ロード完了を待機

### ExecuteInternalメソッド

プロパティオーバーライドと関数実行を行います：

1. **オブジェクトの解決**
   ```cpp
   TargetObjectsAndIndices.Emplace(
       ThisContext->PathsToObjectsAndDataIndex[CurrentPathIndex].Get<0>().ResolveObject(),
       ThisContext->PathsToObjectsAndDataIndex[CurrentPathIndex].Get<2>()
   );
   ```
   - ロードされたオブジェクトパスを実際のオブジェクトに解決

2. **プロパティオーバーライドの適用**
   ```cpp
   PCGObjectPropertyOverrideHelpers::ApplyOverrides(
       Settings->PropertyOverrideDescriptions,
       TargetObjectsAndIndices,
       PCGApplyOnActorConstants::ObjectPropertyOverridesLabel,
       InputIndex,
       Context
   );
   ```
   - すべてのプロパティオーバーライドをバッチ適用
   - Property Overridesピンからのデータを使用

3. **ポストプロセス関数の実行**
   ```cpp
   for (UFunction* Function : PCGHelpers::FindUserFunctions(...))
   {
       TargetObject->ProcessEvent(Function, nullptr);
   }
   ```
   - 指定された関数をオブジェクト上で実行
   - パラメータなし関数のみサポート
   - `CallInEditor`フラグが必要

4. **出力データの設定**
   ```cpp
   Context->OutputData.TaggedData = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);
   ```
   - 入力データをそのままパススルー

### オブジェクトロードコンテキスト

`FPCGLoadObjectsFromPathContext`クラスを使用：
- オブジェクトパスとロードされたオブジェクトのマッピングを管理
- 非同期ロードのタイミング制御
- データインデックスの追跡

## 使用例

### 基本的なプロパティオーバーライド

```
1. Get Actor Data → 特定のアクターを取得
2. Apply On Object に接続
   - PropertyOverrideDescriptions に追加:
     - PropertyTarget: "bHidden"
     - 値: false
3. アクターの表示/非表示を制御
```

### 関数の実行

```
1. Get Actor Data → Blueprintアクターを取得
2. Apply On Object に接続
   - PostProcessFunctionNames: ["OnPCGUpdate"]
3. アクター上のカスタム関数を実行
```

### 複数プロパティの一括設定

```
PropertyOverrideDescriptions:
- PropertyTarget: "Mobility" → 値: EComponentMobility::Movable
- PropertyTarget: "StaticMeshComponent.CastShadow" → 値: true
- PropertyTarget: "StaticMeshComponent.StaticMesh" → メッシュアセット参照
```

### 属性ベースのオーバーライド

```
1. Create Attribute → "ActorScale" 属性を作成（Vector型）
2. Create Attribute → "ActorLocation" 属性を作成
3. Apply On Object に接続
   - Property Overridesピンに属性データを接続
   - PropertyOverrideDescriptions:
     - InputSource: "ActorScale" → PropertyTarget: "RootComponent.RelativeScale3D"
     - InputSource: "ActorLocation" → PropertyTarget: "RootComponent.RelativeLocation"
```

### 非同期ロードの使用

```
1. Create Attribute → FSoftObjectPath型の属性でアクター参照を保持
2. Apply On Object
   - ObjectReferenceAttribute: 作成した属性名を指定
   - bSynchronousLoad: false（デフォルト）
3. 非同期でアクターをロードして操作
```

## パフォーマンス考慮事項

1. **メインスレッド実行**
   - `CanExecuteOnlyOnMainThread()`が`true`
   - 関数呼び出しの安全性のためメインスレッドで実行
   - 大量のオブジェクト処理は実行時間に影響

2. **キャッシュ不可**
   - `IsCacheable()`が`false`
   - ワールド状態を変更するため、常に再実行が必要

3. **非同期ロードの利点**
   - デフォルトで非同期ロード
   - 大きなアセットのロードでもエディタをブロックしない
   - ロード完了まで待機が必要

4. **同期ロードの注意**
   - `bSynchronousLoad = true`は主にデバッグ用
   - 大量のオブジェクトロードでフリーズの可能性
   - 本番環境では非推奨

5. **バッチ処理**
   - 同じ入力インデックスのオブジェクトをグループ化
   - プロパティオーバーライドを効率的に適用

## 注意事項

1. **関数の要件**
   - パラメータなしの関数のみサポート
   - `CallInEditor`フラグが必須
   - Blueprintの場合は`CallInEditor`を有効化

2. **プロパティパスの形式**
   - ネストしたプロパティは`.`で区切る
   - 例: `"StaticMeshComponent.StaticMesh"`
   - プロパティ名は大文字小文字を区別

3. **オブジェクト参照の形式**
   - FSoftObjectPath形式が必要
   - 例: `"/Game/Maps/MyLevel.MyLevel:PersistentLevel.MyActor"`

4. **エラーハンドリング**
   - `bSilenceErrorOnEmptyObjectPath`でエラー制御
   - 無効なオブジェクトパスは警告を生成（デフォルト）

5. **非推奨機能の移行**
   - `TargetActor`プロパティは使用しない
   - 代わりにInピンにデータを接続

6. **実行順序**
   - プロパティオーバーライドが先に適用
   - その後、ポストプロセス関数が実行

## 関連ノード

- **Get Actor Data**: ターゲットアクターの取得
- **Add Component**: アクターにコンポーネントを追加
- **Create Attribute**: プロパティオーバーライド用の属性作成
- **Load Object**: オブジェクトの明示的なロード
- **Execute Blueprint**: Blueprintの実行（パラメータ付き）

## 技術的な詳細

### コンテキスト構造

```cpp
struct FPCGLoadObjectsFromPathContext : public FPCGContext
{
    // オブジェクトパス、データインデックス、エントリインデックスのタプル
    TArray<TTuple<FSoftObjectPath, int32, int32>> PathsToObjectsAndDataIndex;

    bool InitializeAndRequestLoad(...);
};
```

### プロパティオーバーライド構造

```cpp
struct FPCGObjectPropertyOverrideDescription
{
    FName InputSource;              // Property Overridesピンの属性名
    FString PropertyTarget;          // オブジェクト上のプロパティパス
    // 追加のオプション設定
};
```

### 関数検索

```cpp
TArray<UFunction*> PCGHelpers::FindUserFunctions(
    UClass* InClass,
    const TArray<FName>& InFunctionNames,
    const TArray<FName>& InAllowedPrototypes,
    FPCGContext* InContext
);
```

- `CallInEditor`フラグを持つ関数のみ検索
- パラメータなしプロトタイプに一致する関数を返す

### 定数

```cpp
namespace PCGApplyOnActorConstants
{
    const FName ObjectPropertyOverridesLabel = TEXT("Property Overrides");
    const FText ObjectPropertyOverridesTooltip = ...;
}
```

### 非推奨処理

- UE 5.5で`TargetActor`ピンから`In`ピンへの移行
- `ApplyDeprecationBeforeUpdatePins()`で古いエッジを自動的に移行
- 既存のグラフとの後方互換性を維持
