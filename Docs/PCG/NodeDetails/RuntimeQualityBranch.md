# Runtime Quality Branch

## 概要
Runtime Quality Branchノードは、`pcg.Quality`コンソール変数の設定に基づいて入力データを動的に異なる出力ピンにルーティングする制御フローノードです。ランタイム時の品質レベルに応じて、異なる処理パスを選択できます。

## 機能詳細
このノードはランタイム品質レベル（Low、Medium、High、Epic、Cinematic）に基づいて、入力データを対応する出力ピンまたはデフォルトピンに振り分けます。ノードが無効化されている場合、すべてのデータはデフォルトピンに送られます。

### 主な機能
- **品質レベルに基づく動的ルーティング**: `pcg.Quality`設定（0-4）に応じて出力を変更
- **動的ピン**: 有効化された品質レベルのピンのみを表示
- **デフォルトフォールバック**: 無効な品質レベルまたは無効化されたピンはデフォルトピンにルーティング
- **ピン無効化対応**: 使用されない出力ピンを自動的に無効化
- **CRC依存**: 品質レベルが変更されると完全に再実行

### 処理フロー
1. 現在の`pcg.Quality`レベルを取得（`UPCGSubsystem::GetPCGQualityLevel()`）
2. 品質レベル（0-4）を対応するピン（Low-Cinematic）にマッピング
3. そのピンが有効化されているかチェック
4. 有効化されている場合、そのピンから出力
5. 無効化されている場合、デフォルトピンから出力
6. 使用されないピンの出力ビットマスクを設定

## プロパティ

### bUseLowPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Low品質ピン（品質レベル0）を有効化するかどうか
- **特記**: trueの場合、"Low"という名前の出力ピンが追加されます

### bUseMediumPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Medium品質ピン（品質レベル1）を有効化するかどうか
- **特記**: trueの場合、"Medium"という名前の出力ピンが追加されます

### bUseHighPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: High品質ピン（品質レベル2）を有効化するかどうか
- **特記**: trueの場合、"High"という名前の出力ピンが追加されます

### bUseEpicPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Epic品質ピン（品質レベル3）を有効化するかどうか
- **特記**: trueの場合、"Epic"という名前の出力ピンが追加されます

### bUseCinematicPin
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: Cinematic品質ピン（品質レベル4）を有効化するかどうか
- **特記**: trueの場合、"Cinematic"という名前の出力ピンが追加されます

## 品質レベルのマッピング

| 品質レベル | 値 | ピンラベル | プロパティ |
|-----------|---|-----------|-----------|
| Low       | 0 | "Low"     | bUseLowPin |
| Medium    | 1 | "Medium"  | bUseMediumPin |
| High      | 2 | "High"    | bUseHighPin |
| Epic      | 3 | "Epic"    | bUseEpicPin |
| Cinematic | 4 | "Cinematic" | bUseCinematicPin |
| Default   | - | "Default" | 常に存在 |

## 使用例

### 品質に応じた密度調整
```
// 品質レベルに応じて異なる密度のポイントを生成
Input: ポイントデータ

設定:
bUseLowPin = true
bUseHighPin = true

Low出力 → Density Filter (0.3) → 低密度メッシュスポーン
Default → Density Filter (0.5) → 中密度メッシュスポーン
High出力 → Density Filter (1.0) → 高密度メッシュスポーン

結果:
- pcg.Quality = 0 → 低密度
- pcg.Quality = 1 → 中密度（Defaultに）
- pcg.Quality = 2 → 高密度
```

### 品質に応じたメッシュ詳細度
```
// 品質レベルに応じて異なるLODのメッシュを配置
設定:
bUseLowPin = true
bUseMediumPin = true
bUseHighPin = true

Low出力 → Static Mesh Spawner (SimpleMesh)
Medium出力 → Static Mesh Spawner (MediumMesh)
High出力 → Static Mesh Spawner (DetailedMesh)
Default → 何も配置しない

結果: 品質レベルに応じて適切なメッシュが配置される
```

### すべての品質レベルを使用
```
設定:
bUseLowPin = true
bUseMediumPin = true
bUseHighPin = true
bUseEpicPin = true
bUseCinematicPin = true

各出力に異なる処理パイプラインを接続することで、
きめ細かい品質コントロールが可能
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGControlFlowSettings`（`UPCGSettings`の派生）
- **Element**: `FPCGQualityBranchElement`（`IPCGElement`を継承）

