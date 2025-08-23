import { formatDateForDivider } from '@/lib/dateUtils';
import { Calendar } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { Separator, Text, XStack, YStack } from 'tamagui';

interface DateDividerProps {
  date: string;
}

export const DateDivider = memo(function DateDivider({
  date,
}: DateDividerProps) {
  return (
    <XStack items="center" py="$4" px="$4" gap="$3">
      <Separator flex={1} borderColor="$color5" />
      <YStack
        bg="$color2"
        rounded="$10"
        px="$3"
        py="$1.5"
        borderWidth={1}
        borderColor="$color5"
      >
        <XStack items="center" gap="$1.5">
          <Calendar size="$0.75" color="$color10" />
          <Text fontSize="$2" color="$color11" fontWeight="600">
            {formatDateForDivider(date)}
          </Text>
        </XStack>
      </YStack>
      <Separator flex={1} borderColor="$color5" />
    </XStack>
  );
});
