# Filter Data By Type

## 概要
Filter Data By Typeノードは、データ型に基づいて入力コレクションをフィルタリングするノードです。指定されたデータ型にマッチするデータを選択し、異なる出力ピンに振り分けます。コンパクトな表示モードをサポートし、視覚的にシンプルなノードとして使用できます。

## 基本情報
- **ノードタイプ**: Filter
- **クラス**: UPCGFilterByTypeSettings
- **エレメント**: FPCGFilterByTypeElement
- **基底クラス**: UPCGFilterDataBaseSettings
- **ヘッダーファイル**: Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGFilterByType.h

## 機能詳細
このノードは`UPCGFilterByTypeSettings`クラスとして実装されており、以下の処理を行います:

- データ型に基づくコレクションのフィルタリング
- 複数のデータ型を同時に指定可能（ビットマスク）
- 型にマッチするデータとマッチしないデータを別々に出力
- コンパクトな表示モードでワークフローを簡潔に保つ
- 実行依存ピンなし（データフローのみに依存）

## プロパティ

### TargetType
- **型**: EPCGDataType
- **デフォルト値**: EPCGDataType::Any
- **カテゴリ**: Settings
- **説明**: フィルタリングに使用するターゲットデータ型を指定します。複数の型をビット演算で組み合わせることができます。
  - **Any**: すべてのデータ型
  - **Point**: ポイントデータ
  - **Spline**: スプラインデータ
  - **Surface**: サーフェスデータ
  - **Volume**: ボリュームデータ
  - **Primitive**: プリミティブデータ
  - **Texture**: テクスチャデータ
  - **RenderTarget**: レンダーターゲットデータ
  - **BaseTexture**: 基本テクスチャデータ
  - **Param**: パラメータデータ
  - **Spatial**: 空間データ（複数の型を含む）
  - **その他多数の型とその組み合わせ**
- **Blueprint対応**: 読み書き可能

### bShowOutsideFilter
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **説明**: trueに設定すると、型にマッチしないデータを出力する`Outside Filter`ピンが表示されます。falseの場合は`In Filter`ピンのみが表示されます。
- **Blueprint対応**: 読み書き可能

## 使用例

### 例1: ポイントデータのみをフィルタ
1. `TargetType`を`Point`に設定
2. `bShowOutsideFilter`をfalseに設定
3. 実行すると、ポイントデータのみが`In Filter`ピンに出力されます

### 例2: スプラインとボリュームを選択
1. `TargetType`を`Spline | Volume`に設定（複数選択）
2. `bShowOutsideFilter`をtrueに設定
3. 実行すると、スプラインまたはボリュームデータが`In Filter`ピンに、それ以外が`Outside Filter`ピンに出力されます

### 例3: 空間データをフィルタ
1. `TargetType`を`Spatial`に設定
2. 実行すると、すべての空間データ（ポイント、スプライン、サーフェス、ボリュームなど）が選択されます

### 例4: テクスチャデータの分離
1. `TargetType`を`Texture`に設定
2. `bShowOutsideFilter`をtrueに設定
3. 実行すると、テクスチャデータと非テクスチャデータが分離されます

### 例5: 複雑なパイプラインでの型チェック
1. 複数の異なる型のデータを生成するノードの後に配置
2. `TargetType`を目的の型に設定
3. 後続のノードが期待する型のデータのみを渡すことができます

### 例6: デバッグ用途
1. `TargetType`を`Any`に設定
2. `bShowOutsideFilter`をfalseに設定
3. すべてのデータが通過するパススルーとして機能し、データフローの確認に使用できます

## 実装の詳細

### クラス構造
```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UPCGFilterByTypeSettings : public UPCGFilterDataBaseSettings
```

### 入力ピン
- **In** (Primary): フィルタリング対象のデータコレクション

### 出力ピン
- **In Filter**: 指定された型にマッチするデータ
- **Outside Filter**: 指定された型にマッチしないデータ（`bShowOutsideFilter`がtrueの場合のみ表示）

