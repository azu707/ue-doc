# Visualize Attribute

## 概要
Visualize Attributeノードは、選択された属性の値を各ポイントのトランスフォーム位置に3Dテキストとして表示します。属性値をビジュアルに確認し、デバッグを支援します。

- **ノードタイプ**: Debug
- **クラス**: `UPCGVisualizeAttributeSettings`
- **エレメント**: `FPCGVisualizeAttribute`

## 機能詳細
このノードは、ポイントデータの各ポイントに対して、指定された属性の値を3D空間にテキストとして表示します。属性の分布や値を視覚的に確認でき、データの妥当性検証に役立ちます。

### 主な機能
- **属性値の3D表示**: 各ポイントの位置に属性値をテキストで表示
- **カスタマイズ可能な表示**: 色、期間、プレフィックスを設定
- **ポイント制限**: 表示するポイント数を制限してパフォーマンスを維持
- **ローカルオフセット**: ポイント位置からの表示オフセット
- **有効/無効切り替え**: 動的に表示を制御

### 処理フロー
1. 入力ポイントデータを取得
2. 指定された属性を読み取り
3. 各ポイントに対して：
   - 属性値を文字列に変換
   - プレフィックスを追加
   - ローカルオフセットを適用した位置にテキストを描画
4. 入力データを出力にパススルー

## プロパティ

### AttributeSource
- **型**: FPCGAttributePropertyInputSelector
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 値を表示する属性。各入力ポイントのトランスフォーム近くに属性値が表示されます

### CustomPrefixString
- **型**: FString
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 属性値の前に追加されるカスタムプレフィックス

### bPrefixWithIndex
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 表示値にポイントのインデックスをプレフィックスとして追加

### bPrefixWithAttributeName
- **型**: bool
- **デフォルト値**: false
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 表示値に属性名をプレフィックスとして追加

### LocalOffset
- **型**: FVector
- **デフォルト値**: (0, 0, 0)
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: ポイントの位置からのローカルオフセット。テキストをポイントからずらして表示する際に使用

### Color
- **型**: FColor
- **デフォルト値**: Cyan
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: 表示される値の色

### Duration
- **型**: double
- **デフォルト値**: 30.0
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, ClampMin = 0.0
- **説明**: 表示値の表示時間（秒）

### PointLimit
- **型**: int32
- **デフォルト値**: 4096
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable, ClampMin = 1, ClampMax = 4096
- **説明**: デバッグメッセージを描画するポイントの上限。パフォーマンスを維持するために制限されます

### bVisualizeEnabled
- **型**: bool
- **デフォルト値**: true
- **カテゴリ**: Settings
- **アクセス**: BlueprintReadWrite, EditAnywhere
- **メタ**: PCG_Overridable
- **説明**: ビジュアライザが有効かどうか。動的なオーバーライドに便利です

## 使用例

### 基本的な属性可視化
```
// Density属性を表示
AttributeSource: Density
Color: Yellow
結果: 各ポイント位置にDensity値が黄色のテキストで表示される
```

### カスタムプレフィックス付き
```
// 属性名とカスタムプレフィックスを追加
AttributeSource: Height
bPrefixWithAttributeName: true
CustomPrefixString: "Terrain "
結果: "Terrain Height: 123.45" のように表示される
```

### オフセット表示
```
// ポイントから上方にオフセットして表示
AttributeSource: TreeType
LocalOffset: (0, 0, 200)
Color: Green
結果: ポイントの200単位上に属性値が表示される
```

### インデックス付き表示
```
// ポイントインデックスと値を表示
AttributeSource: SpawnWeight
bPrefixWithIndex: true
結果: "[0] 0.75", "[1] 0.32" のように表示される
```

### 制限付き表示
```
// 最初の100ポイントのみ表示
AttributeSource: Quality
PointLimit: 100
結果: パフォーマンスを維持しながら一部のポイントのみ表示
```

### 条件付き表示
```
// 属性値に基づいて動的に有効化
AttributeSource: ErrorFlag
bVisualizeEnabled: (条件に基づいて設定)
結果: 特定の条件でのみ表示
```

## 実装の詳細

### 入出力ピン
- **入力ピン**:
  - "In"（Point）: 可視化するポイントデータ
