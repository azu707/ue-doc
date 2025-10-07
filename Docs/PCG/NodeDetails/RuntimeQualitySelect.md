# Runtime Quality Select

## 概要
Runtime Quality Selectノードは、`pcg.Quality`コンソール変数の設定に基づいて、複数の入力ピンから1つを選択して出力する制御フローノードです。ランタイム時の品質レベルに応じて、異なる入力データを選択できます。

## 機能詳細
このノードはランタイム品質レベル（Low、Medium、High、Epic、Cinematic）に対応する入力ピンを持ち、現在の品質設定に基づいて適切な入力を選択して出力します。指定された品質レベルのピンが存在しない場合は、デフォルト入力が使用されます。

### 主な機能
- **品質レベルに基づく入力選択**: `pcg.Quality`設定（0-4）に応じて入力を選択
- **動的ピン**: 有効化された品質レベルのピンのみを表示
- **デフォルトフォールバック**: 無効な品質レベルまたは無効化されたピンはデフォルト入力を使用
- **型の自動推論**: 出力ピンの型は、すべての入力ピンの型の結合（Union）として決定
- **CRC依存**: 品質レベルが変更されると完全に再実行
- **Base Point Data対応**: ポイントデータの直接処理をサポート

### 処理フロー
1. 現在の`pcg.Quality`レベルを取得（`UPCGSubsystem::GetPCGQualityLevel()`）
2. 品質レベル（0-4）を対応する入力ピン（Low-Cinematic）にマッピング
3. そのピンが有効化されているかチェック
4. 有効化されている場合、そのピンからデータを収集
5. 無効化されている場合、デフォルトピンからデータを収集
6. 収集したデータを単一の出力ピンに送出

## プロパティ

### bUseLowPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Low品質入力ピン（品質レベル0）を有効化するかどうか
- **特記**: trueの場合、"Low"という名前の入力ピンが追加されます

### bUseMediumPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Medium品質入力ピン（品質レベル1）を有効化するかどうか
- **特記**: trueの場合、"Medium"という名前の入力ピンが追加されます

### bUseHighPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: High品質入力ピン（品質レベル2）を有効化するかどうか
- **特記**: trueの場合、"High"という名前の入力ピンが追加されます

### bUseEpicPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Epic品質入力ピン（品質レベル3）を有効化するかどうか
- **特記**: trueの場合、"Epic"という名前の入力ピンが追加されます

### bUseCinematicPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Cinematic品質入力ピン（品質レベル4）を有効化するかどうか
- **特記**: trueの場合、"Cinematic"という名前の入力ピンが追加されます

## 品質レベルのマッピング

| 品質レベル | 値 | ピンラベル | プロパティ |
|-----------|---|-----------|-----------|
| Low       | 0 | "Low"     | bUseLowPin |
| Medium    | 1 | "Medium"  | bUseMediumPin |
| High      | 2 | "High"    | bUseHighPin |
| Epic      | 3 | "Epic"    | bUseEpicPin |
| Cinematic | 4 | "Cinematic" | bUseCinematicPin |
| Default   | - | "Default" | 常に存在 |

## 使用例

### 品質に応じた異なるメッシュソース
```
// 品質レベルに応じて異なるメッシュセットを選択
設定:
bUseLowPin = true
bUseMediumPin = true
bUseHighPin = true

Low入力 ← Get Primitive Data (SimpleMeshes)
Medium入力 ← Get Primitive Data (MediumMeshes)
High入力 ← Get Primitive Data (DetailedMeshes)
Default入力 ← Get Primitive Data (BasicMeshes)

Output → Static Mesh Spawner

結果:
- pcg.Quality = 0 → SimpleMeshesが使用される
- pcg.Quality = 1 → MediumMeshesが使用される
- pcg.Quality = 2 → DetailedMeshesが使用される
- pcg.Quality = 3, 4 → BasicMeshesが使用される（Default）
```

### 品質に応じた異なるポイント密度
```
// 品質レベルに応じて異なる密度のグリッドを選択
設定:
bUseLowPin = true
bUseHighPin = true

Low入力 ← Create Points Grid (Spacing: 200)
Default入力 ← Create Points Grid (Spacing: 100)
High入力 ← Create Points Grid (Spacing: 50)

Output → Static Mesh Spawner

結果: 品質が高いほど密度の高いグリッドが使用される
```

### 品質に応じた処理パイプライン切り替え
```
// 品質レベルに応じて完全に異なる処理パイプラインを選択
設定:
bUseLowPin = true
bUseHighPin = true

Low入力 ← シンプルな処理パイプライン（Noise → Threshold）
Default入力 ← 標準処理パイプライン（Noise → Blur → Threshold）
High入力 ← 複雑な処理パイプライン（Multi-Noise → Blur → Spatial Noise → Threshold）

結果: 品質に応じて適切な複雑度のパイプラインが選択される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGControlFlowSettings`（`UPCGSettings`の派生）
- **Element**: `FPCGQualitySelectElement`（`IPCGElement`を継承）

### 主要メソッド

