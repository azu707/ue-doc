# Attribute Set To Point

## 概要
Attribute Set To Pointノードは、アトリビュートセット（Attribute Set）をポイントデータに変換するノードです。入力されたアトリビュートセットの各エントリーを、対応する属性を持つポイントとして出力します。

## 機能詳細
このノードは`UPCGConvertToPointDataSettings`クラスとして実装されており、`UPCGCollapseSettings`を継承しています。基本的な動作として、以下の処理を行います:

- アトリビュートセットの各エントリーをポイントデータに変換
- 各エントリーの属性情報を保持したままポイント化
- 空のアトリビュートセットに対する処理オプション

## プロパティ

### bPassThroughEmptyAttributeSets
- **型**: bool
- **デフォルト値**: false
- **説明**: バージョン5.6以前の互換性のためのフラグです。trueに設定すると、空のアトリビュートセットを変換せずにそのまま通過させます。falseの場合、空のアトリビュートセットも変換処理の対象となります。
- **備考**: このプロパティはDEPRECATED（非推奨）であり、古いバージョンとの互換性のために残されています。

## 使用例

### 基本的な使用方法
1. アトリビュートセットデータを入力ピンに接続
2. ノードを実行すると、各エントリーが個別のポイントとして出力される
3. 出力されたポイントデータは、元のアトリビュートセットの属性を保持

### 一般的な用途
- アトリビュートセットで管理されているデータをポイントベースの処理に移行する場合
- データベースのようなテーブル形式のデータを空間的なポイントとして配置する場合
- 他のポイント処理ノードと組み合わせて使用する前準備として

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGConvertToPointDataSettings : public UPCGCollapseSettings
```

### 入力ピン
- アトリビュートセット（Attribute Set）データを受け付ける専用の入力ピンを持つ

### 出力ピン
- ポイントデータ（Point Data）を出力
- DefaultPointOutputPinPropertiesを使用

### 実行エレメント
`FPCGCollapseElement`を使用して実行されます。このエレメントは:
- `ExecutionLoopMode`: SinglePrimaryPin（単一のプライマリピンで実行）
- `SupportsBasePointDataInputs`: true（ベースポイントデータ入力をサポート）
- `ShouldComputeFullOutputDataCrc`: 条件付きで完全なCRC計算を実行（変更追跡と再実行の最適化のため）

### ノードの特徴
- **ノード名**: AttributeSetToPoint
- **カテゴリ**: Spatial
- **コンパクト表示**: サポート（UIでの省スペース表示が可能）

## 関連ノード
- **To Point**: より一般的な変換ノード。スペイシャルデータをポイントデータに変換
- **Point To Attribute Set**: 逆の変換を行うノード

## 注意事項
- バージョン5.6以降、空のアトリビュートセットは常に変換されるようになりました
- 古いバージョンからアップグレードする際は、`bPassThroughEmptyAttributeSets`の動作に注意が必要です
