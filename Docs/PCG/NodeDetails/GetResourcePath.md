# Get Resource Path

## 概要

**Get Resource Path**ノードは、リソースデータをリソースパスを含む属性セットに変換するノードです。

カテゴリ: Resource
クラス名: `UPCGGetResourcePath`
エレメント: `FPCGGetResourcePathElement`

## 機能詳細

このノードは、PCGリソースデータ（メッシュリソースなど）からアセットパスを抽出し、文字列属性として出力します。リソースパスをさらなる処理や検証に使用できます。

## プロパティ

このノードにはユーザー設定可能なプロパティはありません。

## 入力ピン

### In (リソースデータ)
- **型**: リソースデータ
- **説明**: パスを抽出するリソースデータ

## 出力ピン

### Out (属性セット)
- **型**: 属性セット
- **説明**: リソースパスを含む属性セット

## 使用例

```
[GetStaticMeshResourceData] → [Get Resource Path] → [AttributeSet]

// 結果: リソースパスが文字列属性として出力される
// 例: "/Game/Meshes/MyMesh.MyMesh"
```

## 実装の詳細

- GPU常駐データをサポート（`SupportsGPUResidentData` が true）
- 実行依存ピンなし（`HasExecutionDependencyPin` が false）

## 関連ノード

- **Get Static Mesh Resource Data**: スタティックメッシュリソースデータを取得
- **Load PCG Data Asset**: PCGデータアセットをロード