#### ExecuteInternal
```cpp
bool ExecuteInternal(FPCGContext* Context) const
{
    // 1. 現在の品質レベルを取得
    const int32 QualityLevel = UPCGSubsystem::GetPCGQualityLevel();

    // 2. 有効なピンを収集し、アクティブなピンを決定
    // 各品質レベル（0-4）について、対応するピンが有効かチェック

    // 3. PCGGather::GatherDataForPin()を使用してデータを収集
    // アクティブなピンからデータを取得し、出力ピンに転送

    return true;
}
```

#### GetCurrentPinTypes
出力ピンの型は、すべての入力ピンの型の結合として計算されます：
```cpp
EPCGDataType GetCurrentPinTypes(const UPCGPin* InPin) const
{
    // すべての入力ピンの型のUnionを取得
    EPCGDataType InputType = EPCGDataType::None;
    for (const FPCGPinProperties& PinProperties : InputPinProperties())
    {
        InputType |= GetTypeUnionOfIncidentEdges(PinProperties.Label);
    }
    return (InputType != EPCGDataType::None) ? InputType : EPCGDataType::Any;
}
```

#### GetDependenciesCrc
品質レベルの変更を検出するため、CRCに品質レベルを含めます：
```cpp
void GetDependenciesCrc(..., FPCGCrc& OutCrc) const
{
    Crc.Combine(UPCGSubsystem::GetPCGQualityLevel());
}
```

### 入力ピンの構成
- **Dynamic Pins**: `HasDynamicPins()` が `true`
- **Default Pin**: 常に存在し、他の品質ピンが無効またはマッチしない場合に使用される
- **Quality Pins**: 対応するbUse*Pinがtrueの場合のみ作成
- **All pins support**:
  - 複数接続（`bInAllowMultipleConnections = true`）
  - 複数データ（`bAllowMultipleData = true`）
  - 任意のデータ型（`EPCGDataType::Any`）

### 出力ピンの構成
- **Single Output Pin**: デフォルト出力ピン1つのみ
- **Type**: すべての入力ピンの型の結合

### ピンのツールチップ
- **Default**: "This default pin will be used for any quality levels that do not have enabled pins."
- **Low**: "Consumed if 'pcg.Quality' setting is set to 0."
- **Medium**: "Consumed if 'pcg.Quality' setting is set to 1."
- **High**: "Consumed if 'pcg.Quality' setting is set to 2."
- **Epic**: "Consumed if 'pcg.Quality' setting is set to 3."
- **Cinematic**: "Consumed if 'pcg.Quality' setting is set to 4."

## Runtime Quality BranchとRuntime Quality Selectの違い

| 特徴 | Runtime Quality Branch | Runtime Quality Select |
|-----|----------------------|----------------------|
| 入力ピン | 1つ（デフォルト） | 複数（品質レベルごと + Default） |
| 出力ピン | 複数（品質レベルごと + Default） | 1つ（デフォルト） |
| データフロー | 1つの入力を複数の出力に分岐 | 複数の入力から1つを選択 |
| 用途 | 品質に応じて後続処理を切り替え | 品質に応じて異なるデータソースを選択 |
| ピン無効化 | 未使用の出力ピンを無効化 | 入力ピンは常にアクティブ |

## パフォーマンス考慮事項

### 利点
1. **条件付きデータ取得**: 選択されたピンのデータのみが処理されます
2. **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true` で効率的な処理
3. **シンプルなロジック**: 直接的な選択ロジックで低オーバーヘッド
4. **型の最適化**: 出力型は入力型の結合として自動的に決定

### 注意事項
1. **品質レベル変更時の再生成**: 品質レベルが変更されるとCRCが変わり、完全な再生成が発生します
2. **ランタイム専用**: ランタイム生成でのみ有効。エディタでの生成では警告が表示されます
3. **動的ピン**: ピン構成を変更すると、ノードの再構築が必要になる場合があります
4. **すべての入力を接続する必要はない**: 使用される入力は現在の品質レベルに依存します

## 注意事項

1. **ランタイム生成が必要**: このノードはランタイム生成（`GenerationTrigger = Generate At Runtime`）でのみ意味を持ちます。それ以外で使用すると警告が表示されます
2. **品質レベルの範囲**: `pcg.Quality`は0-4の範囲内である必要があります。範囲外の値はDefaultピンを使用します
3. **ノードタイトル**: ノードタイトルには現在の品質レベルに対応するピンラベルが表示されます
4. **CRC依存**: 品質レベルが変更されると、ノードのCRCが変わり、再実行がトリガーされます
5. **Default入力の重要性**: Default入力は必ず接続することを推奨します。未使用の品質レベルのフォールバックとして機能します
6. **型の結合**: 異なる型のデータを異なる入力ピンに接続できますが、出力型はそれらの結合となります

## 関連ノード
- **Runtime Quality Branch**: 1つの入力を品質レベルに基づいて複数の出力に分岐
- **Select (Multi) - Multi Select**: 整数/文字列/列挙型に基づく入力選択
- **Boolean Select**: ブール値に基づく入力選択（2つの入力から選択）
- **Gather**: 複数の入力を単一の出力に集約
- **Branch（条件分岐）**: ブール値に基づく分岐

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGQualitySelect.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/ControlFlow/PCGQualitySelect.cpp`
