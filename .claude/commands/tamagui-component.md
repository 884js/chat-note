# tamagui-component

Tamaguiコンポーネントを選択し、最適な実装を行うヘルパーコマンド

## 使用方法
/tamagui-component <コンポーネント名> <用途>

## 例
- `/tamagui-component Button primary-action` - プライマリアクションボタン
- `/tamagui-component Card room-item` - ルームカード
- `/tamagui-component Sheet action-menu` - アクションメニュー
- `/tamagui-component Dialog confirm` - 確認ダイアログ

## 実行内容

1. **Tamaguiコンポーネントライブラリから最適な選択**
   - https://tamagui.dev/ui/ から適切なコンポーネントを選択
   - プロップスとバリアントの確認
   - アニメーション設定の確認

2. **実装パターンの生成**
   - 再利用可能なラッパーコンポーネント
   - スタイルの拡張
   - テーマ対応

## 主要Tamaguiコンポーネント

### レイアウト
- **XStack**: 横並びレイアウト（flexDirection: row）
- **YStack**: 縦並びレイアウト（flexDirection: column）
- **ZStack**: 重ね合わせレイアウト（position: absolute）
- **ScrollView**: スクロール可能エリア

### 基本コンポーネント
- **Text**: テキスト表示（H1-H6, Paragraph対応）
- **Button**: ボタン（variant, size, disabled対応）
- **Input**: テキスト入力
- **TextArea**: 複数行テキスト入力

### 高度なコンポーネント
- **Card**: カードレイアウト
- **Sheet**: ボトムシート/サイドシート
- **Dialog**: モーダルダイアログ
- **AlertDialog**: アラートダイアログ
- **Popover**: ポップオーバー
- **Select**: セレクトボックス
- **Switch**: トグルスイッチ
- **Checkbox**: チェックボックス
- **RadioGroup**: ラジオボタングループ
- **Slider**: スライダー
- **Progress**: プログレスバー
- **Spinner**: ローディングスピナー
- **Avatar**: アバター
- **Badge**: バッジ
- **Tabs**: タブ切り替え
- **Accordion**: アコーディオン
- **Separator**: 区切り線

### アイコン
- **@tamagui/lucide-icons**: Lucideアイコンライブラリ

## コンポーネント実装テンプレート

### 基本構造
```typescript
import { styled, YStack, XStack, Text, Button, Theme } from 'tamagui';

interface ComponentProps {
  // Props定義
}

export const Component = ({ ...props }: ComponentProps) => {
  return (
    <Theme name="light">
      <YStack
        animation="quick"
        enterStyle={{ opacity: 0, scale: 0.9 }}
        exitStyle={{ opacity: 0, scale: 0.95 }}
        // その他のスタイル
      >
        {/* コンテンツ */}
      </YStack>
    </Theme>
  );
};
```

### スタイル拡張
```typescript
const StyledCard = styled(Card, {
  name: 'CustomCard',
  variants: {
    active: {
      true: {
        backgroundColor: '$color5',
      }
    },
    size: {
      small: { padding: '$2' },
      medium: { padding: '$4' },
      large: { padding: '$6' },
    }
  }
});
```

## パフォーマンス最適化

### メモ化
```typescript
import { memo } from 'react';

export const OptimizedComponent = memo(({ ...props }) => {
  // 実装
}, (prevProps, nextProps) => {
  // カスタム比較ロジック
  return prevProps.id === nextProps.id;
});
```

### アニメーション
```typescript
<YStack
  animation="quick" // または "lazy", "medium", "slow"
  enterStyle={{
    opacity: 0,
    y: -10,
  }}
  exitStyle={{
    opacity: 0,
    y: 10,
  }}
  pressStyle={{
    scale: 0.95,
  }}
  hoverStyle={{
    scale: 1.05,
  }}
>
```

## テーマ対応

### カラートークン
- `$color`: プライマリカラー
- `$color1` ~ `$color12`: カラースケール
- `$background`: 背景色
- `$backgroundHover`: ホバー時背景色
- `$backgroundPress`: プレス時背景色
- `$backgroundFocus`: フォーカス時背景色
- `$borderColor`: ボーダー色

### スペーストークン
- `$0` ~ `$20`: スペーシングスケール
- `$true`: デフォルト値

### サイズトークン
- `$0` ~ `$20`: サイズスケール
- `$sm`, `$md`, `$lg`, `$xl`: 一般的なサイズ

## スタイルのshorthand記法（v4対応）

Tamagui v4では、Tailwind風のshorthandが採用されています：

### テキスト系
- `text`: textAlign

### 位置系
- `b`: bottom
- `l`: left
- `r`: right
- `t`: top
- `z`: zIndex

### 背景・見た目
- `bg`: backgroundColor
- `rounded`: borderRadius
- `select`: userSelect

