# Break Transform Attribute

## 概要
Break Transform Attributeノードは、トランスフォーム属性を個別の成分（位置、回転、スケール）に分解します。FTransform型の属性を3つの個別のベクトル/ローテーター属性に分割する際に使用されます。

## 機能詳細
このノードはトランスフォーム型の属性を受け取り、位置（Translation）、回転（Rotation）、スケール（Scale3D）を個別の出力ピンとして提供します。

### 主な機能
- **トランスフォーム分解**: トランスフォーム属性を位置、回転、スケールに分解
- **複数出力**: Translation、Rotation、Scale3Dを個別の出力ピンで提供
- **異なる出力型**: 各成分は適切な型（Vector、Rotator/Quaternion、Vector）で出力

### 処理フロー
1. 入力トランスフォーム属性を取得
2. 位置、回転、スケール成分を抽出
3. 個別の成分を対応する出力ピンに出力

## プロパティ

### InputSource
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **説明**: 分解するトランスフォーム属性を選択
- **サポートされる型**: FTransform

## 使用例

### トランスフォームの分解
```
// トランスフォームを個別の成分に分解
InputSource: Transform (Transform)
出力:
  Translation: 位置ベクトル（Vector）
  Rotation: 回転（Rotator/Quaternion）
  Scale3D: スケールベクトル（Vector）
```

### 位置のみを使用
```
// トランスフォームから位置のみを抽出
InputSource: ActorTransform (Transform)
使用する出力: Translation
結果: 位置ベクトルのみを他のノードで使用可能
```

### 回転のみを使用
```
// トランスフォームから回転のみを抽出
InputSource: Transform (Transform)
使用する出力: Rotation
結果: 回転情報のみを他のノードで使用可能
```

### スケールの調整
```
// トランスフォームからスケールを抽出して調整
InputSource: Transform (Transform)
出力: Scale3D
→ Attribute Maths Op（乗算）で2倍に
→ Make Transform Attributeで新しいトランスフォームを作成
結果: スケールのみが2倍になったトランスフォーム
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **サポートされる型**: FTransform
- **異なる出力型**: `HasDifferentOutputTypes()` が `true` - 各出力が異なる型
- **デフォルト値型**: EPCGMetadataTypes::Transform

### 出力構造
トランスフォームは3つの成分に分解されます:

1. **Translation（位置）**
   - 型: FVector
   - トランスフォームの位置成分

2. **Rotation（回転）**
   - 型: FRotator または FQuat
   - トランスフォームの回転成分

3. **Scale3D（スケール）**
   - 型: FVector
   - トランスフォームのスケール成分（各軸のスケール値）

### 出力ピンラベル
- "Translation"
- "Rotation"
- "Scale3D"

### 出力属性名
- デフォルトでは、BaseName_Translation、BaseName_Rotation、BaseName_Scale3Dの形式
- 例: ActorTransform_Translation、ActorTransform_Rotation、ActorTransform_Scale3D

## 注意事項

1. **型の一致**: 入力はFTransform型である必要があります
2. **固定の成分数**: 常に3つの出力（Translation、Rotation、Scale3D）を生成します
3. **未使用の出力**: すべての出力を使用する必要はありません（必要な成分のみ接続可能）
4. **回転の型**: Rotationの出力型はFRotatorまたはFQuatのいずれかです
5. **属性名**: 出力属性名は入力属性名に基づいて自動生成されます

## 関連ノード
- **Make Transform Attribute**: 個別の成分からトランスフォームを作成（逆操作）
- **Break Vector Attribute**: ベクトルを成分に分解
- **Attribute Transform Op**: トランスフォーム演算
- **Transform Points**: ポイントをトランスフォームで変換

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataBreakTransform.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataBreakTransform.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
