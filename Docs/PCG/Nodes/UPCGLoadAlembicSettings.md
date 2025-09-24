# Load Alembic

- **カテゴリ**: InputOutput (入力/出力) — 7件
- **実装クラス**: `UPCGLoadAlembicSettings`
- **定義**: `Engine/Plugins/PCGInterops/PCGExternalDataInterop/Source/PCGExternalDataInterop/Public/Elements/PCGLoadAlembicElement.h:18`

## 概要

データを Alembic ファイルからロードします<br><span style='color:gray'>(Loads data from an Alembic file)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `AttributeMapping` | `TMap<FString, FPCGAttributePropertyInputSelector>` | 空 | Alembic 内のプロパティ名（キー）を PCG の属性／ポイントプロパティ（値）に割り当てて追加データを格納します。未指定の場合は座標など基本情報のみを取り込みます。 |
| `AlembicFilePath` | `FFilePath` | なし | 読み込む `.abc` ファイルへのパス。エディタからファイルブラウザで選択できます。 |
| `ConversionScale` | `FVector` | `(1.0, -1.0, 1.0)` | インポート時に適用するスケール。既定値は Y 軸を反転して左手系↔右手系の違いを吸収します。 |
| `ConversionRotation` | `FVector` | `(0, 0, 0)` | インポート時に適用するオイラー角。3ds Max の座標系から変換する場合は `(90, 0, 0)` が推奨です。 |
| `bConversionFlipHandedness` | `bool` | `false` | `true` にすると座標系の利き手変換時に回転の向きを反転し、スウィズル設定と組み合わせて正しい姿勢を維持します。 |
| `Setup`<br><span style='color:gray'>(エディタ専用)</span> | `EPCGLoadAlembicStandardSetup` | `None` | 代表的なプリセット（例: City Sample 向け）から `ConversionScale` などを一括設定します。エディタ上のみ利用できる補助オプションです。 |
