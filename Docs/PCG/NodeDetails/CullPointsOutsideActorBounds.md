# Cull Points Outside Actor Bounds

## 概要

Cull Points Outside Actor Boundsノードは、現在のアクター境界の外にあるポイントを削除します。オプションで境界を拡張することができ、OrderedモードとUnorderedモードの2つの処理モードをサポートしています。

## 機能詳細

このノードは、PCGコンポーネントが配置されているアクターの境界ボックスを基準に、その外側にあるポイントをフィルタリングします。境界ボックスは必要に応じて拡張でき、処理順序を保持するかどうかを選択できます。

### 処理フロー

1. **アクター境界の取得**: PCGコンポーネントが配置されているアクターの境界を取得
2. **境界の拡張**: `BoundsExpansion`パラメータに基づいて境界を拡張
3. **ポイントのカリング**: 拡張された境界の外にあるポイントを削除
4. **モード適用**: OrderedまたはUnorderedモードに応じた処理を実行

### カリングモード

#### Ordered (順序保持)
- ポイントの元の順序を保持しながらカリング
- パフォーマンスはやや低下するが、順序が重要な場合に使用

#### Unordered (順序無視)
- ポイントの順序を保持せずにカリング
- より高速な処理が可能
- 順序が重要でない場合に推奨

## プロパティ

### BoundsExpansion
- **型**: `float`
- **デフォルト値**: `0.0`
- **オーバーライド可能**: はい
- **説明**: アクター境界を拡張する距離（単位: cm）
  - 正の値: 境界を外側に拡張（より多くのポイントが保持される）
  - 負の値: 境界を内側に縮小（より多くのポイントが削除される）
  - 0: 元のアクター境界をそのまま使用

### Mode
- **型**: `EPCGCullPointsMode`
- **デフォルト値**: `Ordered`
- **オーバーライド可能**: はい
- **説明**: カリング処理のモード
  - `Ordered`: ポイントの順序を保持
  - `Unordered`: ポイントの順序を無視（高速）

## 使用例

### 基本的な使用方法

1. **アクター境界内のポイントのみを保持**
   - Create Points Gridなどでポイントを生成
   - Cull Points Outside Actor Boundsノードを接続
   - アクター境界外のポイントが自動的に削除される

2. **境界の拡張**
   - `BoundsExpansion = 100.0`を設定
   - アクター境界から100cm外側まで

のポイントを保持

### 典型的な用途

- **レベル境界の適用**: 特定のアクター範囲内にのみオブジェクトを配置
- **最適化**: 不要な範囲のポイントを事前に削除してパフォーマンス向上
- **領域制限**: ゲームプレイエリア内にのみコンテンツを制限
- **デバッグ**: テスト用に特定範囲のポイントのみを表示

### ワークフロー例

```
Create Points Grid (広範囲)
  → Cull Points Outside Actor Bounds (BoundsExpansion = -50)
  → Static Mesh Spawner
```

このワークフローでは、アクター境界より50cm内側にあるポイントのみにメッシュがスポーンされます。

## 実装の詳細

### クラス構成

```cpp
// カリングモード列挙型
enum class EPCGCullPointsMode : uint8
{
    Ordered = 0,
    Unordered
};

// 設定クラス
class UPCGCullPointsOutsideActorBoundsSettings : public UPCGSettings

// 実行エレメント
class FPCGCullPointsOutsideActorBoundsElement : public IPCGElement
```

### ピン構成

**入力ピン**:
- デフォルトの入力ピン（ポイントデータまたはベースポイントデータ）

**出力ピン**:
- デフォルトの出力ピン（カリングされたポイントデータ）

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各入力データに対して個別にカリング処理を実行

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### 依存関係

- `GetDependenciesCrc`: アクターの境界が変更された場合に再計算が必要となるため、依存関係のCRCを計算

### パフォーマンス考慮事項

- **Orderedモード**: 順序を保持するため、やや処理時間が長い
- **Unorderedモード**: 順序を無視できる場合は、こちらを使用してパフォーマンス向上
- **事前カリング**: 後続ノードの処理負荷を軽減するため、早い段階でカリングを適用すると効果的

### スレッドセーフティ

- マルチスレッド実行に対応
- アクター境界の取得はメインスレッドで行う必要がある場合がある

## 注意事項

1. **アクター境界の参照**: このノードは、PCGコンポーネントが配置されているアクターの境界を使用します
2. **動的境界**: アクターの境界が動的に変化する場合、PCGグラフが再実行される必要があります
3. **境界の解釈**: 境界はアクターのすべてのコンポーネントを含む軸整列境界ボックス（AABB）です
4. **順序の重要性**: ポイントの順序が後続の処理で重要な場合は、必ずOrderedモードを使用してください
5. **負の拡張**: `BoundsExpansion`に負の値を設定すると、境界が内側に縮小されます

## 関連ノード

- **Get Bounds**: 境界情報を取得
- **Create Points Grid**: グリッド状にポイントを生成
- **Create Points**: 任意の形状でポイントを生成
- **Filter Data By Attribute**: 属性ベースのフィルタリング
- **Density Filter**: 密度ベースのフィルタリング

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCullPointsOutsideActorBounds.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGCullPointsOutsideActorBounds.cpp`
- **カテゴリ**: Spatial
