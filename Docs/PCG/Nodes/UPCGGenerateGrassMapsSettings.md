# Generate Grass Maps

- **日本語名**: 草マップを生成
- **カテゴリ**: GPU (GPU) — 2件
- **実装クラス**: `UPCGGenerateGrassMapsSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGenerateGrassMaps.h:20`

## 概要

ランドスケープ草マップを GPU で生成します<br><span style='color:gray'>(Generates landscape grass maps on the GPU.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `SelectedGrassTypes` | `TArray<FString>` | 空 | 入力ランドスケープから生成する草タイプのリスト。`bOverrideFromInput` が無効のときのみ使用されます。 |
| `bOverrideFromInput` | `bool` | `false` | `true` の場合、入力ピン「Grass Types」から草タイプ名を受け取り、`SelectedGrassTypes` を無視します。 |
| `GrassTypesAttribute` | `FPCGAttributePropertyInputSelector` | なし | `bOverrideFromInput` 有効時に、オーバーライド入力から草タイプ名を抽出する属性を指定します。 |
| `bExcludeSelectedGrassTypes` | `bool` | `true` | 指定した草タイプを除外モードで扱います。`true` なら選択リスト以外を生成し、`false` ならリスト内のみ生成します。 |
| `bSkipReadbackToCPU` | `bool` | `false` | GPU 生成したテクスチャの CPU 読み戻しをスキップします。エディタでのデバッグ用途よりも高速化を優先する場合に有効です。 |

## 実装メモ

- 入力はランドスケープデータ 1 系統のみサポートし、`bOverrideFromInput` 有効時は追加で草タイプ上書きピンが必須になります。<br><span style='color:gray'>(The node expects a single landscape input and optionally a second pin for overrides when enabled.)</span>
- 実行コンテキストでは `FPCGGenerateGrassMapsContext` がランドスケープコンポーネントをフィルタリングし、選択された草タイプだけを GPU エクスポートに渡します。除外モードではフィルタ結果を反転します。<br><span style='color:gray'>(The context filters landscape components and flips the type set when exclusion is enabled.)</span>
- `bSkipReadbackToCPU` を有効にすると、生成直後の `UPCGTextureData` は GPU 上のターゲットを直接参照し、CPU 側の初期化コストを抑えますが、即座の CPU 読み込みが必要な処理では未初期化として扱われる点に留意してください。<br><span style='color:gray'>(Skipping CPU readback keeps GPU render targets alive but leaves CPU-side texture data uninitialized.)</span>
