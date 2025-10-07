# Get Entries Count (Get Tags / Get Attribute List) ノード群

## 概要

このドキュメントは、PCGデータからメタ情報を抽出する関連ノードについて説明します。

## Get Tags ノード

### 基本情報
- **クラス名**: `UPCGGetTagsSettings`
- **エレメントクラス**: `FPCGGetTagsElement`
- **カテゴリ**: Param

### 機能
入力データのタグを抽出し、タグごとに1エントリを持つ属性セットを作成します。

### プロパティ

#### bExtractTagValues
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: `true`の場合、`Values`属性を作成し、`Key:Value`形式のタグの値部分を文字列として保存します。

### 出力

Param Data with:
- **Attribute** 属性 (FString): タグ名（またはキー）
- **Values** 属性 (FString): タグ値（`bExtractTagValues`が`true`の場合のみ）

### 使用例

```
入力タグ: "Type:Building", "Height:150", "SimpleTag"

bExtractTagValues = true の場合:
  Entry[0]: Attribute="Type", Values="Building"
  Entry[1]: Attribute="Height", Values="150"
  Entry[2]: Attribute="SimpleTag", Values="true"
```

---

## Get Attribute List ノード

### 基本情報
- **クラス名**: `UPCGGetAttributesSettings`
- **エレメントクラス**: `FPCGGetAttributesElement`
- **カテゴリ**: Param

### 機能
入力データの属性リストを抽出し、属性ごとに1エントリを持つ属性セットを作成します。

### プロパティ

#### bGetType
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: `true`の場合、`Type`属性に属性の型名を出力します。

#### bGetDefaultValue
- **型**: `bool`
- **デフォルト値**: `false`
- **説明**: `true`の場合、`DefaultValue`属性に属性のデフォルト値を文字列として出力します。

### 出力

Param Data with:
- **Attribute** 属性 (FName): 属性名
- **Type** 属性 (FName): 属性型（`bGetType`が`true`の場合のみ）
- **DefaultValue** 属性 (FString): デフォルト値（`bGetDefaultValue`が`true`の場合のみ）

### 使用例

```
入力データの属性:
- Position (Vector)
- Height (Float, default: 100.0)
- IsActive (Bool, default: true)

bGetType = true, bGetDefaultValue = true の場合:
  Entry[0]: Attribute="Position", Type="Vector", DefaultValue="X=0 Y=0 Z=0"
  Entry[1]: Attribute="Height", Type="Float", DefaultValue="100.0"
  Entry[2]: Attribute="IsActive", Type="Boolean", DefaultValue="true"
```

---

## 実装の詳細

### Get Tags - タグ解析

```cpp
for (const FString& Tag : Input.Tags)
{
    PCG::Private::FParseTagResult TagData = PCG::Private::ParseTag(Tag);
    if (TagData.IsValid())
    {
        PCGMetadataEntryKey EntryKey = ParamData->Metadata->AddEntry();
        Attribute->SetValue(EntryKey, TagData.GetOriginalAttribute());

        if (Values && TagData.HasValue())
            Values->SetValue(EntryKey, TagData.Value.GetValue());
        else if (Values)
            Values->SetValue(EntryKey, FString("true"));  // Boolean扱い
    }
}
```

### Get Attribute List - 属性列挙

```cpp
TArray<FName> AttributeNames;
TArray<EPCGMetadataTypes> AttributeTypes;
InputMetadata->GetAttributes(AttributeNames, AttributeTypes);

for (int AttributeIndex = 0; AttributeIndex < AttributeNames.Num(); ++AttributeIndex)
{
    PCGMetadataEntryKey EntryKey = ParamData->Metadata->AddEntry();
    Attribute->SetValue(EntryKey, AttributeNames[AttributeIndex]);

    if (Types)
        Types->SetValue(EntryKey, TypesEnum->GetNameByValue(...));

    if (DefaultValues)
        // AttributeAccessorでデフォルト値を取得し文字列化
}
```

## 使用シナリオ

### Get Tags

1. **タグベースのフィルタリング前処理**
   - すべてのタグをリスト化
   - ユーザーが選択可能なタグを提示

2. **タグ値の集計**
   - タグの値を抽出して集計処理
   - 例: すべての`"Priority:N"`タグのNの合計

3. **メタデータの可視化**
   - デバッグ目的でタグ一覧を表示

### Get Attribute List

1. **動的属性処理**
   - 実行時に利用可能な属性を取得
   - 属性名に基づいて処理を分岐

2. **データ検証**
   - 必要な属性が存在するか確認
   - 属性型のチェック

3. **スキーマの抽出**
   - データ構造のドキュメント化
   - 自動生成されたデータの検証

## パフォーマンス考慮事項

- **軽量な処理**: メタデータの読み取りのみ
- **SinglePrimaryPinモード**: 効率的な実行ループ
- **エントリ数**: タグ/属性の数に比例するが、通常は少数

## 注意事項

1. **Get Tags**
   - 無効なタグ形式はスキップされます
   - 値のないタグは`"true"`として扱われます

2. **Get Attribute List**
   - 入力データにMetadataがない場合は空の出力
   - デフォルト値の文字列化は型によって異なる

## 関連ノード

- **Data Attributes To Tags**: 属性からタグへの変換
- **Tags To Data Attributes**: タグから属性への変換
- **Data Count**: データ数のカウント
