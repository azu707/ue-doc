# World Volumetric Query

## 概要

World Volumetric Queryノードは、入力ポイントの位置でワールドに対してボリュメトリッククエリ（Overlap検出）を実行します。指定された形状と重なるアクターやコンポーネントを検出し、フィルタリングして結果を出力します。

## 機能詳細

このノードは、各入力ポイントの位置で、指定された形状を使用してワールドとのオーバーラップ（重なり）を検出します。レイキャストとは異なり、特定のボリューム内にあるすべてのオブジェクトを検出できます。

### 処理フロー

1. **入力ポイントの取得**: ポイントデータを入力から取得
2. **オーバーラップクエリの実行**: 各ポイント位置でボリューム検索を実行
3. **ヒット情報の取得**: 重なっているアクター、コンポーネントなどを取得
4. **フィルタリング**: 指定された条件でヒットをフィルタリング
5. **結果の出力**: フィルタリングされたヒット情報を出力

### クエリタイプ

#### Overlap Detection (オーバーラップ検出)
- 指定された形状と重なるすべてのオブジェクトを検出
- レイキャストよりも広範囲の検出
- 複数のヒットを同時に検出可能

## プロパティ

### QueryParams (FPCGWorldVolumetricQueryParams)
- **型**: `FPCGWorldVolumetricQueryParams`
- **オーバーライド可能**: はい（ShowOnlyInnerProperties）
- **説明**: ワールドボリュメトリッククエリのパラメータ群
- **主要サブプロパティ**:
  - **アクターフィルタ**: ActorTagFilter, ActorClassFilter
  - **コンポーネントフィルタ**: ComponentTagFilter
  - **ランドスケープ処理**: bIgnoreLandscape
  - **クエリ形状**: 入力ポイントの境界を使用

### QueryParams の主要プロパティ詳細

（FPCGWorldCommonQueryParamsから継承）

#### フィルタリング
- **ActorTagFilter**: アクタータグによるフィルタリング
  - None: フィルタなし
  - Include: 指定されたタグを持つアクターのみ
  - Exclude: 指定されたタグを持つアクターを除外

- **ActorTagsList**: フィルタリングに使用するタグのリスト（カンマ区切り）

- **ActorClassFilter**: アクタークラスによるフィルタリング
  - None: フィルタなし
  - Include: 指定されたクラスのアクターのみ
  - Exclude: 指定されたクラスのアクターを除外

- **ActorClass**: フィルタリングに使用するアクタークラス

- **ActorFilterFromInput**: 入力ピンからアクターフィルタを取得
  - None: 使用しない
  - Include/Exclude: 入力からのアクターリストを使用

- **ActorFilterInputSource**: Filter Actorピンから読み取る属性

- **bIgnoreLandscape**: ランドスケープヒットを無視するかどうか

- **bIgnoreSelf**: 自身のPCGコンポーネントを持つアクターを無視

#### その他
- **bSearchForOverlap**: オーバーラップ検索を実行（ボリュメトリッククエリの場合は常にtrue）

## 使用例

### 基本的なオーバーラップ検出

```
Create Points Grid
  → World Volumetric Query
  → (各ポイント位置で重なるアクターを検出)
```

### 特定クラスのアクター検出

```
Create Points
  → World Volumetric Query (ActorClassFilter=Include, ActorClass=StaticMeshActor)
  → (StaticMeshActorのみを検出)
```

### タグによるフィルタリング

```
Create Points Grid
  → World Volumetric Query (ActorTagFilter=Include, ActorTagsList="Tree,Rock")
  → (TreeまたはRockタグを持つアクターのみ検出)
```

### 除外フィルタ

```
Create Points
  → World Volumetric Query (ActorTagFilter=Exclude, ActorTagsList="Ignore")
  → ("Ignore"タグを持つアクターを除外)
```

### 入力からのアクターフィルタ

```
Get Actor Data (フィルタ用アクター)
  ↓ (Filter Actor ピン)
Create Points → World Volumetric Query (ActorFilterFromInput=Include)
  → (指定されたアクターのみを検出)
```

### 典型的な用途

- **オブジェクト検出**: 特定領域内のオブジェクトを検出
- **衝突回避**: 既存のオブジェクトと重ならない位置を見つける
- **近接検出**: 近くにあるアクターを検出
- **領域クエリ**: 特定領域内のすべてのオブジェクトをリストアップ
- **フィルタリング**: 特定の条件を満たすオブジェクトのみを検出

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGWorldQuerySettings : public UPCGSettings

// 実行エレメント
class FPCGWorldVolumetricQueryElement : public IPCGElement

// パラメータ構造体
struct FPCGWorldVolumetricQueryParams : public FPCGWorldCommonQueryParams
struct FPCGWorldCommonQueryParams
```

### ピン構成

**入力ピン**:
- カスタム入力ピン（ポイントデータ）
- オプション: Filter Actor入力ピン（ActorFilterFromInputが設定されている場合）

**出力ピン**:
- カスタム出力ピン（検出されたオブジェクト情報）

### キャッシュ不可

- `IsCacheable() = false`
- ワールドの状態に依存するため、キャッシュできない

### クエリ形状

入力ポイントの境界（Bounds）を使用してオーバーラップを検出します。各ポイントのスケールや境界情報が検出範囲に影響します。

### パフォーマンス考慮事項

- **ポイント数**: 多数のポイントは多数のクエリを実行
- **検出範囲**: 大きな境界はパフォーマンスに影響
- **フィルタリング**: 適切なフィルタで不要な検出を削減
- **複数ヒット**: 1つのクエリで複数のオブジェクトを検出可能

## 注意事項

1. **キャッシュ不可**: ワールド状態に依存するため、結果はキャッシュされません
2. **境界の重要性**: ポイントの境界がクエリ範囲を決定します
3. **フィルタリング**: 適切なフィルタを使用して不要な検出を除外
4. **パフォーマンス**: 大規模なクエリは重い処理です
5. **ランドスケープ**: `bIgnoreLandscape`でランドスケープを除外可能

## World Volumetric Query vs World Ray Hit Query

- **World Volumetric Query**:
  - ボリューム内のオーバーラップ検出
  - 複数のオブジェクトを同時に検出
  - 方向性なし（周囲360度）

- **World Ray Hit Query**:
  - 特定方向へのレイキャスト/スイープ
  - 最初のヒットまたは指定された条件のヒット
  - 方向性あり

World Volumetric Queryは、特定位置の周囲にあるすべてのオブジェクトを検出する場合に使用します。

## 関連ノード

- **World Ray Hit Query**: レイキャスト/スイープクエリ
- **Proxy (World Raycast)**: シンプルなレイキャスト
- **Get Actor Data**: アクターデータの取得
- **Filter Data By Attribute**: 属性によるデータフィルタリング

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGWorldQuery.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGWorldQuery.cpp`
- **パラメータ**: `Engine/Plugins/PCG/Source/PCG/Public/Data/PCGWorldData.h`
- **ヘルパー**: `Engine/Plugins/PCG/Source/PCG/Public/Helpers/PCGWorldQueryHelpers.h`
- **カテゴリ**: Spatial
