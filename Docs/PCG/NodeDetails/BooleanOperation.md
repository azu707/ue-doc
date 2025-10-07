# Boolean Operation

## 概要

**Boolean Operation**ノードは、ダイナミックメッシュ間でブーリアン演算（交差、結合、減算など）を実行するノードです。複数のメッシュを組み合わせて新しいジオメトリを生成できます。

カテゴリ: DynamicMesh
クラス名: `UPCGBooleanOperationSettings`
エレメント: `FPCGBooleanOperationElement`

## 機能詳細

このノードは、GeometryScriptのメッシュブーリアン機能を使用して、2つのダイナミックメッシュセット間で演算を実行します。CSG（Constructive Solid Geometry）操作を可能にし、複雑なメッシュ形状を生成できます。

### 主な特徴

- 複数のブーリアン演算タイプをサポート
- 柔軟な処理モード（各AとB、順次、全組み合わせ）
- タグ継承制御
- GeometryScriptの高度なオプション

## ブーリアン演算タイプ

- **Intersection（交差）**: AとBの重なり部分のみ
- **Union（結合）**: AとBを結合
- **Subtract（減算）**: AからBを除去
- **TrimByPlane（平面でトリム）**: 平面でメッシュを切断

## 処理モード

### EachAWithEachB
- **説明**: 各AのメッシュをそれぞれのBのメッシュとブーリアン演算（A1とB1、A2とB2など）
- **出力数**: N個（A側の入力数）
- **用途**: 1対1の対応関係がある場合

### EachAWithEachBSequentially
- **説明**: 各AのメッシュをすべてのBのメッシュと順次ブーリアン演算（A1をB1で、次にB2で...）
- **出力数**: N個（A側の入力数）
- **用途**: 複数の演算を順次適用する場合

### EachAWithEveryB
- **説明**: 各AのメッシュをすべてのBのメッシュと個別にブーリアン演算（デカルト積: A1とB1、A1とB2、A2とB1、A2とB2など）
- **出力数**: N × M個
- **用途**: すべての組み合わせが必要な場合

## プロパティ

### BooleanOperation
- **型**: `EGeometryScriptBooleanOperation` (enum)
- **デフォルト値**: `EGeometryScriptBooleanOperation::Intersection`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 実行するブーリアン演算のタイプ

### BooleanOperationOptions
- **型**: `FGeometryScriptMeshBooleanOptions`
- **デフォルト値**: デフォルト設定
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: ブーリアン演算の詳細オプション:
  - `bFillHoles`: 穴を埋める
  - `bSimplifyOutput`: 出力を簡略化
  - `SimplificationTolerance`: 簡略化の許容度

### TagInheritanceMode
- **型**: `EPCGBooleanOperationTagInheritanceMode` (enum)
- **デフォルト値**: なし
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 結果メッシュがどちらのタグを継承するか:
  - **Both**: AとBの両方のタグ
  - **A**: Aのタグのみ
  - **B**: Bのタグのみ

### Mode
- **型**: `EPCGBooleanOperationMode` (enum)
- **デフォルト値**: `EPCGBooleanOperationMode::EachAWithEachB`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい (`PCG_Overridable`)
- **説明**: 処理モード（上記参照）

## 入力ピン

### A (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: ブーリアン演算の左辺（A側）のメッシュ

### B (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: ブーリアン演算の右辺（B側）のメッシュ

## 出力ピン

### Out (ダイナミックメッシュデータ)
- **型**: ダイナミックメッシュデータ
- **説明**: ブーリアン演算の結果メッシュ（複数の場合もあり）

## 使用例

### 交差（Intersection）

```
[MeshA: Cube] ─┐
               ├→ [Boolean Operation] → [Result: 交差部分]
[MeshB: Sphere]┘

// 設定:
BooleanOperation = Intersection
Mode = EachAWithEachB

// 結果: CubeとSphereの重なり部分のみ
```

### 減算（Subtract）

```
[MeshA: Cube] ─┐
               ├→ [Boolean Operation] → [Result: 穴の開いたCube]
[MeshB: Sphere]┘

// 設定:
BooleanOperation = Subtract
Mode = EachAWithEachB

// 結果: CubeからSphere部分を除去
```

