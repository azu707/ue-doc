# Visualize Attribute

- **日本語名**: 属性を視覚化
- **カテゴリ**: Debug (デバッグ) — 5件
- **実装クラス**: `UPCGVisualizeAttributeSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGVisualizeAttribute.h:15`

## 概要

ポイントのトランスポートごとに、画面上に選択した属性を視覚化します<br><span style='color:gray'>(Visualizes a selected attribute on screen at each point's transform.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `AttributeSource` | `FPCGAttributePropertyInputSelector` | なし | 可視化する属性。各ポイント近傍に値を描画します。 |
| `CustomPrefixString` | `FString` | なし | 表示文字列の先頭に追加する任意のテキスト。 |
| `bPrefixWithIndex` | `bool` | `true` | ポイントインデックスを前置するか。 |
| `bPrefixWithAttributeName` | `bool` | `false` | 属性名を前置するか。 |
| `LocalOffset` | `FVector` | `(0, 0, 0)` | ポイント位置からの表示オフセット。 |
| `Color` | `FColor` | `FColor::Cyan` | 描画するテキストカラー。 |
| `Duration` | `double` | `30.0` | 表示を維持する時間（秒）。 |
| `PointLimit` | `int32` | `4096` | 可視化するポイント数の上限。 |
| `bVisualizeEnabled` | `bool` | `true` | 可視化処理を有効にするフラグ。 |
