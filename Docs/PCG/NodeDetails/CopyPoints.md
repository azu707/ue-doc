# Copy Points

## 概要

**ノードタイプ**: Sampler
**クラス**: UPCGCopyPointsSettings
**エレメント**: FPCGCopyPointsElement

Copy Pointsノードは、ソースポイントをターゲットポイントの位置にコピーし、両方のポイントの属性、トランスフォーム、タグを継承した新しいポイントセットを生成します。このノードは、ポイント間の関係を構築し、複雑な配置パターンを作成する際に非常に有用です。

## 機能詳細

Copy Pointsノードは、2つの入力ポイントセット（ソースとターゲット）を組み合わせて、新しいポイントを生成します。各出力ポイントは、ソースとターゲットの属性を指定された方法で継承し、トランスフォーム（位置、回転、スケール）、色、シード、メタデータ、タグを柔軟に制御できます。

主な機能:
- ソースポイントをターゲットポイントの位置にコピー
- 相対的、ソース、ターゲットの3つの継承モードによる柔軟な属性制御
- カルテシアン積（N×M）または1対1（N:N）のコピーモード
- GPU実行サポート
- 条件付きコピー（属性マッチング）のサポート（実験的機能）

## プロパティ

### RotationInheritance
- **型**: EPCGCopyPointsInheritanceMode
- **デフォルト値**: Relative
- **説明**: 出力ポイントの回転を決定する方法を指定します
  - `Relative`: ソースの回転にターゲットの回転を相対的に適用
  - `Source`: ソースの回転を使用
  - `Target`: ターゲットの回転を使用
- **オーバーライド可能**: はい

### bApplyTargetRotationToPositions
- **型**: bool
- **デフォルト値**: true
- **説明**: RotationInheritanceがSourceの場合、ソース位置にターゲットの回転を適用するかどうかを制御します
- **オーバーライド可能**: はい
- **編集条件**: RotationInheritance == Source

### ScaleInheritance
- **型**: EPCGCopyPointsInheritanceMode
- **デフォルト値**: Relative
- **説明**: 出力ポイントのスケールを決定する方法を指定します
  - `Relative`: ソースのスケールにターゲットのスケールを相対的に適用（乗算）
  - `Source`: ソースのスケールを使用
  - `Target`: ターゲットのスケールを使用
- **オーバーライド可能**: はい

### bApplyTargetScaleToPositions
- **型**: bool
- **デフォルト値**: true
- **説明**: ScaleInheritanceがSourceの場合、ソース位置にターゲットのスケールを適用するかどうかを制御します
- **オーバーライド可能**: はい
- **編集条件**: ScaleInheritance == Source

### ColorInheritance
- **型**: EPCGCopyPointsInheritanceMode
- **デフォルト値**: Relative
- **説明**: 出力ポイントの色を決定する方法を指定します
  - `Relative`: ソースとターゲットの色を乗算
  - `Source`: ソースの色を使用
  - `Target`: ターゲットの色を使用
- **オーバーライド可能**: はい

### SeedInheritance
- **型**: EPCGCopyPointsInheritanceMode
- **デフォルト値**: Relative
- **説明**: 出力ポイントのシード値を決定する方法を指定します
  - `Relative`: 新しい位置からシードを再計算
  - `Source`: ソースのシードを使用
  - `Target`: ターゲットのシードを使用
- **オーバーライド可能**: はい

### AttributeInheritance
- **型**: EPCGCopyPointsMetadataInheritanceMode
- **デフォルト値**: SourceFirst
- **説明**: 出力データの属性を決定する方法を指定します
  - `SourceFirst`: ソースメタデータを継承し、ターゲットの一意の属性のみを適用
  - `TargetFirst`: ターゲットメタデータを継承し、ソースの一意の属性のみを適用
  - `SourceOnly`: ソースからのみメタデータを継承
  - `TargetOnly`: ターゲットからのみメタデータを継承
  - `None`: メタデータなし
