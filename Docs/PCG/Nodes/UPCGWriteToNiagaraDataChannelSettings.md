# Write To Niagara Data Channel

- **日本語名**: Niagaraデータチャンネルに書き込む
- **カテゴリ**: Generic (汎用) — 25件
- **実装クラス**: `UPCGWriteToNiagaraDataChannelSettings`
- **定義**: `Engine/Plugins/Experimental/PCGInterops/PCGNiagaraInterop/Source/PCGNiagaraInterop/Public/Elements/PCGWriteToNiagaraDataChannel.h:17`

## 概要

Niagara データチャンネルにポイント情報を書き込み、エフェクト側で利用できるようにします。<br><span style='color:gray'>(Writes point data into a Niagara data channel for FX consumption.)</span>

## 設定項目


| プロパティ | 型 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `DataChannel` | `TSoftObjectPtr<UNiagaraDataChannelAsset>` | なし | 書き込み先の Niagara Data Channel。 |
| `NiagaraVariablesPCGAttributeMapping` | `TMap<FName, FPCGAttributePropertyInputSelector>` | なし | PCG 属性と Niagara 変数のマッピング。 |
| `bVisibleToGame` | `bool` | `true` | ゲーム ロジックからチャネルデータを参照可能にします。 |
| `bVisibleToCPU` | `bool` | `true` | Niagara CPU エミッタから参照可能にします。 |
| `bVisibleToGPU` | `bool` | `false` | Niagara GPU エミッタから参照可能にします。 |
| `bSynchronousLoad` | `bool` | `false` | データチャンネル アセットを同期ロードします。 |
