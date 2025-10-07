# Data Attributes To Tags ノード

## 概要

Data Attributes To Tagsノードは、PCGデータのData Domain属性をタグに変換するノードです。属性名と値をキー:バリュー形式のタグとして出力し、データのフィルタリングや分類に利用できます。

**カテゴリ**: Generic
**クラス名**: `UPCGDataAttributesToTagsSettings`
**エレメントクラス**: `FPCGDataAttributesToTagsElement`
**基底クラス**: `UPCGDataAttributesAndTagsSettingsBase`

## 機能詳細

1. **属性からタグへの変換**: Data Domain属性の値をタグとして出力
2. **選択的マッピング**: 特定の属性のみをタグに変換可能
3. **カスタム名前付け**: タグ名を`@Source`キーワードで元の属性名から変更可能
4. **型フィルタリング**: 解析不可能な型（Quaternionなど）の処理を制御
5. **値の省略**: 属性名のみのタグ生成オプション

## プロパティ

### AttributesTagsMapping
- **型**: `TMap<FString, FPCGAttributePropertyOutputSelector>`
- **デフォルト値**: 空マップ
- **説明**: 入力属性/タグから出力属性/タグへのマッピング。`@Source`を使用して元の名前を保持可能。空の場合はすべての属性をコピーします。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`

### bDeleteInputsAfterOperation
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 操作後に入力属性を削除するかどうかを制御します。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

### bDiscardNonParseableAttributeTypes
- **型**: `bool`
- **デフォルト値**: `true`
- **説明**: 解析不可能な属性型（Quaternionなど）を破棄するか、名前のみ追加するかを制御します。
  - `true`: 解析不可能な型は無視
  - `false`: 属性名のみタグとして追加
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `AdvancedDisplay`, `PCG_Overridable`

### bDiscardAttributeValue
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: タグに属性値を含めるかどうかを制御します。
  - `false`: `"AttributeName:Value"`形式
  - `true`: `"AttributeName"`のみ
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `AdvancedDisplay`, `PCG_Overridable`

## 実装の詳細

### 対応する属性型

解析可能な型（`bDiscardNonParseableAttributeTypes`が関係する）:
- `float`, `double`
- `int32`, `int64`
- `bool`
- `FName`, `FString`

これらの型は値がタグに含まれます。

### タグ形式

```cpp
// bDiscardAttributeValue = false の場合
"AttributeName:Value"  // 例: "Height:150", "IsActive:true"

// bDiscardAttributeValue = true の場合
"AttributeName"        // 例: "Height", "IsActive"
```

### ExecuteInternalメソッドの処理フロー

1. **Data Domainの取得**
   - 入力データからData Domain Metadataを取得
   - Domainが存在しない場合は入力をそのまま転送

2. **属性リストの構築**
   - `AttributesTagsMapping`が空：すべての属性を取得
   - マッピングあり：指定された属性のみ処理

3. **各属性の処理**
   ```cpp
   auto SetTag = [...]<typename T>(T) -> bool
   {
       if constexpr (!PCG::Private::IsOfTypes<T, 解析可能な型>())
       {
           // 解析不可能な型の処理
       }
       else
       {
           // タグの生成と追加
           const T Value = static_cast<const FPCGMetadataAttribute<T>*>(Attribute)->GetValueFromItemKey(PCGFirstEntryKey);
           OutputTaggedData.Tags.Add(FString::Format(TEXT("{0}:{1}"), {TagName, Value}));
       }
   };
   ```

4. **属性の削除（オプション）**
   - `bDeleteInputsAfterOperation`が`true`の場合、元の属性を削除

## 使用例

### 基本的な使用

```
1. Create Attribute → "Type" 属性を作成（String型、値: "Building"）
2. Create Attribute → "Height" 属性を作成（Float型、値: 100.0）
3. Data Attributes To Tags
   - AttributesTagsMapping: 空（すべて変換）
4. 出力タグ: "Type:Building", "Height:100.0"
```

### 選択的変換

```
AttributesTagsMapping:
  "Height" -> @Source
  "Width" -> @Source
→ HeightとWidth属性のみがタグに変換される
```

### 属性名のみ出力

```
設定:
- bDiscardAttributeValue = true
- 属性: "IsActive" (bool, true), "Type" (String, "Residential")

出力タグ: "IsActive", "Type"
```

### 変換後に属性を削除

```
設定:
- bDeleteInputsAfterOperation = true

結果:
- タグが追加される
- 元のData Domain属性が削除される
```

## パフォーマンス考慮事項

1. **軽量な処理**: メタデータの読み取りとタグ追加のみ
2. **SinglePrimaryPinモード**: 最適化された実行ループ
3. **型判定**: コンパイル時の`if constexpr`により効率的
4. **属性削除のコスト**: `bDeleteInputsAfterOperation`でデータ複製が必要

## 注意事項

1. **Data Domainの必須性**: Data Domain Metadataを持つデータのみ処理可能
2. **PCGFirstEntryKey**: 最初のエントリの値のみタグに変換
3. **解析不可能な型**: Vector、Transform、Quaternionなどは値を文字列化できません
4. **マッピングの@Source**: `@Source`は元の属性名を保持する特別なキーワード

## 関連ノード

- **Tags To Data Attributes**: タグから属性への逆変換
- **Add Tags**: 固定タグの追加
- **Filter By Tag**: タグベースのフィルタリング
- **Create Attribute**: 属性の作成

## 技術的な詳細

### PCGFirstEntryKey

```cpp
const T Value = static_cast<const FPCGMetadataAttribute<T>*>(Attribute)->GetValueFromItemKey(PCGFirstEntryKey);
```
- Data Domainの最初のエントリから値を取得
- 通常、Data Domainには1つのエントリしか存在しません

### CallbackWithRightType

```cpp
PCGMetadataAttribute::CallbackWithRightType(Attribute->GetTypeId(), SetTag);
```
- ランタイム型情報に基づいて適切なテンプレート関数を呼び出し
- 型安全性を保ちながら汎用的な処理を実現
