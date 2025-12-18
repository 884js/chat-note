# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド・実行
npm run ios              # iOS実行
npm run android          # Android実行
npm run prebuild:ios     # iOSネイティブプロジェクト生成
npm run prebuild:android # Androidネイティブプロジェクト生成

# コード品質
npm run lint             # Biomeでlint + 自動修正
npm run format           # Biomeでフォーマット
npm run typecheck        # TypeScript型チェック

# テスト
npm run test             # Jest (watchモード)

# データベース
npm run db:generate      # Drizzle マイグレーション生成
npm run db:migrate       # マイグレーション実行
```

## アーキテクチャ

### プロジェクト構造

```
src/
├── app/                    # Expo Router画面 (ファイルベースルーティング)
├── features/               # 機能別モジュール
│   ├── group/              # グループ（ルーム）機能
│   ├── memo/               # メモ機能
│   └── backup/             # エクスポート/インポート機能
├── components/             # 共通UIコンポーネント
├── lib/
│   └── database/           # Drizzle ORM + expo-sqlite
└── theme/                  # Tamaguiテーマ設定
```

### 技術スタック

- **フレームワーク**: Expo (React Native) + Expo Router
- **UI**: Tamagui (XStack, YStack, Button, etc.)
- **状態管理**: TanStack Query (React Query)
- **データベース**: expo-sqlite + Drizzle ORM
- **リスト表示**: @shopify/flash-list
- **リンター/フォーマッター**: Biome

### データベース設計

Drizzle ORMでスキーマ定義（`src/lib/database/schema.ts`）:
- `groups`: グループテーブル（id, name, description, color, icon, isArchived）
- `memos`: メモテーブル（id, groupId, content, imageUri, isDeleted）

マイグレーションは `drizzle/` ディレクトリに生成。
DatabaseProviderが初期化・マイグレーション・シードを自動実行。

### 機能モジュール構成

各`features/`ディレクトリの構成:
```
features/{feature}/
├── components/   # UIコンポーネント
├── hooks/        # カスタムフック (useGroups, useMemos等)
├── types/        # 型定義
├── constants/    # 定数
└── services/     # ビジネスロジック (backup機能等)
```

### パスエイリアス

`@/*` → `./src/*` (tsconfig.jsonで設定)

例: `import { DatabaseProvider } from '@/lib/database'`

## コーディング規約

- TDD（テスト駆動開発）で進める
- TypeScript厳密モード有効
- Biome設定: シングルクォート、セミコロン必須、スペース2インデント
- コンポーネントはSmart/Dumb分離（Container/Presentational）
- イベントハンドラは`onXxx`形式で統一

## 設計ドキュメント

### コンセプト

グループ化できるチャットメモアプリ「Memoly」。
- ローカル完結（外部通信なし）
- LINEのKeepメモのように複数グループを作成可能

### 画面構成

1. **グループ一覧** (`/`): カード/グリッド表示、最終更新順ソート
2. **グループ作成/編集** (`/group/create`, `/group/[id]/edit`)
3. **チャット画面** (`/group/[id]`): LINEライクなメモ入力、日付区切り、長押しメニュー
4. **設定・バックアップ** (`/settings/*`)

### データモデル

**Group**
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT | 主キー（UUID） |
| name | TEXT | グループ名 |
| description | TEXT | 説明（オプション） |
| color | TEXT | テーマカラー |
| icon | TEXT | 絵文字アイコン |
| isArchived | INTEGER | アーカイブフラグ |
| createdAt | INTEGER | 作成日時（Unix timestamp） |
| updatedAt | INTEGER | 更新日時（Unix timestamp） |

**Memo**
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT | 主キー（UUID） |
| groupId | TEXT | グループID（外部キー） |
| content | TEXT | テキスト内容 |
| imageUri | TEXT | 画像URI（オプション） |
| createdAt | INTEGER | 作成日時 |
| updatedAt | INTEGER | 更新日時 |
| isDeleted | INTEGER | 削除フラグ（論理削除） |