### 主要メソッド

#### ExecuteInternal
```cpp
bool ExecuteInternal(FPCGContext* Context) const
{
    // 1. 現在の品質レベルを取得
    const int32 QualityLevel = UPCGSubsystem::GetPCGQualityLevel();

    // 2. 有効なピンを収集し、アクティブなピンを決定
    // 各品質レベル（0-4）について、対応するピンが有効かチェック

    // 3. PCGGather::GatherDataForPin()を使用してデータを収集
    // 入力データをアクティブなピンに転送

    // 4. InactiveOutputPinBitmaskを設定
    // 使用されない出力ピンを示すビットマスクを生成
}
```

#### IsPinUsedByNodeExecution
```cpp
bool IsPinUsedByNodeExecution(const UPCGPin* InPin) const
{
    // ノードが無効化されている場合、Defaultピンのみが使用される
    if (!bEnabled)
        return PinLabel == "Default";

    // 現在の品質レベルに対応するピンが有効化されている場合、
    // そのピンが使用される。そうでなければDefaultピンが使用される
}
```

#### GetDependenciesCrc
品質レベルの変更を検出するため、CRCに品質レベルを含めます：
```cpp
void GetDependenciesCrc(..., FPCGCrc& OutCrc) const
{
    Crc.Combine(UPCGSubsystem::GetPCGQualityLevel());
}
```

### 出力ピンの構成
- **Dynamic Pins**: `HasDynamicPins()` が `true`
- **Deactivatable**: `OutputPinsCanBeDeactivated()` が `true`
- **Default Pin**: 常に存在し、すべての未使用の品質レベルがここに集約される
- **Quality Pins**: 対応するbUse*Pinがtrueの場合のみ作成

### ピンのツールチップ
- **Default**: "All unusued quality pins funnel through this default pin."
- **Low**: "Active if pcg.Quality setting is set to 0."
- **Medium**: "Active if pcg.Quality setting is set to 1."
- **High**: "Active if pcg.Quality setting is set to 2."
- **Epic**: "Active if pcg.Quality setting is set to 3."
- **Cinematic**: "Active if pcg.Quality setting is set to 4."

## パフォーマンス考慮事項

### 利点
1. **条件付き実行**: 使用されない品質レベルの処理は実行されません
2. **ピン無効化**: InactiveOutputPinBitmaskにより、未使用のピンの下流ノードがスキップされます
3. **シンプルなロジック**: 直接的なスイッチロジックで低オーバーヘッド

### 注意事項
1. **品質レベル変更時の再生成**: 品質レベルが変更されるとCRCが変わり、完全な再生成が発生します
2. **ランタイム専用**: ランタイム生成でのみ有効。エディタでの生成では警告が表示されます
3. **動的ピン**: ピン構成を変更すると、ノードの再構築が必要になる場合があります

## 注意事項

1. **ランタイム生成が必要**: このノードはランタイム生成（`GenerationTrigger = Generate At Runtime`）でのみ意味を持ちます。それ以外で使用すると警告が表示されます
2. **品質レベルの範囲**: `pcg.Quality`は0-4の範囲内である必要があります。範囲外の値はDefaultピンにルーティングされます
3. **ノードタイトル**: ノードタイトルには現在の品質レベルに対応するピンラベルが表示されます
4. **CRC依存**: 品質レベルが変更されると、ノードのCRCが変わり、再実行がトリガーされます
5. **入力ピン**: 常にデフォルト入力ピン1つのみを持ちます（複数の入力ピンはありません）

## 関連ノード
- **Runtime Quality Select**: 複数の入力ピンから品質レベルに基づいて選択
- **Select (Multi) - Branch**: 整数/文字列/列挙型に基づく分岐（Branch形式）
- **Select (Multi) - Multi Select**: 整数/文字列/列挙型に基づく選択
- **Branch（条件分岐）**: ブール値に基づく分岐
- **Boolean Select**: ブール値に基づく入力選択

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGQualityBranch.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/ControlFlow/PCGQualityBranch.cpp`
