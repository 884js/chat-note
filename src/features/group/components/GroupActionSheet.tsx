import { Edit3, Trash2 } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertDialog,
  Button,
  Separator,
  Sheet,
  Text,
  XStack,
  YStack,
} from 'tamagui';

interface GroupActionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    id: string;
    name: string;
    description?: string;
    color: string;
    icon?: string;
  } | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function GroupActionSheet({
  isOpen,
  onOpenChange,
  group,
  onEdit,
  onDelete,
}: GroupActionSheetProps) {
  const insets = useSafeAreaInsets();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!group) return null;

  const handleEdit = () => {
    onOpenChange(false);
    setTimeout(onEdit, 200);
  };

  const handleDeletePress = () => {
    onOpenChange(false);
    setTimeout(() => setShowDeleteDialog(true), 200);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  return (
    <>
      {/* ボトムシート */}
      <Sheet
        modal
        open={isOpen}
        onOpenChange={onOpenChange}
        snapPoints={[20]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        animation="quick"
        zIndex={100_000}
        disableDrag={false}
      >
        <Sheet.Overlay
          animation="medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={0.4}
          bg="black"
        />
        <Sheet.Handle bg="$color8" size={1} />
        <Sheet.Frame pb={insets.bottom} bg="$background">
          <YStack>
            {/* 編集ボタン */}
            <Button
              size="$5"
              bg="transparent"
              hoverStyle={{ bg: '$color2' }}
              pressStyle={{ bg: '$color3' }}
              onPress={handleEdit}
              justify="space-between"
              px="$5"
              py="$4"
            >
              <XStack gap="$3">
                <Edit3 size={22} color="$color11" />
                <Text fontSize="$5" color="$color12">
                  編集
                </Text>
              </XStack>
            </Button>

            <Separator mx="$5" />

            {/* 削除ボタン */}
            <Button
              size="$5"
              bg="transparent"
              hoverStyle={{ bg: '#fff5f5' }}
              pressStyle={{ bg: '#fee' }}
              onPress={handleDeletePress}
              justify="space-between"
              px="$5"
              py="$4"
            >
              <XStack gap="$3">
                <Trash2 size={22} color="#dc2626" />
                <Text fontSize="$5" color="#dc2626">
                  削除
                </Text>
              </XStack>
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.4}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            p="$5"
            width="85%"
          >
            <YStack gap="$4">
              <YStack gap="$2">
                <AlertDialog.Title fontSize="$6" fontWeight="600">
                  削除の確認
                </AlertDialog.Title>
                <AlertDialog.Description fontSize="$3" color="$color11">
                  「{group.name}」を削除しますか？
                </AlertDialog.Description>
              </YStack>

              <XStack gap="$3">
                <AlertDialog.Cancel asChild>
                  <Button
                    size="$3"
                    variant="outlined"
                    borderColor="$borderColor"
                    flex={1}
                  >
                    キャンセル
                  </Button>
                </AlertDialog.Cancel>
                
                <Button
                  size="$3"
                  bg="#dc2626"
                  color="white"
                  hoverStyle={{ opacity: 0.9 }}
                  pressStyle={{ opacity: 0.8 }}
                  onPress={handleDeleteConfirm}
                  flex={1}
                >
                  削除
                </Button>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </>
  );
}