# Create Constant ノード

## 概要
Create Constantノード（別名: Create Attribute）は、定数値を持つ新しいアトリビュートセット（Attribute Set）を作成するノードです。入力ピンを必要とせず、指定した型と値を持つアトリビュートセットを直接生成します。

**実装クラス**: `UPCGCreateAttributeSetSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGCreateAttribute.cpp`

## 機能詳細

### 主な機能
1. **定数アトリビュートセットの生成**: 指定した型と値を持つアトリビュートセットを新規作成
2. **豊富な型サポート**: PCGメタデータで利用可能なすべての型をサポート
3. **事前設定テンプレート**: 各データ型に応じた事前設定テンプレートから素早く作成可能
4. **グラフパラメータへの変換**: Create Constantノードをグラフパラメータノードに変換可能

### ピン構成
- **入力ピン**: なし
- **出力ピン**:
  - `Out` (Param型): 生成されたアトリビュートセット

## プロパティ

### AttributeTypes
**型**: `FPCGMetadataTypesConstantStruct`
**デフォルト値**: なし
**説明**: 作成するアトリビュートの型と値を定義します。以下の型をサポートしています:

- **Float**: 単精度浮動小数点数
- **Double**: 倍精度浮動小数点数
- **Int32**: 32ビット整数
- **Int64**: 64ビット整数
- **Vector2**: 2次元ベクトル
- **Vector**: 3次元ベクトル
- **Vector4**: 4次元ベクトル
- **Quaternion**: クォータニオン（回転表現）
- **Transform**: トランスフォーム（位置・回転・スケール）
- **String**: 文字列
- **Boolean**: 真偽値
- **Rotator**: ロテーター（回転角度）
- **Name**: 名前

**メタ設定**:
- `ShowOnlyInnerProperties`

### OutputTarget
**型**: `FPCGAttributePropertyOutputNoSourceSelector`
**デフォルト値**: なし
**説明**: 出力するアトリビュート名とメタデータドメインを指定します。

**メタ設定**:
- `PCG_DiscardPropertySelection`
- `PCG_DiscardExtraSelection`
- `PCG_Overridable`

## 実装の詳細

### ExecuteInternalメソッド（FPCGCreateAttributeElement）
このメソッドは、新しいアトリビュートセットを作成し、指定された定数値でアトリビュートを初期化します。

```cpp
bool FPCGCreateAttributeElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGCreateAttributeSetSettings* Settings = Context->GetInputSettings<UPCGCreateAttributeSetSettings>();

    FName OutputAttributeName = Settings->OutputTarget.GetName();

    // デフォルトのParamDataからメタデータドメインIDを取得
    const UPCGParamData* DefaultParam = GetDefault<UPCGParamData>();
    const FPCGMetadataDomainID OutputMetadataDomainID =
        DefaultParam->GetMetadataDomainIDFromSelector(Settings->OutputTarget);

    // ドメインがサポートされているか確認
    if (!DefaultParam->IsSupportedMetadataDomainID(OutputMetadataDomainID))
    {
        PCGLog::Metadata::LogInvalidMetadataDomain(Settings->OutputTarget, Context);
        return true;
    }

    // 新しいParamDataを作成
    UPCGParamData* OutputData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
    FPCGMetadataDomain* OutputMetadata =
        OutputData->MutableMetadata()->GetMetadataDomainFromSelector(Settings->OutputTarget);

    if (!OutputMetadata)
    {
        PCGLog::Metadata::LogInvalidMetadataDomain(Settings->OutputTarget, Context);
        return true;
    }

    // エントリを追加
    OutputMetadata->AddEntry();

    // 定数アトリビュートを作成
    if (!PCGCreateAttribute::ClearOrCreateAttribute(Settings->AttributeTypes, OutputMetadata, OutputAttributeName))
    {
        PCGE_LOG(Error, GraphAndLog,
            FText::Format(PCGCreateAttributeConstants::ErrorCreatingAttributeMessage,
            FText::FromName(OutputAttributeName)));
        return true;
    }

    // 出力データに追加
    FPCGTaggedData& NewData = Context->OutputData.TaggedData.Emplace_GetRef();
    NewData.Data = OutputData;

    return true;
}
```

