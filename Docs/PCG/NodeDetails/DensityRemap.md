# Density Remap

## 概要

**⚠️ 非推奨（Deprecated）**: このノードはバージョン5.5で非推奨となりました。代わりに`UPCGAttributeRemapSettings`（Attribute Remapノード）を使用してください。

Density Remapノードは、ポイントの密度値を指定された範囲から別の範囲にリマップします。入力範囲と出力範囲を設定し、線形補間で密度を変換します。

## 機能詳細

このノードは、各ポイントの密度値を入力範囲から出力範囲にリマップします。密度の調整、正規化、反転などに使用できます。

### 処理フロー

1. **入力ポイントの取得**: ポイントデータを入力から取得
2. **密度のリマップ**: 各ポイントの密度を変換
   - 入力範囲内の値を出力範囲にマッピング
   - 線形補間を使用
3. **範囲外の処理**: オプションで範囲外の値を除外
4. **ポイントの出力**: リマップされた密度を持つポイントを出力

### リマップの計算

基本的な線形補間:
```
OutDensity = ((InDensity - InRangeMin) / (InRangeMax - InRangeMin)) * (OutRangeMax - OutRangeMin) + OutRangeMin
```

特殊ケース（InRangeMin == InRangeMax）:
```
OutDensity = (OutRangeMin + OutRangeMax) / 2
```

## プロパティ

### InRangeMin
- **型**: `float`
- **デフォルト値**: `0.0`
- **範囲**: `0.0 - 1.0`
- **オーバーライド可能**: はい
- **説明**: 入力範囲の最小値
  - この値以下の密度が出力範囲の最小値にマップされる
  - InRangeMin == InRangeMaxの場合、その密度値は出力範囲の平均値にマップされる

### InRangeMax
- **型**: `float`
- **デフォルト値**: `1.0`
- **範囲**: `0.0 - 1.0`
- **オーバーライド可能**: はい
- **説明**: 入力範囲の最大値
  - この値以上の密度が出力範囲の最大値にマップされる
  - InRangeMin == InRangeMaxの場合、その密度値は出力範囲の平均値にマップされる

### OutRangeMin
- **型**: `float`
- **デフォルト値**: `0.0`
- **範囲**: `0.0 - 1.0`
- **オーバーライド可能**: はい
- **説明**: 出力範囲の最小値
  - InRangeMinの密度値がこの値にマップされる

### OutRangeMax
- **型**: `float`
- **デフォルト値**: `1.0`
- **範囲**: `0.0 - 1.0`
- **オーバーライド可能**: はい
- **説明**: 出力範囲の最大値
  - InRangeMaxの密度値がこの値にマップされる

### bExcludeValuesOutsideInputRange
- **型**: `bool`
- **デフォルト値**: `false`
- **オーバーライド可能**: はい
- **説明**: 入力範囲外の値の扱い
  - `false`: 範囲外の値もリマップされる（デフォルト）
  - `true`: 範囲外の密度値は変更されない

## 使用例（参考）

**注意**: このノードは非推奨です。以下は参考情報です。

### 密度の正規化

```
Create Points (様々な密度)
  → Density Remap (InRange=0.2-0.8, OutRange=0-1)
  → (密度を0-1の範囲に正規化)
```

### 密度の反転

```
Create Points
  → Density Remap (InRange=0-1, OutRange=1-0)
  → (密度を反転: 高密度→低密度、低密度→高密度)
```

### 密度の圧縮

```
Create Points
  → Density Remap (InRange=0-1, OutRange=0.4-0.6)
  → (全ての密度を狭い範囲に圧縮)
```

### 閾値処理

```
Create Points
  → Density Remap (InRange=0.5-0.5, OutRange=0-1)
  → (密度0.5を基準に二値化)
```

## 移行ガイド

### Attribute Remapへの移行

`Density Remap`の代わりに`Attribute Remap`ノードを使用してください:

```
旧: Density Remap (InRange=0.2-0.8, OutRange=0-1)

新: Attribute Remap
    - Input Attribute: Density (または $Density)
    - Input Min: 0.2
    - Input Max: 0.8
    - Output Min: 0.0
    - Output Max: 1.0
    - Output Attribute: Density (または $Density)
```

`Attribute Remap`の利点:
- 任意の属性に対応（密度だけでなく）
- より柔軟なリマップオプション
- 最新機能のサポート
- メンテナンスされている

## 実装の詳細

### クラス構成

```cpp
// 設定クラス（非推奨）
class UE_DEPRECATED(5.5, "Superseded by UPCGAttributeRemapSettings")
UPCGDensityRemapSettings : public UPCGSettings

// 実行エレメント
class FPCGDensityRemapElement : public FPCGPointOperationElementBase
```

### 基底クラス

`FPCGPointOperationElementBase`を継承しており、ポイント操作の最適化機能を利用しています。

### ピン構成

**入力ピン**:
- デフォルトのポイント入力ピン

**出力ピン**:
- デフォルトのポイント出力ピン

### ベースポイントデータサポート

- **サポート**: はい (`SupportsBasePointDataInputs = true`)
- AttributeSet、Surface、Volumeなどの暗黙的なポイントデータにも対応

### ポイントのコピー

- `ShouldCopyPoints() = true`
- 入力ポイントをコピーして密度のみを変更

### パフォーマンス考慮事項

- ポイント操作は高速
- 密度値のみを変更するため、オーバーヘッドは最小

## 注意事項

1. **非推奨**: バージョン5.5以降、このノードは非推奨です
2. **移行推奨**: 新しいプロジェクトでは`Attribute Remap`を使用してください
3. **範囲**: 全ての範囲値は0.0-1.0にクランプされます
4. **線形補間**: リマップは線形補間のみをサポート
5. **既存プロジェクト**: 既存のプロジェクトでは動作しますが、移行を検討してください

## 非推奨の理由

より汎用的な`Attribute Remap`ノードが導入されたため、密度専用のこのノードは不要になりました。`Attribute Remap`は:
- 任意の属性をサポート
- より多くのリマップオプション
- 一貫したインターフェース
- 継続的なメンテナンス

## 関連ノード

- **Attribute Remap**: 推奨される代替ノード（任意の属性のリマップ）
- **Density Filter**: 密度に基づくフィルタリング
- **Attribute Transform Op**: 属性の変換操作
- **Attribute Maths Op**: 属性の数学演算

## 実装ファイル

- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDensityRemapElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGDensityRemapElement.cpp`
- **テスト**: `Engine/Plugins/PCG/Source/PCG/Private/Tests/Elements/PCGDensityRemapTest.cpp`
- **カテゴリ**: Density（非推奨）
