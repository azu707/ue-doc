# Spawn Spline Mesh

## 概要
Spawn Spline Meshノードは、スプラインの各セグメントに沿ってUSplineMeshComponentを生成します。道路、パイプ、柵、ケーブルなど、スプラインに沿って変形するメッシュの配置に最適です。

- **ノードタイプ**: Spawner
- **クラス**: `UPCGSpawnSplineMeshSettings`
- **エレメント**: `FPCGSpawnSplineMeshElement`

## 機能詳細
このノードは、入力スプラインの各セグメントに対してSplineMeshComponentを作成し、メッシュをスプラインの形状に合わせて変形させます。タイムスライシングをサポートし、大量のスプラインメッシュを効率的に生成できます。

### 主な機能
- **セグメントごとのメッシュ生成**: スプラインの各セグメントに個別のSplineMeshComponent
- **柔軟なメッシュパラメータ**: スケール、回転、オフセット、UV設定など
- **プロパティオーバーライド**: デスクリプタとパラメータのプロパティを動的に設定
- **非同期ロード**: メッシュとマテリアルの非同期ロードをサポート
- **タイムスライシング**: 大量のスプラインメッシュ生成を複数フレームに分割
- **ポストプロセス関数**: 生成後にカスタム関数を実行

### 処理フロー
1. 入力スプラインデータを取得
2. スプラインメッシュデスクリプタとパラメータを設定
3. 各セグメントに対してSplineMeshComponentを作成
4. メッシュをセグメントの形状に合わせて変形
5. プロパティオーバーライドを適用
6. ポストプロセス関数を実行

## プロパティ

### SplineMeshDescriptor
- **型**: FSoftSplineMeshComponentDescriptor
- **カテゴリ**: Settings
- **アクセス**: EditAnywhere
- **説明**: スポーンするスプラインメッシュの基本設定
  - メッシュアセット
  - マテリアルオーバーライド
  - コリジョン設定
  - レンダリング設定など

### SplineMeshParams
- **型**: FPCGSplineMeshParams
- **カテゴリ**: Settings
- **アクセス**: EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: スプラインメッシュの変形パラメータ
  - スケール（開始/終了）
  - ロール（回転）
  - オフセット
  - UV設定など

### TargetActor
- **型**: TSoftObjectPtr<AActor>
- **PCG_Overridable**: あり
- **説明**: スプラインメッシュコンポーネントを追加するターゲットアクター

### PostProcessFunctionNames
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: スプラインメッシュ作成後にターゲットアクターで呼び出す関数のリスト。パラメータレス、"CallInEditor"フラグが必要

### bSynchronousLoad
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings|Debug
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: メッシュ/マテリアルを非同期ではなく同期的にロードします

### SplineMeshOverrideDescriptions
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: スプラインメッシュデスクリプタのプロパティオーバーライド

### SplineMeshParamsOverride
- **型**: TArray<FPCGObjectPropertyOverrideDescription>
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **説明**: スプラインメッシュパラメータのプロパティオーバーライド

## 使用例

### 基本的な道路スプライン
```
// シンプルな道路メッシュをスプラインに沿って配置
SplineMeshDescriptor:
  Mesh: SM_Road_Segment
  Materials: [M_Road_Asphalt]
SplineMeshParams:
  StartScale: (1.0, 1.0)
  EndScale: (1.0, 1.0)
結果: スプラインに沿って道路メッシュが連続的に配置される
```

### テーパー付きパイプ
```
// 開始から終了にかけて細くなるパイプ
SplineMeshDescriptor:
  Mesh: SM_Pipe
SplineMeshParams:
  StartScale: (1.0, 1.0)
  EndScale: (0.5, 0.5)
結果: 徐々に細くなるパイプが生成される
```

### プロパティオーバーライドを使用した動的設定
```
// 属性に基づいてスプラインメッシュをカスタマイズ
SplineMeshOverrideDescriptions:
  - PropertyName: "Mesh"
    AttributeName: "RoadType"
SplineMeshParamsOverride:
  - PropertyName: "StartScale"
    AttributeName: "WidthStart"
  - PropertyName: "EndScale"
    AttributeName: "WidthEnd"
結果: 各セグメントが属性値に基づいてカスタマイズされる
```

### UV設定を使用したテクスチャタイリング
```
// テクスチャが適切にタイリングされるようにUVを設定
SplineMeshParams:
  bScaleUVsByLength: true
  UVScale: (1.0, 1.0)
結果: スプラインの長さに応じてテクスチャが適切にタイリングされる
```

