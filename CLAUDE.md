# Memoly 設計書

## プロジェクト概要

### コンセプト
グループ化できるチャットメモアプリ。LINEのKeepメモが複数自分の好きな名前で持てるイメージ。
- ユーザーの端末内でのみ完結（外部通信なし）
- 高速でセキュアな動作
- 将来的にエクスポート/バックアップ機能を追加予定（MVP外）

### 主要機能
- ルーム（グループ）の作成・管理
- チャット形式でのメモ投稿
- 画像添付
- メッセージの編集・削除
- 日付区切り表示
- 長押しでコピー

## データモデル設計

### Room（ルーム）テーブル
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
```

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | TEXT | 主キー（UUID） |
| name | TEXT | ルーム名 |
| description | TEXT | 説明（オプション） |
| color | TEXT | テーマカラー |
| icon | TEXT | アイコン（emoji or icon name） |
| createdAt | INTEGER | 作成日時（Unix timestamp） |
| updatedAt | INTEGER | 最終更新日時（Unix timestamp） |

### Message（メッセージ）テーブル
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  roomId TEXT NOT NULL,
  content TEXT,
  imageUri TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  isDeleted INTEGER DEFAULT 0,
  FOREIGN KEY (roomId) REFERENCES rooms(id)
);
```

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | TEXT | 主キー（UUID） |
| roomId | TEXT | ルームID（外部キー） |
| content | TEXT | テキスト内容 |
| imageUri | TEXT | 画像URI（オプション） |
| createdAt | INTEGER | 作成日時（Unix timestamp） |
| updatedAt | INTEGER | 更新日時（Unix timestamp） |
| isDeleted | INTEGER | 削除フラグ（0:未削除, 1:削除済み） |

## 画面構成

### 1. ルーム一覧画面 (`/`)
- ルームをカード形式で表示
- 最終更新順でソート
- 新規ルーム作成ボタン（FAB）
- 各ルームには最新メッセージのプレビュー表示

### 2. ルーム作成/編集画面 (`/room/create`, `/room/[id]/edit`)
- 名前入力（必須）
- 説明入力（オプション）
- カラー選択
- アイコン選択

### 3. チャット画面 (`/room/[id]`)
- LINEライクなチャットUI
- 日付区切り表示
- 下部に入力エリア
- 画像添付ボタン
- メッセージ長押しメニュー（コピー/編集/削除）
- 自動スクロール（新規メッセージ投稿時）

## 技術スタック

### データ永続化
- **expo-sqlite**: ローカルデータベース
- SQLiteのバージョン管理とマイグレーション

### UI/UXライブラリ
- **Tamagui**: 高性能UIフレームワーク（アニメーション、テーマ、型安全）
- **@gorhom/bottom-sheet**: ボトムシート（メニュー用）（既存）
- **@shopify/flash-list**: 高速リスト表示（既存）
- **expo-image-picker**: 画像選択（既存）
- **expo-image**: 画像表示（既存）
- **react-native-gesture-handler**: 長押し操作（既存）

### 状態管理
- **@tanstack/react-query**: データフェッチ/キャッシュ（既存）
- カスタムフック（useRooms, useMessages等）

## プロジェクト構造

```
src/
├── app/                          # 画面コンポーネント
│   ├── _layout.tsx              # ルートレイアウト
│   ├── index.tsx                # ルーム一覧画面
│   └── room/
│       ├── create.tsx           # ルーム作成画面
│       ├── [id]/
│       │   ├── index.tsx        # チャット画面
│       │   └── edit.tsx         # ルーム編集画面
├── features/                     # 機能別モジュール
│   ├── room/
│   │   ├── components/          # ルーム関連コンポーネント
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomList.tsx
│   │   │   └── RoomForm.tsx
│   │   ├── hooks/               # ルーム関連フック
│   │   │   ├── useRooms.ts
│   │   │   └── useRoom.ts
│   │   └── types/               # ルーム関連型定義
│   │       └── index.ts
│   └── message/
│       ├── components/          # メッセージ関連コンポーネント
│       │   ├── MessageItem.tsx
│       │   ├── MessageList.tsx
│       │   ├── MessageInput.tsx
│       │   └── DateDivider.tsx
│       ├── hooks/               # メッセージ関連フック
│       │   ├── useMessages.ts
│       │   └── useMessage.ts
│       └── types/               # メッセージ関連型定義
│           └── index.ts
├── lib/                          # ライブラリ/ユーティリティ
│   └── database/
│       ├── index.ts             # DB接続・初期化
│       ├── migrations/          # マイグレーション
│       │   └── 001_initial.ts
│       └── schemas/             # スキーマ定義
│           ├── room.ts
│           └── message.ts
└── components/                   # 共通UIコンポーネント
    └── ui/
        ├── Button.tsx
        ├── Input.tsx
        ├── FAB.tsx
        └── BottomSheet.tsx
```

