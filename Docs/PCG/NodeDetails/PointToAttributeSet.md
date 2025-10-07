# Point To Attribute Set ノード

## 概要
Point To Attribute Setノードは、ポイントデータをアトリビュートセットに変換するノードです。各ポイントが1つのエントリとなり、ポイントのすべてのアトリビュート（メタデータ）が保持されます。

**実装クラス**: `UPCGConvertToAttributeSetSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGConvertToAttributeSet.cpp`

## 機能詳細

### 主な機能
1. **ポイントデータの変換**: ポイントデータをアトリビュートセットに変換
2. **アトリビュート保持**: すべてのポイントアトリビュートを保持
3. **効率的なコピー**: メタデータの効率的なコピー機構を使用
4. **CRC最適化**: 完全なCRC計算でキャッシュ効率を向上

## ピン構成
- **入力ピン**:
  - `In` (Point型、必須): 変換するポイントデータ
- **出力ピン**:
  - `Out` (Param型): 生成されたアトリビュートセット

## プロパティ

このノードには設定可能なプロパティはありません。動作は完全に自動化されています。

## 実装の詳細

### ExecuteInternalメソッド
```cpp
bool FPCGConvertToAttributeSetElement::ExecuteInternal(FPCGContext* Context) const
{
    TArray<FPCGTaggedData> Inputs = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel);

    for (const FPCGTaggedData& Input : Inputs)
    {
        const UPCGBasePointData* PointData = Cast<UPCGBasePointData>(Input.Data);
        if (!PointData) continue;

        const UPCGMetadata* SourceMetadata = PointData->Metadata;
        
        // アトリビュートまたはポイントがない場合はスキップ
        if (SourceMetadata->GetAttributeCount() == 0 || PointData->GetNumPoints() == 0)
        {
            continue;
        }

        // 新しいParamDataを作成
        UPCGParamData* ParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
        UPCGMetadata* Metadata = ParamData->MutableMetadata();

        // メタデータを初期化パラメータで設定
        FPCGMetadataInitializeParams Params(SourceMetadata);
        FPCGMetadataDomainInitializeParams ElementsDomainParams(SourceMetadata->GetConstMetadataDomain(PCGMetadataDomainID::Elements));

        // ポイントのメタデータエントリ範囲を取得
        const TConstPCGValueRange<int64> MetadataEntryRange = PointData->GetConstMetadataEntryValueRange();
        ElementsDomainParams.OptionalEntriesToCopy = MetadataEntryRange;

        Params.DomainInitializeParams.Emplace(PCGMetadataDomainID::Elements, std::move(ElementsDomainParams));
        
        // メタデータをコピーとして初期化
        Metadata->InitializeAsCopy(Params);

        FPCGTaggedData& Output = Outputs.Emplace_GetRef(Input);
        Output.Data = ParamData;
    }

    return true;
}
```

### CRC最適化
```cpp
virtual bool ShouldComputeFullOutputDataCrc(FPCGContext* Context) const override
{
    // ポイントデータからの変換の場合、完全なCRCを計算することで
    // アトリビュートに変更がない場合にキャッシュの再利用率を最大化
    return true;
}
```

### コンパクトノード設定
このノードはコンパクト表示をサポートし、変換アイコンを使用します:
```cpp
virtual bool ShouldDrawNodeCompact() const override { return true; }
virtual bool GetCompactNodeIcon(FName& OutCompactNodeIcon) const override
{
    OutCompactNodeIcon = PCGNodeConstants::Icons::CompactNodeConvert;
    return true;
}
```

## 使用例

### 例1: ポイントデータのアトリビュートセット化
```
1. Surface Samplerでポイントを生成
2. Attribute Maths Opでアトリビュートを操作
3. Point To Attribute Setノードに接続
4. 出力: 各ポイントが1エントリのアトリビュートセット
```

### 例2: ポイント統計の取得
```
1. ポイントデータを生成
2. Point To Attribute Setノードで変換
3. Attribute Reduceノードで統計値（平均、最大、最小など）を計算
```

### 例3: ポイントデータのエクスポート
```
1. ポイントデータを生成
2. Point To Attribute Setノードで変換
3. Save PCG Data Assetノードでアセットとして保存
```

## パフォーマンス考慮事項

1. **メモリ**: ポイント数に比例してエントリ数が増加
2. **効率的なコピー**: `InitializeAsCopy`を使用した効率的なメタデータコピー
3. **CRC計算**: 完全なCRC計算が有効なため、初回実行時のコストがわずかに増加するが、キャッシュ効率が向上
4. **スキップ条件**: アトリビュートまたはポイントが0の場合は処理をスキップ

## 関連ノード

- **Attribute Set To Point**: アトリビュートセットをポイントデータに変換（逆変換）
- **Data Tags To Attribute Set**: タグをアトリビュートセットに変換
- **Get Attribute List**: アトリビュート名のリストを取得
- **Attribute Reduce**: アトリビュート値の集約

## 注意事項

1. **ポイント数 = エントリ数**: 出力アトリビュートセットのエントリ数は、入力ポイントデータのポイント数と等しくなります
2. **アトリビュートのみコピー**: 空間情報（位置、回転、スケール、バウンド）はアトリビュートとしてのみ保持されます
3. **空のデータのスキップ**: アトリビュートまたはポイントが0の場合、出力は生成されません
4. **タグの継承**: 入力データのタグが出力にも引き継がれます
5. **ベースポイントデータ対応**: UPCGBasePointData（ポイントデータの基底クラス）に対応
6. **実行ループモード**: SinglePrimaryPinモードで各入力を個別に処理
