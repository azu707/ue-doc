# Sanity Check Point Data

- **カテゴリ**: Debug (デバッグ) — 5件
- **実装クラス**: `UPCGSanityCheckPointDataSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGSanityCheckPointData.h:9`

## 概要

ポイントデータの整合性チェックを行い、不正値やゼロ範囲を検出します。<br><span style='color:gray'>(Validates point data to catch invalid values or zero extents.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `MinPointCount` | `int32` | `0` | 許容するポイント数の下限。 |
| `MaxPointCount` | `int32` | `100` | 許容するポイント数の上限。 |
