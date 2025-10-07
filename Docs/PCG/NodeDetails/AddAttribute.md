# Add Attribute

## 概要

**Add Attribute**ノードは、既存の空間データ（Spatial Data）またはアトリビュートセット（Attribute Set）に新しいアトリビュートを追加するノードです。追加するアトリビュートは、定数値として直接設定するか、別のアトリビュートセットからコピーすることができます。

**クラス**: `UPCGAddAttributeSettings`
**カテゴリ**: Param（パラメータ）
**ファイル**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCreateAttribute.h`

## 機能詳細

このノードには2つの主要な動作モードがあります：

### 1. 定数からアトリビュート追加
Attributesピンが未接続の場合、指定した定数値を持つ新しいアトリビュートを入力データに追加します。

### 2. アトリビュートセットからコピー
Attributesピンに別のアトリビュートセット（ParamData）を接続すると、そこから指定したアトリビュートをコピーします。さらに、`bCopyAllAttributes`オプションを有効にすることで、すべてのアトリビュートを一括コピーすることもできます。

## 入力ピン

| ピン名 | 型 | 説明 |
|--------|-----|------|
| In | Any（必須） | アトリビュートを追加する対象データ（空間データまたはアトリビュートセット） |
| Attributes | Param（複数接続可） | コピー元となるアトリビュートセット（オプション） |

## 出力ピン

| ピン名 | 型 | 説明 |
|--------|-----|------|
| Out | Any | 新しいアトリビュートが追加されたデータ |

## プロパティ

### InputSource
- **型**: `FPCGAttributePropertyInputSelector`
- **説明**: Attributesピン接続時に使用する、コピー元のアトリビュート選択
- **条件**: Attributesピンが接続されている場合のみ表示・編集可能
- **オーバーライド可能**: はい

### OutputTarget
- **型**: `FPCGAttributePropertyOutputSelector`
- **説明**: 追加先のアトリビュート名とドメインの指定
- **デフォルト**: `NAME_None`（コンストラクタで設定）
- **オーバーライド可能**: はい

### AttributeTypes
- **型**: `FPCGMetadataTypesConstantStruct`
- **説明**: 定数モード（Attributesピン未接続）の場合に設定する値と型
- **条件**: Attributesピンが未接続の場合のみ編集可能
- **対応型**: Float, Double, Int32, Int64, Vector2, Vector, Vector4, Quaternion, Transform, String, Boolean, Rotator, Name

### bCopyAllAttributes
- **型**: `bool`
- **デフォルト**: `false`
- **説明**: 有効にすると、Attributesピンから接続されたすべてのアトリビュートをコピー
- **オーバーライド可能**: はい

### bCopyAllDomains
- **型**: `bool`
- **デフォルト**: `false`
- **説明**: `bCopyAllAttributes`が有効な場合、ソースデータがサポートする全ドメインのアトリビュートをコピー
- **条件**: `bCopyAllAttributes`が`true`の場合のみ表示
- **オーバーライド可能**: はい

### MetadataDomainsMapping
- **型**: `TMap<FName, FName>`
- **説明**: アトリビュートコピー時のドメインマッピング（空の場合はDefault→Defaultとなる）
- **条件**: `bCopyAllAttributes`が`true`かつ`bCopyAllDomains`が`false`の場合のみ表示
- **用途**: 異なるメタデータドメイン間でのアトリビュートコピー制御

## 使用例

### 例1: 定数値の追加
ポイントデータにスケール値を定数として追加する場合：
1. Attributesピンを未接続のままにする
2. `OutputTarget`に「Scale」と入力
3. `AttributeTypes`で型をFloatに設定し、値を1.5に設定
4. 入力ポイントデータには、すべてのポイントで`Scale = 1.5`というアトリビュートが追加される

### 例2: 他のアトリビュートセットからコピー
既存のアトリビュートセットから特定のアトリビュートをコピーする場合：
1. Attributesピンにアトリビュートセットを接続
2. `InputSource`でコピー元のアトリビュート名を指定（例: "Color"）
3. `OutputTarget`で出力先のアトリビュート名を指定（例: "PointColor"）
4. 入力データに、コピー元の"Color"アトリビュートが"PointColor"として追加される

### 例3: すべてのアトリビュートを一括コピー
複数のアトリビュートセットを統合する場合：
1. Attributesピンに複数のアトリビュートセットを接続
2. `bCopyAllAttributes`を`true`に設定
3. すべてのアトリビュートが入力データに追加される

## 実装の詳細

### ExecuteInternalメソッド（FPCGAddAttributeElement）

主要な実行ロジック：

```cpp
// 1. 定数モード（Attributesピン未接続）
if (SourceParams.IsEmpty() && !bAttributesPinIsConnected)
{
    // 各入力データに対して
    for (const UPCGData* InData : Inputs)
    {
        // データを複製
        UPCGData* OutputData = InData->DuplicateData(Context);

        // 指定されたドメインのメタデータを取得
        FPCGMetadataDomain* OutputMetadata =
            OutputData->MutableMetadata()->GetMetadataDomainFromSelector(Settings->OutputTarget);

        // 定数値でアトリビュートを作成
        PCGCreateAttribute::ClearOrCreateAttribute(
            Settings->AttributeTypes,
            OutputMetadata,
            OutputAttributeName
        );

        // 少なくとも1エントリを確保
        if (OutputMetadata->GetItemCountForChild() == 0)
        {
            OutputMetadata->AddEntry();
        }
    }
}
```

```cpp
// 2. コピーモード（Attributesピン接続済み）
else
{
    if (Settings->bCopyAllAttributes)
    {
        // 全アトリビュートコピー
        for (const UPCGParamData* ParamData : SourceParams)
        {
            PCGMetadataHelpers::FPCGCopyAllAttributesParams Params;
            Params.SourceData = ParamData;
            Params.TargetData = TargetData;

            if (Settings->bCopyAllDomains)
            {
                Params.InitializeMappingForAllDomains();
            }
            else
            {
                Params.InitializeMappingFromDomainNames(Settings->MetadataDomainsMapping);
            }

            PCGMetadataHelpers::CopyAllAttributes(Params);
        }
    }
    else
    {
        // 単一アトリビュートコピー
        PCGMetadataHelpers::FPCGCopyAttributeParams Params;
        Params.SourceData = FirstSourceParamData;
        Params.TargetData = TargetData;
        Params.InputSource = Settings->InputSource;
        Params.OutputTarget = Settings->OutputTarget;
        Params.bSameOrigin = false;

        PCGMetadataHelpers::CopyAttribute(Params);
    }
}
```

### ピン使用判定

```cpp
bool IsPinUsedByNodeExecution(const UPCGPin* InPin) const
{
    // Attributesピンは接続されている場合のみ使用される
    return !InPin ||
           (InPin->Properties.Label != PCGCreateAttributeConstants::AttributesLabel) ||
           InPin->IsConnected();
}
```

### プロパティ編集制御

```cpp
bool CanEditChange(const FProperty* InProperty) const
{
    const bool AttributesPinIsConnected = Node->IsInputPinConnected(PCGCreateAttributeConstants::AttributesLabel);

    if (InProperty->GetFName() == GET_MEMBER_NAME_CHECKED(UPCGAddAttributeSettings, InputSource))
    {
        // InputSourceはAttributesピン接続時のみ編集可能
        return AttributesPinIsConnected;
    }
    else if (InProperty->GetOwnerStruct() == FPCGMetadataTypesConstantStruct::StaticStruct())
    {
        // AttributeTypesはAttributesピン未接続時のみ編集可能
        return !AttributesPinIsConnected;
    }

    return true;
}
```

## パフォーマンス考慮事項

### メモリ
- 入力データは常に複製されるため、大きなデータセットの場合はメモリ消費が増加します
- `bCopyAllAttributes`を使用する場合、複数のアトリビュートセットからコピーするため、さらにメモリが必要になります

### 処理速度
- 定数モードは非常に高速（アトリビュート作成とデフォルト値設定のみ）
- コピーモードは、コピーするアトリビュート数とエントリ数に比例して処理時間が増加
- `bCopyAllAttributes`で複数ソースから大量のアトリビュートをコピーする場合は特に注意

### 最適化のヒント
- 必要なアトリビュートのみをコピーする（`bCopyAllAttributes`を安易に使用しない）
- 同一のアトリビュート追加を複数回行う場合は、Loopノードの外側に配置することを検討
- ドメインマッピングは明示的に指定することで不要なコピーを防ぐ

## 構造的な非推奨化処理

バージョン`FPCGCustomVersion::SupportPartitionedComponentsInNonPartitionedLevels`より前のノードで、Inピンに何も接続されていない場合、自動的に`UPCGCreateAttributeSetSettings`（Create Constantノード）に変換されます。

```cpp
void ApplyStructuralDeprecation(UPCGNode* InOutNode)
{
    if (DataVersion < FPCGCustomVersion::SupportPartitionedComponentsInNonPartitionedLevels)
    {
        if (!InOutNode->IsInputPinConnected(PCGPinConstants::DefaultInputLabel))
        {
            UPCGCreateAttributeSetSettings* NewSettings = NewObject<UPCGCreateAttributeSetSettings>(InOutNode);
            NewSettings->OutputTarget.ImportFromOtherSelector(OutputTarget);
            NewSettings->AttributeTypes = AttributeTypes;
            InOutNode->SetSettingsInterface(NewSettings);
        }
    }
}
```

## 関連ノード

- **Create Constant**: 定数値のみを持つ新しいアトリビュートセットを作成（Inピン不要）
- **Copy Attributes**: より高度なアトリビュートコピー機能を提供
- **Merge Attributes**: 複数のアトリビュートセットをマージ
- **Delete Attributes**: 既存のアトリビュートを削除
- **Attribute Rename**: アトリビュート名を変更

## 注意事項

1. **ドメインの互換性**: ターゲットデータがソースドメインをサポートしていない場合、コピーは失敗します
2. **型の一致**: 既存のアトリビュートに上書きする場合、型の不一致があるとエラーになる可能性があります
3. **エントリ数の保証**: 定数モードでは、メタデータに最低1つのエントリが作成されます
4. **複数ソース警告**: `bCopyAllAttributes`が`false`で複数のアトリビュートセットがAttributesピンに接続されている場合、最初のソースのみが使用され、警告が出力されます
5. **タイトル情報**: ノードのタイトルには、追加されるアトリビュート名または値が動的に表示されます
