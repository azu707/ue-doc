# Sort Attributes ノード

## 概要

Sort Attributesノードは、指定されたアトリビュートの値に基づいてデータ（ポイントまたはメタデータエントリ）をソートします。昇順または降順でのソートが可能で、ポイントデータとアトリビュートセットの両方に対応しています。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSortAttributes.h`
**カテゴリ**: Generic (汎用)
**旧名**: Sort Points（エイリアスとして認識）

## 機能詳細

1. **アトリビュートベースソート**: 任意のアトリビュートの値でソート
2. **昇順/降順**: ソート順序の選択可能
3. **型対応**: 比較可能な型（数値、文字列など）をサポート
4. **ポイントデータ**: ポイントの順序を変更
5. **メタデータ**: メタデータエントリの順序を変更
6. **安定ソート**: 同じ値の要素の相対順序を保持

## プロパティ

### UPCGSortAttributesSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **InputSource** | FPCGAttributePropertyInputSelector | - | ソートに使用するアトリビュート |
| **SortMethod** | EPCGSortMethod | Ascending | ソート順序（昇順/降順） |

### EPCGSortMethod 列挙型

| 値 | 説明 |
|----|------|
| **Ascending** | 昇順ソート（小→大） |
| **Descending** | 降順ソート（大→小） |

### ピン設定

#### 入力ピン
- **In** (動的): `EPCGDataType::Any` - ソート対象のデータ

#### 出力ピン
- **Out**: `EPCGDataType::Any` - ソートされたデータ

## 使用例

### 基本的なポイントのソート

```
[Create Points Grid]
    ↓
[Spatial Noise] → Density アトリビュート追加
    ↓
[Sort Attributes]
- InputSource: Density
- SortMethod: Descending (高密度から低密度へ)
    ↓
[ソートされたポイントデータ]
```

### 距離に基づくソート

```
[Point Data]
    ↓
[Distance] → TargetPoint からの距離を計算
    ↓
[Sort Attributes]
- InputSource: Distance
- SortMethod: Ascending (近い順)
    ↓
[最も近いポイントが先頭]
```

### 優先度順の処理

```
[Point Data with Priority attribute]
    ↓
[Sort Attributes: Priority, Descending]
    ↓
[Select Points: First 100] → 優先度の高い上位100ポイントを選択
```

## 実装の詳細

### ExecuteInternal メソッド概要

```cpp
bool FPCGSortAttributesElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGSortAttributesSettings* Settings = Context->GetInputSettings<UPCGSortAttributesSettings>();

    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    for (const FPCGTaggedData& Input : Inputs)
    {
        // アトリビュートアクセサとキーを作成
        TUniquePtr<const IPCGAttributeAccessor> Accessor =
            PCGAttributeAccessorHelpers::CreateConstAccessor(InputData, InputSource);
        TUniquePtr<const IPCGAttributeAccessorKeys> Keys =
            PCGAttributeAccessorHelpers::CreateConstKeys(InputData, InputSource);

        // 型が比較可能かチェック
        if (!CanCompare(Accessor->GetUnderlyingType()))
        {
            PCGE_LOG(Error, "Attribute is not of a comparable type");
            continue;
        }

        if (const UPCGBasePointData* InputPointData = Cast<const UPCGBasePointData>(InputData))
        {
            // ポイントデータのソート
            TArray<int32> SortedKeyIndices = PCGAttributeAccessorHelpers::SortKeyIndicesByAttribute(
                *Accessor, *Keys, Keys->GetNum(), bAscending);

            // ソートされたインデックスでポイントを再配置
            UPCGBasePointData::SetPoints(InputPointData, OutputPointData, SortedKeyIndices, /*bCopyAll=*/false);
        }
        else if (const UPCGMetadata* InMetadata = InputData->ConstMetadata())
        {
            // メタデータのソート
            TArray<PCGMetadataEntryKey> Entries;
            // ... エントリを収集してソート ...
            PCGAttributeAccessorHelpers::SortByAttribute(*Accessor, *Keys, Entries, bAscending);

            // ソートされたエントリでメタデータを初期化
            OutMetadata->InitializeAsCopy(FPCGMetadataInitializeParams(InMetadata, &Entries));
        }
    }

    return true;
}
```

### ソートアルゴリズム

- **安定ソート**: `Algo::StableSort` を使用
- **インデックスベース**: インデックス配列をソートし、それに基づいてデータを再配置
- **型特化**: 各型に応じた比較関数を使用

### サポートされる型

比較可能な型:
- 整数型（int8, int16, int32, int64, uint8, uint16, uint32, uint64）
- 浮動小数点型（float, double）
- 文字列型（FString, FName）
- ベクトル型（長さでの比較）
- その他の比較演算子を持つ型

## パフォーマンス考慮事項

### 最適化のポイント

1. **ソートアルゴリズム**: O(n log n)の安定ソートを使用
2. **メモリ効率**: インデックス配列を使用してメモリコピーを最小化
3. **ベースポイントデータ対応**: 効率的なポイントデータ処理

### パフォーマンスへの影響

- **処理時間**: O(n log n)、nはポイント/エントリ数
- **メモリ使用**: O(n)の追加メモリ（ソートインデックス用）

### ベストプラクティス

1. **必要な場合のみソート**: ソートは比較的重い処理のため、必要な場合のみ使用
2. **アトリビュートの選択**: 単純な型（数値）のアトリビュートが高速
3. **ダウンストリーム処理**: ソート後のデータを効率的に利用

## 関連ノード

- **Sort Data By Tag Value**: タグの値に基づくデータコレクションのソート
- **Attribute Partition**: アトリビュート値によるデータの分割
- **Select Points**: ソート後の特定範囲の選択
- **Filter Elements By Index**: インデックスに基づくフィルタリング

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+
- **名前変更**: "Sort Points" から "Sort Attributes" に変更（下位互換性あり）

## 注意事項

1. **動的ピン**: 複数の入力データをサポート（各データは個別にソート）
2. **比較可能な型**: アトリビュートは比較演算子をサポートする型である必要があります
3. **安定性**: 同じ値を持つ要素の相対順序は保持されます
4. **空間データの継承**: ポイントデータの場合、空間データは継承されません

## トラブルシューティング

**問題**: "Attribute does not exist" エラー
**解決策**: InputSource に指定したアトリビュート名が正しいか確認

**問題**: "Not of a comparable type" エラー
**解決策**: 指定したアトリビュートの型が比較可能か確認（カスタム構造体などは不可）

**問題**: ソート順が期待と異なる
**解決策**: SortMethod（昇順/降順）の設定を確認

## 実用例

### 優先度順のスポーン

```
[Point Cloud with Priority]
    ↓
[Sort Attributes: Priority, Descending]
    ↓
[Static Mesh Spawner] → 優先度の高いポイントから順にスポーン
```

### 距離ベースのLOD

```
[Point Cloud]
    ↓
[Distance: From Camera]
    ↓
[Sort Attributes: Distance, Ascending]
    ↓
[Filter By Index: 0-100] → 近い100ポイントのみ高詳細表示
```

### 密度グラデーション

```
[Surface Sampler]
    ↓
[Spatial Noise] → Density追加
    ↓
[Sort Attributes: Density, Ascending]
    ↓
[Attribute Remap: Index to Color] → 密度のグラデーション可視化
```

### インデックスベースの処理

```
[Point Cloud]
    ↓
[Sort Attributes: Custom Order]
    ↓
[Get Attribute From Point Index] → ソート後のインデックスで処理
```
