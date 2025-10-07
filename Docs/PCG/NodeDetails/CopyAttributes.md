# Copy Attributes

## 概要
Copy Attributesノード（UPCGCopyAttributesSettings）は、ソースデータからターゲットデータに属性をコピーします。3つの異なるコピーモードをサポートし、柔軟な属性転送を実現します。

## 機能詳細
このノードは複数のソースとターゲット間で属性をコピーする際の動作を制御します。全属性のコピー、特定属性のコピー、複数ドメイン間のマッピングをサポートします。

### 主な機能
- **3つのコピーモード**: 対応、マージ、全組み合わせ
- **全属性コピー**: すべての属性を一括でコピー
- **ドメインマッピング**: 異なるメタデータドメイン間での属性コピー
- **選択的コピー**: 特定の属性のみをコピー

### 処理フロー
1. ソースピンとターゲットピンからデータを取得
2. 選択されたコピー操作に基づいて処理
3. 属性をソースからターゲットにコピー
4. 結果を出力

## プロパティ

### Operation
- **型**: EPCGCopyAttributesOperation（列挙型）
- **デフォルト値**: CopyEachSourceToEachTargetRespectively
- **PCG_Overridable**: あり
- **説明**: コピー操作のモードを指定
- **選択肢**:

  **CopyEachSourceToEachTargetRespectively（対応コピー）**:
  - N:N、N:1、1:N操作
  - SourceA/SourceBとTargetA/TargetBがある場合:
    - SourceA → TargetA
    - SourceB → TargetB
  - SourceAとTargetA/TargetBがある場合:
    - SourceA → TargetA
    - SourceA → TargetB
  - SourceA/SourceBとTargetAがある場合:
    - SourceA → TargetA
    - SourceB → TargetAのコピー
  - 出力数: Max(N, M)（NまたはMが1、またはN == M）

  **MergeSourcesAndCopyToAllTargets（マージしてコピー）**:
  - N:M操作
  - すべてのソースをすべてのターゲットにコピー
  - コピーは順次実行（属性名が重複する場合、最後のソースで上書き）
  - 出力数: N（ターゲット数）

  **CopyEachSourceOnEveryTarget（全組み合わせ）**:
  - N:M操作
  - すべての組み合わせを作成:
    - SourceA → TargetA
    - SourceA → TargetB
    - SourceB → TargetA
    - SourceB → TargetB
  - 出力数: N × M

### bCopyAllAttributes
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **説明**: 有効にすると、すべての属性をコピーします

### bCopyAllDomains
- **型**: bool
- **デフォルト値**: false
- **PCG_Overridable**: あり
- **表示条件**: `bCopyAllAttributes == true`
- **説明**: 有効にすると、サポートされているすべてのドメインからすべての属性をコピーします

### MetadataDomainsMapping
- **型**: TMap<FName, FName>
- **表示条件**: `bCopyAllAttributes == true && bCopyAllDomains == false`
- **説明**: ドメイン間のマッピングを指定。空の場合、Default → Defaultとなります

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `bCopyAllAttributes == false`
- **説明**: コピーするソース属性を選択

### OutputTarget
- **型**: FPCGAttributePropertyOutputSelector
- **PCG_Overridable**: あり
- **表示条件**: `bCopyAllAttributes == false`
- **説明**: コピー先のターゲット属性を指定

## 使用例

### 対応コピー（1:1マッピング）
```
// 各ソースを対応するターゲットにコピー
Source入力: [DataA, DataB]
Target入力: [TargetA, TargetB]
Operation: CopyEachSourceToEachTargetRespectively
結果: DataA → TargetA, DataB → TargetB
```

### 1つのソースを複数のターゲットにコピー
```
// 1つのソースを複数のターゲットに配布
Source入力: [Data]
Target入力: [TargetA, TargetB, TargetC]
Operation: CopyEachSourceToEachTargetRespectively
結果: Data → TargetA, Data → TargetB, Data → TargetC
```

### 全ソースを全ターゲットにマージ
```
// すべてのソースをマージして各ターゲットにコピー
Source入力: [DataA, DataB]
Target入力: [TargetA, TargetB]
Operation: MergeSourcesAndCopyToAllTargets
bCopyAllAttributes: true
結果:
  - TargetA（DataAとDataBの全属性を含む）
  - TargetB（DataAとDataBの全属性を含む）
```

### 全組み合わせのコピー
```
// すべての組み合わせを作成
Source入力: [DataA, DataB]
Target入力: [TargetA, TargetB]
Operation: CopyEachSourceOnEveryTarget
結果:
  - DataA → TargetA
  - DataA → TargetB
  - DataB → TargetA
  - DataB → TargetB
出力数: 4
```

### 特定属性のコピー
```
// 特定の属性のみをコピー
bCopyAllAttributes: false
InputSource: Density
OutputTarget: CustomDensity
結果: Density属性がCustomDensityとしてコピーされる
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGCopyAttributesElement`（`IPCGElement`を継承）

### 特徴
- **動的ピン**: `HasDynamicPins()` が `true`
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`
- **ノードタイトルエイリアス**: 複数の名前で検索可能

### ピン構造
- **Sourceピン**: コピー元のデータ（複数入力可能）
- **Targetピン**: コピー先のデータ（複数入力可能）
- **出力**: 操作モードに応じて動的に生成

### ドメインマッピング
メタデータドメイン間でのマッピングを指定可能:
- Default → Default
- Custom → OtherCustom
- など

## 注意事項

1. **操作モードの選択**: データ構造に応じて適切な操作モードを選択してください
2. **属性名の競合**: MergeSourcesAndCopyToAllTargetsモードでは、同名の属性は最後のソースで上書きされます
3. **出力数**: 操作モードによって出力数が変わるため注意が必要です
4. **ドメインの互換性**: ターゲットデータがサポートしていないドメインの属性はコピーされません
5. **パフォーマンス**: CopyEachSourceOnEveryTargetモードは大量の出力を生成する可能性があります

## 関連ノード
- **Merge Attributes**: 属性をマージ
- **Attribute Rename**: 属性名を変更
- **Delete Attributes**: 属性を削除
- **Match And Set Attributes**: 条件に基づいて属性を設定

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGCopyAttributes.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGCopyAttributes.cpp`
