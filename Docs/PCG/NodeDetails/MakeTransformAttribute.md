# Make Transform Attribute

## 概要
Make Transform Attributeノードは、位置（Translation）、回転（Rotation）、スケール（Scale）の3つの成分からトランスフォーム属性を構築します。Break Transform Attributeの逆操作を行います。

## 機能詳細
このノードは個別の位置、回転、スケール属性を組み合わせて、完全なFTransform型の属性を作成します。

### 主な機能
- **トランスフォーム構築**: 3つの成分から完全なトランスフォームを作成
- **柔軟な入力**: Vector、Rotator、Vector型の入力を受け付け
- **固定入力数**: 常に3つの入力（Translation、Rotation、Scale）

### 処理フロー
1. 位置ベクトルを取得（InputSource1）
2. 回転を取得（InputSource2）
3. スケールベクトルを取得（InputSource3）
4. これらを組み合わせてトランスフォームを構築
5. 結果を出力属性に書き込み

## プロパティ

### InputSource1
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **ピンラベル**: Translation
- **説明**: トランスフォームの位置（平行移動）成分
- **入力型**: FVector

### InputSource2
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **ピンラベル**: Rotation
- **説明**: トランスフォームの回転成分
- **入力型**: FRotator または FQuat

### InputSource3
- **型**: FPCGAttributePropertyInputSelector
- **PCG_Overridable**: あり
- **ピンラベル**: Scale
- **説明**: トランスフォームのスケール成分
- **入力型**: FVector（各軸のスケール値）

## 使用例

### 個別の成分からトランスフォームを構築
```
// 位置、回転、スケールからトランスフォームを作成
InputSource1 (Translation): Position (Vector, 例: (100, 200, 50))
InputSource2 (Rotation): Rotation (Rotator, 例: (0, 90, 0))
InputSource3 (Scale): Scale (Vector, 例: (1, 1, 2))
結果: 完全なトランスフォーム
```

### Break/Make の組み合わせ
```
// トランスフォームを分解して、スケールのみ変更して再構築
1. Break Transform Attribute
   → Translation, Rotation, Scale
2. Attribute Maths Op（Scaleを2倍）
3. Make Transform Attribute
   → 新しいトランスフォーム（スケールのみ変更）
```

### カスタム位置でのトランスフォーム作成
```
// カスタム位置に標準的な回転とスケールを適用
InputSource1: CustomPosition (Vector)
InputSource2: デフォルト回転 (0, 0, 0)
InputSource3: 均一スケール (1, 1, 1)
結果: カスタム位置のトランスフォーム
```

### アクタートランスフォームの調整
```
// アクタートランスフォームを取得して調整
1. Get Actor Dataでトランスフォームを取得
2. Break Transform Attributeで分解
3. 各成分を個別に調整
4. Make Transform Attributeで再構築
結果: 調整されたトランスフォーム
```

## 実装の詳細

### 基底クラス
- **Settings**: `UPCGMetadataSettingsBase`
- **Element**: `FPCGMetadataElementBase`

### 特徴
- **固定オペランド数**: 常に3つの入力（`GetOperandNum()` = 3）
- **出力型**: FTransform
- **固定ピン構造**: Translation、Rotation、Scaleの3ピン

### ピンラベル定数
- `PCGMetadataTransformConstants::Translation` = "Translation"
- `PCGMetadataTransformConstants::Rotation` = "Rotation"
- `PCGMetadataTransformConstants::Scale` = "Scale"

### サポートされる入力型
1. **Translation**: FVector
2. **Rotation**: FRotator、FQuat
3. **Scale**: FVector

### トランスフォーム構築
```cpp
FTransform(Rotation, Translation, Scale)
```
この順序で内部的にトランスフォームが構築されます。

## 注意事項

1. **すべての入力が必須**: 3つすべての入力が必要です
2. **スケールのゼロ値**: スケールが0の場合、予期しない結果になる可能性があります
3. **回転の型**: RotatorとQuaternion両方をサポートしますが、内部的にQuaternionに変換されます
4. **スケールの方向**: 負のスケール値は反転を引き起こします
5. **トランスフォームの順序**: Scale → Rotation → Translation の順で適用されます

## 関連ノード
- **Break Transform Attribute**: トランスフォームを分解（逆操作）
- **Make Rotator Attribute**: ローテーターを作成
- **Make Vector Attribute**: ベクトルを作成
- **Attribute Transform Op**: トランスフォーム演算
- **Transform Points**: ポイントをトランスフォームで変換

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMakeTransform.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/Metadata/PCGMetadataMakeTransform.cpp`
- **基底クラス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataOpElementBase.h`
