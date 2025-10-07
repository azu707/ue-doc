# Data Count ノード

## 概要

Data Countノードは、入力データコレクション内のデータ数をカウントし、その結果を属性として出力するノードです。入力ピンに接続されたデータの総数を取得するシンプルなユーティリティノードです。

**カテゴリ**: Generic
**クラス名**: `UPCGDataNumSettings`
**エレメントクラス**: `FPCGDataNumElement`
**GPU対応**: ✅ あり

## 機能詳細

1. **データ数のカウント**: 入力データコレクション内のデータ数を取得
2. **Param Data出力**: カウント結果を属性として含むParamDataを出力
3. **GPU実行サポート**: GPU上での実行に対応
4. **カスタム属性名**: 出力属性名をカスタマイズ可能

## プロパティ

### OutputAttributeName
- **型**: `FName`
- **デフォルト値**: `NAME_None`（空の名前）
- **説明**: カウント結果を格納する属性の名前を指定します。空の場合はデフォルト名が使用されます。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

## 入出力

### 入力ピン
- **Input** (Any): カウント対象のデータコレクション

### 出力ピン
- **Output** (Param): データカウントを含む属性セット
  - Int32型の属性としてカウント値を保持

## 実装の詳細

### ExecuteInternalメソッド

```cpp
bool FPCGDataNumElement::ExecuteInternal(FPCGContext* Context) const
{
    const int32 InputDataCount = Context->InputData.GetInputsByPin(PCGPinConstants::DefaultInputLabel).Num();

    UPCGParamData* OutputParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
    FPCGMetadataAttribute<int32>* NumAttribute = OutputParamData->Metadata->CreateAttribute<int32>(
        Settings->OutputAttributeName,
        InputDataCount,  // デフォルト値
        /*bAllowInterpolation=*/false,
        /*bOverrideParent=*/false
    );

    OutputParamData->Metadata->AddEntry();

    return true;
}
```

### 処理フロー

1. 入力データ数をカウント（`GetInputsByPin().Num()`）
2. 新しいParamDataオブジェクトを作成
3. Int32型の属性を作成し、カウント値をデフォルト値として設定
4. メタデータにエントリを追加
5. 出力データとして設定

## 使用例

### 基本的な使用

```
1. 複数のデータソースを Gather ノードで統合
2. Data Count ノードに接続
3. OutputAttributeName: "TotalCount"
4. 出力: TotalCount属性にデータ数が格納されたParamData
```

### 条件分岐での使用

```
1. Create Points Grid → グリッド生成
2. Filter → 条件でフィルタリング
3. Data Count → フィルタ後のデータ数をカウント
4. Branch (Custom) → カウント数に応じて分岐
```

### デバッグ用途

```
各処理段階でData Countを挿入し、データ数の変化を追跡
- 初期生成: 1000個
- フィルタ後: 750個
- 最終出力: 500個
```

## パフォーマンス考慮事項

1. **非常に軽量**: データ数を取得するだけ（O(1)）
2. **GPU対応**: 大規模データでGPU実行可能
3. **キャッシュ可能**: 入力が同じなら結果もキャッシュ
4. **即座に実行**: 遅延なく完了

## 注意事項

1. **データ数のカウント**: データの内容ではなく、データコレクション内のエントリ数をカウント
2. **ポイント数ではない**: PointData内のポイント数ではなく、データの個数
3. **OutputAttributeName**: 空の場合、属性名が適切に設定されない可能性
4. **Param Data**: 出力はParam Data型で、他のデータ型に変換が必要な場合あり

## 関連ノード

- **Get Points Count**: PointData内のポイント数を取得（異なる目的）
- **Get Data Info**: データの詳細情報を取得
- **Branch**: カウント結果に基づく条件分岐

## 技術的な詳細

### GPU実行

```cpp
#if WITH_EDITOR
void UPCGDataNumSettings::CreateKernels(FPCGGPUCompilationContext& InOutContext, ...) const
{
    UPCGDataNumKernel* Kernel = InOutContext.NewObject_AnyThread<UPCGDataNumKernel>(InObjectOuter);
    Kernel->SetOutputAttribute(OutputAttributeName);
    Kernel->Initialize(KernelParams);
    OutKernels.Add(Kernel);
    // カーネルとエッジの設定
}
#endif
```

- `DisplayExecuteOnGPUSetting()`が`true`を返す
- 専用のGPUカーネル（`UPCGDataNumKernel`）を使用
- GPU上で並列実行可能

### 出力データ構造

```
UPCGParamData
  ├─ Metadata
  │   ├─ Attribute: [OutputAttributeName] (Int32)
  │   │   └─ Value: [InputDataCount]
  │   └─ Entry[0]
  └─ (その他のParamDataプロパティ)
```
