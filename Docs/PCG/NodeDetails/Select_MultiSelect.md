# Select (Multi)

## 概要
Select (Multi)ノードは、静的な選択基準（整数、文字列、または列挙型）に基づいて、任意の数の入力ピンから1つを選択して出力する制御フローノードです。複数の選択肢から動的に1つを選ぶことができます。

## 機能詳細
このノードは選択モード（Integer、String、Enum）に応じて異なる入力ピンを生成し、設定された選択値に対応する入力からデータを選択して出力します。選択値が有効なオプションと一致しない場合は、デフォルト入力が使用されます。

### 主な機能
- **3つの選択モード**: Integer、String、Enumから選択
- **動的な入力ピン**: 選択モードとオプションに基づいてピンを自動生成
- **オーバーライド可能な選択**: 選択値はPCG Overridableで、動的に変更可能
- **デフォルトフォールバック**: 無効な選択値の場合、デフォルト入力を使用
- **型の自動推論**: 出力ピンの型は、すべての入力ピンの型の結合（Union）として決定
- **Base Point Data対応**: ポイントデータの直接処理をサポート

### 処理フロー
1. 選択モードに基づいて入力ピンを生成
2. 選択値（IntegerSelection、StringSelection、EnumSelection）を取得
3. 選択値が有効なオプションに存在するかチェック
4. 存在する場合、対応する入力ピンからデータを収集
5. 存在しない場合、デフォルト入力からデータを収集
6. 収集したデータを出力ピンに送出

## プロパティ

### SelectionMode
- **型**: EPCGControlFlowSelectionMode（列挙型）
- **デフォルト値**: Integer
- **PCG_Overridable**: なし（編集時のみ変更可能）
- **説明**: 選択に使用する値のタイプを決定
- **選択肢**:
  - `Integer`: 整数値に基づく選択
  - `String`: 文字列値に基づく選択
  - `Enum`: 列挙型値に基づく選択

### IntegerSelection
- **型**: int32
- **デフォルト値**: 0
- **PCG_Overridable**: あり
- **表示条件**: `SelectionMode == Integer`
- **説明**: 整数選択モードで、どの入力を選択するかを決定
- **特記**: この値はIntOptionsに存在する必要があります

### IntOptions
- **型**: TArray\<int32\>
- **デフォルト値**: {0}
- **表示条件**: `SelectionMode == Integer`
- **説明**: 利用可能な入力ピンの整数オプションを定義
- **特記**: 各整数値に対応する入力ピンが作成されます

### StringSelection
- **型**: FString
- **デフォルト値**: ""（空文字列）
- **PCG_Overridable**: あり
- **表示条件**: `SelectionMode == String`
- **説明**: 文字列選択モードで、どの入力を選択するかを決定
- **特記**: この値はStringOptionsに存在する必要があります

### StringOptions
- **型**: TArray\<FString\>
- **デフォルト値**: {}（空配列）
- **表示条件**: `SelectionMode == String`
- **説明**: 利用可能な入力ピンの文字列オプションを定義
- **特記**: 各文字列値に対応する入力ピンが作成されます（ピン名として使用）

### EnumSelection
- **型**: FEnumSelector（構造体）
- **PCG_Overridable**: あり（Valueのみ）
- **表示条件**: `SelectionMode == Enum`
- **説明**: 列挙型選択モードで、どの入力を選択するかを決定
- **構成要素**:
  - `Class` (TObjectPtr\<UEnum\>): 使用する列挙型クラス（PCG_NotOverridable）
  - `Value` (int64): 選択された列挙型の値

### CachedPinLabels
- **型**: TArray\<FName\>
- **Transient**: あり
- **説明**: 選択処理で使用するピンラベルのキャッシュ
- **特記**: PostLoad()、PostEditChangeProperty()、OnOverrideSettingsDuplicatedInternal()で自動的に更新されます

## 選択モード詳細

