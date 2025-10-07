# Density Filter

## 概要

Density Filterノードは、ポイントの密度(Density)値に基づいてポイントをフィルタリングするノードです。指定された範囲内の密度を持つポイントのみを通過させるか、逆にその範囲外のポイントのみを通過させることができます。

**ノードタイプ**: Filter
**クラス**: `UPCGDensityFilterSettings`
**エレメント**: `FPCGDensityFilterElement`

## 機能詳細

このノードは以下の処理を行います:

1. 入力ポイントデータの各ポイントの密度値を確認
2. 密度値が指定された範囲内(LowerBound ≤ Density ≤ UpperBound)にあるかチェック
3. 条件を満たすポイントのみを出力ポイントデータに含める
4. `bInvertFilter`がtrueの場合、条件を反転（範囲外のポイントを出力）

密度フィルタリングは、ポイント密度に基づいた選択的な配置や、密度によるポイントの分類に使用されます。

## プロパティ

### LowerBound (float)
密度フィルタの下限値を指定します。
- **型**: `float`
- **デフォルト値**: `0.5`
- **範囲**: `0.0 ~ 1.0` (ClampMin/Max)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **説明**: この値以上の密度を持つポイントが選択されます

### UpperBound (float)
密度フィルタの上限値を指定します。
- **型**: `float`
- **デフォルト値**: `1.0`
- **範囲**: `0.0 ~ 1.0` (ClampMin/Max)
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **説明**: この値以下の密度を持つポイントが選択されます

### bInvertFilter (bool)
フィルタ条件を反転します。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings
- **オーバーライド可能**: はい
- **説明**:
  - `false`: LowerBound ≤ Density ≤ UpperBoundのポイントを通過
  - `true`: 範囲外のポイント(Density < LowerBound または Density > UpperBound)を通過

### bKeepZeroDensityPoints (bool) [エディタ専用]
フィルタで除外されたポイントを密度0で保持します。
- **型**: `bool`
- **デフォルト値**: `false`
- **カテゴリ**: Settings|Debug
- **オーバーライド可能**: はい
- **エディタ専用**: はい
- **説明**: デバッグ用。除外されたポイントを密度0として出力に含めます

## 使用例

### 例1: 高密度ポイントのみを選択
```
Density Filter:
  LowerBound = 0.7
  UpperBound = 1.0
  bInvertFilter = false

結果: 密度が0.7以上のポイントのみが出力される
```

### 例2: 中程度の密度を除外
```
Density Filter:
  LowerBound = 0.3
  UpperBound = 0.7
  bInvertFilter = true

結果: 密度が0.3未満または0.7より大きいポイントが出力される
```

### 例3: 完全密度のポイントのみ
```
Density Filter:
  LowerBound = 1.0
  UpperBound = 1.0
  bInvertFilter = false

結果: 密度が正確に1.0のポイントのみが出力される
```

### 例4: デバッグモード（エディタのみ）
```
Density Filter:
  LowerBound = 0.5
  UpperBound = 1.0
  bInvertFilter = false
  bKeepZeroDensityPoints = true

結果:
  - 密度0.5以上のポイント: 元の密度で出力
  - 密度0.5未満のポイント: 密度0で出力
```

## 実装の詳細

### 入力ピン

| ピン名 | 型 | 説明 |
|--------|------|------|
| In | Point | ポイントデータの入力 |

### 出力ピン

| ピン名 | 型 | 説明 |
|--------|------|------|
| Out | Point | フィルタリングされたポイントデータ |

### ExecuteInternal の処理フロー

```cpp
1. 設定値を取得:
   - LowerBound, UpperBound, bInvertFilter, bKeepZeroDensityPoints

2. 実際の範囲を計算:
   MinBound = min(LowerBound, UpperBound)
   MaxBound = max(LowerBound, UpperBound)

3. 自明なケースを検出:
   a. bNoResults: すべてのポイントが除外される場合
      - (MaxBound <= 0.0 && !bInvertFilter)
      - (MinBound == 0.0 && MaxBound >= 1.0 && bInvertFilter)

   b. bTrivialFilter: すべてのポイントが通過する場合
      - (MinBound <= 0.0 && MaxBound >= 1.0 && !bInvertFilter)
      - (MinBound == 0.0 && MaxBound == 0.0 && bInvertFilter)

4. 各入力について:
   a. 空間データであることを確認
   b. 自明なフィルタの場合はスキップ
   c. ToBasePointData()でポイントデータに変換
   d. フィルタリング済みポイントデータを作成
   e. 並列処理でフィルタリングを実行
   f. 結果を出力

5. 処理完了
```

### フィルタリングロジック

```cpp
for each point in OriginalData:
    ReadDensity = point.Density
    bInRange = (ReadDensity >= MinBound && ReadDensity <= MaxBound)

    if (bInRange != bInvertFilter):
        // ポイントを出力に含める
        WritePoint(point)
        NumWritten++
    #if WITH_EDITOR
    else if (bKeepZeroDensityPoints):
        // デバッグ: 密度0で出力に含める
        WritePoint(point with Density = 0)
        NumWritten++
    #endif

FilteredData.SetNumPoints(NumWritten)
```

### 最適化処理

#### 自明なケースの検出

