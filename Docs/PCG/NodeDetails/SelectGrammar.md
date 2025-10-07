# Select Grammar ノード

## 概要

Select Grammarノードは、入力アトリビュートの値と提供された条件セットを順次比較し、条件に一致するグラマー（文字列）を選択してポイントデータに出力します。グラマーベースのプロシージャル生成システムで、サイズや他のアトリビュートに基づいてグラマールールを動的に選択する際に使用されます。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Grammar/PCGSelectGrammar.h`
**カテゴリ**: Generic (汎用)

## 機能詳細

1. **条件付き選択**: 複数の条件を順次評価してグラマーを選択
2. **柔軟な比較**: <、<=、==、>=、>、範囲条件をサポート
3. **アトリビュート入力**: 比較値をポイントアトリビュートから取得
4. **条件セット入力**: 条件をパラメータデータとして外部から提供可能
5. **デフォルト処理**: 条件に一致しない場合のキー値コピー機能

## プロパティ

### UPCGSelectGrammarSettings

#### キー設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bKeyAsAttribute** | bool | true | キーをアトリビュートから取得するか |
| **Key** | FName | - | 固定のキー値 |
| **KeyAttribute** | FPCGAttributePropertyInputSelector | - | キーのアトリビュートセレクタ |

#### 比較設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **ComparedValueAttribute** | FPCGAttributePropertyInputSelector | $ScaledLocalSize.X | 比較対象のアトリビュート |

#### 条件設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bCriteriaAsInput** | bool | false | 条件を入力ピンから取得 |
| **Criteria** | TArray\<FPCGSelectGrammarCriterion\> | [] | 評価する条件のリスト |

#### 出力設定

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **OutputGrammarAttribute** | FPCGAttributePropertyOutputSelector | "Grammar" | 出力アトリビュート名 |
| **bCopyKeyForUnselectedGrammar** | bool | false | 未選択時にキー値をコピー |

#### 条件アトリビュート名のリマップ

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **bRemapCriteriaAttributeNames** | bool | false | 条件アトリビュート名をリマップ |
| **CriteriaAttributeNames** | FPCGSelectGrammarCriteriaAttributeNames | - | リマップされたアトリビュート名 |

### FPCGSelectGrammarCriterion 構造体

| フィールド名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **Key** | FName | - | このグラマーに対応するキー |
| **Comparator** | EPCGSelectGrammarComparator | LessThan | 比較演算子 |
| **FirstValue** | double | 0.0 | 第一比較値 |
| **SecondValue** | double | 0.0 | 第二比較値（範囲条件用） |
| **Grammar** | FString | "" | 選択されるグラマー文字列 |

### EPCGSelectGrammarComparator 列挙型

| 値 | 記号 | 説明 |
|----|------|------|
| **Select** | - | 常に選択（無条件） |
| **LessThan** | < | A < B |
| **LessThanEqualTo** | <= | A <= B |
| **EqualTo** | == | A == B |
| **GreaterThanEqualTo** | >= | A >= B |
| **GreaterThan** | > | A > B |
| **RangeExclusive** | - | B < A < C（排他的範囲） |
| **RangeInclusive** | - | B <= A <= C（包括的範囲） |

### ピン設定

#### 入力ピン
- **In**: `EPCGDataType::Point` - 評価対象のポイントデータ（必須）
- **Selection Criteria Data**: `EPCGDataType::Param` - 条件データ（bCriteriaAsInput=trueの場合、必須）

#### 出力ピン
- **Out**: `EPCGDataType::Point` - 選択されたグラマーを含むポイントデータ

## 使用例

### サイズに基づくグラマー選択

```
[Point Data with $ScaledLocalSize]
    ↓
[Select Grammar]
Criteria:
- Key: "Small",  < 5.0,   Grammar: "S{F[+L][-L]F}"
- Key: "Medium", < 10.0,  Grammar: "M{FF[++L][--L]FF}"
- Key: "Large",  >= 10.0, Grammar: "L{FFF[+++L][---L]FFF}"
    ↓
[各ポイントのサイズに応じたグラマー出力]
```

### 範囲に基づくグラマー選択

```
[Point Data]
    ↓
[Select Grammar: ComparedValueAttribute=Density]
Criteria:
- Key: "Low",    Range(0.0, 0.3), Grammar: "SimpleRule"
- Key: "Medium", Range(0.3, 0.7), Grammar: "MediumRule"
- Key: "High",   Range(0.7, 1.0), Grammar: "ComplexRule"
    ↓
