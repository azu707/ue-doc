# Get Property From Object Path ノード

## 概要
Get Property From Object Pathノードは、オブジェクトパス（FSoftObjectPath）のリストからオブジェクトをロードし、そのプロパティ値を抽出してアトリビュートセットとして出力するノードです。非同期ロードをサポートし、エディタ外のアセットにも動的にアクセスできます。

**実装クラス**: `UPCGGetPropertyFromObjectPathSettings`
**カテゴリ**: Param（パラメータ）
**実装ファイル**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGGetPropertyFromObjectPath.cpp`

## 機能詳細

### 主な機能
1. **オブジェクトパスからのロード**: FSoftObjectPath形式でオブジェクトを指定してロード
2. **プロパティ抽出**: ロードしたオブジェクトのプロパティ値を抽出
3. **非同期ロード**: デフォルトで非同期ロード、オプションで同期ロードも可能
4. **動的追跡**: エディタビルドでオブジェクト変更を追跡
5. **静的パスと動的パス**: 固定パスリストまたは入力からのパス取得を選択可能

## ピン構成
- **入力ピン**:
  - `In` (Param型): パスを含むアトリビュートセット（オプション）
- **出力ピン**:
  - `Out` (Param型): 抽出されたプロパティを含むアトリビュートセット

## プロパティ

### ObjectPathsToExtract
**型**: `TArray<FSoftObjectPath>`
**デフォルト値**: 空の配列
**説明**: Inピンが未接続の場合に使用する静的なオブジェクトパスのリスト

### InputSource
**型**: `FPCGAttributePropertyInputSelector`
**説明**: Inピンが接続されている場合、パス値を取得するアトリビュート名
**オーバーライド可能**: はい

### PropertyName
**型**: `FName`
**デフォルト値**: `NAME_None`
**説明**: 抽出するプロパティ名。`NAME_None`の場合、オブジェクト全体を抽出
**オーバーライド可能**: はい

### bForceObjectAndStructExtraction
**型**: `bool`
**デフォルト値**: `false`
**説明**: 構造体/オブジェクト型のプロパティを強制的に展開してサブプロパティを抽出

### OutputAttributeName
**型**: `FPCGAttributePropertyOutputSelector`
**デフォルト値**: `@Source`（新規ノード）、`NAME_None`（既存ノード）
**説明**: 出力アトリビュート名（複数プロパティ抽出時は無視）
**オーバーライド可能**: はい

### bSanitizeOutputAttributeName
**型**: `bool`
**デフォルト値**: `true`（新規ノード）、`false`（既存ノード）
**説明**: 出力アトリビュート名の特殊文字を削除

### bSynchronousLoad
**型**: `bool`
**デフォルト値**: `false`
**説明**: trueの場合、同期ロードを強制（デバッグ用）

### bPersistAllData
**型**: `bool`
**デフォルト値**: `false`
**説明**: 抽出に失敗した場合でも空のデータを出力（入出力数を一致させる）

### bSilenceErrorOnEmptyObjectPath
**型**: `bool`
**デフォルト値**: `false`
**説明**: 空のオブジェクトパスのエラーを抑制

## 実装の詳細

### PrepareDataInternalメソッド
オブジェクトの非同期ロードを初期化します:

```cpp
bool FPCGGetPropertyFromObjectPathElement::PrepareDataInternal(FPCGContext* Context) const
{
    FPCGLoadObjectsFromPathContext* ThisContext = static_cast<FPCGLoadObjectsFromPathContext*>(Context);
    
    return ThisContext->InitializeAndRequestLoad(
        PCGPinConstants::DefaultInputLabel,
        Settings->InputSource,
        Settings->ObjectPathsToExtract,
        Settings->bPersistAllData,
        Settings->bSilenceErrorOnEmptyObjectPath,
        Settings->bSynchronousLoad
    );
}
```

### ExecuteInternalメソッド
ロードされたオブジェクトからプロパティを抽出します:

```cpp
bool FPCGGetPropertyFromObjectPathElement::ExecuteInternal(FPCGContext* Context) const
{
    for (const TTuple<FSoftObjectPath, int32, int32>& SoftPathAndIndex : ThisContext->PathsToObjectsAndDataIndex)
    {
        const UObject* Object = SoftPath.ResolveObject();
        if (!Object) continue;

        PCGPropertyHelpers::FExtractorParameters Parameters(
            Object, 
            Object->GetClass(), 
            Settings->PropertyName.ToString(), 
            OutputAttributeName, 
            Settings->bForceObjectAndStructExtraction, 
            /*bPropertyNeedsToBeVisible=*/true
        );
        Parameters.bStrictSanitizeOutputAttributeNames = Settings->bSanitizeOutputAttributeName;

        if (UPCGParamData* ParamData = PCGPropertyHelpers::ExtractPropertyAsAttributeSet(Parameters, Context))
        {
            AddToOutput(ParamData, Index);
            // 動的追跡を追加
            DynamicTrackingHelper.AddToTracking(FPCGSelectionKey::CreateFromPath(SoftPath), false);
        }
    }

    return true;
}
```

## 使用例

### 例1: 静的アセットのプロパティ取得
```
1. ObjectPathsToExtractに"/Game/Materials/M_Base.M_Base"を追加
2. PropertyNameに"BaseColor"を設定
3. 出力: マテリアルのBaseColorパラメータ値
```

### 例2: 動的パスからの取得
```
1. Load Data Tableノードで複数のアセットパスを含むデータテーブルをロード
2. Get Property From Object PathノードのInピンに接続
3. InputSourceでパスアトリビュート名を指定
4. 出力: 各アセットのプロパティ値
```

### 例3: 複数オブジェクトの一括プロパティ取得
```
1. ObjectPathsToExtractに複数のアセットパスを追加
2. PropertyNameに"StaticMesh"を設定
3. 出力: 各アセットのStaticMeshプロパティ
```

## パフォーマンス考慮事項

1. **非同期ロード**: デフォルトで非同期ロードのため、大量のアセットでもフレームレートへの影響が少ない
2. **キャッシュ無効**: 動的追跡のため、このノードはキャッシュ不可
3. **ロード時間**: アセットサイズに応じてロード時間が変動
4. **メインスレッド実行**: オブジェクトアクセスの安全性のため、メインスレッドでのみ実行

## 関連ノード

- **Get Actor Property**: アクタープロパティを取得
- **Load PCG Data Asset**: PCGデータアセットをロード
- **Get Console Variable**: コンソール変数を取得

## 注意事項

1. **パスの正確性**: オブジェクトパスは正確でなければならず、誤ったパスはエラーになります
2. **ロード失敗**: オブジェクトのロードに失敗した場合、そのデータはスキップされます（bPersistAllDataがfalseの場合）
3. **メタデータ互換性**: PCGメタデータと互換性のある型のみサポート
4. **動的追跡の制限**: Inピンが接続されている場合のみ動的追跡が有効
5. **同期ロードの注意**: bSynchronousLoadをtrueにすると、フレームレートに影響する可能性があります
