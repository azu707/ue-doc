# Get Loop Index ノード

## 概要

Get Loop Indexノードは、現在実行中のループ内でのイテレーションインデックスを取得します。Loopノード内でサブグラフが実行されている場合に、そのループの現在の反復回数を整数値として出力します。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetLoopIndex.h`

**カテゴリ**: Generic (汎用)

**キャッシュ**: 不可（ループの各反復で異なる値を返す必要があるため）

## 機能詳細

1. **ループインデックス取得**: 実行スタック内の最も近いループのインデックスを取得
2. **警告機能**: ループ外で呼び出された場合に警告を表示（オプション）
3. **整数出力**: ループインデックスを整数型のアトリビュートとして出力
4. **スタック解析**: 実行スタックを解析して適切なループフレームを特定

## プロパティ

### UPCGGetLoopIndexSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bWarnIfCalledOutsideOfLoop** | bool | true | ループ外で呼び出された場合に警告を表示するか |

### ピン設定

#### 入力ピン
- なし（入力データを必要としない）

#### 出力ピン
- **Out**: `EPCGDataType::Param` - ループインデックスを含むパラメータデータ（アトリビュート名: "LoopIndex"）

## 使用例

### 基本的なループ処理

```
[Create Points Grid] → [Loop: Count=10]
                           ↓
                   [Get Loop Index]
                           ↓
                   [サブグラフ処理]
```

### インデックスに基づく変動処理

```cpp
// ループインデックスを使用して各反復で異なる処理を実行

Loop (10回) {
    Index = Get Loop Index  // 0, 1, 2, ..., 9
    Offset = Index * 100    // 各反復で異なるオフセット
    [Transform Points: Offset]
}
```

### 条件付き処理

```
[Loop]
  ↓
[Get Loop Index]
  ↓
[Compare: Index % 2 == 0]  // 偶数インデックスのみ
  ↓
[Branch]
  ↓
偶数回目の処理のみ実行
```

### シード値の変動

```
[Loop: Count=5]
    ↓
[Get Loop Index] → [Generate Seed] → [各反復で異なる乱数生成]
```

## 実装の詳細

### ExecuteInternal メソッド

```cpp
bool FPCGGetLoopIndexElement::ExecuteInternal(FPCGContext* Context) const
{
    const UPCGGetLoopIndexSettings* Settings = Context->GetInputSettings<UPCGGetLoopIndexSettings>();

    const FPCGStack* Stack = Context->GetStack();
    if (!ensure(Stack))
    {
        PCGE_LOG(Error, LogOnly, "実行コンテキストにコールスタックがありません");
        return true;
    }

    int LoopIndex = INDEX_NONE;
    const TArray<FPCGStackFrame>& StackFrames = Stack->GetStackFrames();

    // スタックの最後から2番目の要素がループインデックスを含む
    // （最後の要素は現在のサブグラフ）
    if (StackFrames.Num() >= 2)
    {
        LoopIndex = StackFrames.Last(1).LoopIndex;
    }

    // ループが見つからない場合
    if (LoopIndex == INDEX_NONE)
    {
        if (Settings->bWarnIfCalledOutsideOfLoop)
        {
            PCGE_LOG(Warning, GraphAndLog,
                "GetLoopIndexノードがループ外で実行されました。");
        }
        return true;
    }

    // ループインデックスをパラメータデータとして出力
    UPCGParamData* LoopIndexParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);
    FPCGMetadataAttribute<int>* LoopIndexAttribute =
        LoopIndexParamData->Metadata->CreateAttribute<int>(
            "LoopIndex", LoopIndex,
            /*bAllowInterpolation=*/false,
            /*bOverrideParent=*/false);

    LoopIndexParamData->Metadata->AddEntry();

    FPCGTaggedData& OutputData = Context->OutputData.TaggedData.Emplace_GetRef();
    OutputData.Data = LoopIndexParamData;

    return true;
}
```

### スタックフレーム解析

実行スタックの構造:
```
[トップレベルグラフ]
  ↓
[ループノード] ← LoopIndex = N
  ↓
[サブグラフ] ← 現在の実行位置
  ↓
[Get Loop Index] ← このノードが1つ前のスタックフレームからインデックスを取得
```

### 重要な注意点

1. **スタックフレームの依存**: このノードはスタックフレームの構造に依存しており、将来の変更に敏感
2. **最も近いループのみ**: ネストされたループの場合、最も内側のループのインデックスのみを取得
3. **ループ内での使用が前提**: ループ外で使用すると INDEX_NONE (-1) が返される

## パフォーマンス考慮事項

### 最適化のポイント

1. **軽量処理**: スタックフレームの読み取りのみで非常に高速
2. **キャッシュ不可**: 各反復で異なる値を返す必要があるため、キャッシュは無効
3. **スレッドセーフ**: スレッドセーフな実装

### パフォーマンスへの影響

- **処理時間**: 最小限（O(1)スタックアクセス）
- **メモリ使用**: 非常に少ない（整数値1つ）

### ベストプラクティス

1. **ループ内で使用**: 必ずLoopノード内のサブグラフで使用
2. **警告の管理**: 意図的にループ外で使用する場合は警告を無効化
3. **インデックスの活用**: シード値、オフセット、条件判定などに活用

## 関連ノード

- **Loop**: ループ処理を実行（このノードと組み合わせて使用）
- **Get Subgraph Depth**: サブグラフの深度を取得
- **Get Execution Context Info**: 実行コンテキスト情報を取得
- **Generate Seed**: インデックスに基づくシード生成
- **Compare Op**: インデックスに基づく条件判定

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **ループ内での使用必須**: このノードはLoopノード内で使用することを前提としています
2. **ネストされたループ**: 複数のループがネストされている場合、最も内側のループのインデックスを取得
3. **インデックスの範囲**: ループの開始インデックスは0です（C++の配列と同様）
4. **スタック依存**: 実行スタックの構造に依存するため、将来のバージョンで動作が変更される可能性があります

## トラブルシューティング

### よくある問題

**問題**: "ループ外で実行されました"という警告が出る
- **解決策**: このノードをLoopノード内のサブグラフに配置してください。または、意図的な場合は `bWarnIfCalledOutsideOfLoop` を false に設定

**問題**: 期待したインデックスが取得できない
- **解決策**: スタック構造を確認。ネストされたループの場合、最も内側のループのインデックスが取得されます

**問題**: 出力データが生成されない
- **解決策**: ループが正しく設定されているか、ループの反復回数が0でないか確認

## 実用例

### 各反復で異なるオフセット

```
[Loop: Count=5]
    ↓
[Get Loop Index] → [Multiply by 100] → [Transform Points]
// 結果: 0, 100, 200, 300, 400 のオフセット
```

### 偶数/奇数で異なる処理

```
[Loop: Count=10]
    ↓
[Get Loop Index]
    ↓
[Attribute Math: % 2]  // モジュロ演算
    ↓
[Branch: == 0]
    ↙        ↘
偶数処理    奇数処理
```

### インデックスベースのシード生成

```
[Loop: Count=100]
    ↓
[Get Loop Index]
    ↓
[Generate Seed: BaseSeed + Index]
    ↓
[Random処理: 各反復で異なる乱数シーケンス]
```

### 進行状況ベースの変動

```
[Loop: Count=20]
    ↓
[Get Loop Index]
    ↓
[Density Remap: t = Index / 19.0]  // 0.0 ~ 1.0
    ↓
[Lerp処理: 開始値から終了値へ徐々に変化]
```