[密度範囲に基づくグラマー]
```

### 外部条件データの使用

```
[Point Data] ──────┐
                   │
[Criteria Param] ──┤→ [Select Grammar: bCriteriaAsInput=true]
                   │
[Custom Key Data] ─┘
```

## 実装の詳細

### 順次評価ロジック

```cpp
for (const FPCGSelectGrammarCriterion& Criterion : Criteria)
{
    // キーが一致するかチェック
    if (!bKeyAsAttribute || KeyMatches(Point, Criterion.Key))
    {
        // 比較演算子に基づいて条件を評価
        bool bConditionMet = EvaluateComparator(
            ComparedValue,
            Criterion.Comparator,
            Criterion.FirstValue,
            Criterion.SecondValue
        );

        if (bConditionMet)
        {
            // グラマーを選択して評価終了
            OutputGrammar = Criterion.Grammar;
            break;
        }
    }
}
```

### 比較演算子の処理

```cpp
// 2項演算子（Select, <, <=, ==, >=, >）
template <typename T>
bool EvaluateBinary(const T& Value, EPCGSelectGrammarComparator Comparator, const T& Threshold)
{
    switch (Comparator)
    {
    case Select: return true;
    case LessThan: return Value < Threshold;
    case LessThanEqualTo: return Value <= Threshold;
    case EqualTo: return Value == Threshold;
    case GreaterThanEqualTo: return Value >= Threshold;
    case GreaterThan: return Value > Threshold;
    }
}

// 3項演算子（範囲条件）
template <typename T>
bool EvaluateRange(const T& Value, bool bInclusive, const T& Start, const T& End)
{
    if (bInclusive)
        return Start <= Value && Value <= End;
    else
        return Start < Value && Value < End;
}
```

## パフォーマンス考慮事項

### 最適化のポイント

1. **順次評価**: 最初に一致した条件で評価終了
2. **条件の順序**: 頻繁に一致する条件を上位に配置
3. **ベースポイントデータ対応**: 効率的なポイントデータ処理

### パフォーマンスへの影響

- **処理時間**: O(n × m)、n=ポイント数、m=条件数
- **メモリ使用**: 中程度（グラマー文字列の追加）

### ベストプラクティス

1. **条件の最適化**: 最も頻繁に一致する条件を先頭に配置
2. **グラマーの簡潔化**: グラマー文字列を必要最小限に保つ
3. **キーの使用**: 適切なキーでグラマーセットを分類

## 関連ノード

- **Print Grammar**: グラマールールの展開と処理
- **Attribute Select**: アトリビュートに基づく値の選択
- **Branch/Select**: 条件に基づくデータの分岐
- **Parse String**: 文字列の解析

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **順次評価**: 条件は定義順に評価され、最初に一致した条件で停止
2. **未選択時**: 条件に一致しない場合、bCopyKeyForUnselectedGrammar によりキー値がコピーされるか、空のグラマーになります
3. **型の制限**: ComparedValueAttribute は数値型である必要があります
4. **グラマーシステム**: このノードは通常、L-systemやグラマーベースの生成システムの一部として使用されます

## トラブルシューティング

**問題**: グラマーが選択されない
**解決策**: 条件の範囲を確認、ComparedValueAttribute が正しく設定されているか確認

**問題**: 意図しないグラマーが選択される
**解決策**: 条件の順序を確認（最初に一致した条件が使用されます）

**問題**: キーが一致しない
**解決策**: bKeyAsAttribute の設定を確認、キーアトリビュートが存在するか確認

## 実用例

### 植生のバリエーション

```
[Point Data: $ScaledLocalSize]
    ↓
[Select Grammar: "TreeGrammar"]
Criteria:
- Small (< 3.0):  "Sapling"
- Medium (< 8.0): "Tree"
- Large (>= 8.0): "OldTree"
    ↓
[Print Grammar] → [植生の生成]
```

### 建物の詳細レベル

```
[Building Points: $Distance]
    ↓
[Select Grammar: "BuildingDetail"]
Criteria:
- Near (< 50):   "HighDetail"
- Mid (< 200):   "MediumDetail"
- Far (>= 200):  "LowDetail"
    ↓
[建物生成]
```