```cpp
const bool bNoResults =
    (MaxBound <= 0.0f && !bInvertFilter) ||  // 範囲が0以下で通常フィルタ
    (MinBound == 0.0f && MaxBound >= 1.0f && bInvertFilter);  // 全範囲で反転フィルタ

const bool bTrivialFilter =
    (MinBound <= 0.0f && MaxBound >= 1.0f && !bInvertFilter) ||  // 全範囲で通常フィルタ
    (MinBound == 0.0f && MaxBound == 0.0f && bInvertFilter);  // 範囲0で反転フィルタ

if (bNoResults && !bKeepZeroDensityPoints)
{
    // すべて除外される場合は処理をスキップ
    return true;
}

if (bTrivialFilter)
{
    // すべて通過する場合は入力をそのまま出力
    continue;
}
```

### 並列処理

```cpp
FPCGAsync::AsyncProcessingRangeEx(
    AsyncState,
    OriginalData->GetNumPoints(),
    InitializeFunc,          // データの初期化
    AsyncProcessRangeFunc,   // 範囲ごとの処理
    MoveDataRangeFunc,       // データの移動
    FinishedFunc,            // 完了時の処理
    /*bEnableTimeSlicing=*/false
);
```

#### 初期化関数
```cpp
InitializeFunc = [FilteredData, OriginalData]()
{
    FilteredData->SetNumPoints(OriginalData->GetNumPoints(), /*bInitializeValues=*/false);
    FilteredData->AllocateProperties(
        OriginalData->GetAllocatedProperties() | EPCGPointNativeProperties::Density
    );
    FilteredData->CopyUnallocatedPropertiesFrom(OriginalData);
};
```

#### 範囲処理関数
```cpp
AsyncProcessRangeFunc = [MinBound, MaxBound, bInvertFilter, bKeepZeroDensityPoints]
    (int32 StartReadIndex, int32 StartWriteIndex, int32 Count) -> int32
{
    const FConstPCGPointValueRanges ReadRanges(OriginalData);
    FPCGPointValueRanges WriteRanges(FilteredData, /*bAllocate=*/false);

    int32 NumWritten = 0;

    for (int32 i = 0; i < Count; ++i)
    {
        int32 ReadIndex = StartReadIndex + i;
        float ReadDensity = ReadRanges.DensityRange[ReadIndex];
        bool bInRange = (ReadDensity >= MinBound && ReadDensity <= MaxBound);

        if (bInRange != bInvertFilter)
        {
            int32 WriteIndex = StartWriteIndex + NumWritten;
            WriteRanges.SetFromValueRanges(WriteIndex, ReadRanges, ReadIndex);
            WriteRanges.DensityRange[WriteIndex] = ReadDensity;
            ++NumWritten;
        }
    }

    return NumWritten;
};
```

### ループモード

```cpp
virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override
{
    return EPCGElementExecutionLoopMode::SinglePrimaryPin;
}
```

各入力ポイントデータを個別に処理します。

### ベースポイントデータのサポート

```cpp
virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override { return true; }
```

UPCGBasePointDataおよびその派生クラス（ポリライン、サーフェスなど）をサポートします。

## パフォーマンス考慮事項

1. **自明なケースの早期検出**:
   - すべて除外/すべて通過のケースを事前に判定して処理をスキップ
   - パフォーマンスの大幅な向上

2. **並列処理**:
   - `FPCGAsync::AsyncProcessingRangeEx`を使用した並列フィルタリング
   - 大量のポイントでも高速に処理

3. **メモリ効率**:
   - 初期は全ポイント分を確保し、フィルタリング後にサイズを調整
   - 無駄なメモリコピーを最小限に抑制

4. **密度プロパティの最適化**:
   - 密度プロパティを明示的に割り当て（`EPCGPointNativeProperties::Density`）
   - 密度アクセスの高速化

## 使用上の注意

1. **範囲の順序**:
   - LowerBoundとUpperBoundの大小関係は自動的に調整されます
   - LowerBound > UpperBoundの場合、内部で入れ替えられます

2. **境界値の扱い**:
   - 境界値は包含的（inclusive）です
   - Density == LowerBoundまたはDensity == UpperBoundのポイントは含まれます

3. **デバッグモード**:
   - `bKeepZeroDensityPoints`はエディタビルドでのみ有効
   - パッケージビルドでは常にfalseとして扱われます

4. **空間データの変換**:
   - 入力が空間データの場合、自動的にポイントデータに変換されます
   - 変換後の空間属性は継承されません（`bInheritSpatialData = false`）

## 典型的なワークフロー

### 例1: 密度に基づく段階的配置
```
Surface Sampler -> Density Filter (0.7-1.0) -> 高密度オブジェクト配置
                -> Density Filter (0.3-0.7) -> 中密度オブジェクト配置
                -> Density Filter (0.0-0.3) -> 低密度オブジェクト配置
```

### 例2: 密度によるバリエーション
```
Points -> Density Filter (>0.8) -> 大きなメッシュ
       -> Density Filter (0.4-0.8) -> 中サイズメッシュ
       -> Density Filter (<0.4) -> 小さなメッシュ
```

### 例3: スパース化
```
Points -> Density Filter (0.5-1.0, Inverted) -> 密度の低いポイントのみ
```

## 関連ノード

- **Density Remap**: 密度値のリマッピング
- **Attribute Filter**: 任意の属性によるフィルタリング
- **Self Pruning**: 距離に基づくポイントの間引き
- **Random Choice**: ランダムなポイント選択

## トラブルシューティング

| 問題 | 原因 | 解決策 |
|------|------|--------|
| すべてのポイントが除外される | 範囲設定が不適切 | LowerBound/UpperBoundを確認 |
| 期待と逆の結果 | bInvertFilterの設定ミス | bInvertFilterの値を確認 |
| ポイント数が変わらない | 自明なフィルタが適用されている | ログを確認し、範囲設定を調整 |
| デバッグモードが効かない | パッケージビルドで実行 | エディタビルドで実行 |
