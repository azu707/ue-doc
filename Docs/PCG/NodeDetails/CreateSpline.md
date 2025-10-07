# Create Spline

## 概要
Create Splineノードは、入力ポイントデータからスプラインを作成するノードです。ポイントの位置を制御点として、カスタムタンジェント付きのスプラインを生成できます。

## 機能詳細
このノードは`UPCGCreateSplineSettings`クラスとして実装されており、以下の処理を行います:

- 入力ポイントの位置からスプライン制御点を作成
- スプラインデータのみまたはアクターコンポーネントとして生成
- オプションでカスタムタンジェントを適用
- 閉じたループスプラインの作成をサポート

## プロパティ

### Mode
- **型**: EPCGCreateSplineMode
- **デフォルト値**: EPCGCreateSplineMode::CreateDataOnly
- **カテゴリ**: Settings
- **説明**: スプラインの作成モード
  - **CreateDataOnly**: スプラインデータのみを作成
  - **CreateComponent**: アクターにスプラインコンポーネントを作成
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bClosedLoop
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、スプラインをループ（閉じた経路）として作成します
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bLinear
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、制御点間のセグメントが直線になります（カーブではなく）
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### bApplyCustomTangents
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: 各ポイントにカスタムタンジェントを属性から指定できます。スプラインがlinearの場合は設定できません
- **編集条件**: !bLinear
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### ArriveTangentAttribute
- **型**: FName
- **デフォルト値**: NAME_None
- **カテゴリ**: Settings
- **説明**: 到着タンジェントを含む属性名
- **編集条件**: !bLinear && bApplyCustomTangents
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### LeaveTangentAttribute
- **型**: FName
- **デフォルト値**: NAME_None
- **カテゴリ**: Settings
- **説明**: 出発タンジェントを含む属性名
- **編集条件**: !bLinear && bApplyCustomTangents
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### TargetActor
- **型**: TSoftObjectPtr<AActor>
- **カテゴリ**: Settings
- **説明**: スプラインコンポーネントを作成するターゲットアクター
- **メタフラグ**: PCG_Overridable
- **Blueprint対応**: 読み書き可能

### PostProcessFunctionNames
- **型**: TArray<FName>
- **カテゴリ**: Settings
- **説明**: スプライン作成後にターゲットアクターで呼び出す関数のリスト。関数はパラメータなしで「CallInEditor」フラグを有効にする必要があります
- **Blueprint対応**: 読み書き可能

## 使用例

### 基本的な使用方法
1. ポイントデータを入力ピンに接続
2. 必要に応じて`bClosedLoop`や`bLinear`を設定
3. カスタムタンジェントを使用する場合は属性名を指定
4. ノードを実行すると、スプラインデータまたはコンポーネントが作成される

### 一般的な用途
- パスやルートの作成
- 道路やケーブルのレイアウト
- カスタム形状の作成
- アニメーションパスの定義

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGCreateSplineSettings : public UPCGSettings
```

### 実行エレメント
```cpp
class FPCGCreateSplineElement : public IPCGElement
{
    virtual bool CanExecuteOnlyOnMainThread(FPCGContext* Context) const override;
    virtual bool IsCacheable(const UPCGSettings* InSettings) const override;
};
```

### 入力ピン
- ポイントデータ（DefaultPointInputPinProperties）
- ベースポイントデータ入力をサポート

### 出力ピン
- スプラインデータまたはスプラインコンポーネント参照

### 実行ループモード
- `ExecutionLoopMode`: SinglePrimaryPin

### ノードの特徴
- **ノード名**: CreateSpline
- **表示名**: Create Spline
- **カテゴリ**: Spatial
- **メインスレッド実行**: コンポーネント作成時は必須
- **キャッシュ可能**: モードにより異なる

## 注意事項
- コンポーネント作成モードではメインスレッドで実行される必要があります
- ポイント数が2未満の場合、有効なスプラインは作成されません
- カスタムタンジェントを使用する場合、指定した属性が存在する必要があります
- PostProcessFunctionNamesで指定する関数は、パラメータなしで呼び出し可能である必要があります

## 関連ノード
- **Get Spline Control Points**: スプラインから制御点を抽出
- **Spline Sampler**: スプラインに沿ってポイントをサンプリング
- **Clean Spline**: スプラインの最適化
