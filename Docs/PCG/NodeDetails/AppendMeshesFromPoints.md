# Append Meshes From Points

## 概要

**Append Meshes From Points**ノードは、ポイントの位置と変換にメッシュを追加するノードです。単一のスタティックメッシュ、ポイント属性から取得した複数のメッシュ、または別のダイナミックメッシュを使用できます。

カテゴリ: DynamicMesh
クラス名: `UPCGAppendMeshesFromPointsSettings`
エレメント: `FPCGAppendMeshesFromPointsElement`

## 機能詳細

このノードは、PCGポイントデータの各ポイントにメッシュを配置し、それらを1つのダイナミックメッシュに結合します。Static Mesh Spawner ノードと似ていますが、スポーンする代わりにメッシュジオメトリを直接結合します。

### 主な特徴

- 複数のメッシュソースモード（単一メッシュ/属性から/ダイナミックメッシュ）
- ポイント変換の適用
- マテリアルの自動抽出
- LOD設定のカスタマイズ
- 非同期メッシュロード対応

## モード

### SingleStaticMesh
- **説明**: ノード設定からメッシュを取得
- **用途**: すべてのポイントに同じメッシュを配置

### StaticMeshFromAttribute
- **説明**: ポイントの属性からメッシュを取得
- **用途**: ポイントごとに異なるメッシュを配置

### DynamicMesh
- **説明**: 別のダイナミックメッシュからメッシュを取得
- **用途**: 既存のダイナミックメッシュをポイント位置に複製

## プロパティ

### Mode
- **型**: `EPCGAppendMeshesFromPointsMode` (enum)
- **デフォルト値**: なし
- **カテゴリ**: Settings
- **説明**: メッシュの取得方法を指定します。

### StaticMesh
- **型**: `TSoftObjectPtr<UStaticMesh>`
- **デフォルト値**: `nullptr`
- **カテゴリ**: Settings
- **条件**: `Mode == SingleStaticMesh`
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 使用するスタティックメッシュ。SingleStaticMesh モードで使用されます。

### MeshAttribute
- **型**: `FPCGAttributePropertyInputSelector`
- **デフォルト値**: なし
- **カテゴリ**: Settings
- **条件**: `Mode == StaticMeshFromAttribute`
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: メッシュを取得する属性セレクタ。StaticMeshFromAttribute モードで使用されます。

### bExtractMaterials
- **型**: `bool`
- **デフォルト値**: `true`
- **カテゴリ**: Settings
- **条件**: `Mode != DynamicMesh`
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: スタティックメッシュからマテリアルを抽出し、結果の追加メッシュに設定します。

### RequestedLODType
- **型**: `EGeometryScriptLODType` (enum)
- **デフォルト値**: `EGeometryScriptLODType::RenderData`
- **カテゴリ**: Settings|LODSettings
- **条件**: `Mode != DynamicMesh`
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 指定されたスタティックメッシュからダイナミックメッシュを作成する際に使用するLODタイプ。

### RequestedLODIndex
- **型**: `int32`
- **デフォルト値**: `0`
- **カテゴリ**: Settings|LODSettings
- **条件**: `Mode != DynamicMesh`
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 使用するLODインデックス。

### bSynchronousLoad
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings|Debug
- **条件**: `Mode != DynamicMesh`
- **説明**: 同期ロードを使用します。デバッグ用途に推奨されます。通常は非同期ロードが使用されます。

## 入力ピン

動的に定義されます。通常、以下のピンがあります:

### Points (ポイントデータ)
- **型**: ポイントデータ
- **説明**: メッシュを配置するポイントデータ

### Dynamic Mesh (オプション、DynamicMeshモードのみ)
- **型**: ダイナミックメッシュデータ
- **説明**: 複製するダイナミックメッシュ

## 出力ピン

### Out (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: 結合されたダイナミックメッシュ

## 使用例

### 単一メッシュの配置

```
[PointSampler] → [Append Meshes From Points]
                        ↓
                  [DynamicMeshData]

// 設定:
Mode = SingleStaticMesh
StaticMesh = /Game/Meshes/Rock.Rock
bExtractMaterials = true
```

### ポイント属性からのメッシュ配置

