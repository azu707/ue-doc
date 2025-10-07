# Select (Boolean Select)

## 概要
Boolean Selectノードは、ブール値の条件（`bUseInputB`）に基づいて、2つの入力ピンのいずれかを選択して出力する制御フローノードです。シンプルな二者択一の選択を行います。

## 機能詳細
このノードは2つの入力ピン（Input AとInput B）を持ち、`bUseInputB`プロパティの値に応じて、どちらか一方の入力データを出力ピンに転送します。プロパティはオーバーライド可能で、動的な選択が可能です。

### 主な機能
- **2つの入力からの選択**: Input AまたはInput Bのいずれかを選択
- **オーバーライド可能な選択**: `bUseInputB`はPCG Overridableで、動的に変更可能
- **型の自動推論**: 出力ピンの型は、両方の入力ピンの型の結合（Union）として決定
- **シンプルなロジック**: 高速で低オーバーヘッドの選択処理
- **Base Point Data対応**: ポイントデータの直接処理をサポート

### 処理フロー
1. `bUseInputB`の値を取得（オーバーライドされている場合はその値を使用）
2. `bUseInputB`がfalseの場合、Input Aからデータを収集
3. `bUseInputB`がtrueの場合、Input Bからデータを収集
4. 収集したデータを出力ピンに送出

## プロパティ

### bUseInputB
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: trueの場合、Input Bが選択されます。falseの場合、Input Aが選択されます
- **特記**: このプロパティは他のノードからオーバーライドできるため、動的な選択が可能です

## 入力ピン

### Input A
- **ラベル**: "Input A"
- **型**: EPCGDataType::Any
- **複数接続**: 可能
- **複数データ**: 可能
- **ツールチップ**: "Will only be used if 'Use Input B' (overridable) is false"
- **説明**: `bUseInputB`がfalseの場合に使用される入力

### Input B
- **ラベル**: "Input B"
- **型**: EPCGDataType::Any
- **複数接続**: 可能
- **複数データ**: 可能
- **ツールチップ**: "Will only be used if 'Use Input B' (overridable) is true"
- **説明**: `bUseInputB`がtrueの場合に使用される入力

## 出力ピン

### Output
- **ラベル**: "Out"（デフォルト出力ラベル）
- **型**: 両方の入力ピンの型の結合（Union）
- **複数接続**: 可能
- **複数データ**: 可能
- **ツールチップ**: "All input will gathered into a single data collection"
- **説明**: 選択された入力からのすべてのデータを含むコレクション

## 使用例

### 条件に基づくメッシュの切り替え
```
// ブール属性に基づいて異なるメッシュセットを選択
Input A ← Get Primitive Data (OutdoorMeshes)
Input B ← Get Primitive Data (IndoorMeshes)

bUseInputB: false（デフォルト）
または
bUseInputB ← Attribute比較ノードからオーバーライド（例: IsIndoor属性）

Output → Static Mesh Spawner

結果: bUseInputBの値に応じて、OutdoorMeshesまたはIndoorMeshesが使用される
```

### 距離に基づくポイントセットの選択
```
// 距離に基づいて異なるポイント密度を選択
Input A ← Create Points Grid (Spacing: 100) // 密
Input B ← Create Points Grid (Spacing: 200) // 疎

bUseInputB ← 距離チェックの結果をオーバーライドで設定

Output → Static Mesh Spawner

結果: 距離が遠い場合は疎なグリッド、近い場合は密なグリッドが使用される
```

### フィルタリング結果に基づく選択
```
// フィルタリングの結果に基づいて処理を分岐
Input A ← フィルタリング前のデータ
Input B ← フィルタリング後のデータ

bUseInputB: パラメータで制御

Output → 次の処理ノード

結果: bUseInputBによって、フィルタリングの有無を切り替え可能
```

### 動的な条件選択
```
// 属性値に基づく動的な選択
ポイントデータ → Attribute Maths Op → 条件判定（例: Height > 100）
→ bUseInputBをオーバーライド

Input A ← 低地用のデータ
Input B ← 高地用のデータ

Output → Static Mesh Spawner

結果: 高さに応じて動的にデータソースが切り替わる
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGControlFlowSettings`（`UPCGSettings`の派生）
- **Element**: `FPCGBooleanSelectElement`（`IPCGElement`を継承）

### 主要メソッド

