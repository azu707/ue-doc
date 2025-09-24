# Normal To Density

- **カテゴリ**: Spatial (空間) — 48件
- **実装クラス**: `UPCGNormalToDensitySettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGNormalToDensity.h:24`

## 概要

ポイント法線の方向から密度を計算し、傾きに応じた重みを付けます。<br><span style='color:gray'>(Derives density from point normals so slope influences sampling weight.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `Normal` | `FVector` | `FVector::UpVector` | 比較対象となる基準法線。ポイントの法線とのズレ量から密度を計算します。<br><span style='color:gray'>(The normal to compare against)</span> |
| `Offset` | `double` | `0.0` | 法線とのずれを加算・減算して結果をバイアスします。正の値で基準側に寄せ、負の値で離れた方向を強調します。 |
| `Strength` | `double` | `1.0` | 出力密度に指数カーブを掛けてメリハリを調整します（結果 = 結果^(1/Strength)）。 |
| `DensityMode` | `PCGNormalToDensityMode` | `PCGNormalToDensityMode::Set` | 計算結果を既存の密度へどう適用するか（置き換え・乗算など）を指定します。 |