### Integer Mode
- **入力ピン**: IntOptionsの各整数値に対応するピンが作成されます
- **ピンラベル**: 整数値の文字列表現（例: "0", "1", "2"）
- **選択**: IntegerSelectionの値がIntOptionsに存在する場合、その値に対応するピンが選択されます
- **例**: IntOptions = {0, 5, 10} → "0", "5", "10", "Default"の4つの入力ピンが作成されます

### String Mode
- **入力ピン**: StringOptionsの各文字列に対応するピンが作成されます
- **ピンラベル**: 文字列そのもの（例: "Low", "Medium", "High"）
- **選択**: StringSelectionの値がStringOptionsに存在する場合、その文字列に対応するピンが選択されます
- **例**: StringOptions = {"Low", "High"} → "Low", "High", "Default"の3つの入力ピンが作成されます

### Enum Mode
- **入力ピン**: EnumSelection.Classの各列挙値に対応するピンが作成されます
- **ピンラベル**: 列挙値の表示名（`GetDisplayNameTextByIndex()`）
- **選択**: EnumSelection.Valueが列挙型に存在する場合、その値に対応するピンが選択されます
- **特記**: Hidden属性やSpacer属性を持つ列挙値はスキップされます
- **例**: EWeatherType {Sunny, Cloudy, Rainy} → "Sunny", "Cloudy", "Rainy", "Default"のピンが作成されます

## 入力ピンの構成

### 動的ピン（選択モードに依存）
- **型**: EPCGDataType::Any
- **複数接続**: 可能
- **複数データ**: 可能
- **ピン数**: SelectionModeとOptionsに依存

### Default Pin
- **ラベル**: "Default"
- **型**: EPCGDataType::Any
- **複数接続**: 可能
- **複数データ**: 可能
- **説明**: 選択値が無効な場合、または対応するピンが存在しない場合に使用される

## 出力ピン

### Output
- **ラベル**: "Out"（デフォルト出力ラベル）
- **型**: すべての非Advanced入力ピンの型の結合（Union）
- **複数接続**: 可能
- **複数データ**: 可能
- **ツールチップ**: "All input on the selected input pin will be forwarded directly to the output."
- **説明**: 選択された入力からのすべてのデータを含むコレクション

## 使用例

### Integer Mode: LODレベルの選択
```
SelectionMode: Integer
IntOptions: {0, 1, 2}
IntegerSelection: 1

入力ピン:
"0" ← Get Primitive Data (LOD0_Meshes)
"1" ← Get Primitive Data (LOD1_Meshes)
"2" ← Get Primitive Data (LOD2_Meshes)
"Default" ← Get Primitive Data (Default_Meshes)

Output → Static Mesh Spawner

結果: IntegerSelection = 1 なので、LOD1_Meshesが選択される
```

### String Mode: バイオームの選択
```
SelectionMode: String
StringOptions: {"Forest", "Desert", "Ocean"}
StringSelection: "Forest"

入力ピン:
"Forest" ← Get Primitive Data (ForestMeshes)
"Desert" ← Get Primitive Data (DesertMeshes)
"Ocean" ← Get Primitive Data (OceanMeshes)
"Default" ← Get Primitive Data (GenericMeshes)

Output → Static Mesh Spawner

結果: StringSelection = "Forest" なので、ForestMeshesが選択される
```

### Enum Mode: 天候タイプの選択
```
SelectionMode: Enum
EnumSelection.Class: EWeatherType
EnumSelection.Value: 1 (Cloudy)

入力ピン:
"Sunny" ← Get Primitive Data (SunnyMeshes)
"Cloudy" ← Get Primitive Data (CloudyMeshes)
"Rainy" ← Get Primitive Data (RainyMeshes)
"Default" ← Get Primitive Data (DefaultMeshes)

Output → Static Mesh Spawner

結果: EnumSelection.Value = 1 (Cloudy) なので、CloudyMeshesが選択される
```

### オーバーライドを使用した動的選択
```
SelectionMode: Integer
IntOptions: {0, 1, 2, 3}

// Attribute値に基づいてIntegerSelectionをオーバーライド
Attribute Maths Op → IntegerSelectionをオーバーライド

入力ピン:
"0" ← 処理パイプラインA
"1" ← 処理パイプラインB
"2" ← 処理パイプラインC
"3" ← 処理パイプラインD
"Default" ← デフォルト処理

結果: 属性値に応じて動的に処理パイプラインが切り替わる
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGControlFlowSettings`（`UPCGSettings`の派生）
- **Element**: `FPCGMultiSelectElement`（`IPCGElement`を継承）

