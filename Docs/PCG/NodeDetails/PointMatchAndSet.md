# Point Match And Set

## 概要
Point Match And Setノードは、ポイントデータに対して「Match and Set」操作を適用します。ポイントが指定されたMatch & Setオブジェクトの条件と一致する場合、ポイントに値を設定します。

## 機能詳細
このノードはMatch & Setシステムを使用して、ポイントの属性やプロパティを条件に基づいて設定します。カスタマイズ可能なMatch & Setタイプをサポートします。

### 主な機能
- **条件付き設定**: ポイントが条件に一致する場合のみ値を設定
- **カスタマイズ可能**: 様々なMatch & Setタイプを使用可能
- **柔軟な出力**: 属性またはプロパティを設定可能

### 処理フロー
1. ポイントデータを入力
2. Match & Setオブジェクトの条件に基づいてポイントをチェック
3. 一致するポイントに指定された値を設定
4. 更新されたポイントデータを出力

## プロパティ

### MatchAndSetType
- **型**: TSubclassOf<UPCGMatchAndSetBase>
- **NoClear**: クリア不可
- **説明**: 使用するMatch & Setオブジェクトの型を定義
- **設定**: Blueprintで定義されたカスタムMatch & Setクラスを選択可能

### MatchAndSetInstance
- **型**: UPCGMatchAndSetBase*（インスタンス化）
- **VisibleAnywhere**: 読み取り専用
- **説明**: MatchAndSetTypeのインスタンス。この設定で使用されるデータを格納

### SetTarget
- **型**: FPCGAttributePropertyOutputSelector
- **PCG_Overridable**: あり
- **説明**: Match & Setの「Set」部分 - 操作で変更される対象を定義
- **選択肢**: 属性またはプロパティ

### SetTargetType
- **型**: EPCGMetadataTypes（列挙型）
- **デフォルト値**: Double
- **表示条件**: `SetTarget.Selection == Attribute`
- **説明**: 「Set」部分が属性の場合、型を指定する必要があります

## 使用例

### 条件に基づく密度の設定
```
// 特定の条件を満たすポイントの密度を設定
MatchAndSetType: CustomDensityMatcher（Blueprint）
SetTarget: Density
SetTargetType: Double
結果: 条件に一致するポイントのみ密度が設定される
```

### タイプに基づく属性の設定
```
// ポイントのタイプに基づいてカラーを設定
MatchAndSetType: TypeColorMatcher（Blueprint）
SetTarget: Color
SetTargetType: Vector
結果: 各タイプに対応するカラーが設定される
```

### カスタムマッチング
```
// カスタムロジックでポイントをマッチング
MatchAndSetType: CustomMatcher（Blueprint）
SetTarget: Category
SetTargetType: Integer32
結果: カスタムロジックに基づいてカテゴリが設定される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGPointMatchAndSetElement`（`IPCGElement`を継承）

### 特徴
- **シード使用**: `UseSeed()` - Match & Setのタイプによって異なる
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **動的ピン**: 入力/出力ピンのプロパティはMatch & Setインスタンスによって決定される

### Match & Set システム
Match & Setシステムは2つの部分から構成されます:
1. **Match部分**: ポイントが条件に一致するかを判定
2. **Set部分**: 一致したポイントに値を設定

### カスタムMatch & Set
UPCGMatchAndSetBaseを継承してカスタムMatch & Setクラスを作成可能:
- Blueprintで実装可能
- C++でも実装可能
- カスタムロジックとデータを定義可能

### インスタンスの更新
`SetMatchAndSetType()`を呼び出すことで、プログラムからMatch & Setタイプを変更可能

## 注意事項

1. **Match & Setタイプ**: 有効なMatch & Setタイプを選択する必要があります
2. **属性の型**: SetTargetが属性の場合、適切な型を指定してください
3. **カスタム実装**: カスタムMatch & Setを実装する場合、UPCGMatchAndSetBaseを継承してください
4. **パフォーマンス**: 複雑なマッチングロジックはパフォーマンスに影響する可能性があります
5. **シード**: Match & Setタイプによってはシードを使用します

## 関連ノード
- **Match And Set Attributes**: 属性セットを使用したマッチングと設定
- **Attribute Select**: 条件に基づいた属性の選択
- **Filter Data By Attribute**: 属性によるフィルタリング
- **Copy Attributes**: 属性のコピー

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGPointMatchAndSet.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGPointMatchAndSet.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/PCGSettings.h`
