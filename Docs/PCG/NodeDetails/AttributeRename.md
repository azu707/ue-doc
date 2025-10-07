# Attribute Rename

## 概要
Attribute Renameノードは、属性の名前を変更します。シンプルなノードで、既存の属性を新しい名前で参照できるようにします。

## 機能詳細
このノードは指定された属性の名前を新しい名前に変更します。属性のデータ型や値は変更されず、名前のみが変更されます。

### 主な機能
- **属性名の変更**: 既存の属性を新しい名前にリネーム
- **データ保持**: 属性の値と型は変更されない
- **動的ピン**: 出力ピンプロパティが動的に変更

### 処理フロー
1. 入力データから指定された属性を検索
2. 属性のメタデータをコピー
3. 新しい名前で属性を作成
4. 元の属性のすべての値を新しい属性にコピー
5. 元の属性を削除（オプション）
6. 変更されたデータを出力

## プロパティ

### AttributeToRename
- **型**: FName
- **デフォルト値**: NAME_None（空）
- **PCG_Overridable**: あり
- **説明**: リネームする属性の現在の名前を指定

### NewAttributeName
- **型**: FName
- **デフォルト値**: NAME_None（空）
- **PCG_Overridable**: あり
- **説明**: 属性の新しい名前を指定

## 使用例

### 属性名の標準化
```
// "Dens" を "Density" にリネーム
AttributeToRename: Dens
NewAttributeName: Density
結果: "Dens"属性が"Density"という名前に変更される
```

### 一時属性の永続化
```
// 一時的な属性を意味のある名前に変更
AttributeToRename: TempValue
NewAttributeName: FinalScore
結果: "TempValue"が"FinalScore"にリネームされる
```

### 命名規則の統一
```
// プレフィックスを追加するためのリネーム
AttributeToRename: Color
NewAttributeName: Material_Color
結果: "Color"が"Material_Color"にリネームされる
```

### 出力用の属性名変更
```
// 他のシステムが期待する名前に変更
AttributeToRename: InternalID
NewAttributeName: ObjectID
結果: "InternalID"が"ObjectID"にリネームされる
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGSettings`
- **Element**: `FPCGMetadataRenameElement`（`IPCGElement`を継承）

### 特徴
- **動的ピン**: `HasDynamicPins()` が `true` - 出力ピンプロパティが動的に変更
- **実行ループモード**: `SinglePrimaryPin` - プライマリピンの各入力を個別に処理
- **Base Point Data対応**: `SupportsBasePointDataInputs()` が `true`

### リネーム処理
1. 指定された名前の属性が存在するか確認
2. 新しい名前が既存の属性と競合しないか確認
3. 属性のメタデータ（型、デフォルト値など）を保持
4. 新しい名前で属性を再作成
5. すべての値をコピー
6. 元の属性を削除

### エラー処理
- 元の属性が存在しない場合は警告
- 新しい名前が既に使用されている場合はエラー
- AttributeToRenameまたはNewAttributeNameが空の場合はスキップ

## 注意事項

1. **属性の存在確認**: リネームする属性が実際に存在することを確認してください
2. **名前の競合**: 新しい名前が既存の属性と重複しないようにしてください
3. **参照の更新**: リネーム後、その属性を参照する他のノードの設定を更新する必要があります
4. **大文字小文字の区別**: 属性名は大文字小文字を区別します
5. **空の名前**: どちらかの名前が空の場合、リネームは実行されません

## 関連ノード
- **Copy Attributes**: 属性をコピー（異なる名前で複製可能）
- **Delete Attributes**: 属性を削除
- **Add Attribute**: 新しい属性を追加
- **Attribute Select**: 属性の選択操作

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataRenameElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataRenameElement.cpp`