### 実行エレメント
```cpp
class FPCGFilterByTypeElement : public IPCGElement
{
protected:
    virtual bool ExecuteInternal(FPCGContext* InContext) const override;
    virtual EPCGElementExecutionLoopMode ExecutionLoopMode(const UPCGSettings* Settings) const override;
    virtual bool SupportsBasePointDataInputs(FPCGContext* InContext) const override;
};
```

### ノードの特徴
- **ノード名**: FilterDataByType
- **表示名**: Filter Data By Type（動的に生成）
- **ツールチップ**: Filter Data By Type（動的に生成）
- **カテゴリ**: Filter
- **コンパクト表示**: true（`ShouldDrawNodeCompact`がtrueを返す）
- **コンパクトアイコン**: カスタムアイコンを持つ（`GetCompactNodeIcon`で取得）
- **タイトル編集**: 不可（`CanUserEditTitle`がfalseを返す）
- **実行依存ピン**: なし（`HasExecutionDependencyPin`がfalseを返す）
- **実行ループモード**: SinglePrimaryPin
- **Base Point Data対応**: true

### 処理フロー
1. 入力データコレクションを取得
2. 各データの型を`GetDataType()`で取得
3. `TargetType`とビットマスク演算で型の一致をチェック
4. マッチするデータを`In Filter`ピンに追加
5. `bShowOutsideFilter`がtrueの場合、マッチしないデータを`Outside Filter`ピンに追加
6. 両方の出力コレクションをコンテキストに設定

### 型チェックロジック
```cpp
// 疑似コード
bool MatchesType(EPCGDataType DataType, EPCGDataType TargetType)
{
    // ビット演算でデータ型の一致をチェック
    return (DataType & TargetType) != EPCGDataType::None;
}
```

### ピンの動的型指定
```cpp
virtual EPCGDataType GetCurrentPinTypes(const UPCGPin* InPin) const override;
```
出力ピンのデータ型は`TargetType`設定に基づいて動的に変更されます。

### 出力ピンのカスタマイズ
```cpp
virtual TArray<FPCGPinProperties> OutputPinProperties() const override;
```
`bShowOutsideFilter`の設定に基づいて、出力ピンの数と表示を制御します。

## パフォーマンス考慮事項

### 最適化のポイント
- **型チェックの効率**: データ型のチェックはビット演算で行われ、非常に高速です
- **データコピー**: データ自体はコピーされず、参照のみが転送されるため効率的です
- **コンパクト表示**: ビジュアル的にシンプルで、大規模なグラフでも見やすくなります
- **実行依存性なし**: 不要な依存関係を作らず、並列実行の可能性を高めます

### パフォーマンス特性
- **時間計算量**: O(N)（N = 入力データ数）
- **空間計算量**: O(1)（データの参照のみを保存）
- **型チェック**: O(1)（ビット演算のみ）

## 注意事項
- `TargetType`は複数の型をビット演算で組み合わせることができます
- `EPCGDataType::Any`は文字通りすべての型にマッチします
- データの継承関係も考慮されます（例: PointデータはSpatialデータでもある）
- `bShowOutsideFilter`をfalseに設定すると、マッチしないデータは破棄されます
- コンパクト表示モードでは、ノードのタイトルは編集できません
- 実行依存ピンがないため、データが存在しない場合でもノードはスキップされません
- 型フィルタリングは静的な型チェックです（実行時の型変換は行いません）

## 関連ノード
- **Filter Data By Attribute**: 属性によるフィルタリング
- **Filter Data By Tag**: タグによるフィルタリング
- **Filter Data By Index**: インデックスによるフィルタリング
- **To Point**: 他の型をポイントデータに変換
- **Get Data Type**: データの型を取得
- **Branch**: データ型に基づく分岐処理
- **Static Mesh Sampler**: スタティックメッシュをポイントデータに変換
