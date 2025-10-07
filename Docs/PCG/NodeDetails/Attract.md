# Attract ノード

## 概要

Attractノードは、ソースポイントをターゲットポイントに向かって引き寄せる(補間する)ノードです。距離や属性値に基づいて最も適切なターゲットポイントを選択し、重み付き平均によってポイントを融合します。

**ノードタイプ**: Point Ops  
**クラス名**: `UPCGAttractSettings` / `FPCGAttractElement`

## 主な機能

- 4つの引き寄せモード（最近接、最小属性、最大属性、インデックス指定）
- 重み付き属性補間
- 引き寄せられなかったポイントの除外オプション
- カスタム属性マッピングによる柔軟な融合

## 主要プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| **Mode** | EPCGAttractMode | Closest | 引き寄せ基準（Closest/MinAttribute/MaxAttribute/FromIndex） |
| **Attractor Index Attribute** | FPCGAttributePropertyInputSelector | AttractIndex | FromIndexモード時のターゲットポイントインデックス属性 |
| **Distance** | double | 100.0 | 検索半径（FromIndexモード以外） |
| **Remove Unattracted Points** | bool | false | 引き寄せられなかったポイントを除外 |
| **Target Attribute** | FPCGAttributePropertyInputSelector | - | MinAttribute/MaxAttributeモード時の比較属性 |
| **Use Source Weight** | bool | false | ソース重み属性を使用 |
| **Source Weight Attribute** | FPCGAttributePropertyInputSelector | - | ソースの重み属性 |
| **Use Target Weight** | bool | false | ターゲット重み属性を使用 |
| **Target Weight Attribute** | FPCGAttributePropertyInputSelector | - | ターゲットの重み属性 |
| **Weight** | double | 1.0 | 固定重み値（重み属性未使用時） |
| **Source And Target Attribute Mapping** | TMap | Position→Position | 補間する属性のマッピング |
| **Output Attract Index** | bool | false | 引き寄せ先インデックスを出力 |
| **Output Attract Index Attribute** | FPCGAttributePropertyOutputNoSourceSelector | AttractIndex | 出力インデックス属性名 |

## 引き寄せモード

### Closest (最近接)
検索半径内の最も近いターゲットポイントに引き寄せ。

### MinAttribute / MaxAttribute
検索半径内で指定属性が最小/最大のターゲットポイントに引き寄せ。

### FromIndex
属性で指定されたインデックスのターゲットポイントに引き寄せ（距離制限なし）。

## 重み計算

```
Alpha = TargetWeight / (SourceWeight + TargetWeight)
補間値 = SourceValue * (1 - Alpha) + TargetValue * Alpha
```

## 使用例

### 基本的な最近接引き寄せ
```
ソース: 100ポイント at (-100, 0, 0)
ターゲット: 1ポイント at (100, 0, 0)
Distance: 300
Weight: 0.5

結果: ソースポイントが(0, 0, 0)に移動（50%補間）
```

### 属性による選択的引き寄せ
```
Mode: MaxAttribute
Target Attribute: "Height"
Distance: 1000

結果: 各ソースポイントは検索半径内で最もHeight値が高いターゲットに引き寄せられる
```

## パフォーマンス

- 計算コスト: O(N * M) - N=ソース数、M=検索範囲内のターゲット数
- Octreeを使用した空間検索により最適化
- Time Slicing対応で大規模データセット処理可能

## 関連ノード

- Point Neighborhood - 近傍ポイント処理
- Merge Points - ポイントのマージ
- Copy Attributes - 属性コピー
