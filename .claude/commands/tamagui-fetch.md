# tamagui-fetch

Tamaguiドキュメントから最新の情報を取得し、実装に活用するコマンド

## 使用方法
/tamagui-fetch <コンポーネント名|トピック>

## 例
- `/tamagui-fetch Card` - Cardコンポーネントの使い方
- `/tamagui-fetch animations` - アニメーションの実装方法
- `/tamagui-fetch themes` - テーマシステムの使い方
- `/tamagui-fetch performance` - パフォーマンス最適化

## 実行フロー

1. **ドキュメント取得**
   ```
   WebFetch(
     url: "https://tamagui.dev/ui/<component>",
     prompt: "Extract implementation details, props, examples, and best practices"
   )
   ```

2. **実装例の生成**
   - 取得した情報を基に具体的な実装例を生成
   - プロジェクトのコンテキストに合わせた調整

3. **ベストプラクティスの適用**
   - パフォーマンス最適化
   - アクセシビリティ対応
   - TypeScript型定義

## 主要なドキュメントURL

### コアコンセプト
- https://tamagui.dev/ui/intro - 導入とコンセプト
- https://tamagui.dev/docs/core/theme - テーマシステム
- https://tamagui.dev/docs/core/animations - アニメーション
- https://tamagui.dev/docs/core/styled - スタイル拡張

### 基本コンポーネント
- https://tamagui.dev/ui/stacks - Stack系レイアウト
- https://tamagui.dev/ui/text - Text系コンポーネント
- https://tamagui.dev/ui/button - Button
- https://tamagui.dev/ui/input - Input

### 高度なコンポーネント
- https://tamagui.dev/ui/card - Card
- https://tamagui.dev/ui/sheet - Sheet
- https://tamagui.dev/ui/dialog - Dialog
- https://tamagui.dev/ui/select - Select
- https://tamagui.dev/ui/tabs - Tabs

### パフォーマンス
- https://tamagui.dev/docs/intro/compiler - コンパイラ最適化
- https://tamagui.dev/docs/guides/how-to-optimize - 最適化ガイド

## 取得する情報

### コンポーネント情報
- Props一覧と型定義
- バリアント設定
- デフォルト値
- 使用例
- アニメーション設定

### 実装パターン
- 基本的な使い方
- カスタマイズ方法
- 複合コンポーネントの作成
- テーマ適用方法

### 最適化情報
- メモ化の推奨事項
- パフォーマンスTips
- バンドルサイズ削減方法

## 実装例テンプレート

### 取得した情報を基にした実装
```typescript
// Tamaguiドキュメントから取得した最新のベストプラクティスを適用

import { [取得したコンポーネント] } from 'tamagui';

// ドキュメントから取得したProps定義
interface ComponentProps {
  // 最新の型定義
}

// ドキュメントの推奨パターンに基づく実装
export const Component = (props: ComponentProps) => {
  // 実装
};
```

## 活用方法

1. **新規コンポーネント作成時**
   - 最新のAPIを確認
   - 推奨パターンの適用

2. **既存コンポーネントの改善**
   - 新機能の確認
   - パフォーマンス改善方法の取得

3. **トラブルシューティング**
   - 公式の解決方法を確認
   - ベストプラクティスとの比較

## 注意事項

- ドキュメントは頻繁に更新されるため、常に最新情報を取得
- プロジェクトのTamaguiバージョンとの互換性を確認
- 実装前に既存コンポーネントとの整合性を確認