### 複数メッシュの順次演算

```
[MeshA: BaseMesh] ─┐
                   ├→ [Boolean Operation] → [Result: 複数穴のあるMesh]
[MeshB1: Hole1]    │
[MeshB2: Hole2]    │
[MeshB3: Hole3] ───┘

// 設定:
BooleanOperation = Subtract
Mode = EachAWithEachBSequentially

// 結果: BaseMeshからHole1、Hole2、Hole3を順次除去
```

### 全組み合わせ（デカルト積）

```
[MeshA1: CubeA] ─┐
[MeshA2: CubeB] ─┤
                 ├→ [Boolean Operation] → [4つの結果メッシュ]
[MeshB1: SphereA]│
[MeshB2: SphereB]┘

// 設定:
BooleanOperation = Intersection
Mode = EachAWithEveryB

// 結果:
// 1. CubeA ∩ SphereA
// 2. CubeA ∩ SphereB
// 3. CubeB ∩ SphereA
// 4. CubeB ∩ SphereB
```

## 実装の詳細

### ExecuteInternal メソッド

1. **入力の検証**: AとBの両方のピンに有効なダイナミックメッシュデータがあるか確認
2. **モードによる分岐**:
   - **EachAWithEachB**: AとBをペアで処理
   - **EachAWithEachBSequentially**: 各Aに対してすべてのBを順次適用
   - **EachAWithEveryB**: すべての組み合わせを処理
3. **ブーリアン演算の実行**: GeometryScriptのブーリアン関数を呼び出し
4. **タグの継承**: 設定に基づいてタグをコピー
5. **出力**: 結果のダイナミックメッシュを出力ピンに追加

### GeometryScript統合

このノードは、Unreal EngineのGeometryScriptプラグインの機能を使用します:
```cpp
UGeometryScriptLibrary_MeshBooleanFunctions::ApplyMeshBoolean(
    TargetMesh,
    Transform,
    ToolMesh,
    ToolTransform,
    BooleanOperation,
    BooleanOperationOptions
);
```

## パフォーマンス考慮事項

1. **複雑さ**: メッシュの頂点数が多いほど、演算に時間がかかります
2. **モード選択**:
   - `EachAWithEachB`: 最も高速（N個の演算）
   - `EachAWithEachBSequentially`: 中程度（N × M個の演算）
   - `EachAWithEveryB`: 最も低速（N × M個の出力）
3. **簡略化**: `BooleanOperationOptions.bSimplifyOutput = true` で後処理を削減できますが、品質とのトレードオフがあります
4. **穴の充填**: `BooleanOperationOptions.bFillHoles` は追加の処理時間が必要です

## 一般的なブーリアン演算の用途

### Intersection（交差）
- 2つのボリュームの重なり部分の検出
- クリッピング領域の作成
- 衝突検出ボリュームの生成

### Union（結合）
- 複数のメッシュを1つに統合
- 複雑な形状の構築
- 継ぎ目のないメッシュの作成

### Subtract（減算）
- 穴や凹みの作成
- カットアウトの生成
- 内部ボリュームの除去

## 関連ノード

- **Merge Dynamic Meshes**: ブーリアン演算なしでメッシュを結合
- **Dynamic Mesh Transform**: メッシュの変換を適用
- **Create Empty Dynamic Mesh**: 空のダイナミックメッシュを作成

## 注意事項

- 両方の入力（AとB）にダイナミックメッシュが必要です
- 非閉鎖メッシュ（穴があるメッシュ）では予期しない結果になる可能性があります
- 自己交差するメッシュは問題を引き起こす可能性があります
- 処理モードによって出力数が大きく異なります
- GeometryScriptプラグインが必要です

## ベストプラクティス

1. **閉鎖メッシュの使用**: ブーリアン演算には閉鎖メッシュ（水密メッシュ）が最適です
2. **簡略化の活用**: 結果メッシュが複雑になりすぎる場合、`bSimplifyOutput` を使用
3. **モードの選択**: 必要な結果に応じて適切なモードを選択してパフォーマンスを最適化
4. **タグ管理**: `TagInheritanceMode` を使用して結果メッシュのタグを適切に管理
