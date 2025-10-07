# Bounds Modifier ノード

## 概要

Bounds Modifierノードは、ポイントのバウンド（BoundsMin/BoundsMax）とSteepness（急峻度）を変更するノードです。5つのモードでバウンドを操作できます。

**ノードタイプ**: Point Ops  
**クラス名**: `UPCGBoundsModifierSettings` / `FPCGBoundsModifier`

## プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| **Mode** | EPCGBoundsModifierMode | Scale | 変更モード |
| **Bounds Min** | FVector | (1, 1, 1) | 適用する最小バウンド値 |
| **Bounds Max** | FVector | (1, 1, 1) | 適用する最大バウンド値 |
| **Affect Steepness** | bool | false | Steepnessも変更 |
| **Steepness** | float | 1.0 | 設定するSteepness値 |

## Mode詳細

### Set (設定)
バウンドを指定値に設定。Steepnessも直接設定。

### Intersect (交差)
既存バウンドとの交差領域を計算。SteepnessはMin値を使用。

### Include (包含)
既存バウンドと指定バウンドの両方を含む領域を計算。SteepnessはMax値を使用。

### Translate (平行移動)
BoundsMin/Maxを指定値だけ加算。Steepnessも加算（0-1にクランプ）。

### Scale (スケール)
BoundsMin/Maxに指定値を乗算。Steepnessも乗算（0-1にクランプ）。

## 使用例

### バウンドのスケール変更
```
Mode: Scale
Bounds Min/Max: (0.5, 0.5, 2.0)

結果: XY方向に半分、Z方向に2倍のバウンドに
```

### 最大サイズ制限
```
Mode: Intersect
Bounds Min: (-100, -100, -100)
Bounds Max: (100, 100, 100)

結果: すべてのポイントのバウンドが200x200x200以下に制限される
```

## 関連ノード

- Extents Modifier - エクステント変更
- Apply Scale To Bounds - スケールをバウンドに適用
