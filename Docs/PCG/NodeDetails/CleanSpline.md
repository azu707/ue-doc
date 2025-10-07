# Clean Spline

## 概要
Clean Splineノードは、スプラインから不要な制御点を削除して、スプラインを最適化するノードです。共通位置にある制御点（co-located）や、直線上にある制御点（collinear）を削除します。

## 機能詳細
このノードは`UPCGCleanSplineSettings`クラスとして実装されており、以下の処理を行います:

- 同じ位置にある制御点の結合（fusion）
- 直線上の不要な制御点の削除
- スプラインの形状を保ちながら制御点数を削減

## プロパティ

### bFuseColocatedControlPoints
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: 同じ位置（または非常に近い位置）にある制御点を結合するかどうかを制御します。共通位置の制御点は本質的に共線的であるため、collinear削除を有効にすると自動的に適用されます。
- **Blueprint対応**: 読み書き可能
- **PCG_Overridable**: 対応

### ColocationDistanceThreshold
- **型**: double
- **デフォルト値**: UE_KINDA_SMALL_NUMBER
- **カテゴリ**: Settings
- **説明**: 制御点が共通位置とみなされる距離の閾値です。この距離以内にある制御点は同じ位置として扱われます。
- **編集条件**: `bFuseColocatedControlPoints`がtrueの場合のみ表示
- **Blueprint対応**: 読み書き可能
- **PCG_Overridable**: 対応

### bUseSplineLocalSpace
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、ワールド空間ではなくスプラインのローカル空間で距離計算を行います。
- **編集条件**: `bFuseColocatedControlPoints`がtrueの場合のみ表示
- **Blueprint対応**: 読み書き可能
- **PCG_Overridable**: 対応

### FuseMode
- **型**: EPCGControlPointFuseMode
- **デフォルト値**: EPCGControlPointFuseMode::Auto
- **カテゴリ**: Settings
- **説明**: 2つの共通位置制御点を結合する方法を制御します。
  - **KeepFirst**: インデックス0と1が共通位置の場合、0を保持
  - **KeepSecond**: インデックス0と1が共通位置の場合、1を保持
  - **Merge**: 2つの制御点を中間点に結合
  - **Auto**: 一般的に2番目の制御点を保持。ただし、スプラインの長さが変わる場合（最終制御点など）は最初を保持
- **編集条件**: `bFuseColocatedControlPoints`がtrueの場合のみ表示
- **Blueprint対応**: 読み書き可能
- **PCG_Overridable**: 対応

### bRemoveCollinearControlPoints
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **説明**: スプラインの直線セクション上にある、最終的なスプライン計算に影響を与えない制御点を削除します。
- **Blueprint対応**: 読み書き可能
- **PCG_Overridable**: 対応

### CollinearAngleThreshold
- **型**: double
- **デフォルト値**: 5
- **カテゴリ**: Settings
- **説明**: 制御点が共線的とみなされる角度の閾値です。前後の制御点間のセグメントからこの角度以内にある場合、その制御点は共線的と判断されます。
- **編集条件**: `bRemoveCollinearControlPoints`がtrueの場合のみ表示
- **Blueprint対応**: 読み書き可能
- **PCG_Overridable**: 対応
- **ClampMin**: 0

### bUseRadians
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、度数ではなくラジアンを直接使用します。トグルすると、現在の`CollinearAngleThreshold`値が自動的に変換されます。
- **編集条件**: `bRemoveCollinearControlPoints`がtrueの場合のみ表示
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. スプラインデータを入力ピンに接続
2. 削除したい制御点のタイプ（共通位置または共線）を選択
3. 閾値を調整して、どの程度積極的に制御点を削除するかを制御
4. ノードを実行すると、最適化されたスプラインが出力される

### 一般的な用途
- インポートされたスプラインの簡素化
- メモリ使用量とパフォーマンスの最適化
- 不要な制御点を含むスプラインのクリーンアップ
- スプライン生成後の後処理として

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGCleanSplineSettings : public UPCGSettings
```

### 実行エレメント
```cpp
class FPCGCleanSplineElement : public IPCGElement
```

### 入力ピン
- スプラインデータを受け付ける

### 出力ピン
- クリーンアップされたスプラインデータを出力

### ノードの特徴
- **ノード名**: CleanSpline
- **表示名**: Clean Spline
- **カテゴリ**: Spatial
- **プロパティ変更後処理**: `PostEditChangeProperty`をオーバーライド（角度単位の変換など）

## 注意事項
- 共線的制御点の削除は、スプラインの視覚的な形状を保持しますが、完全に同一とは限りません
- 閾値の設定が緩すぎると、意図しない制御点が削除される可能性があります
- 閾値の設定が厳しすぎると、最適化の効果が限定的になります
- ラジアンと度数の切り替え時には、自動変換が行われます

## 関連ノード
- **Create Spline**: ポイントからスプラインを作成
- **Get Spline Control Points**: スプラインの制御点を取得
- **Spline Direction**: スプラインの方向を制御
