# Get Subgraph Depth ノード

## 概要

Get Subgraph Depthノードは、実行スタック内での現在のグラフの呼び出し深度または再帰深度を取得します。サブグラフのネストレベルや再帰的な呼び出しの深さを把握し、深度に応じた処理制御が可能になります。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetSubgraphDepth.h`
**カテゴリ**: Generic (汎用)
**キャッシュ**: 不可

## 機能詳細

1. **深度測定**: トップレベルグラフからの相対的な深度を測定
2. **再帰深度測定**: 同じグラフが実行スタック内に何回出現するかを測定
3. **上流グラフ指定**: 任意の上流グラフからの相対深度を測定可能
4. **整数出力**: 深度を整数型アトリビュートとして出力

## プロパティ

### UPCGGetSubgraphDepthSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **Mode** | EPCGSubgraphDepthMode | Depth | 測定モード（深度または再帰深度） |
| **DistanceRelativeToUpstreamGraph** | int | 0 | 再帰深度測定時の上流グラフまでの距離 |
| **bQuietInvalidDepthQueries** | bool | false | 無効なクエリ時の警告を抑制 |

### EPCGSubgraphDepthMode 列挙型

| 値 | 説明 |
|----|------|
| **Depth** | トップレベルグラフからの動的サブグラフの深度 |
| **RecursiveDepth** | 現在のサブグラフの再帰深度（スタック内での出現回数） |

### ピン設定

- **入力**: なし
- **出力**: `EPCGDataType::Param` (アトリビュート名: "Depth")

## 使用例

### サブグラフの深度制限

```
[Subgraph]
    ↓
[Get Subgraph Depth: Mode=Depth]
    ↓
[Compare: < 5]  // 深度5未満の場合のみ
    ↓
[Branch] → さらにサブグラフを呼び出す
```

### 再帰的な処理の制御

```cpp
// Mode: RecursiveDepth
// DistanceRelativeToUpstreamGraph: 0 (現在のグラフ)

// 再帰的なサブグラフ呼び出しで、深度に応じて処理を変更
深度0: 大きなグリッドを生成
深度1: 中サイズのグリッド
深度2: 小サイズのグリッド
深度3以上: 処理を停止
```

## 実装の詳細

### ExecuteInternal メソッド概要

```cpp
bool FPCGGetSubgraphDepthElement::ExecuteInternal(FPCGContext* Context) const
{
    bool bRecursive = Settings->Mode == EPCGSubgraphDepthMode::RecursiveDepth;
    const UPCGGraph* TargetGraph = nullptr;
    int Depth = 0;

    const TArray<FPCGStackFrame>& StackFrames = Stack->GetStackFrames();

    if (bRecursive)
    {
        // 上流グラフを特定し、そのグラフの出現回数をカウント
        // DistanceRelativeToUpstreamGraph 分だけスキップして対象グラフを決定
        // 対象グラフがスタック内に何回出現するかをカウント
    }
    else
    {
        // 単純にスタック内のグラフ数をカウント
    }

    // ルートと自身を除外するため -1
    Depth = FMath::Max(0, Depth - 1);

    // Depth アトリビュートとして出力
    return true;
}
```

### 深度計算ロジック

**Depthモード**:
```
トップレベルグラフ (深度0)
  └─ Subgraph A (深度1)
       └─ Subgraph B (深度2)
            └─ Subgraph C (深度3)
```

**RecursiveDepthモード**:
```
Graph A (再帰深度1)
  └─ Graph A (再帰深度2) ← 同じグラフが再び呼び出される
       └─ Graph A (再帰深度3)
```

## パフォーマンス考慮事項

- **処理時間**: O(n)、nはスタックフレーム数
- **メモリ使用**: 最小限（整数値1つ）
- **キャッシュ**: 不可（実行コンテキストにより変動）

## 関連ノード

- **Get Loop Index**: ループインデックス取得
- **Get Execution Context Info**: 実行コンテキスト情報取得
- **Branch/Select**: 深度に基づく条件分岐

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **深度の開始**: 深度は0から開始します（トップレベル = 0）
2. **再帰制限**: 無限再帰を防ぐため、深度チェックを必ず実装してください
3. **上流グラフ指定**: DistanceRelativeToUpstreamGraph を誤って設定すると、想定外の深度が返されます

## トラブルシューティング

**問題**: 無効なクエリ警告が出る
**解決策**: DistanceRelativeToUpstreamGraph の値を確認。スタック内に存在するグラフを指定してください

**問題**: 再帰深度が期待と異なる
**解決策**: どのグラフの再帰深度を測定しているか確認。現在のグラフ（0）か、親グラフ（1）か、さらに上（2+）か

## 実用例

### 再帰的な地形分割

```
[Subgraph: Terrain Subdivision]
    ↓
[Get Subgraph Depth: RecursiveDepth]
    ↓
[Branch: Depth < MaxDepth]
    ↙        ↘
再帰続行    分割終了
[呼び出し自身]
```
