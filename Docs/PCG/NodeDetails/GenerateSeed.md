# Generate Seed

## 概要
Generate Seedノードは、ランダムストリーム、定数文字列、またはソース属性からシード値を生成します。決定論的なランダム性を提供し、再現可能な結果を得るために使用されます。

## 機能詳細
このノードは3つの異なる方法でシード値を生成します。生成されたシードは他のノードで使用され、一貫性のあるランダムな結果を生成します。

### 主な機能
- **3つのシード生成方法**: ランダムストリーム、文字列ハッシュ、属性ハッシュ
- **決定論的**: 同じ入力から常に同じシードを生成
- **シードのリセット**: 入力ごとにシードをリセット可能
- **柔軟な出力**: カスタム属性名で出力

### 処理フロー
1. 生成ソースに基づいてシード値を計算
2. 各エントリ/ポイントに対してシードを生成
3. 生成されたシードを出力属性に書き込み

## プロパティ

### GenerationSource
- **型**: EPCGGenerateSeedSource（列挙型）
- **デフォルト値**: RandomStream
- **説明**: シード生成の方法を指定
- **選択肢**:

  **RandomStream（ランダムストリーム）**:
  - ノードのシードを使用してランダムストリームを作成
  - そこから新しいシードを生成
  - 高速だが、重複する入力データ間で同一になる可能性がある

  **HashEachSourceAttribute（各ソース属性をハッシュ）**:
  - ソース属性の各値をハッシュしてシードを決定
  - 重複する入力データでも異なる結果を生成可能
  - 決定論的で再現性が高い

  **HashStringConstant（文字列定数をハッシュ）**:
  - 文字列のハッシュ値と前のシード値を組み合わせてターゲットシードを作成
  - 高速で人間が読みやすい
  - 重複する入力データ間で同一になる可能性がある

### SourceString
- **型**: FString
- **表示条件**: `GenerationSource == HashStringConstant`
- **表示名**: String
- **説明**: ハッシュ化して新しいシードを生成する文字列値

### SeedSource
- **型**: FPCGAttributePropertyInputSelector
- **表示条件**: `GenerationSource == HashEachSourceAttribute`
- **説明**: 新しいシードを生成するためにハッシュ化するソース属性

### bResetSeedPerInput
- **型**: bool
- **デフォルト値**: true
- **PCG_Overridable**: あり
- **表示条件**: `GenerationSource != HashEachSourceAttribute`
- **説明**: 各入力の生成開始時にシードをリセットして順序非依存を維持します

### OutputTarget
- **型**: FPCGAttributePropertyOutputSelector
- **PCG_Overridable**: あり
- **説明**: 生成されたシードの出力先属性

## 使用例

### ランダムストリームからシード生成
```
// ノードのシードから新しいシードを生成
GenerationSource: RandomStream
bResetSeedPerInput: true
OutputTarget: RandomSeed
結果: 各ポイントに異なるランダムシード値が割り当てられる
```

### 文字列からシード生成
```
// 文字列定数からシードを生成
GenerationSource: HashStringConstant
SourceString: "TreeVariation"
OutputTarget: TreeSeed
結果: "TreeVariation"のハッシュに基づくシード値
```

### 属性からシード生成
```
// 既存の属性値からシードを生成
GenerationSource: HashEachSourceAttribute
SeedSource: ObjectID
OutputTarget: UniqueSeed
結果: 各ObjectIDに基づく一意のシード値（同じIDは同じシード）
```

### 座標ベースのシード
```
// 位置座標からシードを生成（グリッドベースの決定論的ランダム性）
GenerationSource: HashEachSourceAttribute
SeedSource: Position
OutputTarget: PositionSeed
結果: 同じ位置のポイントは同じシードを持つ
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGGenerateSeedElement`（`IPCGElement`を継承）

### 特徴
- **シード使用**: `UseSeed()` が `true` - ノード自体がシードを使用
- **動的ピン**: `HasDynamicPins()` が `true`
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`
- **ノードエイリアス**: "Seed From Value"としても検索可能

### シード生成方法の詳細

#### RandomStream
- PCGのランダムストリームを使用
- ノードのシードから初期化
- 順次シード値を生成
- bResetSeedPerInputでリセット可能

#### HashEachSourceAttribute
- 各属性値をハッシュ化
- 前のシード値と組み合わせ
- 決定論的で再現可能
- データの重複に強い

#### HashStringConstant
- 文字列のハッシュ値を計算
- 前のシード値と組み合わせ
- 人間が読みやすいシード定義
- 静的な変動に適している

## 注意事項

1. **順序依存性**: RandomStreamモードはbResetSeedPerInputがfalseの場合、入力順序に依存します
2. **重複データ**: 重複する入力データで異なるシードが必要な場合、HashEachSourceAttributeを使用してください
3. **シードの範囲**: 生成されるシードは32ビット整数の範囲です
4. **決定論性**: 同じ設定と入力では常に同じシードが生成されます
5. **パフォーマンス**: HashEachSourceAttributeは各値をハッシュ化するため、若干遅くなります

## 関連ノード
- **Mutate Seed**: 既存のシード値を変更
- **Hash Attribute**: 属性をハッシュ化
- **Attribute Noise**: シードを使用してノイズを生成
- **Spatial Noise**: シードを使用して空間ノイズを生成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGenerateSeedElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGGenerateSeedElement.cpp`
