# Attribute Noise

## 概要
Attribute Noiseノードは、属性またはプロパティにノイズを適用します。数値型とベクトル/ローテーター型をサポートし、ノイズの適用モードと範囲を選択できます。Density Noiseとして使用することもできます。

## 機能詳細
このノードは数値属性にランダムなノイズ値を適用し、値のバリエーションや自然なランダム性を追加します。密度、位置、スケールなどの属性に使用されます。

### 主な機能
- **ノイズ適用**: 指定された範囲のランダムな値を生成
- **複数の適用モード**: Set、Minimum、Maximum、Add、Multiplyから選択
- **ソース反転**: ノイズ適用前に元の値を反転（1 - 値）
- **結果のクランプ**: 0-1の範囲にクランプ可能
- **カスタムシード**: 属性からシード値を取得可能

### 処理フロー
1. 入力属性から値を取得
2. オプションで値を反転（bInvertSource）
3. ノイズ範囲[NoiseMin, NoiseMax]からランダム値を生成
4. 指定されたモードでノイズを適用
5. オプションで結果をクランプ
6. 出力属性に書き込み

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: ノイズを適用する入力属性またはプロパティを選択

### OutputTarget
- **型**: FPCGAttributePropertyOutputSelector
- **PCG_Overridable**: あり
- **説明**: ノイズ適用後の値を書き込む出力属性を指定

### Mode
- **型**: EPCGAttributeNoiseMode（列挙型）
- **デフォルト値**: Set
- **PCG_Overridable**: あり
- **説明**: ノイズの適用方法を指定
- **選択肢**:
  - `Set`: 属性 = ノイズ（元の値を置き換え）
  - `Minimum`: 属性 = Min(元の値, ノイズ)
  - `Maximum`: 属性 = Max(元の値, ノイズ)
  - `Add`: 属性 = 元の値 + ノイズ
  - `Multiply`: 属性 = 元の値 * ノイズ

### NoiseMin
- **型**: float
- **デフォルト値**: 0.0
- **PCG_Overridable**: あり
- **説明**: ノイズの最小値

### NoiseMax
- **型**: float
- **デフォルト値**: 1.0
- **PCG_Overridable**: あり
- **説明**: ノイズの最大値

### bInvertSource
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 有効にすると、ノイズ適用前に元の値を反転します（属性 = 1 - 属性）

### bClampResult
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 有効にすると、結果を0-1の範囲にクランプします
- **特記**: 密度属性に適用する場合は常に有効になります

### bHasCustomSeedSource
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: カスタムシードソースを使用するかどうか

### CustomSeedSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `bHasCustomSeedSource == true`
- **説明**: ノイズ生成に使用するシード値の属性を指定

## 使用例

### 密度へのノイズ適用
```
// 密度を0.5-1.0の範囲でランダム化
InputSource: Density
OutputTarget: Density
Mode: Set
NoiseMin: 0.5
NoiseMax: 1.0
bClampResult: true
結果: 各ポイントの密度が0.5-1.0の範囲のランダム値になる
```

### スケールのランダム化（乗算）
```
// スケールに0.8-1.2の乗数を適用
InputSource: Scale
OutputTarget: Scale
Mode: Multiply
NoiseMin: 0.8
NoiseMax: 1.2
結果: 元のスケールに80%-120%の変動が加わる
```

### 高さの変動追加
```
// 高さに-5から+5の変動を追加
InputSource: Height
OutputTarget: Height
Mode: Add
NoiseMin: -5.0
NoiseMax: 5.0
結果: 元の高さに-5から+5の範囲のノイズが加算される
```

### 密度の反転とノイズ適用
```
// 密度を反転してからノイズを適用
InputSource: Density
OutputTarget: Density
Mode: Set
NoiseMin: 0.3
NoiseMax: 0.7
bInvertSource: true
bClampResult: true
結果: (1 - Density)を計算した後、0.3-0.7のノイズを設定
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `IPCGElementWithCustomContext<FPCGAttributeNoiseContext>`

### カスタムコンテキスト
`FPCGAttributeNoiseContext`を使用して実行状態を管理:
- 現在の入力インデックス
- データ準備状態
- 属性アクセサとキー

### 特徴
- **Preconfigured Settings**: Density NoiseとAttribute Noiseの2つのプリセットを提供
- **GroupPreconfiguredSettings**: `false` - プリセットをグループ化しない
- **シード使用**: `UseSeed()` が `true` - ランダム性にシードを使用
- **動的ピン**: `HasDynamicPins()` が `true` - ピンプロパティが動的に変更
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### サポートされる型
- すべての数値型（int32, int64, float, double）
- ベクトル型（Vector2, Vector, Vector4）
- ローテーター型（Rotator, Quaternion）

### ノイズ生成
- PCGのシードシステムを使用してランダム値を生成
- カスタムシードソースが指定されている場合、その属性値をシードとして使用
- ベクトルやローテーターの場合、各成分に個別のノイズを適用

## 注意事項

1. **密度への適用**: 密度属性に適用する場合、bClampResultは自動的に有効になります
2. **ベクトルへのノイズ**: ベクトル型の場合、各成分に同じノイズ範囲が個別に適用されます
3. **乗算モードの注意**: Multiplyモードで0を含む範囲を使用すると、値が0になる可能性があります
4. **シードの一貫性**: 同じシードと設定では常に同じノイズパターンが生成されます
5. **パフォーマンス**: 大量のポイントに適用する場合、カスタムコンテキストで効率的に処理されます

## 関連ノード
- **Spatial Noise**: 空間的なノイズパターンを生成
- **Attribute Maths Op**: 数学演算
- **Attribute Remap**: 値の範囲変換
- **Mutate Seed**: シード値の変更

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGAttributeNoise.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGAttributeNoise.cpp`
