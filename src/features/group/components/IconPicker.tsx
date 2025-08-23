import { memo } from 'react';
import { XStack, YStack, Text, ScrollView } from 'tamagui';
import { TouchableOpacity } from 'react-native';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  disabled?: boolean;
}

const iconGroups = [
  {
    category: 'よく使う',
    icons: [
      '📝',
      '📔',
      '💡',
      '📚',
      '💼',
      '🏠',
      '✨',
      '🌟',
      '❤️',
      '✅',
      '📌',
      '🔖',
      '📎',
      '🗂️',
      '📊',
      '🎯',
      '⚡',
      '🔥',
    ],
  },
  {
    category: '仕事・学習',
    icons: [
      '📈',
      '📉',
      '📋',
      '🗓️',
      '📖',
      '✏️',
      '🖊️',
      '🔍',
      '🎓',
      '🏆',
      '💭',
      '🗯️',
      '💫',
      '🚀',
      '⏰',
      '📅',
      '📂',
      '💻',
    ],
  },
  {
    category: '生活・趣味',
    icons: [
      '🛒',
      '🍳',
      '🌱',
      '🌿',
      '🌸',
      '☕',
      '🍎',
      '🎨',
      '🎭',
      '🎸',
      '🎮',
      '🎲',
      '🏃',
      '⚽',
      '🧺',
      '🧹',
      '🎪',
      '♟️',
    ],
  },
];

export const IconPicker = memo(function IconPicker({
  value,
  onChange,
  disabled = false,
}: IconPickerProps) {
  return (
    <ScrollView height={300} showsVerticalScrollIndicator={false}>
      <YStack gap="$3">
        {iconGroups.map((group) => (
          <YStack key={group.category} gap="$1.5">
            <Text fontSize="$2" color="$color10" fontWeight="500">
              {group.category}
            </Text>
            <XStack flexWrap="wrap" gap="$1.5">
              {group.icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => !disabled && onChange(icon)}
                  disabled={disabled}
                  activeOpacity={0.7}
                >
                  <YStack
                    width={45}
                    height={45}
                    bg={value === icon ? '$color5' : '$color2'}
                    rounded="$2"
                    items="center"
                    justify="center"
                    opacity={disabled ? 0.5 : 1}
                    borderWidth={value === icon ? 2 : 1}
                    borderColor={value === icon ? '$primary' : '$color4'}
                    animation="quick"
                    scale={value === icon ? 1.05 : 1}
                  >
                    <Text fontSize={40}>{icon}</Text>
                  </YStack>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  );
});