## 実装順序

### Phase 1: データベース基盤
1. expo-sqliteのセットアップ
2. データベース初期化処理
3. マイグレーション機能の実装
4. Roomテーブルのスキーマ定義
5. Messageテーブルのスキーマ定義

### Phase 2: ルーム機能
1. ルーム一覧画面の実装
2. ルーム作成画面の実装
3. ルームCRUD操作の実装
4. useRoomsフックの実装
5. 最終更新順のソート実装

### Phase 3: メッセージ機能（基本）
1. チャット画面UIの実装
2. メッセージ投稿機能
3. メッセージ一覧表示
4. 日付区切り表示
5. 自動スクロール

### Phase 4: メッセージ機能（拡張）
1. 画像添付機能
2. メッセージ編集機能
3. メッセージ削除機能（論理削除）
4. 長押しメニュー実装
5. コピー機能

### Phase 5: UI/UX改善
1. ローディング状態の表示
2. エラーハンドリング
3. アニメーション追加
4. パフォーマンス最適化

## コンポーネント設計

### Tamaguiの導入
- **パフォーマンス最適化**: コンパイル時最適化により高速なレンダリング
- **統一されたデザインシステム**: トークンベースのスタイリング
- **型安全**: TypeScript完全対応
- **アニメーション**: React Native Reanimatedとの統合
- **テーマ切り替え**: ルームごとのカラーテーマ対応

### Tamaguiコンポーネントマッピング
| 用途 | Tamaguiコンポーネント |
|-----|---------------------|
| レイアウト | XStack, YStack, ZStack |
| テキスト | Text, H1-H6, Paragraph |
| ボタン | Button |
| 入力 | Input, TextArea |
| カード | Card |
| シート | Sheet |
| ダイアログ | Dialog |
| アバター | Avatar |
| リスト | ListItem |
| セパレーター | Separator |

### アーキテクチャ原則
- **Smart/Dumb Components**: ロジックを持つコンテナと表示専用コンポーネントを分離
- **Single Responsibility**: 各コンポーネントは単一の責務
- **Props Drilling回避**: 必要に応じてContext使用
- **型安全性**: 全Props/StateをTypeScriptで厳密に型定義

### features/room コンポーネント詳細

