# Get Actor Property ノード

## 概要
Get Actor Propertyノードは、アクターまたはアクターコンポーネントのプロパティ値を抽出し、アトリビュートセット（Param Data）として出力するノードです。動的なデータ取得と、変更の追跡（Dynamic Tracking）をサポートします。

**実装クラス**: `UPCGGetActorPropertySettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGGetActorProperty.cpp`

## 機能詳細

### 主な機能
1. **アクタープロパティの抽出**: 指定したアクターのプロパティ値をアトリビュートセットとして取得
2. **コンポーネントプロパティの抽出**: アクターに付随するコンポーネントのプロパティを取得
3. **動的追跡**: アクタープロパティの変更を追跡し、自動的に再実行
4. **複数プロパティの抽出**: カンマ区切りで複数のプロパティを同時に抽出可能
5. **構造体/オブジェクトの展開**: 構造体やオブジェクト型のプロパティ内のサブプロパティを自動展開

## ピン構成
- **入力ピン**:
  - `In` (Any型、条件付き): ActorFilterが`FromInput`の場合のみ表示
- **出力ピン**:
  - `Out` (Param型): 抽出されたプロパティを含むアトリビュートセット

## プロパティ

### ActorSelector
**型**: `FPCGActorSelectorSettings`
**説明**: アクター選択の設定
- `ActorSelection`: アクター選択方法（ByTag、ByName、ByClass、Original、Selfなど）
- `ActorFilter`: フィルタリング方法（Self、Parent、Root、AllWorldActors、FromInputなど）
- `bMustOverlapSelf`: Selfと重なるアクターのみを選択

### bSelectComponent
**型**: `bool`
**デフォルト値**: `false`
**説明**: trueの場合、アクターではなくアクターコンポーネントからプロパティを抽出

### ComponentClass
**型**: `TSubclassOf<UActorComponent>`
**説明**: 抽出するコンポーネントのクラス（`bSelectComponent`がtrueの場合のみ有効）

### bProcessAllComponents
**型**: `bool`
**デフォルト値**: `true`（新規ノード）、`false`（既存ノード）
**説明**: 複数のコンポーネントが見つかった場合、すべてを処理するかどうか

### bOutputComponentReference
**型**: `bool`
**デフォルト値**: `false`
**説明**: コンポーネント参照をアトリビュートとして出力するかどうか

### PropertyName
**型**: `FName`
**デフォルト値**: `NAME_None`
**説明**: 抽出するプロパティ名。カンマ区切りで複数指定可能。`NAME_None`の場合、アクター/コンポーネント全体を抽出

### bForceObjectAndStructExtraction
**型**: `bool`
**デフォルト値**: `false`
**説明**: 構造体/オブジェクト型のプロパティを強制的に展開し、サブプロパティを抽出

### OutputAttributeName
**型**: `FPCGAttributePropertyOutputSelector`
**デフォルト値**: `@Source`（新規ノード）、`NAME_None`（既存ノード）
**説明**: 出力アトリビュート名（複数プロパティ抽出時は無視）

### bSanitizeOutputAttributeName
**型**: `bool`
**デフォルト値**: `true`（新規ノード）、`false`（既存ノード）
**説明**: 出力アトリビュート名の特殊文字を削除

### bOutputActorReference
**型**: `bool`
**デフォルト値**: `false`
**説明**: アクター参照（`ActorReference`アトリビュート）を出力に追加

### bAlwaysRequeryActors
**型**: `bool`
**デフォルト値**: `true`
**説明**: 常にアクターを再クエリして最新のプロパティ値を取得（キャッシュ無効化）

### bTrackActorsOnlyWithinBounds（エディタのみ）
**型**: `bool`
**デフォルト値**: `false`
**説明**: コンポーネント境界外のアクターの変更を追跡しない

## 実装の詳細

### ExecuteInternalメソッド
1. **アクター検索**: `PCGActorSelector::FindActors`を使用してアクターを検索
2. **動的追跡の設定**: エディタビルドで動的追跡を有効化
3. **プロパティ抽出**: `PCGPropertyHelpers::ExtractPropertyAsAttributeSet`を使用してプロパティを抽出
4. **タグ継承**: 見つかったアクターのタグを出力データに追加
5. **参照の追加**: 必要に応じてアクター/コンポーネント参照をアトリビュートとして追加

### キャッシュ制御
```cpp
bool FPCGGetActorPropertyElement::IsCacheable(const UPCGSettings* InSettings) const
{
    if (const UPCGGetActorPropertySettings* Settings = Cast<UPCGGetActorPropertySettings>(InSettings))
    {
        return !Settings->bAlwaysRequeryActors;
    }
    return false;
}
```

### 依存関係CRC
Self/Originalアクターに依存する場合、アクターのタグと参照からCRCを計算してキャッシュ無効化を制御します。

## 使用例

### 例1: アクター位置の取得
```
1. Get Actor Propertyノードを配置
2. ActorSelectorでSelfを選択
3. PropertyNameに"RootComponent.RelativeLocation"を設定
4. 出力: アクターの位置がVectorアトリビュートとして取得される
```

### 例2: 複数プロパティの一括取得
```
1. PropertyNameに"Health,MaxHealth,Speed"を設定
2. 出力: 3つのアトリビュート（Health、MaxHealth、Speed）を含むアトリビュートセット
```

### 例3: コンポーネントプロパティの取得
```
1. bSelectComponentをtrueに設定
2. ComponentClassに`UStaticMeshComponent`を指定
3. PropertyNameに"StaticMesh"を設定
4. 出力: StaticMeshコンポーネントのメッシュアセット参照
```

## パフォーマンス考慮事項

1. **動的追跡のコスト**: `bAlwaysRequeryActors`がtrueの場合、キャッシュが無効化されるため、毎回再実行されます
2. **構造体展開**: `bForceObjectAndStructExtraction`は多くのサブプロパティを生成する可能性があり、処理コストが増加します
3. **複数アクター処理**: AllWorldActorsなど広範囲のアクター選択は、パフォーマンスに影響します

## 関連ノード

- **Get Property From Object Path**: オブジェクトパスからプロパティを取得
- **Get Actor Data**: アクターの空間データを取得
- **Execute Blueprint**: ブループリント関数を実行してプロパティを取得

## 注意事項

1. **プロパティの可視性**: デフォルトでは可視プロパティ（UPROPERTY）のみ抽出可能
2. **メタデータ互換性**: PCGメタデータと互換性のある型のみサポート
3. **エディタビルド**: 動的追跡はエディタビルドでのみ機能
4. **メインスレッド実行**: オブジェクトアクセスの安全性のため、メインスレッドでのみ実行