### 事前設定情報の提供
ノードは各データ型に対応する事前設定テンプレートを提供します。これにより、ユーザーは素早く目的の型のConstantノードを作成できます。

```cpp
TArray<FPCGPreConfiguredSettingsInfo> UPCGCreateAttributeSetSettings::GetPreconfiguredInfo() const
{
    return FPCGPreConfiguredSettingsInfo::PopulateFromEnum<EPCGMetadataTypes>(
        /*InValuesToSkip=*/{EPCGMetadataTypes::Count, EPCGMetadataTypes::Unknown},
        /*InOptionalFormat=*/FTextFormat(LOCTEXT("PreconfigureFormat", "New {0} Constant")));
}
```

これにより、以下のような事前設定が生成されます:
- New Float Constant
- New Double Constant
- New Int32 Constant
- New Vector Constant
- など

### 事前設定の適用
```cpp
void UPCGCreateAttributeSetSettings::ApplyPreconfiguredSettings(const FPCGPreConfiguredSettingsInfo& PreconfigureInfo)
{
    if (PreconfigureInfo.PreconfiguredIndex < 0 ||
        PreconfigureInfo.PreconfiguredIndex >= static_cast<uint8>(EPCGMetadataTypes::Count))
    {
        return;
    }

    AttributeTypes.Type = static_cast<EPCGMetadataTypes>(PreconfigureInfo.PreconfiguredIndex);
}
```

### グラフパラメータへの変換
Create Constantノードは、グラフパラメータ（Get Graph Parameter）ノードに変換できます。これにより、定数値をグラフパラメータとして管理できるようになります。

```cpp
bool UPCGCreateAttributeSetSettings::ConvertNode(const FPCGPreconfiguredInfo& ConversionInfo)
{
    UPCGNode* Node = CastChecked<UPCGNode>(GetOuter());

    switch (ConversionInfo.PreconfiguredIndex)
    {
        case PCGCreateAttributeConstants::Conversion::ToGetGraphParameterIndex:
        {
            FPCGSingleNodeConverter NodeConverter(Node, UPCGUserParameterGetSettings::StaticClass());

            NodeConverter.PrepareData();

            // グラフパラメータを作成
            if (UPCGGraph* Graph = NodeConverter.GetGraph())
            {
                FName PropertyName = OutputTarget.GetName();

                // ユニークな名前を生成
                PCGGraphParameter::Helpers::GenerateUniqueName(Graph, PropertyName);

                // プロパティディスクリプタを作成
                FPropertyBagPropertyDesc PropertyDesc =
                    PCGPropertyHelpers::CreatePropertyBagDescWithMetadataType(PropertyName, AttributeTypes.Type);

                Graph->AddUserParameters({PropertyDesc});

                // 生成されたノードの設定を更新
                UPCGUserParameterGetSettings* Settings =
                    CastChecked<UPCGUserParameterGetSettings>(NodeConverter.GetGeneratedSettings());
                Settings->PropertyName = PropertyName;

                // グラフパラメータに値を設定
                AttributeTypes.Dispatcher([PropertyName, Graph]<typename T>(T&& Value) {
                    Graph->SetGraphParameter(PropertyName, std::forward<T>(Value));
                });
            }

            NodeConverter.ApplyStructural();
            NodeConverter.Finalize();

            return NodeConverter.IsComplete();
        }
    }

    return false;
}
```

### ノードタイトル情報
ノードのタイトルには、作成するアトリビュートの名前と値が動的に表示されます。