- **出力ピン**:
  - "Out"（Point）: 入力ポイントデータをそのまま出力

### 処理の特徴
- **メインスレッド実行**: `CanExecuteOnlyOnMainThread()` が `true` を返す（デバッグコンポーネント作成のため）
- **キャッシュ不可**: `IsCacheable()` が `false` を返す
- **ベースポイントデータ対応**: `SupportsBasePointDataInputs()` が `true` を返す

### テキスト描画
Unreal Engineのデバッグ描画システムを使用して、3D空間にテキストを表示します。

### フォーマット
表示されるテキストのフォーマット：
```
[CustomPrefix][Index] [AttributeName]: Value
```

各要素は対応するboolプロパティが有効な場合のみ含まれます。

## パフォーマンス考慮事項

1. **ポイント数**: PointLimitを適切に設定してパフォーマンスを維持します
2. **描画コスト**: 大量のテキスト描画はエディタのフレームレートに影響します
3. **更新頻度**: 頻繁に再生成されるグラフでは表示のオーバーヘッドがあります
4. **文字列変換**: 属性値から文字列への変換にコストがかかります
5. **メモリ使用**: 表示されるテキストはメモリに保持されます

## 注意事項

1. **エディタ専用**: このノードはエディタでのみ機能し、ランタイムでは無効です
2. **ポイント制限**: 最大4096ポイントまで表示可能です
3. **属性の存在**: 指定された属性がすべてのポイントに存在する必要があります
4. **パフォーマンス影響**: 大量のポイントで使用する場合、PointLimitを調整してください
5. **視認性**: ポイントが密集している場合、テキストが重なって読みにくくなる可能性があります
6. **座標系**: LocalOffsetはポイントのローカル座標系に相対的です

## ビジュアライゼーションのベストプラクティス

### 1. 適切なポイント制限
大量のポイントがある場合、PointLimitを小さく設定してパフォーマンスを維持。

### 2. コントラストの高い色
背景に対してよく見える色を選択。

### 3. オフセットの使用
ポイントのマーカーとテキストが重ならないようにLocalOffsetを調整。

### 4. 段階的なデバッグ
最初は少数のポイントで確認し、徐々に範囲を広げる。

### 5. 一時的な使用
デバッグが完了したらノードを削除または無効化。

## デバッグワークフロー

### 1. 属性値の確認
生成された属性値が期待される範囲内か確認。

### 2. 分布の可視化
属性値の空間的分布パターンを視覚的に確認。

### 3. 異常値の検出
期待外の値を持つポイントを素早く特定。

### 4. フィルタリングの検証
フィルタ条件が正しく機能しているか、残ったポイントの属性を確認。

### 5. トランスフォームの確認
トランスフォーム処理が属性に正しく影響しているか確認。

## トラブルシューティング

### テキストが表示されない
- bVisualizeEnabledが有効か確認
- 属性が存在するか確認
- PointLimitが十分に大きいか確認
- カメラ位置を調整して表示範囲内か確認

### テキストが読めない
- Colorを背景とコントラストの高い色に変更
- LocalOffsetを調整してポイントから離す
- PointLimitを減らして密度を下げる

### パフォーマンス問題
- PointLimitを減らす
- bVisualizeEnabledを無効化
- Durationを短くする

### 値が期待と異なる
- 属性名が正しいか確認
- 前のノードが正しく実行されているか確認
- 属性の型を確認

## 色の推奨設定

### 一般的な属性
- Cyan: デフォルト、汎用
- Yellow: 警告レベルの値
- Green: 正常範囲の値
- Red: エラーまたは範囲外の値
- White: 高コントラストが必要な場合
- Orange: 中間レベルの値

## 関連ノード
- **Debug**: データ構造を可視化
- **Print String**: テキストメッセージをログに出力
- **Sanity Check Point Data**: ポイント数を検証
- **Attribute Compare**: 属性値を比較

## 実装ファイル
- **ヘッダー**: `Engine/Plugins/PCG/Source/PCG/Public/Elements/PCGVisualizeAttribute.h`
- **実装**: `Engine/Plugins/PCG/Source/PCG/Private/Elements/PCGVisualizeAttribute.cpp`
