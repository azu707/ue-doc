# Copy Attributes (Attribute Transfer) - 非推奨

## 概要

Copy Attributes (Attribute Transfer)ノードは、ソースデータからターゲットデータへ属性をコピーする非推奨のノードです。このノードは**Unreal Engine 5.5で非推奨**となり、`UPCGCopyAttributesSettings`を使用するように変更されました。

**ノードタイプ**: Metadata
**クラス**: `UPCGAttributeTransferSettings` (非推奨)
**エレメント**: `FPCGCopyAttributesElement`（基底クラスから継承）
**基底クラス**: `UPCGCopyAttributesSettings`
**非推奨バージョン**: Unreal Engine 5.5
**代替ノード**: Copy Attributes (`UPCGCopyAttributesSettings`)

## 非推奨の理由

このクラスは、`UPCGCopyAttributesSettings`に統合されました。機能的には同一ですが、以下の理由で非推奨となりました:

1. **コードの統合**: 複数の類似クラスを1つに統合してメンテナンスを簡素化
2. **API の整理**: PCG プラグインのAPIをより明確にするため
3. **重複の削減**: 同じ機能を持つクラスの重複を避けるため

## 実装の詳細

### クラス定義

```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UE_DEPRECATED(5.5, "Use UPCGCopyAttributeSettings")
UPCGAttributeTransferSettings : public UPCGCopyAttributesSettings
{
    GENERATED_BODY()

public:
    UPCGAttributeTransferSettings()
        : UPCGCopyAttributesSettings()
    {
#if WITH_EDITOR
        bExposeToLibrary = false;  // ライブラリに公開しない
#endif

        // CopyAttributesから継承したデフォルト値をリセット
        // Attribute Transferのデフォルト値に戻す
        InputSource = FPCGAttributePropertyInputSelector();
        OutputTarget = FPCGAttributePropertyOutputSelector();
    }
};
```

### デフォルト値の違い

このクラスは、`UPCGCopyAttributesSettings`から継承していますが、コンストラクタでデフォルト値をリセットしています:

- **InputSource**: 空のセレクター（デフォルト状態）
- **OutputTarget**: 空のセレクター（デフォルト状態）

これは、元のAttribute Transferノードの動作を維持するための措置です。

### エディタでの扱い

```cpp
bExposeToLibrary = false;
```

このフラグにより、エディタのノードライブラリには表示されません。既存のグラフとの互換性のためにのみ存在します。

## 移行ガイド

### 既存のグラフの扱い

既存のグラフで`UPCGAttributeTransferSettings`を使用している場合:

1. **自動変換**: エンジンが自動的に`UPCGCopyAttributesSettings`として扱います
2. **警告表示**: エディタで非推奨の警告が表示される場合があります
3. **機能は維持**: 既存の動作は完全に維持されます

### 新しいグラフでの使用

新しいグラフを作成する場合:

1. **Copy Attributesノードを使用**: 標準の`UPCGCopyAttributesSettings`を使用してください
2. **同じ設定が可能**: すべての機能が`UPCGCopyAttributesSettings`で利用可能です

### 設定の移行例

**旧: Attribute Transfer**
```
UPCGAttributeTransferSettings:
  InputSource.AttributeName = "Height"
  OutputTarget.AttributeName = "Z"
```

**新: Copy Attributes**
```
UPCGCopyAttributesSettings:
  InputSource.AttributeName = "Height"
  OutputTarget.AttributeName = "Z"
```

設定は完全に同一です。

## プロパティ

すべてのプロパティは`UPCGCopyAttributesSettings`から継承されます。詳細は[CopyAttributes.md](CopyAttributes.md)を参照してください。

### 主要プロパティ（継承）

| プロパティ名 | 型 | 説明 |
|------------|------|------|
| InputSource | FPCGAttributePropertyInputSelector | コピー元の属性またはプロパティ |
| OutputTarget | FPCGAttributePropertyOutputSelector | コピー先の属性またはプロパティ |

## 関連ノード

- **Copy Attributes (UPCGCopyAttributesSettings)**: 推奨される代替ノード
- **Copy Attributes (UPCGMetadataOperationSettings)**: 同じく非推奨の類似ノード
- **Match And Set Attributes**: より高度な属性操作

## 注意事項

1. **新規使用は非推奨**: 新しいプロジェクトではこのノードを使用しないでください
2. **既存グラフは動作**: 既存のグラフは引き続き動作しますが、移行を検討してください
3. **将来的な削除**: 将来のバージョンで完全に削除される可能性があります
4. **ドキュメント参照**: 機能の詳細は`UPCGCopyAttributesSettings`のドキュメントを参照してください

## 参照

- [Copy Attributes (UPCGCopyAttributesSettings)](CopyAttributes.md)
- Unreal Engine 5.5 Release Notes
