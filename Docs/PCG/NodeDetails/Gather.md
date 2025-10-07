# Gather ノード

## 概要

Gatherノードは、複数の入力ワイヤーを1つの出力ワイヤーにまとめる組織化目的のノードです。複数のデータソースを単一のコレクションに集約し、依存関係専用ピンを通じて実行順序を制御することもできます。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGather.h`

**カテゴリ**: Generic (汎用)

## 機能詳細

Gatherノードは以下の主要な機能を提供します:

1. **データ集約**: 複数の入力ピンからのデータを単一の出力コレクションに統合
2. **動的ピン**: 必要に応じて入力ピンを追加可能
3. **実行順序制御**: 依存関係専用ピンを使用した実行フローの管理
4. **タグ管理**: 入力データのタグを適切に出力に反映
5. **GPU対応**: GPU常駐データとベースポイントデータ入力をサポート

## プロパティ

### UPCGGatherSettings

このノードは設定可能なUPROPERTYを持ちません。動的入力ピンの設定のみで動作します。

### ピン設定

#### 入力ピン
- **In (静的)**: `EPCGDataType::Any` - 任意のPCGデータを受け入れる基本入力ピン
- **In 2, In 3, ...** (動的): エディタで追加可能な追加の入力ピン
- **Execution Dependency**: 依存関係専用ピン（データフローなしで実行順序のみ制御）

#### 出力ピン
- **Out**: `EPCGDataType::Any` - 集約されたすべてのデータを含む単一の出力

## 使用例

### 基本的な使用方法

```cpp
// Gatherノードは通常、グラフエディタで視覚的に設定されます
// 複数のデータソースを統合する例:

// データソース1: ランドスケープデータ
// データソース2: アクターデータ
// データソース3: スプラインデータ
//
// これらすべてを1つのGatherノードに接続すると、
// 単一の出力ピンからすべてのデータにアクセスできます
```

### プログラムでの使用

```cpp
// Gatherノードの機能をコードで利用する例
FPCGDataCollection InputData;
// ... InputDataに複数のデータを追加 ...

// 特定のピンのデータを集約
FPCGDataCollection GatheredData = PCGGather::GatherDataForPin(
    InputData,
    PCGPinConstants::DefaultInputLabel,
    PCGPinConstants::DefaultOutputLabel
);
```

### 複数のデータソースの統合例

```
[Landscape Data] ──┐
                   │
[Actor Data] ──────┤──→ [Gather] ──→ [Out]
                   │
[Spline Data] ─────┘
```

## 実装の詳細

### ExecuteInternal メソッド

```cpp
bool FPCGGatherElement::ExecuteInternal(FPCGContext* Context) const
{
    TRACE_CPUPROFILER_EVENT_SCOPE(FPCGGatherElement::Execute);

    if (const UPCGGatherSettings* Settings = Context->GetInputSettings<UPCGGatherSettings>())
    {
        // 定義されたすべてのピンからデータを収集
        for (FName PinLabel : Settings->GetNodeDefinedPinLabels())
        {
            Context->OutputData += PCGGather::GatherDataForPin(Context->InputData, PinLabel);
        }
    }
    else
    {
        // 設定なしで実行される場合、デフォルトの入力ピンから収集
        Context->OutputData = PCGGather::GatherDataForPin(Context->InputData, PCGPinConstants::DefaultInputLabel);
    }

    return true;
}
```

### GatherDataForPin 関数

この関数は特定のピンからデータを収集し、出力ピンラベルを更新します:

1. 指定された入力ピンラベルに一致するすべてのタグ付きデータを取得
2. データが空でない場合、出力コレクションを作成
3. すべてのタグ付きデータのピンラベルを出力ピンラベルに更新
4. 結果を返す

### 主要な特徴

- **効率的なデータ処理**: 可能な場合は入力データをそのまま使用（ムーブセマンティクス）
- **タグの保持**: 入力データのタグはすべて保持され、ピンラベルのみ更新
- **柔軟なピン構成**: エディタで動的にピンを追加可能

## パフォーマンス考慮事項

### 最適化のポイント

1. **メモリ効率**: データのコピーを最小限に抑え、可能な限りムーブセマンティクスを使用
2. **GPU対応**: GPU常駐データをサポートし、GPU処理パイプラインで効率的に動作
3. **軽量処理**: データの実際の変換は行わず、単純な集約のみを実行

### パフォーマンスへの影響

- **処理時間**: 非常に軽量（O(n)、nは入力データ数）
- **メモリ使用**: 最小限（主にポインタのコピー）
- **GPU利用**: GPU常駐データをサポート

### ベストプラクティス

1. **適切な使用**: 複数のデータソースを1つのノードに渡す必要がある場合に使用
2. **代替手段**: データの順序や選択が重要な場合は、専用のフィルタリングノードの使用を検討
3. **実行依存関係**: データフローなしで実行順序のみを制御したい場合は、Execution Dependencyピンを使用

## 関連ノード

- **Union**: 空間データの統合（Gatherと異なり、空間的なマージを行う）
- **Merge Points**: ポイントデータの統合と結合
- **Merge Attributes**: アトリビュートの統合
- **Select (Multi)**: 条件に基づくデータの選択と集約

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. Gatherノードはデータの変換や処理を行いません - 単純な集約のみ
2. 入力データの順序は保持されますが、特定の順序が必要な場合は明示的なソートノードを使用してください
3. 依存関係専用ピンはデータを転送せず、実行順序の制御のみに使用されます
4. 過去のバージョンでは"Dependency Only"ピンが"Execution Dependency"に名称変更されました

## トラブルシューティング

### よくある問題

1. **データが出力されない**: すべての入力ピンが接続され、有効なデータを提供していることを確認
2. **実行順序の問題**: Execution Dependencyピンを使用して明示的な順序を定義
3. **タグの混乱**: 各入力データソースに適切なタグを設定し、下流のノードで識別可能にする
