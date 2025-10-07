# Spline Direction（スプライン方向）

## 概要

Spline Directionノード（旧: Reverse Spline）は、スプラインのコントロールポイントの順序を制御するノードです。無条件反転、または時計回り/反時計回りに強制的に向きを揃えることができます。

**ノードタイプ**: Spatial
**クラス名**: `UPCGReverseSplineSettings`, `FPCGSplineDirectionElement`

## 機能詳細

このノードは、スプラインのコントロールポイントの順序を調整します。XY平面上での時計回り/反時計回りの判定を行い、条件付きまたは無条件でポイントを反転させることができます。

### 主な特徴

- **方向判定**: XY平面上で時計回り（CW）/反時計回り（CCW）を自動判定
- **条件付き反転**: 特定の向きに強制可能
- **無条件反転**: 常にコントロールポイントを逆順に

## プロパティ

### Operation
- **型**: `EPCGReverseSplineOperation` (enum)
- **デフォルト値**: `Reverse`
- **説明**: 反転操作のタイプ
  - **Reverse**: 向きに関係なく常にスプラインポイントを反転
  - **ForceClockwise**: 反時計回りの場合のみ反転（時計回りに強制）
  - **ForceCounterClockwise**: 時計回りの場合のみ反転（反時計回りに強制）

## 使用例

### 基本的な使用方法

```
Spline Data → Spline Direction → 方向が調整されたSpline
```

### 実際のワークフロー例

1. **一貫した向きの確保**
   - 複数のスプラインを生成
   - Spline Direction (ForceClockwise) で全て時計回りに統一
   - 後続の方向依存処理を簡素化

2. **スプライン反転**
   - Spline作成
   - Spline Direction (Reverse) で始点と終点を入れ替え
   - 逆方向の処理を実行

3. **閉じたループの向き統一**
   - 閉じたスプラインループを作成
   - ForceCounterClockwise で向きを統一
   - ポリゴン生成などで一貫した法線方向を確保

## 実装の詳細

### ファイル位置
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSplineDirection.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGSplineDirection.cpp`

### 継承関係
- `UPCGReverseSplineSettings` ← `UPCGSettings`
- `FPCGSplineDirectionElement` ← `IPCGElement`

### ExecuteInternal処理フロー

1. **入力スプラインデータ取得**
2. **各スプラインの処理**:
   ```cpp
   for each spline:
       isClockwise = PCGSplineDirection::IsClockwiseXY(splineData)

       shouldReverse = false
       switch (Operation):
           case Reverse:
               shouldReverse = true
           case ForceClockwise:
               shouldReverse = !isClockwise  // CCWなら反転
           case ForceCounterClockwise:
               shouldReverse = isClockwise   // CWなら反転

       if (shouldReverse):
           reversedSpline = PCGSplineDirection::Reverse(splineData, Context)
           output reversedSpline
       else:
           output original spline
   ```

### 時計回り判定アルゴリズム

```cpp
namespace PCGSplineDirection
{
    bool IsClockwiseXY(const UPCGSplineData* InputSplineData)
    {
        // スプラインのコントロールポイントを取得
        // XY平面上で符号付き面積を計算（Shoelace公式）
        // 面積が負なら時計回り、正なら反時計回り

        double signedArea = 0.0;
        for (int i = 0; i < numPoints; i++)
        {
            p1 = points[i];
            p2 = points[(i + 1) % numPoints];
            signedArea += (p2.X - p1.X) * (p2.Y + p1.Y);
        }

        return signedArea < 0;  // 負なら時計回り
    }

    UPCGSplineData* Reverse(const UPCGSplineData* InputSplineData, FPCGContext* Context)
    {
        // コントロールポイントの順序を逆転した新しいスプラインを作成
    }
}
```

### パフォーマンス特性

- **実行ループモード**: SinglePrimaryPin
- **計算コスト**: 低（ポイント順序の反転のみ）
- **キャッシュ可能**: はい

### 入出力仕様

- **入力ピン**:
  - `In` (デフォルト)
  - タイプ: `EPCGDataType::Spline`

- **出力ピン**:
  - `Out` (デフォルト)
  - タイプ: `EPCGDataType::Spline`

### 技術的詳細

#### 非推奨フィールド

```cpp
// UE 5.6より前のバージョンでは、CW/CCWの計算が逆でした
// このフラグは既存データの互換性を保つために存在します
UPROPERTY()
bool bFlipClockwiseComputationResult = false;
```

UE 5.5以前からのデータを開くと、警告が表示され、修正を促されます。

#### ノード名とタイトル

```cpp
virtual FName GetDefaultNodeName() const override
{
    // Operationによって変化
    return Operation == Reverse ? "ReverseSpline" : "SplineDirection";
}

virtual FText GetDefaultNodeTitle() const override
{
    // Operationによって変化
}
```

ノードの表示名は、選択されたOperationに応じて動的に変更されます。

### 注意事項

1. **XY平面での判定**: Z軸（高さ）は無視され、XY平面上で判定されます
2. **閉じたスプライン**: 閉じたスプラインループでのみ、時計回り/反時計回りの概念が意味を持ちます
3. **開いたスプライン**: 開いたスプラインでForceClockwise/ForceCounterClockwiseを使用した場合、始点と終点の位置関係で判定されます
4. **互換性**: UE 5.6以降、CW/CCWの計算が修正されました。古いデータには警告が表示されます
5. **タイトル情報**: ノードのタイトルにOperationの情報が追加されます

### ユースケース

- **一貫した向きの確保**: 複数のスプラインを同じ向きに統一
- **法線方向の制御**: ポリゴン生成時に法線方向を制御
- **始点/終点の入れ替え**: スプラインの進行方向を逆転
- **ループの向き統一**: 閉じたスプラインループの向きを統一
- **方向依存処理**: スプライン方向に依存する後続処理の準備

### 関連するヘルパー関数

```cpp
namespace PCGSplineDirection
{
    // スプラインがXY平面上で時計回りかテスト
    PCG_API bool IsClockwiseXY(const UPCGSplineData* InputSplineData);

    // コントロールポイントが逆順の同じスプラインデータを返す
    PCG_API UPCGSplineData* Reverse(const UPCGSplineData* InputSplineData, FPCGContext* Context);
}
```

これらの関数はPCG APIとして公開されており、カスタムノードからも使用可能です。
