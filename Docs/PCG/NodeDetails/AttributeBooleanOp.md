# Attribute Boolean Op

## 概要
Attribute Boolean Opノードは、ブール型の属性に対して論理演算を実行します。And、Not、Or、Xorの4つの論理演算をサポートしており、ポイント属性やメタデータに対して条件判定やフィルタリングを行う際に使用されます。

## 機能詳細
このノードはブール値の属性に対して論理演算を実行します。事前設定されたプリセットとして提供され、各演算タイプ用のノードが個別に提供されます。

### 主な機能
- **論理AND演算**: 2つのブール値の論理積（両方がtrueのときtrue）
- **論理NOT演算**: ブール値の否定（単項演算）
- **論理OR演算**: 2つのブール値の論理和（いずれかがtrueのときtrue）
- **論理XOR演算**: 2つのブール値の排他的論理和（値が異なるときtrue）

### 処理フロー
1. 入力属性からブール値を取得
2. 指定された論理演算を適用
3. 結果を出力属性に書き込み

## プロパティ

### Operation
- **型**: EPCGMetadataBooleanOperation（列挙型）
- **デフォルト値**: And
- **説明**: 実行する論理演算のタイプを指定
- **選択肢**:
  - `And`: 論理AND演算（両方がtrueのときtrue）
  - `Not`: 論理NOT演算（値を反転）
  - `Or`: 論理OR演算（いずれかがtrueのときtrue）
  - `Xor`: 論理XOR演算（値が異なるときtrue）

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 最初の入力属性またはプロパティを選択
- **使用**: すべての演算で必須

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **表示条件**: `Operation != EPCGMetadataBooleanOperation::Not`
- **説明**: 2番目の入力属性またはプロパティを選択
- **使用**: And、Or、Xor演算で使用（Not演算では非表示）

## 使用例

### 複数条件の組み合わせ
```
// 2つの条件を両方満たすポイントをフィルタリング
InputSource1: IsNearWater (ブール属性)
InputSource2: IsFlat (ブール属性)
Operation: And
結果: 水辺かつ平坦な場所のみtrue
```

### 条件の反転
```
// 条件を反転してフィルタリング
InputSource1: IsExcluded (ブール属性)
Operation: Not
結果: 除外されていないポイントのみtrue
```

### いずれかの条件を満たす
```
// どちらかの条件を満たすポイントを選択
InputSource1: IsForest (ブール属性)
InputSource2: IsGrassland (ブール属性)
Operation: Or
結果: 森林または草原のポイントをtrue
```

### 排他的条件
```
// 一方のみtrueのポイントを選択
InputSource1: IsDay (ブール属性)
InputSource2: IsNight (ブール属性)
Operation: Xor
結果: 昼または夜のいずれか一方のみtrue（両方falseまたは両方trueの場合はfalse）
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **Preconfigured Settings**: `OnlyExposePreconfiguredSettings()` が `true` を返すため、事前設定された演算タイプとして提供されます
- **サポートされる型**: ブール型のみサポート
- **デフォルト値型**: EPCGMetadataTypes::Boolean
- **デフォルト値文字列**: boolのゼロ値（false）

### 入力要件
- Not演算: 1つの入力のみ必要
- And、Or、Xor演算: 2つの入力が必要
- 入力はブール型である必要があります

### 演算実装
`FPCGMetadataBooleanElement::DoOperation()` で実際の論理演算が実行されます。

## 注意事項

1. **ブール型限定**: このノードはブール型の属性のみをサポートします。数値やその他の型には使用できません
2. **Not演算の特性**: Not演算は単項演算のため、InputSource2は非表示になります
3. **条件組み合わせ**: 複雑な条件を作成する場合、複数のBooleanノードを連結する必要があります
4. **フィルタリング連携**: Filter By Attributeノードと組み合わせることで、複雑な条件でのフィルタリングが可能です

## 関連ノード
- **Attribute Bitwise Op**: ビット演算（整数値）を実行
- **Attribute Maths Op**: 算術演算を実行
- **Attribute Compare**: 属性の比較演算を実行
- **Filter By Attribute**: ブール属性によるフィルタリング

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBooleanOpElement.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataBooleanOpElement.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