#### ExecuteInternal
```cpp
bool ExecuteInternal(FPCGContext* Context) const
{
    const UPCGBooleanSelectSettings* Settings = Context->GetInputSettings<UPCGBooleanSelectSettings>();

    // 1. 選択されたピンラベルを決定
    const FName SelectedPinLabel = Settings->bUseInputB
        ? PCGBooleanSelectConstants::InputLabelB
        : PCGBooleanSelectConstants::InputLabelA;

    // 2. PCGGather::GatherDataForPin()を使用してデータを収集
    // 選択されたピンからすべてのデータを取得し、出力に転送
    Context->OutputData = PCGGather::GatherDataForPin(Context->InputData, SelectedPinLabel);

    return true;
}
```

#### GetCurrentPinTypes
出力ピンの型は、両方の入力ピンの型の結合として計算されます：
```cpp
EPCGDataType GetCurrentPinTypes(const UPCGPin* Pin) const
{
    if (Pin->IsOutputPin())
    {
        // 両方の入力ピンの型のUnionを計算
        const EPCGDataType InputTypeUnion =
            GetTypeUnionOfIncidentEdges("Input A") |
            GetTypeUnionOfIncidentEdges("Input B");

        return InputTypeUnion != EPCGDataType::None
            ? InputTypeUnion
            : EPCGDataType::Any;
    }

    return Super::GetCurrentPinTypes(Pin);
}
```

### ピン構成
- **Dynamic Pins**: `HasDynamicPins()` が `true`
- **Both Inputs Always Present**: 両方の入力ピンは常に存在
- **All pins support**:
  - 複数接続（`bInAllowMultipleConnections = true`）
  - 複数データ（`bAllowMultipleData = true`）
  - 任意のデータ型（`EPCGDataType::Any`）

### ノードタイトル
- **Base Title**: "Select"
- **TODO**: 将来的には、選択された入力を表示する予定（例: "Select (Input A)"）

## パフォーマンス考慮事項

### 利点
1. **条件付きデータ取得**: 選択されたピンのデータのみが処理されます
2. **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true` で効率的な処理
3. **最小限のオーバーヘッド**: 単純なif-else選択で、計算コストがほぼゼロ
4. **型の最適化**: 出力型は入力型の結合として自動的に決定

### 注意事項
1. **両方の入力を接続する必要はない**: 選択されない入力は接続しなくても問題ありません
2. **オーバーライドのコスト**: `bUseInputB`がオーバーライドされている場合、その計算コストが追加されます
3. **データ収集**: 選択された入力に複数のデータがある場合、すべてが収集されます

## Select (Multi) - Boolean SelectとMulti Selectの違い

| 特徴 | Boolean Select | Multi Select |
|-----|----------------|--------------|
| 入力数 | 2つ（Input A, Input B） | 可変（選択モードに依存） |
| 選択基準 | ブール値（bUseInputB） | 整数/文字列/列挙型 |
| 選択肢の数 | 2つ | 任意の数 |
| 用途 | シンプルな二者択一 | 多数の選択肢から1つを選択 |
| ノード名 | "Select" | "Select (Multi)" |

## 注意事項

1. **ノードタイトル**: 現在のノードタイトルは単に"Select"で、選択された入力は表示されません（将来的には表示される予定）
2. **型の結合**: 異なる型のデータを異なる入力ピンに接続できますが、出力型はそれらの結合となります
3. **オーバーライド**: `bUseInputB`はPCG Overridableなので、他のノードから動的に制御できます
4. **デフォルト選択**: デフォルトでは常にInput A（`bUseInputB = false`）が選択されます
5. **接続の推奨**: 少なくとも選択される可能性のある入力は接続することを推奨します
6. **複数データのサポート**: 選択された入力ピンに複数のデータがある場合、すべてのデータが出力に転送されます

## 関連ノード
- **Select (Multi) - Multi Select**: 整数/文字列/列挙型に基づく多者択一選択
- **Runtime Quality Select**: 品質レベルに基づく入力選択
- **Select (Multi) - Branch**: 整数/文字列/列挙型に基づく分岐（Branch形式）
- **Branch（条件分岐）**: ブール値に基づく出力分岐
- **Gather**: 複数の入力を単一の出力に集約

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGBooleanSelect.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/ControlFlow/PCGBooleanSelect.cpp`