### ケーブルや柵の生成
```
// 回転とオフセットを使用したケーブル配置
SplineMeshDescriptor:
  Mesh: SM_Cable
SplineMeshParams:
  StartRoll: 0.0
  EndRoll: 90.0
  StartOffset: (0, 0, 100)
  EndOffset: (0, 0, 100)
結果: 高さオフセットを持ち、回転するケーブルが生成される
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（Spline、複数接続可）: スプライン形状のソースとなるスプラインデータ（PolyLineまたはLandscapeSpline）
- **出力ピン**:
  - "Out"（Spline）: 入力スプラインデータをパススルー

### 処理の特徴
- **メインスレッド実行**: `CanExecuteOnlyOnMainThread()` が `true` を返すため、メインスレッドでのみ実行
- **キャッシュ不可**: `IsCacheable()` が `false` を返すため、結果はキャッシュされない
- **タイムスライシング**: `TPCGTimeSlicedElementBase` を継承し、大量のメッシュ生成を分割処理
- **非同期ロード**: `PrepareDataInternal()` でメッシュとマテリアルの非同期ロードを準備

### コンテキスト
`FPCGSpawnSplineMeshContext` と `IPCGAsyncLoadingContext` を使用して、非同期ロードとタイムスライシングの状態を管理します。

### スプラインメッシュの変形
各セグメントについて：
1. セグメントの開始位置と終了位置を取得
2. タンジェントベクトルを計算
3. SplineMeshComponentを作成
4. SetStartAndEndメソッドで形状を設定
5. スケール、ロール、オフセットを適用

### タイムスライシング戦略
大量のセグメントがある場合、処理を複数のイテレーションに分割し、各フレームで一定数のセグメントのみを処理します。

## パフォーマンス考慮事項

1. **セグメント数**: セグメントが多いほど生成時間とメモリ使用量が増加します
2. **メッシュの複雑度**: 高ポリゴンメッシュはパフォーマンスに影響します
3. **非同期ロード**: bSynchronousLoadはfalseのままにすることを推奨
4. **タイムスライシング**: 自動的に有効化され、大規模な生成でもフレームレートを維持します
5. **コリジョン**: コリジョンが有効な場合、追加のコストが発生します
6. **マテリアルの複雑度**: 複雑なマテリアルはレンダリングコストを増加させます

## 注意事項

1. **メッシュの有効性**: SplineMeshDescriptorに指定されたメッシュは有効なStaticMeshである必要があります
2. **スプラインメッシュの制約**: すべてのメッシュがスプラインメッシュに適しているわけではありません（適切なUV配置が必要）
3. **ターゲットアクターの要件**: ターゲットアクターは有効で、コンポーネントを追加できる状態である必要があります
4. **セグメントの長さ**: 非常に短いまたは長いセグメントは視覚的な問題を引き起こす可能性があります
5. **UV設定**: bScaleUVsByLengthを使用する場合、メッシュのUVが適切に設定されている必要があります
6. **プロパティオーバーライドの型**: オーバーライドする型はデスクリプタやパラメータのプロパティ型と一致する必要があります

## SplineMeshParamsの詳細設定

### スケール設定
- `StartScale`: セグメント開始位置のXY方向スケール
- `EndScale`: セグメント終了位置のXY方向スケール

### オフセット設定
- `StartOffset`: セグメント開始位置のローカルオフセット
- `EndOffset`: セグメント終了位置のローカルオフセット

### ロール（回転）設定
- `StartRoll`: セグメント開始位置の回転（度）
- `EndRoll`: セグメント終了位置の回転（度）

### UV設定
- `bScaleUVsByLength`: セグメントの長さに応じてUVをスケーリング
- `UVScale`: UVのスケーリング係数

### Forward Axis設定
- `ForwardAxis`: メッシュの前方軸を指定（X, Y, Z）

## 関連ノード
- **Spawn Spline Component**: スプラインコンポーネント自体をスポーン
- **Create Spline**: ポイントデータからスプラインを作成
- **Subdivide Spline**: スプラインをより多くのセグメントに分割
- **Static Mesh Spawner**: ポイントベースのメッシュスポーン

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSpawnSplineMesh.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSpawnSplineMesh.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/PCGTimeSlicedElementBase.h`
