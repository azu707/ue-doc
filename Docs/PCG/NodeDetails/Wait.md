# Wait ノード

## 概要

Waitノードは、指定された時間やフレーム数だけ待機してから入力データを出力に転送します。デバッグやタイミング制御に使用できますが、**本番環境での使用は特別なケース以外では推奨されません**。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGWait.h`
**カテゴリ**: Generic (汎用) / ControlFlow (制御フロー)
**キャッシュ**: 不可（実行時のタイミングに依存）

## 機能詳細

1. **時間待機**: 秒単位での待機
2. **エンジンフレーム待機**: ゲームスレッドフレーム数での待機
3. **レンダーフレーム待機**: レンダースレッドフレーム数での待機
4. **複合条件**: AND/OR条件で複数の待機条件を組み合わせ可能
5. **非ブロッキング**: 他のタスクの実行を妨げない待機

## プロパティ

### UPCGWaitSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **WaitTimeInSeconds** | double | 1.0 | 待機する秒数 |
| **WaitTimeInEngineFrames** | int64 | 0 | 待機するゲームスレッドフレーム数 |
| **WaitTimeInRenderFrames** | int64 | 0 | 待機するレンダースレッドフレーム数 |
| **bEndWaitWhenAllConditionsAreMet** | bool | true | すべての条件を満たす必要があるか（AND） |

#### プロパティの詳細

**WaitTimeInSeconds**
- 型: double
- オーバーライド可能: はい（`PCG_Overridable`）
- 最小値: 0.0
- 用途: 実時間での待機（秒単位）
- 例: 1.5 → 1.5秒待機

**WaitTimeInEngineFrames**
- 型: int64
- オーバーライド可能: はい
- 最小値: 0
- 用途: ゲームスレッドのフレーム数で待機
- 例: 60 → 60フレーム待機（60FPSなら1秒）

**WaitTimeInRenderFrames**
- 型: int64
- オーバーライド可能: はい
- 最小値: 0
- 用途: レンダースレッドのフレーム数で待機
- 例: 120 → 120レンダーフレーム待機

**bEndWaitWhenAllConditionsAreMet**
- 型: bool
- オーバーライド可能: はい
- デフォルト: true（AND条件）
- true: すべての条件を満たす必要がある
- false: いずれかの条件を満たせば終了（OR条件）

### ピン設定

#### 入力ピン
- なし（データ入力を受け付けない）

#### 出力ピン
- **Execution Dependency**: `EPCGDataType::Any` - 依存関係専用ピン（待機完了後に実行）

## 使用例

### 単純な時間待機

```
[Wait: WaitTimeInSeconds=2.0]
    ↓
[2秒後に実行される処理]
```

### フレーム数による待機

```
[Wait: WaitTimeInEngineFrames=60]
    ↓
[60フレーム後に実行される処理]
```

### 複合条件（AND）

```
[Wait]
- WaitTimeInSeconds: 1.0
- WaitTimeInEngineFrames: 30
- bEndWaitWhenAllConditionsAreMet: true
    ↓
[1秒かつ30フレーム経過後に実行]
```

### 複合条件（OR）

```
[Wait]
- WaitTimeInSeconds: 2.0
- WaitTimeInEngineFrames: 60
- bEndWaitWhenAllConditionsAreMet: false
    ↓
