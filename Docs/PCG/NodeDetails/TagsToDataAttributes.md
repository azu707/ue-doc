# Tags To Data Attributes ノード

## 概要

Tags To Data Attributesノードは、PCGデータのタグを解析してData Domain属性に変換するノードです。`Key:Value`形式のタグから属性を自動生成し、データに構造化された情報を付加します。

**カテゴリ**: Generic
**クラス名**: `UPCGTagsToDataAttributesSettings`
**エレメントクラス**: `FPCGTagsToDataAttributesElement`
**基底クラス**: `UPCGDataAttributesAndTagsSettingsBase`

## 機能詳細

1. **タグから属性への変換**: `Key:Value`形式のタグを解析して属性化
2. **自動型推論**: タグ値から適切な属性型を自動判定
3. **選択的マッピング**: 特定のタグのみを属性に変換可能
4. **Data Domain管理**: 属性をData Domainに自動追加

## プロパティ

### AttributesTagsMapping
- **型**: `TMap<FString, FPCGAttributePropertyOutputSelector>`
- **デフォルト値**: 空マップ
- **説明**: 入力タグから出力属性へのマッピング。空の場合はすべてのタグを処理します。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`

### bDeleteInputsAfterOperation
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: 操作後に入力タグを削除するかどうかを制御します。
- **編集可能**: `EditAnywhere`, `BlueprintReadWrite`, `PCG_Overridable`

## 実装の詳細

### タグ解析

```cpp
struct FParseTagResult
{
    FString Attribute;  // "Key" 部分
    FString Value;      // "Value" 部分（オプション）
    // 型推論情報
};
```

### 対応する値の型

タグ値から自動的に以下の型に変換：
- **Int32/Int64**: 整数値（例: `"Count:42"`）
- **Float/Double**: 浮動小数点値（例: `"Height:3.5"`）
- **Bool**: `true`/`false`（例: `"IsActive:true"`）
- **FName**: 識別子（例: `"Category:Residential"`）
- **FString**: 文字列（デフォルト）

### ExecuteInternalメソッドの処理フロー

1. **データ検証**
   - 入力データがData Domainをサポートするか確認
   - サポートしない場合は入力をそのまま転送

2. **タグの解析**
   ```cpp
   TMap<const FString*, PCG::Private::FParseTagResult> ParsedTags;
   Algo::Transform(Input.Tags, ParsedTags, [](const FString& Tag) {
       return MakeTuple(&Tag, PCG::Private::ParseTag(Tag));
   });
   ```

3. **出力データの準備**
   - 入力データを複製
   - Data Domainが空の場合はエントリを追加

4. **属性の作成と設定**
   ```cpp
   PCG::Private::SetAttributeFromTag(
       ParsedResult,
       OutputMetadata,
       PCGFirstEntryKey,
       ESetAttributeFromTagFlags::CreateAttribute,
       AttributeName
   );
   ```

5. **タグの削除（オプション）**
   - `bDeleteInputsAfterOperation`が`true`の場合、変換されたタグを削除

## 使用例

### 基本的なタグ解析

```
入力タグ:
- "Height:150"
- "IsActive:true"
- "Type:Building"

Tags To Data Attributes 実行後:
- Height 属性 (Int32): 150
- IsActive 属性 (Bool): true
- Type 属性 (FString): "Building"
```

### 選択的変換

```
AttributesTagsMapping:
  "Height" -> "BuildingHeight"
  "Width" -> "BuildingWidth"

入力タグ: "Height:100", "Width:50", "Type:House"
出力属性: "BuildingHeight" (100), "BuildingWidth" (50)
→ "Type"タグは無視される
```

### 変換後にタグを削除

```
設定:
- bDeleteInputsAfterOperation = true

結果:
- 属性が作成される
- 元のタグが削除される
- データのタグセットがクリーンになる
```

### データのない空のタグ

```
入力タグ: "SimpleTag" (値なし)

Tags To Data Attributes 実行後:
- SimpleTag 属性 (FString): "" (空文字列)
```

## パフォーマンス考慮事項

1. **解析コスト**: タグ文字列の解析と型推論が必要
2. **データ複製**: 常に入力データを複製
3. **属性作成**: 新しい属性の動的作成オーバーヘッド
4. **SinglePrimaryPinモード**: 効率的な実行ループ

## 注意事項

1. **タグ形式の要件**
   - `Key:Value`形式を推奨
   - コロンがない場合は属性名のみ、値は空文字列

2. **Data Domainのサポート**
   - データがData Domainをサポートしている必要があります
   - PointDataなどは対応

3. **型推論の限界**
   - 複雑な型（Vector、Transformなど）は直接サポートされません
   - カスタムパーサーの拡張が必要

4. **解析失敗**
   - 解析に失敗したタグはエラーログに記録
   - そのタグはスキップされます

5. **属性名の衝突**
   - 既存の属性名と同じ名前のタグは上書きされる可能性があります

## 関連ノード

- **Data Attributes To Tags**: 属性からタグへの逆変換
- **Create Attribute**: 手動での属性作成
- **Delete Attributes**: 属性の削除

## 技術的な詳細

### ParseTag関数

```cpp
namespace PCG::Private
{
    FParseTagResult ParseTag(const FString& Tag)
    {
        // タグを解析してKey:Value形式を抽出
        // 値の型を推論
        // FParseTagResultを返す
    }
}
```

### SetAttributeFromTag関数

```cpp
bool SetAttributeFromTag(
    const FParseTagResult& ParsedResult,
    FPCGMetadataDomain* OutputMetadata,
    PCGMetadataEntryKey EntryKey,
    ESetAttributeFromTagFlags Flags,
    FName AttributeName
);
```

- 解析結果に基づいて属性を作成
- 型推論に基づいて適切な型の属性を生成
- 値を設定

### 型推論のロジック

1. **整数チェック**: 値がすべて数字 → `Int32`または`Int64`
2. **浮動小数点チェック**: 小数点を含む → `Float`または`Double`
3. **ブールチェック**: `"true"`/`"false"` → `Bool`
4. **デフォルト**: `FString`または`FName`
