# Copy Attributes (Metadata Operation) - 非推奨

## 概要

Copy Attributes (Metadata Operation)ノードは、メタデータ操作として属性をコピーする非推奨のノードです。このノードは**Unreal Engine 5.5で非推奨**となり、`UPCGCopyAttributesSettings`を使用するように変更されました。

**ノードタイプ**: Metadata
**クラス**: `UPCGMetadataOperationSettings` (非推奨)
**エレメント**: `FPCGCopyAttributesElement`（基底クラスから継承）
**基底クラス**: `UPCGCopyAttributesSettings`
**非推奨バージョン**: Unreal Engine 5.5
**代替ノード**: Copy Attributes (`UPCGCopyAttributesSettings`)

## 非推奨の理由

このクラスは、`UPCGCopyAttributesSettings`に統合されました。元々は「メタデータ操作」という名前で提供されていましたが、以下の理由で非推奨となりました:

1. **命名の明確化**: "Metadata Operation"という名前が汎用的すぎて具体的な機能を表していない
2. **機能の統合**: Copy Attributesノードに機能が完全に統合された
3. **APIの簡素化**: 複数の類似ノードを1つに統合してユーザー体験を向上

## 実装の詳細

### クラス定義

```cpp
UCLASS(MinimalAPI, BlueprintType, ClassGroup = (Procedural))
class UE_DEPRECATED(5.5, "Use UPCGCopyAttributeSettings")
UPCGMetadataOperationSettings : public UPCGCopyAttributesSettings
{
    GENERATED_BODY()

public:
    UPCGMetadataOperationSettings()
        : UPCGCopyAttributesSettings()
    {
#if WITH_EDITOR
        bExposeToLibrary = false;  // ライブラリに公開しない
#endif
    }
};
```

### 特徴

このクラスは`UPCGAttributeTransferSettings`と異なり、コンストラクタでデフォルト値をリセットしていません:

- **デフォルト値**: `UPCGCopyAttributesSettings`のデフォルト値をそのまま使用
- **エディタ非公開**: `bExposeToLibrary = false`により、新規作成時には表示されない
- **完全な互換性**: 基底クラスと完全に同じ動作

### UPCGAttributeTransferSettingsとの違い

| 項目 | UPCGMetadataOperationSettings | UPCGAttributeTransferSettings |
|------|------------------------------|------------------------------|
| デフォルト値のリセット | なし（基底クラスのまま） | あり（空のセレクターに設定） |
| InputSource初期値 | 基底クラスのデフォルト | 空のセレクター |
| OutputTarget初期値 | 基底クラスのデフォルト | 空のセレクター |
| 用途 | メタデータ操作（汎用） | 属性転送（特化） |

## 移行ガイド

### 既存のグラフの扱い

既存のグラフで`UPCGMetadataOperationSettings`を使用している場合:

1. **自動互換性**: エンジンが自動的に`UPCGCopyAttributesSettings`として扱います
2. **動作の維持**: すべての設定と動作が完全に維持されます
3. **警告の表示**: 非推奨の警告が表示される場合があります

### 新しいグラフでの使用

新しいグラフを作成する場合は、必ず**Copy Attributes**ノード (`UPCGCopyAttributesSettings`) を使用してください。

### 移行手順

1. **既存ノードの確認**: グラフ内でMetadata Operationノードを検索
2. **設定の記録**: 現在の設定（InputSource、OutputTargetなど）を記録
3. **ノードの置き換え**: Copy Attributesノードに置き換え
4. **設定の再適用**: 記録した設定を新しいノードに適用
5. **動作確認**: グラフを実行して期待通りの結果を確認

### 設定の移行例

**旧: Metadata Operation**
```
UPCGMetadataOperationSettings:
  InputSource.AttributeName = "SourceAttribute"
  OutputTarget.AttributeName = "TargetAttribute"
```

**新: Copy Attributes**
```
UPCGCopyAttributesSettings:
  InputSource.AttributeName = "SourceAttribute"
  OutputTarget.AttributeName = "TargetAttribute"
```

## プロパティ

すべてのプロパティは`UPCGCopyAttributesSettings`から継承されます。詳細は[CopyAttributes.md](CopyAttributes.md)を参照してください。

### 主要プロパティ（継承）

| プロパティ名 | 型 | デフォルト値 | 説明 |
|------------|------|------------|------|
| InputSource | FPCGAttributePropertyInputSelector | 基底クラスのデフォルト | コピー元の属性またはプロパティ |
| OutputTarget | FPCGAttributePropertyOutputSelector | 基底クラスのデフォルト | コピー先の属性またはプロパティ |

## 使用例（参考用）

このノードは非推奨ですが、参考のために使用例を示します。

### 例1: 属性のコピー
```
Metadata Operation (非推奨):
  InputSource.AttributeName = "Height"
  OutputTarget.AttributeName = "Elevation"

↓ 移行後

Copy Attributes (推奨):
  InputSource.AttributeName = "Height"
  OutputTarget.AttributeName = "Elevation"
```

## 関連ノード

- **Copy Attributes (UPCGCopyAttributesSettings)**: 推奨される代替ノード
- **Copy Attributes (UPCGAttributeTransferSettings)**: 同じく非推奨の類似ノード
- **Merge Attributes**: 複数の属性をマージ
- **Match And Set Attributes**: 条件付き属性設定

## 注意事項

1. **新規使用禁止**: 新しいプロジェクトやグラフではこのノードを使用しないでください
2. **互換性維持**: 既存のグラフは動作しますが、早めの移行を推奨
3. **将来的な削除**: 将来のバージョンで完全に削除される可能性があります
4. **ドキュメント参照**: 詳細な機能説明は`UPCGCopyAttributesSettings`のドキュメントを参照

## バージョン履歴

- **Unreal Engine 5.5**: 非推奨化、`UPCGCopyAttributesSettings`への移行推奨
- **以前のバージョン**: メタデータ操作ノードとして利用可能

## 参照

- [Copy Attributes (UPCGCopyAttributesSettings)](CopyAttributes.md)
- [Copy Attributes (UPCGAttributeTransferSettings)](CopyAttributes_AttributeTransfer.md)
- Unreal Engine 5.5 Release Notes
