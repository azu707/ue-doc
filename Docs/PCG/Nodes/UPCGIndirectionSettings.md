# Proxy

- **日本語名**: プロキシ
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGIndirectionSettings`
- **定義**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGIndirectionElement.h:20`

## 概要

別の設定オブジェクトを実行します。オーバーライドされる可能性があります<br><span style='color:gray'>(Executes another settings object, which can be overridden.)</span>

## 設定項目

| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `ProxyInterfaceMode` | `EPCGProxyInterfaceMode` | `BySettings` | ピン構成の決定方法。ネイティブ設定、ブループリント要素、ローカル設定のいずれかを指定します。 |
| `SettingsClass` | `TSubclassOf<UPCGSettings>` | なし | `ProxyInterfaceMode == ByNativeElement` のときに参照する設定クラス。 |
| `BlueprintElementClass` | `TSubclassOf<UPCGBlueprintElement>` | なし | `ProxyInterfaceMode == ByBlueprintElement` の場合に使用するブループリント要素。 |
| `Settings` | `UPCGSettings*` | `null` | 実際に実行される設定インスタンス。オーバーライド可能で、`ProxyInterfaceMode == BySettings` でピン構成も決定します。 |
| `bTagOutputsBasedOnOutputPins` | `bool` | `true` | 出力ピン名を元にタグ名を付与し、出力データに反映します。 |

## 実装メモ

- ノードは内部に別の PCG ノードを保持し、その設定に応じて入力／出力ピンをプロキシ化します。設定が変わると動的にピン定義が再構築されます。<br><span style='color:gray'>(The proxy rebuilds its pin map whenever the inner settings class changes.)</span>
- `Settings` にアサインされたインスタンスは実行時に複製され、内側の `IPCGElement` がセットアップされます。タグ出力オプションを有効にしておくと、内側のピン名を `FPCGTaggedData::Pin` にコピーしデバッグしやすくなります。<br><span style='color:gray'>(Tagged outputs inherit pin labels when `bTagOutputsBasedOnOutputPins` stays true.)</span>
- プロキシはキャッシュ不可で、メインスレッド制限もないものの GPU 常駐データをパススルーできるよう設計されています。<br><span style='color:gray'>(It forwards GPU resident data and disables caching to account for mutable inner settings.)</span>
