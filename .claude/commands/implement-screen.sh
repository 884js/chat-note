#!/bin/bash

# Tamagui画面実装ヘルパースクリプト
# 使用方法: ./implement-screen.sh <画面名> <画面タイプ>

SCREEN_NAME=$1
SCREEN_TYPE=$2

if [ -z "$SCREEN_NAME" ] || [ -z "$SCREEN_TYPE" ]; then
    echo "使用方法: ./implement-screen.sh <画面名> <画面タイプ>"
    echo "画面タイプ: list | form | chat | detail"
    exit 1
fi

echo "================================================"
echo "Tamagui画面実装ヘルパー"
echo "画面名: $SCREEN_NAME"
echo "画面タイプ: $SCREEN_TYPE"
echo "================================================"

echo ""
echo "1. Tamaguiドキュメントを参照中..."
echo "   - https://tamagui.dev/ui/intro"
echo "   - https://tamagui.dev/ui/$SCREEN_TYPE"

echo ""
echo "2. 実装チェックリスト:"
echo "   □ TypeScript型定義"
echo "   □ Tamaguiコンポーネント使用"
echo "   □ テーマ対応"
echo "   □ アニメーション設定"
echo "   □ パフォーマンス最適化"
echo "   □ アクセシビリティ対応"
echo "   □ エラーハンドリング"
echo "   □ ローディング状態"

echo ""
echo "3. 推奨コンポーネント構成:"

case $SCREEN_TYPE in
    "list")
        echo "   - FlashList (高速スクロール)"
        echo "   - Card (アイテム表示)"
        echo "   - XStack/YStack (レイアウト)"
        echo "   - Spinner (ローディング)"
        echo "   - Text (EmptyState)"
        echo "   - Button (FAB)"
        ;;
    "form")
        echo "   - YStack (フォームレイアウト)"
        echo "   - Input/TextArea (入力フィールド)"
        echo "   - Select (選択フィールド)"
        echo "   - Switch/Checkbox (トグル)"
        echo "   - Button (送信ボタン)"
        echo "   - Text (エラー表示)"
        ;;
    "chat")
        echo "   - FlashList (メッセージリスト)"
        echo "   - YStack (メッセージバブル)"
        echo "   - Input (メッセージ入力)"
        echo "   - Button (送信ボタン)"
        echo "   - Avatar (ユーザーアイコン)"
        echo "   - Separator (日付区切り)"
        ;;
    "detail")
        echo "   - ScrollView (スクロール)"
        echo "   - Card (コンテンツ表示)"
        echo "   - XStack/YStack (レイアウト)"
        echo "   - Avatar (画像表示)"
        echo "   - Text/H1-H6 (テキスト)"
        echo "   - Button (アクション)"
        ;;
    *)
        echo "   - 不明な画面タイプ"
        ;;
esac

echo ""
echo "4. 生成するファイル:"
echo "   - src/app/$SCREEN_NAME.tsx (画面コンポーネント)"
echo "   - src/features/$SCREEN_NAME/components/*.tsx (機能コンポーネント)"
echo "   - src/features/$SCREEN_NAME/hooks/*.ts (カスタムフック)"
echo "   - src/features/$SCREEN_NAME/types/index.ts (型定義)"

echo ""
echo "================================================"
echo "実装を開始しますか？ (y/n)"