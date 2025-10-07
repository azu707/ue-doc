# Load Alembic

## 概要

Load Alembicノードは、Alembic(.abc)ファイルからジオメトリデータをロードし、PCGポイントデータとして変換するノードです。Alembic形式は、複雑なジオメトリやアニメーションデータの交換に広く使用される業界標準フォーマットです。このノードを使用することで、HoudiniやMayaなどの外部DCCツールで作成されたデータをUnreal EngineのPCGシステムで利用できます。

**重要**: このノードはエディタビルドでのみ動作します。パッケージ化されたゲームでは使用できません。

## 機能詳細

このノードは以下の処理を実行します:

1. **Alembicファイルの読み込み**: 指定されたAlembicファイルからデータをロード
2. **座標系変換**: スケール、回転、ハンドネス(右手/左手座標系)の変換を適用
3. **属性マッピング**: Alembicの属性をPCGの属性/プロパティにマッピング
4. **ポイントデータ生成**: 変換されたデータをPCGポイントデータとして出力
5. **標準設定のサポート**: City Sampleなどの事前定義された設定を適用可能

### 座標系変換

DCCツールとUnreal Engineでは座標系が異なるため、変換が必要です:
- **ConversionScale**: 軸のスケーリング(例: Y軸を反転)
- **ConversionRotation**: オイラー角での回転
- **bConversionFlipHandedness**: 回転方向の反転(W成分を反転)

## プロパティ

### AlembicFilePath
- **型**: `FFilePath`
- **カテゴリ**: Alembic
- **オーバーライド可能**: Yes (PCG_Overridable)
- **ファイルフィルタ**: `*.abc`
- **説明**: 読み込むAlembicファイルへのパス。

### ConversionScale
- **型**: `FVector`
- **カテゴリ**: Alembic
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `(1.0, -1.0, 1.0)`
- **説明**: インポート時に適用するスケール。デフォルトではY軸を反転します。MaxやMayaのプリセットでは、この値が座標系の違いを補正します。

### ConversionRotation
- **型**: `FVector`
- **カテゴリ**: Alembic
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `(0.0, 0.0, 0.0)`
- **説明**: インポート時に適用する回転(オイラー角)。例えば、3ds Maxの場合は`(90, 0, 0)`を使用します。

### bConversionFlipHandedness
- **型**: `bool`
- **カテゴリ**: Alembic
- **オーバーライド可能**: Yes (PCG_Overridable)
- **デフォルト値**: `false`
- **説明**: 座標系のハンドネス(右手系/左手系)を変更する際、回転方向を反転する必要がある場合があります。このフラグを有効にすると、回転のW成分が反転されます。スウィズリング(軸の入れ替え)と併用すると便利です。

### Setup (エディタのみ)
- **型**: `EPCGLoadAlembicStandardSetup` (Enum)
- **カテゴリ**: Alembic
- **デフォルト値**: `None`
- **オプション**:
  - `None`: 標準設定なし
  - `CitySample`: City Sampleデモと同じ設定を使用(右手系Y-up、orientとscaleのマッピング)
- **説明**: 標準的な設定プリセットを選択すると、自動的に変換パラメータと属性マッピングが設定されます。

### AttributeMapping (継承元)
- **型**: `TMap<FString, FPCGAttributePropertyInputSelector>`
- **カテゴリ**: Settings
- **継承元**: `UPCGExternalDataSettings`
- **説明**: Alembicファイル内の属性名をPCGのプロパティ/属性にマッピングします。キーはAlembic属性名、値はPCGプロパティセレクタです。

## 使用例

### 基本的な使用方法

1. Load Alembicノードを追加
2. `AlembicFilePath`にAlembicファイルを指定
3. 必要に応じて座標変換パラメータを調整
4. 属性マッピングを設定(必要に応じて)
5. ノードを実行してポイントデータを生成

### City Sample設定の使用

City Sampleプロジェクトと同じ設定を使用する場合:

1. `Setup`プロパティを`CitySample`に変更
2. 自動的に以下が設定されます:
   - `ConversionScale`: `(1.0, 1.0, 1.0)`
   - `ConversionRotation`: `(0.0, 0.0, 0.0)`
   - `bConversionFlipHandedness`: `true`
   - 属性マッピング:
     - `position` → `$Position.xzy` (Y-Zスウィズリング)
     - `scale` → `$Scale.xzy`
     - `orient` → `$Rotation.xzyw`

### カスタム属性マッピング例

Alembicファイルに`velocity`という属性があり、それをPCGの`Speed`という名前の属性にマッピングしたい場合:

```
AttributeMapping:
  "velocity" → "$Speed"
```

### 典型的なユースケース

