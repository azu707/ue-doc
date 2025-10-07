# Delete Attributes

## 概要
Delete Attributesノードは、入力データのメタデータから属性を削除します。選択した属性のみを保持するか、選択した属性のみを削除するかを選択できます。

## 機能詳細
このノードは指定された属性名のリストに基づいて、メタデータから属性を削除または保持します。出力は更新されたメタデータを持つ元のデータです。

### 主な機能
- **2つの操作モード**: 選択した属性のみを保持、または選択した属性のみを削除
- **柔軟な属性選択**: 文字列マッチング演算子をサポート
- **ドメイン指定**: 特定のメタデータドメインをターゲット可能

### 処理フロー
1. 入力データのメタデータを取得
2. 選択された属性リストと操作モードに基づいて処理
3. 指定されたドメインの属性を削除または保持
4. 更新されたメタデータを持つデータを出力

## プロパティ

### Operation
- **型**: EPCGAttributeFilterOperation（列挙型）
- **デフォルト値**: KeepSelectedAttributes（新しいオブジェクトではDeleteSelectedAttributesに変更）
- **PCG_Overridable**: あり
- **説明**: 属性フィルタ操作のタイプを指定
- **選択肢**:
  - `KeepSelectedAttributes`: 選択した属性のみを保持（他はすべて削除）
  - `DeleteSelectedAttributes`: 選択した属性のみを削除（他はすべて保持）

### Operator
- **型**: EPCGStringMatchingOperator（列挙型）
- **デフォルト値**: Equal
- **PCG_Overridable**: あり
- **説明**: 属性名のマッチング方法を指定
- **選択肢**: Equal、NotEqual、Contains、Matches（ワイルドカード）、など

### SelectedAttributes
- **型**: FString
- **PCG_Overridable**: あり
- **説明**: 保持または削除する属性のカンマ区切りリスト
- **例**: "Density,Color,Height"

### bTokenizeOnWhiteSpace (非推奨)
- **型**: bool
- **デフォルト値**: false
- **説明**: スペースを区切り文字として使用する古い動作を有効化
- **⚠️ 非推奨（5.5）**: この機能は非推奨です

### MetadataDomain
- **型**: FName
- **デフォルト値**: PCGDataConstants::DefaultDomainName
- **PCG_Overridable**: あり
- **説明**: 属性削除のターゲットとなる単一のドメインを指定

## 使用例

### 不要な属性の削除
```
// 特定の属性のみを削除
Operation: DeleteSelectedAttributes
SelectedAttributes: "TempValue,DebugInfo"
MetadataDomain: Default
結果: TempValueとDebugInfo属性が削除され、他の属性は保持される
```

### 必要な属性のみを保持
```
// 必要な属性のみを保持
Operation: KeepSelectedAttributes
SelectedAttributes: "Density,Color,Scale"
MetadataDomain: Default
結果: Density、Color、Scaleのみが保持され、他の属性はすべて削除される
```

### パターンマッチングで削除
```
// 特定のプレフィックスを持つ属性を削除
Operation: DeleteSelectedAttributes
Operator: Contains
SelectedAttributes: "Temp"
結果: "Temp"を含む属性（TempValue、TempDataなど）がすべて削除される
```

### クリーンアップ
```
// デフォルト属性以外をすべて削除
Operation: KeepSelectedAttributes
SelectedAttributes: "$Position,$Rotation,$Scale"
結果: 位置、回転、スケール属性のみが保持される
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGDeleteAttributesElement`（`IPCGElement`を継承）

### 特徴
- **動的ピン**: `HasDynamicPins()` が `true`
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`
- **ノードタイトルエイリアス**: 複数の名前で検索可能

### 文字列マッチング演算子
- **Equal**: 完全一致
- **NotEqual**: 完全不一致
- **Contains**: 部分一致（属性名に文字列が含まれる）
- **Matches**: ワイルドカードパターンマッチング（*, ?）

### メタデータドメイン
- デフォルトドメイン: PCGDataConstants::DefaultDomainName
- カスタムドメイン: 特定のドメイン名を指定可能
- ドメインごとに属性を個別に管理可能

## 注意事項

1. **元に戻せない**: 属性の削除は元に戻せません。慎重に操作してください
2. **システム属性**: 一部のシステム属性（$Position、$Rotationなど）の削除は避けるべきです
3. **ドメインの指定**: 特定のドメインのみをターゲットとする場合、MetadataDomainを適切に設定してください
4. **カンマ区切り**: 属性リストはカンマで区切ります（スペースは含めない）
5. **大文字小文字**: 属性名の大文字小文字は区別されます

## 関連ノード
- **Attribute Rename**: 属性名を変更
- **Copy Attributes**: 属性をコピー
- **Add Attribute**: 新しい属性を追加
- **Merge Attributes**: 複数の属性セットをマージ

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGDeleteAttributesElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGDeleteAttributesElement.cpp`