```
// ポイントデータの属性に "MeshPath" が含まれている場合:
[PointsWithMeshAttribute] → [Append Meshes From Points]
                                    ↓
                              [DynamicMeshData]

// 設定:
Mode = StaticMeshFromAttribute
MeshAttribute = "MeshPath"
```

### ダイナミックメッシュの複製

```
[SourceDynamicMesh] ─┐
[Points] ────────────┴→ [Append Meshes From Points]
                              ↓
                        [MultipleDynamicMeshes]

// 設定:
Mode = DynamicMesh
```

## 実装の詳細

### コンテキスト

`FPCGAppendMeshesFromPointsContext` は以下を保持します:

#### bPrepareDataSucceeded
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: データ準備が成功したかどうか

#### MeshToPointIndicesMapping
- **型**: `TMap<FSoftObjectPath, TArray<int32>>`
- **説明**: メッシュパスからポイントインデックスへのマッピング。StaticMeshFromAttribute モードで使用されます。

### PrepareDataInternal メソッド

1. **モード判定**: 設定されたモードに基づいて処理を分岐
2. **メッシュの収集**:
   - SingleStaticMesh: 単一のメッシュパスを使用
   - StaticMeshFromAttribute: 各ポイントの属性からメッシュパスを取得してマッピングを作成
   - DynamicMesh: ダイナミックメッシュデータを取得
3. **非同期ロードの開始**: 必要なメッシュの非同期ロードを開始（`bSynchronousLoad = false` の場合）

### ExecuteInternal メソッド

1. **ロード待機**: 非同期ロードが完了するまで待機
2. **ダイナミックメッシュの作成**: 新しい空のダイナミックメッシュを作成
3. **メッシュの追加**:
   - 各ポイントまたはメッシュグループに対して
   - スタティックメッシュをダイナミックメッシュに変換
   - ポイントの変換を適用
   - 結果のダイナミックメッシュに追加
4. **マテリアルの処理**: `bExtractMaterials = true` の場合、マテリアルを抽出して設定
5. **出力**: 結合されたダイナミックメッシュを出力

### メインスレッド実行

`CanExecuteOnlyOnMainThread()` は、非同期ロードコンテキストが使用中の場合に true を返します。これは、アセットロードがメインスレッドで処理される必要があるためです。

## パフォーマンス考慮事項

1. **メッシュロード**: 大量の異なるメッシュを使用する場合、非同期ロードでもパフォーマンスに影響する可能性があります
2. **メッシュ結合**: 多数のポイントがある場合、メッシュ結合に時間がかかります
3. **LOD選択**: 適切なLODを選択することで、メモリとパフォーマンスを最適化できます
4. **マテリアル抽出**: `bExtractMaterials = false` に設定すると、わずかにパフォーマンスが向上します

## 静的キー追跡

このノードは静的キー追跡をサポートしています:
- `Mode != DynamicMesh` の場合、使用されるメッシュを追跡
- `GetStaticTrackedKeys()` で静的に決定可能なメッシュを報告
- `CanDynamicallyTrackKeys()` で動的追跡の可否を報告

## 関連ノード

- **Static Mesh To Dynamic Mesh Element**: スタティックメッシュをダイナミックメッシュに変換
- **Merge Dynamic Meshes**: 複数のダイナミックメッシュを結合
- **Static Mesh Spawner**: スタティックメッシュをスポーン（メッシュデータではなくアクター）
- **Point From Mesh**: メッシュからポイントを生成

## 注意事項

- メッシュアセットは有効なスタティックメッシュである必要があります
- ポイント属性からメッシュを取得する場合、属性はソフトオブジェクトパスまたはメッシュへの参照である必要があります
- 大量のポイントと重いメッシュの組み合わせは、メモリを大量に消費する可能性があります
- DynamicMesh モードでは、入力ダイナミックメッシュが必要です

## ベストプラクティス

1. **LODの活用**: 遠景用には低LODを使用してパフォーマンスを向上
2. **メッシュの再利用**: 可能な限り同じメッシュを再利用してロード時間を削減
3. **非同期ロード**: デバッグ時以外は `bSynchronousLoad = false` を使用
4. **マテリアルの最適化**: 必要ない場合は `bExtractMaterials = false` に設定