```cpp
FString UPCGCreateAttributeSetSettings::GetAdditionalTitleInformation() const
{
    if (HasAnyFlags(RF_ClassDefaultObject))
    {
        return PCGCreateAttributeConstants::NodeNameAddAttribute.ToString();
    }

    return FString::Printf(TEXT("%s: %s"), *OutputTarget.ToString(), *AttributeTypes.ToString());
}
```

例: `MyAttribute: 42` または `Position: X=1.0, Y=2.0, Z=3.0`

### ツールチップテキスト
```cpp
FText UPCGCreateAttributeSetSettings::GetNodeTooltipText() const
{
    return FText::Format(
        PCGCreateAttributeConstants::NodeTooltipFormatCreateConstant,
        FText::FromString(AttributeTypes.TypeToString()),
        FText::FromString(AttributeTypes.ToString())
    );
}
```

例: `Outputs an attribute set containing a constant 'Float' value: 3.14159`

## 使用例

### 例1: スケール値の定数作成
すべてのポイントに適用するスケール値を定数として作成する場合:

1. Create Constantノードを配置（または「New Float Constant」テンプレートを選択）
2. `AttributeTypes`でFloat型を選択し、値を2.0に設定
3. `OutputTarget`を「Scale」に設定
4. 出力されたアトリビュートセットには、`Scale = 2.0`というエントリが1つ含まれる

### 例2: カラー値の定数作成
マテリアル設定用のカラー値を作成する場合:

1. 「New Vector Constant」テンプレートを選択
2. Vector値を設定（例: R=1.0, G=0.0, B=0.0 で赤色）
3. `OutputTarget`を「BaseColor」に設定
4. Static Mesh Spawnerなどのノードに接続してマテリアルパラメータとして使用

### 例3: グラフパラメータへの変換
定数値をグラフパラメータとして管理する場合:

1. Create Constantノードを作成し、値を設定
2. ノードを右クリックして「Convert to Get Graph Parameter」を選択
3. 自動的にグラフパラメータが作成され、Get Graph Parameterノードに置き換えられる
4. グラフの詳細パネルからパラメータ値を調整可能

## パフォーマンス考慮事項

### メモリ
- 非常に軽量: 1つのエントリのみを持つアトリビュートセットを作成
- メモリフットプリントは最小限

### 処理速度
- 非常に高速: 単純なアトリビュート作成とエントリ追加のみ
- ループ外に配置しても、ループ内に配置しても処理コストは同等

### 最適化のヒント
- 同じ定数値を複数箇所で使用する場合は、1つのCreate Constantノードから分岐させる
- グラフパラメータに変換することで、実行時に値を変更可能な柔軟性を得られる
- 複数の定数値が必要な場合、個別のCreate Constantノードを使用するのではなく、Data Table等の使用を検討

## 関連ノード

- **Add Attribute**: 既存データに定数アトリビュートを追加
- **Get Graph Parameter**: グラフパラメータから値を取得（Create Constantから変換可能）
- **Load PCG Data Asset**: 事前定義されたアトリビュートセットをロード
- **Data Table Row To Attribute Set**: データテーブルの行をアトリビュートセットに変換

## 注意事項

1. **入力ピン不要**: このノードは入力を必要としません。データフローの起点として使用できます。

2. **エントリ数**: 常に1つのエントリのみを持つアトリビュートセットを作成します。

3. **型の選択**: 一度型を選択すると、その型に応じたプロパティエディタが表示されます。型を変更する場合は、事前設定テンプレートから新しいノードを作成するのが最も簡単です。

4. **変換の制限**: グラフパラメータへの変換は、ノードが有効なグラフ内に存在する場合のみ可能です。

5. **タイトルエイリアス**: ノード選択時、「Create Constant」と「Create Attribute」の両方の名前で検索可能です。

6. **メタデータドメイン**: アトリビュートセットのメタデータドメインは、`OutputTarget`セレクタで指定できます。デフォルトはElements ドメインです。
