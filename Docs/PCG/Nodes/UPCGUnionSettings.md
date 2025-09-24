# Union

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGUnionSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGUnionElement.h:10`

## 概要

空間データを結合して、すべての入力の共用体にします。入力の順序が考慮され、動的ピンの入力から始まります<br><span style='color:gray'>(Combine spatial data into a union of all inputs. Order of inputs is respected, beginning with the dynamic pin inputs.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Type` | `EPCGUnionType` | `EPCGUnionType::LeftToRightPriority` | 複数入力を結合する際の優先順位や密度の扱いを指定します。 |
| `DensityFunction` | `EPCGUnionDensityFunction` | `EPCGUnionDensityFunction::Maximum` | 結合時に密度をどのように合成するか（最大値、平均など）を選択します。 |
