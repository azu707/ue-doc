# Select (Multi) - Switch

## 概要
Select (Multi) - Switchは、`Select (Multi)`ノードの概念的なバリエーションで、プログラミングのSwitch-Case文のような動作を提供します。実装上は`UPCGMultiSelectSettings`と同じノードですが、Switch文スタイルの使い方を強調しています。

## 注記
このドキュメントは概念的な参照用です。完全な技術詳細については、以下のメインドキュメントを参照してください：

**メインドキュメント**: [Select_MultiSelect.md](Select_MultiSelect.md)

## 概念的な用途
「Switch」という名前は、プログラミングにおけるSwitch-Case文の概念を反映しています。整数値や列挙型の値に基づいて、複数のケースから1つを選択する動作を提供します。

### 典型的な使用シナリオ
- **整数値によるケース分岐**: LODレベル、難易度レベル、フェーズ番号などに応じた処理
- **列挙型によるケース分岐**: 状態、タイプ、カテゴリなどに応じた処理
- **文字列によるケース分岐**: 名前、IDなどに基づく処理

## 主な特徴
- **3つの選択モード**: Integer（数値ケース）、String（文字列ケース）、Enum（列挙型ケース）
- **動的なケースピン**: 定義されたケースに応じて入力ピンが自動生成
- **デフォルトケース**: どのケースにも該当しない場合のフォールバック（switch文のdefaultに相当）
- **オーバーライド可能**: ケース選択値を他のノードから動的に設定可能

## Switch文との対応

### プログラミングのSwitch文
```cpp
switch (value)
{
    case 0:
        // 処理A
        break;
    case 1:
        // 処理B
        break;
    case 2:
        // 処理C
        break;
    default:
        // デフォルト処理
        break;
}
```

### PCGでの対応
```
SelectionMode: Integer
IntOptions: {0, 1, 2}
IntegerSelection: 1

入力ピン:
"0" ← 処理A用のデータ
"1" ← 処理B用のデータ
"2" ← 処理C用のデータ
"Default" ← デフォルト処理用のデータ

結果: IntegerSelection = 1 なので、処理Bが実行される
```

## 使用例

### 整数値によるSwitch（LODレベル）
```
SelectionMode: Integer
IntOptions: {0, 1, 2, 3}
IntegerSelection: 2

入力:
"0" ← Get Primitive Data (LOD0_DetailedMeshes)
"1" ← Get Primitive Data (LOD1_MediumMeshes)
"2" ← Get Primitive Data (LOD2_SimpleMeshes)
"3" ← Get Primitive Data (LOD3_BasicMeshes)
"Default" ← Get Primitive Data (FallbackMeshes)

Output → Static Mesh Spawner

結果: LODレベル2の簡易メッシュが使用される
```

### 列挙型によるSwitch（天候タイプ）
```
SelectionMode: Enum
EnumSelection.Class: EWeatherType
EnumSelection.Value: Rainy

入力:
"Sunny" ← 晴天用のメッシュとエフェクト
"Cloudy" ← 曇天用のメッシュとエフェクト
"Rainy" ← 雨天用のメッシュとエフェクト
"Snowy" ← 雪天用のメッシュとエフェクト
"Default" ← デフォルトの環境

結果: Rainy（雨天）に対応する処理が実行される
```

### 文字列によるSwitch（バイオームID）
```
SelectionMode: String
StringOptions: {"Forest", "Desert", "Arctic", "Jungle"}
StringSelection: "Desert"

入力:
"Forest" ← 森林バイオームのアセット
"Desert" ← 砂漠バイオームのアセット
"Arctic" ← 極地バイオームのアセット
"Jungle" ← ジャングルバイオームのアセット
"Default" ← 汎用バイオームのアセット

結果: Desert（砂漠）バイオームのアセットが選択される
```

## Switch、Branch、Selectの概念的な違い

| 概念 | プログラミングでの対応 | 主な用途 | 実装 |
|------|---------------------|---------|------|
| Switch | switch-case文 | 値によるケース分岐 | UPCGMultiSelectSettings |
| Branch | if-else if-else文 | 条件による分岐 | 同上 |
| Select | 三項演算子 | データソース選択 | 同上 |

実装は同じですが、概念的な使い方が異なります：
- **Switch**: ケース値に基づく明確な分岐（整数、列挙型に適している）
- **Branch**: 条件に基づく分岐（より一般的）
- **Select**: データソースの選択（入力の切り替え）

## Switch文のベストプラクティス

### ケースの網羅性
- すべての可能な値をケース（IntOptions、StringOptions）として定義
- 予期しない値に対応するため、必ずDefault入力を接続

### 列挙型の使用
- 型安全性が必要な場合、Enum modeを推奨
- 列挙型を使用すると、有効な値の範囲が明確になる

### ケース数の最適化
- ケース数が2つの場合、Boolean Selectの方がシンプル
- ケース数が多い場合（10以上）、他のアプローチ（Attribute-based filtering）を検討

## 注意事項

1. **Fall-through無し**: プログラミングのSwitch文と異なり、PCGでは複数のケースを同時に実行することはできません（1つの入力のみが選択されます）
2. **Break不要**: 各ケースは独立しており、明示的なBreakは不要です
3. **Default必須**: Default入力を接続しないと、無効な値の場合にエラーとなる可能性があります
4. **実行時の値変更**: IntegerSelection等をオーバーライドすることで、実行時にケースを動的に変更できます

## 関連ドキュメント
- **[Select_MultiSelect.md](Select_MultiSelect.md)**: 完全な技術ドキュメント
- **[Select_Branch.md](Select_Branch.md)**: Branch（分岐）スタイルの概念的な参照
- **[Select_BooleanSelect.md](Select_BooleanSelect.md)**: ブール値による2つのケースからの選択
- **[RuntimeQualityBranch.md](RuntimeQualityBranch.md)**: 品質レベルに基づくSwitch的な動作

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/ControlFlow/PCGMultiSelect.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/ControlFlow/PCGMultiSelect.cpp`
