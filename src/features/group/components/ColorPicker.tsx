import { Check } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { type GetThemeValueForKey, XStack, YStack } from 'tamagui';
import type { GroupColor } from '../types';

interface ColorPickerProps {
  value: GroupColor;
  onChange: (color: GroupColor) => void;
  disabled?: boolean;
}

const colors: Array<{ name: GroupColor; hex: string; label: string }> = [
  { name: 'blue', hex: '#3B82F6', label: 'ブルー' },
  { name: 'purple', hex: '#8B5CF6', label: 'パープル' },
  { name: 'green', hex: '#10B981', label: 'グリーン' },
  { name: 'orange', hex: '#F97316', label: 'オレンジ' },
  { name: 'pink', hex: '#EC4899', label: 'ピンク' },
  { name: 'red', hex: '#EF4444', label: 'レッド' },
  { name: 'yellow', hex: '#F59E0B', label: 'イエロー' },
  { name: 'gray', hex: '#6B7280', label: 'グレー' },
];

export const ColorPicker = memo(function ColorPicker({
  value,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  return (
    <YStack gap="$3">
      <XStack flexWrap="wrap" gap="$3">
        {colors.map((color) => (
          <TouchableOpacity
            key={color.name}
            onPress={() => !disabled && onChange(color.name)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <YStack
              width={60}
              height={60}
              bg={color.hex as GetThemeValueForKey<'backgroundColor'>}
              rounded="$4"
              items="center"
              justify="center"
              opacity={disabled ? 0.5 : 1}
              borderWidth={value === color.name ? 3 : 0}
              borderColor="$color12"
              animation="quick"
              scale={value === color.name ? 1.1 : 1}
              elevationAndroid={value === color.name ? 4 : 1}
              shadowColor="$shadowColor"
              shadowOpacity={value === color.name ? 0.2 : 0.1}
              shadowRadius={value === color.name ? 8 : 4}
              shadowOffset={{ width: 0, height: 2 }}
            >
              {value === color.name && (
                <Check size="$2" color="white" strokeWidth={3} />
              )}
            </YStack>
          </TouchableOpacity>
        ))}
      </XStack>
    </YStack>
  );
});