### 主要メソッド

#### ExecuteInternal
```cpp
bool ExecuteInternal(FPCGContext* Context) const
{
    const UPCGMultiSelectSettings* Settings = Context->GetInputSettings<UPCGMultiSelectSettings>();

    // 1. 選択されたピンラベルを取得
    FName SelectedPinLabel;
    if (!Settings->GetSelectedPinLabel(SelectedPinLabel))
    {
        // エラー: 選択値が有効なオプションではない
        PCGE_LOG_C(Error, GraphAndLog, Context, "Selected value is not a valid option.");
        return true;
    }

    // 2. PCGGather::GatherDataForPin()を使用してデータを収集
    Context->OutputData = PCGGather::GatherDataForPin(Context->InputData, SelectedPinLabel);

    return true;
}
```

#### GetSelectedPinLabel
選択値に基づいて、どのピンを使用するかを決定します：
```cpp
bool GetSelectedPinLabel(FName& OutSelectedPinLabel) const
{
    int32 Index = INDEX_NONE;

    if (SelectionMode == Integer && IsValuePresent(IntegerSelection))
    {
        Index = IntOptions.IndexOfByKey(IntegerSelection);
    }
    else if (SelectionMode == String && IsValuePresent(StringSelection))
    {
        Index = StringOptions.IndexOfByKey(StringSelection);
    }
    else if (SelectionMode == Enum && IsValuePresent(EnumSelection.Value))
    {
        // Hidden列挙値を考慮してラベルで検索
        const FName PinLabel(EnumSelection.GetCultureInvariantDisplayName());
        Index = CachedPinLabels.IndexOfByKey(PinLabel);
    }
    else
    {
        // 無効な選択値の場合、Defaultを使用
        OutSelectedPinLabel = "Default";
        return true;
    }

    if (Index < 0 || Index >= CachedPinLabels.Num())
        return false;

    OutSelectedPinLabel = CachedPinLabels[Index];
    return true;
}
```

#### GetCurrentPinTypes
出力ピンの型は、すべての非Advanced入力ピンの型の結合として計算されます：
```cpp
EPCGDataType GetCurrentPinTypes(const UPCGPin* Pin) const
{
    if (Pin->IsOutputPin())
    {
        EPCGDataType InputTypeUnion = EPCGDataType::None;

        // Advanced pinを除く、すべての入力ピンの型を結合
        for (const UPCGPin* InputPin : Pin->Node->GetInputPins())
        {
            if (!InputPin->Properties.IsAdvancedPin())
            {
                InputTypeUnion |= GetTypeUnionOfIncidentEdges(InputPin->Properties.Label);
            }
        }

        return InputTypeUnion != EPCGDataType::None ? InputTypeUnion : EPCGDataType::Any;
    }

    return Super::GetCurrentPinTypes(Pin);
}
```

#### InputPinProperties
選択モードに基づいて入力ピンを生成します：
```cpp
TArray<FPCGPinProperties> InputPinProperties() const
{
    TArray<FPCGPinProperties> PinProperties;

    switch (SelectionMode)
    {
        case Integer:
            for (const int32 Value : IntOptions)
                PinProperties.Emplace(FName(FString::FromInt(Value)));
            break;

        case String:
            for (const FString& Value : StringOptions)
                PinProperties.Emplace(FName(Value));
            break;

        case Enum:
            for (int32 Index = 0; EnumSelection.Class && Index < EnumSelection.Class->NumEnums() - 1; ++Index)
            {
                // Hidden/Spacer属性の列挙値をスキップ
                if (!bHidden)
                    PinProperties.Emplace(FName(EnumSelection.Class->GetDisplayNameTextByIndex(Index).BuildSourceString()));
            }
            break;
    }

    // 常にDefaultピンを追加
    PinProperties.Emplace("Default");

    return PinProperties;
}
```

