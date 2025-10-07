# To Point

## 概要

To Pointノード（内部名: Collapse）は、入力をポイントデータに変換します。必要に応じてデフォルト設定でサンプリングを実行し、あらゆる型のデータを統一されたポイントデータとして出力します。

## 機能詳細

このノードは、任意の入力データをポイントデータに「折りたたみ（Collapse）」ます。暗黙的な空間データ（サーフェス、ボリューム、スプラインなど）は自動的にサンプリングされ、AttributeSetなどもポイントデータに変換されます。

### 処理フロー

1. **入力データの取得**: 任意の型のデータを入力から取得
2. **データ型の判定**: 入力のデータ型を確認
3. **変換/サンプリング**: 必要に応じてポイントデータに変換
   - 既にポイントデータ: そのまま出力
   - 暗黙的空間データ: デフォルト設定でサンプリング
   - AttributeSet: ポイントデータに変換
   - その他: 可能であればポイントに変換
4. **ポイントデータの出力**: 統一されたポイントデータとして出力

## プロパティ

### bPassThroughEmptyAttributeSets
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: いいえ（レガシー設定）
- **説明**: バージョン5.6より前の動作を保持するための設定
  - `false`: 空のAttributeSetも変換する（5.6以降のデフォルト）
  - `true`: 空のAttributeSetを変換せずにパススルー（5.6より前の動作）
- **注意**: バージョンPCGAttributeSetToPointAlwaysConverts（5.6）より前は、空のAttributeSetはパススルーされていました

## 使用例

### 基本的な変換

```
Get Landscape Data
  → To Point
  → (ポイントデータとして出力)
```

### 複数データ型の統一

```
Gather (異なる型のデータを収集)
  → To Point
  → (すべてポイントデータとして統一)
```

### サンプリングの強制

```
Get Volume Data
  → To Point (デフォルト設定でサンプリング)
  → Attribute Transform Op
```

### パイプラインの簡略化

```
(複数の異なるデータソース)
  → To Point
  → (ポイント処理ノード群)
```

データ型を気にせず、常にポイントとして処理

### 典型的な用途

- **データ型の統一**: 異なる型のデータをポイントに統一
- **パイプラインの簡略化**: 後続ノードでポイント型のみを考慮すればよい
- **サンプリングの自動化**: 暗黙的データを自動的にサンプリング
- **AttributeSetの変換**: AttributeSetを実際のポイントに変換
- **デバッグ**: データが実際にどのようなポイントになるかを確認

## 実装の詳細

### クラス構成

```cpp
// 設定クラス
class UPCGCollapseSettings : public UPCGSettings

// コンテキスト
struct FPCGCollapseContext : public FPCGContext

// 実行エレメント
class FPCGCollapseElement : public IPCGElementWithCustomContext<FPCGCollapseContext>
```

### ピン構成

**入力ピン**:
- カスタム入力ピン（任意の型）

**出力ピン**:
- デフォルトのポイント出力ピン

### 実行ループモード

- **Mode**: `EPCGElementExecutionLoopMode::SinglePrimaryPin`
- 各入力データに対して個別に変換を実行

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータに対応

### CRC計算

- `ShouldComputeFullOutputDataCrc`を条件付きでサポート
- スプライン/ランドスケープなどの外部データをサンプリングする可能性がある場合、完全なCRCを計算
- 変更の伝播や再実行を停止できる可能性を考慮

### ノード表示

- `ShouldDrawNodeCompact() = true`
- エディタでコンパクト表示される
- カスタムアイコンをサポート (`GetCompactNodeIcon`)
- `CanUserEditTitle() = false`
- ユーザーはタイトルを編集できない

### 変換の詳細

各データ型に対する処理:
- **PointData**: そのまま出力
- **Surface**: デフォルトサーフェスサンプリング
- **Volume**: デフォルトボリュームサンプリング
- **Spline**: デフォルトスプラインサンプリング
- **AttributeSet**: ポイントデータに変換（空でも変換、5.6以降）
- **その他**: 可能であればポイントに変換

### パフォーマンス考慮事項

- **サンプリングコスト**: 大きな暗黙的データの変換は計算コストが高い
- **デフォルト設定**: サンプリングはデフォルト設定で行われるため、細かい制御不可
- **ポイント数**: 出力ポイント数は元のデータとデフォルトサンプリング設定に依存

## 注意事項

1. **デフォルトサンプリング**: サンプリングパラメータはカスタマイズできません
2. **すべてをポイントに**: すべての入力がポイントデータに変換されます
3. **バージョン互換性**: 5.6以降、空のAttributeSetも変換されます
4. **コンパクト表示**: ノードはエディタで小さく表示されます
5. **カスタムサンプリング**: より細かい制御が必要な場合は、専用のSamplerノードを使用

## To Point vs Attribute Set To Point

- **To Point** (`UPCGCollapseSettings`):
  - すべての型のデータをポイントに変換
  - 空間データ、AttributeSet、その他をサポート

- **Attribute Set To Point** (`UPCGConvertToPointDataSettings`):
  - AttributeSetのみを受け入れるバリアント
  - To Pointを継承
  - 入力ピンがAttributeSet専用

Attribute Set To Pointは、To Pointの特殊化バージョンで、入力ピンの型がAttributeSetに制限されています。

## 関連ノード

- **Attribute Set To Point**: AttributeSet専用のTo Pointバリアント
- **Make Concrete**: 空間データを具体化してポイントに変換
- **Surface Sampler**: サーフェスのカスタムサンプリング
- **Volume Sampler**: ボリュームのカスタムサンプリング
- **Spline Sampler**: スプラインのカスタムサンプリング

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCollapseElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGCollapseElement.cpp`
- **カテゴリ**: Spatial