- **外部ツールからのインポート**: Houdiniで生成したパーティクルやジオメトリをPCGで使用
- **アニメーションデータ**: Alembicキャッシュされたアニメーションをポイントクラウドとして利用
- **大規模データセット**: 外部で最適化されたデータをPCGにインポート
- **アーティストワークフロー**: DCCツールでのプレビューとUnreal Engineでの最終レンダリングの統合

## 実装の詳細

### クラス構成

#### UPCGLoadAlembicSettings
- 継承: `UPCGExternalDataSettings`
- Alembicファイルのロード設定を保持
- 座標変換パラメータを管理

#### FPCGLoadAlembicElement
- 継承: `FPCGExternalDataElement`
- Alembicファイルの読み込みと変換を実行
- ファイルタイムスタンプに基づく依存関係CRCを計算

#### FPCGLoadAlembicContext
- 継承: `FPCGExternalDataContext`
- ロード処理のコンテキストを保持

### 重要な実装ポイント

1. **エディタ限定機能**:
   ```cpp
   #if WITH_EDITOR
       PCGAlembicInterop::LoadFromAlembicFile(Context, FileName);
       // ... データ処理
   #else
       PCGE_LOG(Error, GraphAndLog, "The Load Alembic node is not support in non-editor builds.");
   #endif
   ```
   ゲームビルドではエラーメッセージを表示して終了します。

2. **ファイルタイムスタンプによる依存関係追跡**:
   `GetDependenciesCrc`メソッドでAlembicファイルのタイムスタンプをCRCに含めることで、ファイルが更新された場合に再計算をトリガーします。

3. **二段階の処理**:
   - **PrepareLoad**: Alembicファイルからデータをロードし、ポイントデータとアクセサマッピングを作成
   - **ExecuteLoad**: 座標変換を適用

4. **座標変換の適用**:
   ```cpp
   FTransform ConversionTransform(FRotator::MakeFromEuler(ConversionRotation), FVector::ZeroVector, ConversionScale);
   TransformRange[PointIndex] = TransformRange[PointIndex] * ConversionTransform;

   if (bFlipRotationW)
   {
       FQuat Rotation = TransformRange[PointIndex].GetRotation();
       Rotation.W *= -1;
       TransformRange[PointIndex].SetRotation(Rotation);
   }
   ```

5. **標準設定の適用**:
   `SetupFromStandard`メソッドが呼ばれると、選択されたプリセットに基づいて変換パラメータと属性マッピングが自動設定されます。

### City Sample標準設定の詳細

City Sample設定では以下のマッピングが適用されます:

| Alembic属性 | PCGプロパティ | スウィズリング |
|------------|--------------|---------------|
| position   | $Position    | .xzy (Y-Z入れ替え) |
| scale      | $Scale       | .xzy |
| orient     | $Rotation    | .xzyw |

これは、Alembicが通常Y-up右手座標系を使用するのに対し、Unreal EngineがZ-up左手座標系を使用するための調整です。

### パフォーマンス考慮事項

- Alembicファイルの読み込みはI/O集約的であり、ファイルサイズに応じて時間がかかります
- 大量のポイントを含むファイルの場合、メモリ使用量が増加します
- 座標変換は各ポイントに対して実行されるため、ポイント数に比例して処理時間が増加します
- ファイルタイムスタンプベースの依存関係追跡により、ファイルが変更されていない場合は再ロードを回避できます

### エラーハンドリング

- ファイルが見つからない場合: Alembicインタロップレイヤーでエラーが処理されます
- 無効なAlembic形式: ロード時にエラーがログに記録されます
- エディタ外での実行: エラーログを出力して処理を中断

### 外部依存

このノードは`PCGAlembicInterop`モジュールに依存しており、Alembicライブラリとの統合を提供します。Alembicファイルの実際の読み込みとパース処理はこのモジュールで行われます。

### ファイルパス

- **ヘッダー**: `/Engine/Plugins/PCGInterops/PCGExternalDataInterop/Source/PCGExternalDataInterop/Public/Elements/PCGLoadAlembicElement.h`
- **実装**: `/Engine/Plugins/PCGInterops/PCGExternalDataInterop/Source/PCGExternalDataInterop/Private/Elements/PCGLoadAlembicElement.cpp`

## 注意事項

1. **エディタ専用**: このノードはエディタビルドでのみ動作し、パッケージ化されたゲームでは使用できません
2. **ファイルパス**: Alembicファイルへのパスは、プロジェクトからアクセス可能な場所に配置する必要があります
3. **座標系**: DCCツールとUnreal Engineの座標系の違いに注意し、適切な変換パラメータを設定してください
4. **属性名**: Alembicファイル内の属性名は大文字小文字を区別します
5. **パフォーマンス**: 大きなAlembicファイルの読み込みには時間がかかる場合があります