### レイアウト系
- `content`: alignContent
- `flex`: flexDirection
- `grow`: flexGrow
- `items`: alignItems
- `justify`: justifyContent
- `self`: alignSelf
- `shrink`: flexShrink

### スペーシング系
- `m`: margin
- `mb`: marginBottom
- `ml`: marginLeft
- `mr`: marginRight
- `mt`: marginTop
- `mx`: marginHorizontal
- `my`: marginVertical
- `p`: padding
- `pb`: paddingBottom
- `pl`: paddingLeft
- `pr`: paddingRight
- `pt`: paddingTop
- `px`: paddingHorizontal
- `py`: paddingVertical

### サイズ系
- `maxH`: maxHeight
- `maxW`: maxWidth
- `minH`: minHeight
- `minW`: minWidth

### 使用例
```typescript
// 従来の書き方
<YStack
  justifyContent="center"
  alignItems="center"
  backgroundColor="$background"
  padding="$4"
  marginTop="$2"
/>

// shorthand記法
<YStack
  justify="center"
  items="center"
  bg="$background"
  p="$4"
  mt="$2"
/>
```

### 注意事項
- v4では `jc` や `ai` などの短縮形は廃止され、より明確な `justify` と `items` になりました
- Tailwindと同じ命名規則を採用しているため、Tailwindに慣れている開発者にも使いやすくなっています

## リスト表示（FlashList）

高速なリスト表示には `@shopify/flash-list` を使用します。

### 基本的な使い方
- **公式ドキュメント**: https://shopify.github.io/flash-list/docs/usage
- FlatListからの移行が簡単
- 自動的なアイテムリサイクリングによる高速レンダリング

### 必須プロパティ
```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}                    // 必須: データ配列
  renderItem={({ item }) => ...}  // 必須: レンダリング関数
  estimatedItemSize={100}          // 推奨: アイテムの推定サイズ
/>
```

### 重要なプロパティ
- `keyExtractor`: アイテムの一意なキーを生成
- `getItemType`: 異なるアイテムタイプを区別（異種リスト用）
- `onEndReached`: リスト終端到達時のコールバック
- `onEndReachedThreshold`: 終端判定のしきい値
- `ListEmptyComponent`: データが空の時の表示
- `ListHeaderComponent`: リストヘッダー
- `ListFooterComponent`: リストフッター

### ベストプラクティス

#### 1. コンポーネントのメモ化
```typescript
const Item = memo(({ item }) => {
  return <View>...</View>;
});
```

#### 2. keyExtractorの使用
```typescript
const keyExtractor = useCallback((item) => item.id, []);
```

#### 3. 異種リストでのgetItemType
```typescript
const getItemType = useCallback((item) => {
  return item.type; // 'header', 'item', 'footer' など
}, []);
```

#### 4. estimatedItemSizeの適切な設定
```typescript
// 実際のアイテムサイズに近い値を設定
estimatedItemSize={120} // RoomCardなら120px程度
estimatedItemSize={80}  // MessageBubbleなら80px程度
```

### パフォーマンス最適化のTips
1. **開発モードでパフォーマンステストをしない**
   - JS Dev Modeはパフォーマンスに大きく影響
   
2. **renderItemをメモ化**
   ```typescript
   const renderItem = useCallback(({ item }) => {
     return <Item item={item} />;
   }, []);
   ```

3. **不要な再レンダリングを防ぐ**
   - propsをメモ化
   - 状態更新を最小限に

### 使用例（チャットリスト）
```typescript
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';

export const MessageList = memo(function MessageList({ messages }) {
  const renderItem = useCallback(({ item }) => (
    <MessageBubble message={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlashList
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={80}
      showsVerticalScrollIndicator={false}
    />
  );
});
```

### 注意事項
- `estimatedItemSize` はTypeScriptで型エラーになることがあるが、実際には有効なプロパティ
- 必要に応じて `// @ts-ignore` を使用するか、型定義を拡張
- FlashListのバージョンによってAPIが変わることがあるので、公式ドキュメントを確認

## アクセシビリティ

- `accessible`: アクセシブル要素として認識
- `accessibilityRole`: 役割の指定
- `accessibilityLabel`: ラベルテキスト
- `accessibilityHint`: ヒントテキスト
- `accessibilityState`: 状態の指定

## 実装時の注意点

1. **import文の最適化**
   - 必要なコンポーネントのみインポート
   - `tamagui`からの一括インポートを推奨

2. **スタイリング優先順位**
   - トークンベースのスタイリングを優先
   - インラインスタイルは最小限に

3. **レスポンシブ対応**
   - `$gtSm`, `$gtMd`, `$gtLg`等のメディアクエリ使用

4. **パフォーマンス**
   - 大量のアイテムには`FlashList`を使用
   - 重い処理は`useMemo`でメモ化