# Bounds From Mesh

## 概要
Bounds From Meshノードは、メッシュから取得したバウンディングボックス（境界ボックス）を使用して、ポイントのバウンド（範囲）を設定するノードです。指定されたスタティックメッシュの境界情報を各ポイントに適用します。

## 機能詳細
このノードは`UPCGBoundsFromMeshSettings`クラスとして実装されており、以下の処理を行います:

- 入力ポイントデータの各ポイントに対して、指定された属性からメッシュを取得
- 取得したメッシュのバウンディングボックスを計算
- 各ポイントのバウンド（extents）をメッシュのバウンドで更新

## プロパティ

### MeshAttribute
- **型**: FPCGAttributePropertyInputSelector
- **説明**: メッシュを取得するための属性セレクターです。この属性は、UStaticMeshまたはFSoftObjectPathを含んでいる必要があります。
- **メタフラグ**: PCG_DiscardPropertySelection（プロパティ選択を無効化）
- **Blueprint対応**: 読み書き可能

### bSilenceAttributeNotFoundErrors
- **型**: bool
- **デフォルト値**: false
- **説明**: trueに設定すると、入力データに必要な属性が見つからない場合の警告を抑制します。エラーログを減らすために使用されます。
- **Blueprint対応**: 読み書き可能

### bSynchronousLoad
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings|Debug
- **説明**: デフォルトでは非同期ロードが使用されますが、trueに設定すると同期的にメッシュをロードします。デバッグやテスト時に使用されます。
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. ポイントデータを入力ピンに接続
2. メッシュへの参照を含む属性を`MeshAttribute`に指定
3. ノードを実行すると、各ポイントのバウンドがメッシュのサイズに基づいて更新される

### 一般的な用途
- スタティックメッシュスポーナーの前処理として、正確なバウンド情報を設定
- 異なるサイズのメッシュに対応したポイント配置の調整
- コリジョン検出やカリング処理の最適化

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType)
class UPCGBoundsFromMeshSettings : public UPCGSettings
```

### コンテキスト構造
```cpp
struct FPCGBoundsFromMeshContext : public FPCGContext, public IPCGAsyncLoadingContext
```

カスタムコンテキストには以下の情報が含まれます:
- `PerInputData`: 各入力データに対するメッシュ情報
- `SingleMesh`: 単一メッシュのパス
- `MeshToBoundsMap`: メッシュIDからバウンドへのマッピング
- `MeshesToLoad`: ロードが必要なメッシュのリスト
- `bPrepareDone`: 準備完了フラグ
- `bBoundsQueried`: バウンドクエリ完了フラグ

### 実行フロー
1. **PrepareDataInternal**: メッシュの非同期ロードを開始
2. **ExecuteInternal**: メッシュのバウンドを取得し、ポイントに適用

### スレッド実行
- `CanExecuteOnlyOnMainThread`: true
- メッシュのロードとオブジェクトアクセスはメインスレッドで実行される必要があります

### 入力ピン
- ポイントデータを受け付ける
- ベースポイントデータ入力をサポート（`SupportsBasePointDataInputs`: true）

### 出力ピン
- 更新されたバウンド情報を持つポイントデータを出力

### 実行ループモード
- `ExecutionLoopMode`: SinglePrimaryPin（単一のプライマリピンで実行）

### ノードの特徴
- **ノード名**: BoundsFromMesh
- **カテゴリ**: Spatial
- **動的キー追跡**: サポート（`CanDynamicallyTrackKeys`: true）
- **ピン使用判定**: サポート（`IsPinUsedByNodeExecution`: true）

## 注意事項
- メッシュの非同期ロードが完了するまで、処理は待機状態になります
- 大量のメッシュを処理する場合、ロード時間が長くなる可能性があります
- 指定された属性が存在しない場合、デフォルトではエラーが発生します（`bSilenceAttributeNotFoundErrors`でコントロール可能）
- メッシュアセットへのアクセスにはメインスレッドが必要なため、並列処理の恩恵は限定的です

## 関連ノード
- **Static Mesh Spawner**: バウンド情報を使用してメッシュを配置
- **Get Bounds**: 空間データからバウンド情報を取得
- **Create Collision Data**: メッシュのコリジョン情報を取得
