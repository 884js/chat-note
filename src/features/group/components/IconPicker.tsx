import { memo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';
import { Text, XStack, YStack } from 'tamagui';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  disabled?: boolean;
}

export const IconPicker = memo(function IconPicker({
  value,
  onChange,
  disabled = false,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = (emoji: EmojiType) => {
    onChange(emoji.emoji);
    setIsOpen(false);
  };

  return (
    <YStack gap="$3">
      {/* タッチ可能な選択エリア */}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <XStack
          items="center"
          gap="$3"
          p="$3"
          bg="$color2"
          rounded="$3"
          borderWidth={1}
          borderColor="$color6"
          opacity={disabled ? 0.5 : 1}
        >
          {/* 絵文字アイコン */}
          <YStack
            width={40}
            height={40}
            bg="$color4"
            rounded="$6"
            items="center"
            justify="center"
          >
            <Text fontSize={20}>{value}</Text>
          </YStack>

          {/* テキスト */}
          <Text fontSize="$4" color="$color12" flex={1}>
            アイコンを変更
          </Text>
        </XStack>
      </TouchableOpacity>

      {/* EmojiPicker */}
      <EmojiPicker
        onEmojiSelected={handleEmojiSelect}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </YStack>
  );
});
