# Merge Attributes

## 概要
Merge Attributesノードは、複数の属性セットを単一の属性セットにマージします。複数の入力ピンを持ち、すべての属性を統合した結果を出力します。

## 機能詳細
このノードは複数のソースから属性セットを受け取り、それらをすべて含む単一の属性セットを作成します。同名の属性がある場合、後の入力で上書きされます。

### 主な機能
- **複数入力**: 動的に入力ピンを追加可能
- **属性の統合**: すべての入力の属性を単一のセットに統合
- **エントリの結合**: 各入力のエントリがマージされた出力に追加

### 処理フロー
1. すべての入力ピンから属性セットを取得
2. すべての属性をマージ（同名の属性は後の入力で上書き）
3. すべてのエントリを結合
4. マージされた属性セットを出力

## プロパティ

このノードには設定可能なプロパティはありません。入力ピンの数のみを制御します。

### 動的入力ピン
- **ベースラベル**: 自動的に生成される動的ピンラベル
- **追加**: エディタで動的に入力ピンを追加可能
- **削除**: 不要な入力ピンを削除可能

## 使用例

### 複数のソースから属性セットを統合
```
// 3つの異なるソースから属性セットをマージ
入力1: Trees属性セット（Species, Height, Diameter）
入力2: Rocks属性セット（Type, Size, Color）
入力3: Grass属性セット（Variety, Density）

結果: すべての属性を含む単一の属性セット
  - Species, Height, Diameter (from Trees)
  - Type, Size, Color (from Rocks)
  - Variety, Density (from Grass)
```

### 属性の上書き
```
// 後の入力で前の入力の属性を上書き
入力1: BaseAttributes（Color=Green, Scale=1.0）
入力2: OverrideAttributes（Color=Red）

結果: マージされた属性セット
  - Color=Red (上書きされた)
  - Scale=1.0 (保持)
```

### 段階的な属性の追加
```
// 段階的に属性を追加してライブラリを構築
入力1: BasicProperties
入力2: VisualProperties
入力3: PhysicsProperties
入力4: GameplayProperties

結果: 完全な属性ライブラリ
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettingsWithDynamicInputs`
- **Element**: `FPCGMergeAttributesElement`（`IPCGElement`を継承）

### 特徴
- **動的入力ピン**: エディタで入力ピンを動的に追加・削除可能
- **単一出力**: マージされた属性セットを1つの出力ピンから出力

### マージの動作
1. **属性の追加**: 新しい属性は追加される
2. **属性の上書き**: 同名の属性は後の入力で上書きされる
3. **エントリの結合**: すべての入力のエントリが出力に含まれる
4. **順序の影響**: 入力の順序が重要（後のものが優先）

### 属性セットの構造
マージ後の属性セットは:
- すべての一意の属性を含む
- 各入力からのすべてのエントリを含む
- 属性値はエントリごとに異なる可能性がある

## 注意事項

1. **同名の属性**: 同じ名前の属性がある場合、最後の入力の定義が使用されます
2. **型の一致**: 同名の属性の型は一致している必要があります
3. **入力順序**: マージの順序が重要です（後の入力が優先）
4. **エントリ数**: 出力のエントリ数は、すべての入力のエントリ数の合計です
5. **パフォーマンス**: 多数の入力やエントリがある場合、パフォーマンスに影響する可能性があります

## 関連ノード
- **Copy Attributes**: 属性のコピー（特定の属性のみ）
- **Match And Set Attributes**: 属性のマッチングとコピー
- **Delete Attributes**: 属性の削除
- **Data Table Row To Attribute Set**: データテーブルから属性セットを作成

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGMergeAttributes.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGMergeAttributes.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/PCGSettingsWithDynamicInputs.h`