- **オーバーライド可能**: はい

### TagInheritance
- **型**: EPCGCopyPointsTagInheritanceMode
- **デフォルト値**: Both
- **説明**: 出力データのタグを決定する方法を指定します
  - `Both`: ソースとターゲットの両方のタグを継承
  - `Source`: ソースのタグのみを継承
  - `Target`: ターゲットのタグのみを継承
- **オーバーライド可能**: はい

### bCopyEachSourceOnEveryTarget
- **型**: bool
- **デフォルト値**: true
- **説明**: trueの場合、各ソースポイントをすべてのターゲットポイントにコピーします（カルテシアン積、N×M個のポイントデータを生成）。falseの場合、N:N（または N:1、1:N）操作を実行し、N個のポイントデータを生成します
- **オーバーライド可能**: はい

### bMatchBasedOnAttribute
- **型**: bool
- **デフォルト値**: false
- **説明**: データペアが一致する属性を持つ場合にのみコピー操作を実行する条件付きコピーを実行します。**実験的機能**: 現在GPU専用で、不安定な可能性があります
- **オーバーライド可能**: いいえ（コンパイル時の決定に使用）
- **編集条件**: bExecuteOnGPU == true

### MatchAttribute
- **型**: FName
- **デフォルト値**: NAME_None
- **説明**: ソースデータとターゲットポイントの両方に存在し、同じ値を持つ必要がある属性。**実験的機能**: 現在GPU専用で、不安定な可能性があります
- **オーバーライド可能**: いいえ
- **編集条件**: bExecuteOnGPU == true && bMatchBasedOnAttribute == true

## 入力ピン

### Source
- **型**: Point Data
- **説明**: コピーされるソースポイント
- **ラベル**: "Source"

### Target
- **型**: Point Data
- **説明**: ソースポイントがコピーされる先のターゲットポイント
- **ラベル**: "Target"

### SelectedFlags（オプション）
- **型**: Point Data
- **説明**: コピー対象として選択されたポイントを示すフラグ属性
- **ラベル**: "SelectedFlags"
- **属性名**: "SelectForCopy"

## 出力ピン

### Out
- **型**: Point Data
- **説明**: コピーされた新しいポイントセット

## 使用例

### 例1: オブジェクトの配置パターン
グリッド上にランダムな回転でオブジェクトを配置する場合:
1. Create Points Gridでグリッドポイントを作成（ターゲット）
2. 単一のソースポイントを作成（オブジェクトの原点）
3. Copy Pointsノードで接続:
   - RotationInheritance: Target（グリッドポイントの回転を使用）
   - ScaleInheritance: Source（ソースのスケールを維持）
   - bCopyEachSourceOnEveryTarget: true（各グリッド位置にコピー）

### 例2: パスに沿ったオブジェクトの配置
スプライン上に複数のオブジェクトを配置する場合:
1. Spline Samplerでスプラインポイントを取得（ターゲット）
2. 複数のソースポイントを用意（複数のオブジェクト）
3. Copy Pointsノードで接続:
   - RotationInheritance: Relative（スプラインの方向に合わせて回転）
   - ScaleInheritance: Source（元のスケールを維持）
   - bCopyEachSourceOnEveryTarget: false（N:N配置）

### 例3: 属性ベースのコピー（GPU実験的機能）
特定のIDを持つポイント同士のみをマッチングする場合:
1. ソースとターゲットの両方に "MatchID" 属性を設定
2. Copy Pointsノードで:
   - bExecuteOnGPU: true
   - bMatchBasedOnAttribute: true
   - MatchAttribute: "MatchID"
3. 同じMatchID値を持つペアのみがコピーされます

### 例4: 相対的なトランスフォームの適用
既存のポイントに相対的なオフセットを適用する場合:
1. 元のポイントセット（ターゲット）
2. オフセット情報を持つポイント（ソース）
3. Copy Pointsノードで:
   - RotationInheritance: Relative（相対回転）
   - ScaleInheritance: Relative（相対スケール）
   - ColorInheritance: Relative（色の乗算）