#### 型定義
```typescript
interface Room {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### コンポーネント構成

| コンポーネント | 種別 | 責務 | Props | 使用hooks |
|--------------|------|------|-------|----------|
| **RoomListScreen** | Container | ルーム一覧の取得と状態管理 | - | useRooms() |
| **RoomList** | Presentational | リスト表示のみ | rooms[], onRoomPress, onRoomLongPress | - |
| **RoomCard** | Presentational | 個別ルーム表示 | room, onPress, onLongPress | - |
| **RoomAvatar** | Presentational | ルームアイコン表示 | icon, color, size | - |
| **LastMessagePreview** | Presentational | 最終メッセージプレビュー | message, date | - |
| **RoomFormScreen** | Container | ルーム作成/編集のロジック | roomId? | useCreateRoom(), useUpdateRoom() |
| **RoomForm** | Presentational | フォーム表示と入力管理 | initialValues?, onSubmit, isLoading | - |
| **ColorPicker** | Presentational | カラー選択UI | value, onChange, colors[] | - |
| **IconPicker** | Presentational | アイコン選択UI | value, onChange, icons[] | - |

### features/message コンポーネント詳細

#### 型定義
```typescript
interface Message {
  id: string;
  roomId: string;
  content?: string;
  imageUri?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
```

#### コンポーネント構成

| コンポーネント | 種別 | 責務 | Props | 使用hooks |
|--------------|------|------|-------|----------|
| **ChatScreen** | Container | メッセージ取得とチャット全体の管理 | roomId | useMessages(), useRoom() |
| **ChatHeader** | Presentational | ヘッダー表示 | room, onBackPress, onMenuPress | - |
| **MessageList** | Container | メッセージリストのスクロール管理 | messages[], roomId | - |
| **MessageItem** | Presentational | 個別メッセージ表示 | message, onLongPress, onImagePress | - |
| **MessageBubble** | Presentational | テキストバブル表示 | content, time, isEdited | - |
| **MessageImage** | Presentational | 画像メッセージ表示 | imageUri, onPress | - |
| **MessageTime** | Presentational | 時刻表示 | time | - |
| **MessageInput** | Container | 入力状態管理と送信 | onSend, roomId | - |
| **DateDivider** | Presentational | 日付区切り表示 | date | - |
| **MessageActionSheet** | Presentational | 長押しメニュー表示 | message, onEdit, onDelete, onCopy | - |
| **ImagePickerButton** | Presentational | 画像選択ボタン | onPick | - |
| **SendButton** | Presentational | 送信ボタン | onPress, disabled | - |

### components/ui 共通コンポーネント

| コンポーネント | 責務 | Props |
|--------------|------|-------|
| **FAB** | フローティングアクションボタン | onPress, icon, color |
| **EmptyState** | データがない時の表示 | title, description, icon, action? |
| **LoadingScreen** | ローディング表示 | message? |
| **ErrorBoundary** | エラーキャッチと表示 | fallback |
| **ConfirmDialog** | 確認ダイアログ | title, message, onConfirm, onCancel |
| **Button** | 汎用ボタン | variant, size, onPress, children |
| **Input** | 汎用入力フィールド | value, onChange, placeholder, error? |
| **BottomSheet** | ボトムシート | isOpen, onClose, children |

### カスタムフック設計

#### features/room/hooks

```typescript
// useRooms.ts
export const useRooms = () => {
  // 全ルーム取得
  // ソート（最終更新順）
  // リアルタイム更新
  return { rooms, isLoading, error, refetch };
};

// useRoom.ts
export const useRoom = (roomId: string) => {
  // 単一ルーム取得
  // ルーム更新
  return { room, isLoading, error, updateRoom };
};

// useCreateRoom.ts
export const useCreateRoom = () => {
  // ルーム作成
  // バリデーション
  return { createRoom, isCreating, error };
};

// useDeleteRoom.ts
export const useDeleteRoom = () => {
  // ルーム削除
  // 関連メッセージも削除
  return { deleteRoom, isDeleting, error };
};
```

#### features/message/hooks

```typescript
// useMessages.ts
export const useMessages = (roomId: string) => {
  // メッセージ取得（ページネーション）
  // リアルタイム更新
  // 楽観的更新
  return { messages, isLoading, error, loadMore, hasMore };
};

// useSendMessage.ts
export const useSendMessage = (roomId: string) => {
  // メッセージ送信
  // 画像アップロード
  // エラーハンドリング
  return { sendMessage, isSending, error };
};

// useMessageActions.ts
export const useMessageActions = () => {
  // 編集/削除/コピー
  // 楽観的更新
  return { editMessage, deleteMessage, copyMessage };
};
```

### 状態管理フロー

```
App
 ├─ QueryClientProvider (Tanstack Query)
 │   ├─ RoomListScreen
 │   │   ├─ useRooms() → SQLite
 │   │   └─ RoomList
 │   │       └─ RoomCard × n
 │   │
 │   └─ ChatScreen
 │       ├─ useMessages() → SQLite
 │       ├─ useRoom() → SQLite
 │       ├─ ChatHeader
 │       ├─ MessageList
 │       │   ├─ DateDivider
 │       │   └─ MessageItem × n
 │       └─ MessageInput
 │           ├─ ImagePickerButton
 │           └─ SendButton
 │
 └─ BottomSheetModalProvider
     └─ MessageActionSheet
```

### コンポーネント間の通信

#### Props Drilling対策
- 2階層まではPropsで直接渡す
- 3階層以上はContext or カスタムフックを使用
- グローバル状態は最小限に

#### イベント処理規約
- イベントハンドラーは`onXxx`形式で統一
- 子から親へはコールバック関数で通信
- 非同期処理は親コンポーネントで管理

#### エラー処理方針
- 各ContainerコンポーネントでTry-Catch
- ErrorBoundaryで予期しないエラーをキャッチ
- ユーザーフレンドリーなエラーメッセージ表示

### レンダリング最適化

#### メモ化戦略
```typescript
// 高頻度で再レンダリングされるコンポーネント
export const MessageItem = React.memo(({ message, ... }) => {
  // ...
}, (prevProps, nextProps) => {
  // カスタム比較ロジック
  return prevProps.message.id === nextProps.message.id &&
         prevProps.message.updatedAt === nextProps.message.updatedAt;
});
```

#### 仮想化リスト
- FlashListを使用して大量のデータを効率的に表示
- estimatedItemSizeの適切な設定
- getItemTypeで異なるアイテムタイプを識別

## 開発ガイドライン

### コーディング規約
- TypeScriptの厳密な型定義
- React Hooksのベストプラクティス遵守
- コンポーネントの責務分離
- TDDアプローチ（テスト先行開発）

### パフォーマンス考慮事項
- FlashListによる大量メッセージの効率的表示
- 画像の遅延読み込み
- SQLiteクエリの最適化
- React.memoによる不要な再レンダリング防止

### セキュリティ考慮事項
- SQLインジェクション対策（パラメータバインディング）
- 画像URIの検証
- ローカルストレージのみ使用（外部通信なし）

## 今後の拡張予定（MVP外）
- 検索機能（ルーム内/全体）
- データエクスポート/インポート
- バックアップ機能
- ルームのアーカイブ
- メッセージのピン留め
- 絵文字リアクション