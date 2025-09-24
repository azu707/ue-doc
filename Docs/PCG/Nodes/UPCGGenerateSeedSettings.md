# Generate Seed

- **カテゴリ**: Metadata (メタデータ) — 33件
- **実装クラス**: `UPCGGenerateSeedSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGenerateSeedElement.h:18`

## 概要

シード属性を生成します <br><span style='color:gray'>(Generate a seed attribute )</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `GenerationSource` | `EPCGGenerateSeedSource` | `EPCGGenerateSeedSource::RandomStream` | シード値生成に使用するソース（ランダムストリーム、属性ハッシュなど）。 |
| `SourceString` | `FString` | なし | 文字列をハッシュ化して各ポイントのシードを生成する場合の元テキスト。 |
| `SeedSource` | `FPCGAttributePropertyInputSelector` | なし | シード生成元となる属性。 |
| `bResetSeedPerInput` | `bool` | `true` | 入力ごとにシードをリセットし、処理順の影響を受けないようにします。 |
| `OutputTarget` | `FPCGAttributePropertyOutputSelector` | なし | 生成したシードを書き込む属性名。 |
