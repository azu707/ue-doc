# Reroute (Named Base)

## 概要

**Reroute (Named Base)**は、名前付きリルートノード（Named Reroute Declaration と Named Reroute Usage）の基底クラスです。このクラス自体は直接使用されませんが、名前付きリルート機能の共通実装を提供します。

カテゴリ: Reroute
クラス名: `UPCGNamedRerouteBaseSettings`
エレメント: `FPCGRerouteElement`

## 機能詳細

このクラスは、Named Reroute Declaration と Named Reroute Usage の共通機能を実装する抽象基底クラスです。主に、ノードタイトルの編集可能性と視覚的表現の共有を提供します。

### 主な特徴

- 名前付きリルートの基底クラス
- ユーザー編集可能なタイトル
- 標準リルートノードからの継承
- エディタでの視覚的表現の共有

## プロパティ

このクラスには独自のプロパティはなく、`UPCGRerouteSettings` から継承されたプロパティのみを持ちます。

## 実装の詳細

### クラス階層

```
UPCGSettings
    ↓
UPCGRerouteSettings
    ↓
UPCGNamedRerouteBaseSettings (抽象基底クラス)
    ↓
    ├─ UPCGNamedRerouteDeclarationSettings
    └─ UPCGNamedRerouteUsageSettings
```

### ユーザー編集可能なタイトル

このクラスの主な機能の1つは、タイトルの編集を許可することです:

```cpp
#if WITH_EDITOR
virtual bool CanUserEditTitle() const override { return true; }
#endif
```

標準の `UPCGRerouteSettings` では `CanUserEditTitle()` が false を返しますが、名前付きリルートではタイトルが識別子として機能するため、編集可能である必要があります。

### エディタでの視覚的表現

Named Reroute Declaration と Named Reroute Usage は、このベースクラスを共有することで、エディタでの視覚的表現も共有します。これにより、ユーザーは2つのノードタイプを視覚的に関連付けやすくなります。

## Declaration と Usage の共通点

| 機能 | Declaration | Usage | Named Base での実装 |
|------|-------------|-------|---------------------|
| タイトル編集 | 可能 | 可能 | CanUserEditTitle = true |
| 基底エレメント | FPCGRerouteElement | FPCGRerouteElement | 継承 |
| 動的ピン | あり | あり | 継承 |
| 視覚的スタイル | 類似 | 類似 | 共有 |

## Declaration と Usage の相違点

Named Base は共通機能のみを提供し、Declaration と Usage の具体的な動作は各派生クラスで実装されます:

### Declaration の特殊化
- 入力ピンあり、出力ピン非表示
- データソースとして機能
- 変換オプションを提供

### Usage の特殊化
- 入力ピン非表示、出力ピンあり
- データの参照として機能
- カリング不可

## 設計思想

### なぜベースクラスが必要か

1. **コードの重複を避ける**: 共通機能を1箇所で実装
2. **視覚的一貫性**: エディタでの表現を統一
3. **拡張性**: 将来的な名前付きリルート機能の拡張に対応
4. **型の一貫性**: Declaration と Usage を関連する型として扱える

### なぜ抽象クラスではないか

技術的には抽象クラスではありませんが、実際には直接インスタンス化されることはありません。Declaration または Usage のいずれかとして使用されます。

## 関連ノード

- **Named Reroute Declaration**: このクラスから派生、データソースを定義
- **Named Reroute Usage**: このクラスから派生、データを参照
- **Reroute**: 親クラス、基本的なリルート機能を提供

## 実装クラスでオーバーライドされるメソッド

派生クラスでは、以下のメソッドがオーバーライドされます:

### Declaration でのオーバーライド
```cpp
virtual FName GetDefaultNodeName() const override;
virtual TArray<FPCGPinProperties> OutputPinProperties() const override;
virtual TArray<FPCGPreconfiguredInfo> GetConversionInfo() const override;
virtual bool ConvertNode(const FPCGPreconfiguredInfo& ConversionInfo) override;
```

### Usage でのオーバーライド
```cpp
virtual FName GetDefaultNodeName() const override;
virtual TArray<FPCGPinProperties> InputPinProperties() const override;
virtual bool CanCullTaskIfUnwired() const override;
virtual EPCGDataType GetCurrentPinTypes(const UPCGPin* InPin) const override;
```

## 注意事項

- このクラスは直接使用されることを意図していません
- 常に Declaration または Usage として実体化されます
- エディタ機能の多くはこのベースクラスで定義されています
- 実行時の動作は派生クラスで実装されます

## まとめ

Reroute (Named Base) は、名前付きリルート機能の共通基盤を提供する重要なクラスです。直接使用されることはありませんが、Declaration と Usage の一貫した動作と視覚的表現を保証します。