[2秒または60フレームのいずれか早い方で実行]
```

## 実装の詳細

### FPCGWaitContext 構造体

```cpp
struct FPCGWaitContext : public FPCGContext
{
    double StartTime = -1.0;        // 開始時刻
    uint64 StartEngineFrame = 0;    // 開始エンジンフレーム
    uint64 StartRenderFrame = 0;    // 開始レンダーフレーム
    bool bQueriedTimers = false;    // タイマー初期化済みフラグ
};
```

### ExecuteInternal メソッド

```cpp
bool FPCGWaitElement::ExecuteInternal(FPCGContext* InContext) const
{
    FPCGWaitContext* Context = static_cast<FPCGWaitContext*>(InContext);
    const UPCGWaitSettings* Settings = Context->GetInputSettings<UPCGWaitSettings>();

    // 現在の時刻とフレーム数を取得
    const double CurrentTime = FPlatformTime::Seconds();
    const int64 CurrentEngineFrame = GFrameCounter;
    const int64 CurrentRenderFrame = GFrameCounterRenderThread;

    // 初回実行時: 開始時刻/フレームを記録
    if (!Context->bQueriedTimers)
    {
        Context->StartTime = CurrentTime;
        Context->StartEngineFrame = CurrentEngineFrame;
        Context->StartRenderFrame = CurrentRenderFrame;
        Context->bQueriedTimers = true;
    }

    // 各条件の完了判定
    const bool bTimeDone = (CurrentTime - Context->StartTime) >= Settings->WaitTimeInSeconds;
    const bool bEngineFramesDone = (CurrentEngineFrame - Context->StartEngineFrame) >= Settings->WaitTimeInEngineFrames;
    const bool bRenderFramesDone = (CurrentRenderFrame - Context->StartRenderFrame) >= Settings->WaitTimeInRenderFrames;

    // AND条件 or OR条件で待機終了を判定
    bool bShouldEnd = false;
    if (Settings->bEndWaitWhenAllConditionsAreMet)
    {
        // AND: すべての条件が満たされる
        bShouldEnd = bTimeDone && bEngineFramesDone && bRenderFramesDone;
    }
    else
    {
        // OR: いずれかの条件が満たされる
        bShouldEnd = bTimeDone || bEngineFramesDone || bRenderFramesDone;
    }

    if (bShouldEnd)
    {
        // 待機完了: 入力を出力に転送
        Context->OutputData = Context->InputData;
        return true;
    }
    else
    {
        // 待機継続: 次フレームで再実行をスケジュール
        Context->bIsPaused = true;
        FPCGModule::GetPCGModuleChecked().ExecuteNextTick([ContextHandle = Context->GetOrCreateHandle()]()
        {
            // 次フレームでコンテキストを再開
            FPCGContext::FSharedContext<FPCGWaitContext> SharedContext(ContextHandle);
            if (FPCGWaitContext* ContextPtr = SharedContext.Get())
            {
                ContextPtr->bIsPaused = false;
            }
        });

        return false; // 継続実行
    }
}
```

### 待機メカニズム

1. **初回実行**: 開始時刻/フレームを記録
2. **経過時間計算**: 現在時刻/フレームとの差分を計算
3. **条件判定**: 待機条件を満たしているか確認
4. **次フレームスケジュール**: 条件未達の場合、次フレームで再実行
5. **待機完了**: 条件達成時にデータを転送して終了

## パフォーマンス考慮事項

### 最適化のポイント

1. **非ブロッキング**: ゲームスレッドをブロックせずに待機
2. **メインスレッド実行**: `CanExecuteOnlyOnMainThread` が true
3. **最小オーバーヘッド**: 簡単な時刻/フレーム比較のみ

### パフォーマンスへの影響

- **処理時間**: ほぼゼロ（時刻比較のみ）
- **メモリ使用**: 最小限（コンテキスト内の数値のみ）
- **実行回数**: 待機中、毎フレーム実行される

### ベストプラクティス

1. **本番環境での使用を避ける**: デバッグや特殊なタイミング制御のみに使用
2. **適切な待機時間**: 過度に長い待機は避ける
3. **条件の選択**: 目的に応じた適切な条件を設定

## 関連ノード

- **Wait Until Landscape Is Ready**: ランドスケープの準備完了を待機
- **Branch/Select**: 条件に基づく制御フロー
- **Gather**: 実行依存関係の管理
- **Loop**: 反復処理

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **本番環境非推奨**: このノードは特別なケースを除き、本番環境での使用は推奨されません
2. **フレームレート依存**: フレーム待機はフレームレートに依存します（可変FPSに注意）
3. **キャッシュ不可**: 待機はタイミングに依存するため、結果はキャッシュされません
4. **メインスレッド**: メインスレッドでのみ実行されます

## トラブルシューティング

**問題**: 待機時間が予想より長い/短い
**解決策**: フレームレートの変動を確認。時間待機とフレーム待機の組み合わせに注意

**問題**: 待機が終了しない
**解決策**: すべての条件が適切に設定されているか確認。AND条件の場合、すべての条件が達成可能か確認

**問題**: タイミングがずれる
**解決策**: レンダーフレームとゲームフレームは異なる可能性があります。用途に応じて適切なフレームタイプを選択

## 実用例

### デバッグ用の遅延

```
[Debug: Print String "Start"]
    ↓
[Wait: 1.0 seconds]
    ↓
[Debug: Print String "After 1 second"]
```

### アニメーションタイミング

```
[Spawn Actors]
    ↓
[Wait: 30 frames]
    ↓
[Apply Effects] // アクターが安定してから効果を適用
```

### ロード待機（特殊ケース）

```
[Load Resources]
    ↓
[Wait: 60 frames] // リソースの読み込み時間を確保
    ↓
[Use Resources]
```

**警告**: このような使用は推奨されません。適切な完了コールバックを使用してください。