#### CachePinLabels
ピンラベルをキャッシュして高速アクセスを可能にします：
```cpp
void CachePinLabels()
{
    CachedPinLabels.Empty();
    Algo::Transform(InputPinProperties(), CachedPinLabels, [](const FPCGPinProperties& Property)
    {
        return Property.Label;
    });
}
```

### ノードタイトルとサブタイトル
- **Base Title**: "Select (Multi)"
- **Flipped Title Lines**: `HasFlippedTitleLines()` が `true` （タイトル行が反転）
- **Additional Information**: 選択モードと現在の選択値を表示
  - Integer: "Integer Selection: 5"
  - String: "String Selection: Forest"
  - Enum: "EWeatherType: Sunny"

### ピン構成
- **Dynamic Pins**: `HasDynamicPins()` が `true`
- **Pin Count**: SelectionModeとOptionsによって可変
- **Default Pin**: 常に最後に追加される
- **All pins support**:
  - 複数接続（`bInAllowMultipleConnections = true`）
  - 複数データ（`bAllowMultipleData = true`）
  - 任意のデータ型（`EPCGDataType::Any`）

## パフォーマンス考慮事項

### 利点
1. **条件付きデータ取得**: 選択されたピンのデータのみが処理されます
2. **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true` で効率的な処理
3. **キャッシュされたピンラベル**: CachedPinLabelsで高速な選択処理
4. **型の最適化**: 出力型は入力型の結合として自動的に決定

### 注意事項
1. **ピン再構築**: SelectionModeやOptionsを変更すると、ピンが再構築されます
2. **オーバーライドのコスト**: 選択値がオーバーライドされている場合、その計算コストが追加されます
3. **列挙型のコスト**: Enum modeの場合、列挙型のメタデータアクセスによる若干のオーバーヘッドがあります
4. **無効な選択値**: 無効な選択値の場合、エラーログが出力されます

## 注意事項

1. **選択値の検証**: 選択値は必ずOptionsに存在する必要があります。存在しない場合、Defaultピンが使用されるか、エラーが発生します
2. **ピンラベルのキャッシュ**: CachedPinLabelsは自動的に更新されますが、手動での変更は推奨されません
3. **列挙型の変更**: Enum modeで列挙型クラスを変更すると、既存の接続が失われる可能性があります
4. **ピン名の一意性**: Integer modeでIntOptionsに重複した値がある場合、動作は未定義です
5. **Default接続の推奨**: Defaultピンには必ずフォールバック用のデータを接続することを推奨します
6. **オーバーライド可能なプロパティ**: SelectionMode以外の選択値（IntegerSelection、StringSelection、EnumSelection.Value）はオーバーライド可能です
7. **PostLoad処理**: 5.5での変更により、Enum modeのピンラベルが正しく復元されるようになりました

## SelectモードとBranchモード（概念的な違い）

PCGNodeWorking.mdには「Select (Multi) - Branch」、「Select (Multi) - Multi Select」、「Select (Multi) - Switch」と記載されていますが、実装上はすべて同じ`UPCGMultiSelectSettings`クラスです。これらの名前の違いは概念的な用途の違いを示しています：

| 概念名 | 用途 | 実装 |
|--------|------|------|
| Multi Select | 複数の入力から1つを選択 | UPCGMultiSelectSettings |
| Branch | 条件に基づいて処理を分岐（ただし入力選択として機能） | 同上 |
| Switch | Switch文のような選択（Integer/Enum mode） | 同上 |

実際には、これらはすべて同じノードで、SelectionModeによって動作が変わります。

## 関連ノード
- **Boolean Select**: ブール値に基づく2つの入力からの選択
- **Runtime Quality Select**: 品質レベルに基づく入力選択
- **Runtime Quality Branch**: 品質レベルに基づく出力分岐
- **Branch（条件分岐）**: ブール値に基づく出力分岐
- **Gather**: 複数の入力を単一の出力に集約

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGMultiSelect.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/ControlFlow/PCGMultiSelect.cpp`
