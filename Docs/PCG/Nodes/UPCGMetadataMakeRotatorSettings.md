# Make Rotator Attribute

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGMetadataMakeRotatorSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/Metadata/PCGMetadataMakeRotator.h:39`

## 概要

ピッチ・ヨー・ロールから Rotator 属性を生成します。<br><span style='color:gray'>(Builds a rotator attribute from pitch, yaw, and roll inputs.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `InputSource1` | `FPCGAttributePropertyInputSelector` | なし | ローテータ生成に利用する第一入力。 |
| `InputSource2` | `FPCGAttributePropertyInputSelector` | なし | 第二入力。 |
| `InputSource3` | `FPCGAttributePropertyInputSelector` | なし | 第三入力。 |
| `Operation` | `EPCGMetadataMakeRotatorOp` | `EPCGMetadataMakeRotatorOp::MakeRotFromAxes` | 軸ベクトルから作る、ピッチ・ヨー・ロールから作るなど、ローテータの組み立て方法を選びます。 |