## 実装の詳細

### 処理フロー

1. **入力の検証**: ソースとターゲットの入力を取得し、有効性を確認
2. **継承モードの評価**: 各属性（回転、スケール、色、シード、メタデータ、タグ）の継承モードを評価
3. **ポイントのコピー**:
   - bCopyEachSourceOnEveryTargetがtrueの場合: N×M個のポイントを生成（カルテシアン積）
   - falseの場合: N個のポイントを生成（1対1マッピング）
4. **属性の計算**:
   - 位置の計算（トランスフォームの適用）
   - 回転の計算（継承モードに基づく）
   - スケールの計算（継承モードに基づく）
   - 色の計算（継承モードに基づく）
   - シードの計算（継承モードに基づく）
5. **メタデータとタグの継承**: 指定された継承モードに従ってメタデータとタグを結合
6. **出力の生成**: 新しいポイントデータを出力ピンに送信

### コードスニペット

**継承モードの列挙型定義**:
```cpp
UENUM()
enum class EPCGCopyPointsInheritanceMode : uint8
{
    Relative,  // 相対的に結合
    Source,    // ソースから継承
    Target     // ターゲットから継承
};
```

**属性継承モードの列挙型定義**:
```cpp
UENUM()
enum class EPCGCopyPointsMetadataInheritanceMode : uint8
{
    SourceFirst,  // ソース優先
    TargetFirst,  // ターゲット優先
    SourceOnly,   // ソースのみ
    TargetOnly,   // ターゲットのみ
    None          // なし
};
```

**GPU実行のサポート**:
```cpp
virtual bool DisplayExecuteOnGPUSetting() const override { return true; }
virtual void CreateKernels(FPCGGPUCompilationContext& InOutContext,
                          UObject* InObjectOuter,
                          TArray<UPCGComputeKernel*>& OutKernels,
                          TArray<FPCGKernelEdge>& OutEdges) const override;
```

## パフォーマンス考慮事項

1. **カルテシアン積のコスト**: bCopyEachSourceOnEveryTargetがtrueの場合、N×M個のポイントが生成されるため、大量のポイントが生成される可能性があります。必要に応じてfalseに設定することを検討してください。

2. **GPU実行**: 大量のポイントを処理する場合、GPU実行を有効にすることでパフォーマンスが大幅に向上します。

3. **属性継承のコスト**: SourceFirstやTargetFirstモードは、両方の属性セットをマージする必要があるため、SourceOnlyやTargetOnlyよりも若干コストが高くなります。

4. **メモリ使用量**: 大量のポイントと多くの属性を持つ場合、メモリ使用量が増加します。特にカルテシアン積を使用する場合は注意が必要です。

5. **条件付きコピー（実験的）**: bMatchBasedOnAttributeを使用する場合、属性のマッチング処理が追加されるため、パフォーマンスへの影響があります。現在GPU専用です。

## 関連ノード

- **Point Sampler**: ポイントを別のポイントセットに投影
- **Merge Points**: 複数のポイントセットを結合（コピーではなくマージ）
- **Transform Points**: ポイントのトランスフォームを変更
- **Create Points Grid**: グリッドパターンでポイントを生成
- **Spline Sampler**: スプラインに沿ってポイントを生成
- **Match And Set Attributes**: 属性ベースのマッチングと設定

## 注意事項

- bMatchBasedOnAttribute機能は実験的で、現在GPU専用です。将来変更または削除される可能性があります。
- SeedInheritanceをRelativeに設定すると、新しい位置からシードが再計算されるため、ランダム性が変化します。
- bCopyEachSourceOnEveryTargetをtrueにすると、大量のポイントが生成される可能性があるため、パフォーマンスとメモリに注意してください。
- Base Point Data入力をサポートしています。
