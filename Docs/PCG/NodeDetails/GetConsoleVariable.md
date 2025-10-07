# Get Console Variable ノード

## 概要

Get Console Variableノードは、指定されたコンソール変数（CVar）の値を読み取り、その値をアトリビュートセットに書き込みます。このノードは、実行時の設定やデバッグパラメータに基づいてPCGグラフの動作を動的に制御するために使用されます。

**ノードパス**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGGetConsoleVariable.h`

**カテゴリ**: Generic (汎用)

**重要**: コンソール変数を設定しても、自動的に再生成はトリガーされません。

## 機能詳細

このノードは以下の機能を提供します:

1. **コンソール変数の読み取り**: 指定された名前のコンソール変数を検索して値を取得
2. **型自動検出**: Bool、Int、Float、String型のコンソール変数を自動的に識別
3. **アトリビュートセット出力**: 読み取った値をパラメータデータとして出力
4. **エラーハンドリング**: 変数が見つからない場合や型がサポートされていない場合のエラー報告

## プロパティ

### UPCGGetConsoleVariableSettings

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|-----|------------|------|
| **ConsoleVariableName** | FName | NAME_None | 読み取るコンソール変数の名前 |
| **OutputAttributeName** | FName | NAME_None | 出力アトリビュートの名前（空の場合は変数名を使用） |

#### プロパティの詳細

**ConsoleVariableName**
- オーバーライド可能: はい（`PCG_Overridable`）
- 用途: 読み取るコンソール変数を指定
- 例: `r.PCG.Debug`, `pcg.GraphCache.Enabled`

**OutputAttributeName**
- オーバーライド可能: はい（`PCG_Overridable`）
- 用途: 出力されるアトリビュートの名前をカスタマイズ
- 空の場合、コンソール変数名がそのまま使用されます

### ピン設定

#### 入力ピン
- なし（入力データを必要としない）

#### 出力ピン
- **Out**: `EPCGDataType::Param` - コンソール変数の値を含むパラメータデータ

## 使用例

### 基本的な使用方法

```cpp
// デバッグモードフラグを取得
// ConsoleVariableName: "pcg.Debug"
// OutputAttributeName: "IsDebugMode"

// グラフエディタでの設定:
// [Get Console Variable] -> [Branch] -> 条件に応じた処理
```

### デバッグフラグに基づく条件分岐

```
[Get Console Variable: "pcg.Debug"]
            ↓
    [Branch Node]
      ↙        ↘
 Debug処理    通常処理
```

### 品質設定の取得例

```cpp
// コンソールでの設定:
// r.PCG.Quality 2

// PCGグラフ:
// [Get Console Variable: "r.PCG.Quality"] -> [Quality Select]
```

## 実装の詳細

### ExecuteInternal メソッド

```cpp
bool FPCGGetConsoleVariableElement::ExecuteInternal(FPCGContext* Context) const
{
    // コンソール変数の取得
    IConsoleVariable* ConsoleVariable = IConsoleManager::Get()
        .FindConsoleVariable(*Settings->ConsoleVariableName.ToString());

    if (!ConsoleVariable)
    {
        // エラー: 変数が見つからない
        PCGE_LOG(Error, GraphAndLog,
            FText::Format(LOCTEXT("FailedToFindCVar", "Failed to find console variable '{0}'."),
                FText::FromName(Settings->ConsoleVariableName)));
        return true;
    }

    // パラメータデータの作成
    UPCGParamData* OutParamData = FPCGContext::NewObject_AnyThread<UPCGParamData>(Context);

    // 型に応じた処理
    if (ConsoleVariable->IsVariableBool())
    {
        CreateAttribute<bool>(ConsoleVariable->GetBool());
    }
    else if (ConsoleVariable->IsVariableInt())
    {
        CreateAttribute<int>(ConsoleVariable->GetInt());
    }
    else if (ConsoleVariable->IsVariableFloat())
    {
        CreateAttribute<float>(ConsoleVariable->GetFloat());
    }
    else if (ConsoleVariable->IsVariableString())
    {
        CreateAttribute<FString>(ConsoleVariable->GetString());
    }

    return true;
}
```

### サポートされる型

| コンソール変数の型 | PCGアトリビュート型 | 説明 |
|------------------|-------------------|------|
| Bool | bool | true/falseの値 |
| Int | int | 整数値 |
| Float | float | 浮動小数点値 |
| String | FString | 文字列値 |

## パフォーマンス考慮事項

### 最適化のポイント

1. **軽量処理**: コンソール変数の読み取りは非常に高速
2. **キャッシュ不可**: コンソール変数は実行時に変更される可能性があるため、結果はキャッシュされません
3. **スレッドセーフ**: メインスレッドから実行されることを想定

### パフォーマンスへの影響

- **処理時間**: 最小限（O(1)ルックアップ）
- **メモリ使用**: 非常に少ない（単一の値のみ）

### ベストプラクティス

1. **変数名の確認**: 存在するコンソール変数名を使用
2. **デフォルト処理**: 変数が見つからない場合の代替処理を用意
3. **型の一致**: 下流のノードで期待される型と一致させる

## 関連ノード

- **Get Actor Property**: アクターのプロパティ値を取得
- **Get Property From Object Path**: オブジェクトパスからプロパティを取得
- **Branch**: 取得した値に基づく条件分岐
- **Quality Select**: 品質レベルに基づく選択

## バージョン情報

- **導入バージョン**: Unreal Engine 5.x
- **最終更新**: UE 5.5+

## 注意事項

1. **再生成トリガーなし**: コンソール変数を変更しても、自動的にPCGコンポーネントは再生成されません
2. **変数の存在確認**: 変数名のタイプミスに注意してください。エラーログを確認してください
3. **型の制限**: サポートされていない型のコンソール変数はエラーになります
4. **グローバル設定**: コンソール変数はグローバル設定であり、すべてのPCGコンポーネントで共有されます

## トラブルシューティング

### よくある問題

**問題**: 変数が見つからないエラーが出る
- **解決策**: コンソール変数名が正しいか確認。コンソールで`help <変数名>`を実行して存在を確認

**問題**: 値が期待と異なる
- **解決策**: コンソールで`<変数名>`を入力して現在の値を確認

**問題**: 再生成されない
- **解決策**: コンソール変数を変更した後、手動でPCGコンポーネントを再生成する必要があります

## コンソールコマンド例

```
// PCG関連の主要なコンソール変数
pcg.Debug 1                    // デバッグ情報を有効化
pcg.GraphCache.Enabled 0       // グラフキャッシュを無効化
r.PCG.Quality 2                // 品質レベルを設定
pcg.Seed 12345                 // シード値を設定
```
