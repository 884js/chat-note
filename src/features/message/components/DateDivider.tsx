import { memo } from 'react';
import { XStack, Text, Separator } from 'tamagui';

interface DateDividerProps {
  date: string;
}

export const DateDivider = memo(function DateDivider({ date }: DateDividerProps) {
  const formatDate = (dateStr: string) => {
    const today = new Date();
    const targetDate = new Date(dateStr);
    
    // 今日かどうか
    if (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    ) {
      return '今日';
    }
    
    // 昨日かどうか
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      yesterday.getFullYear() === targetDate.getFullYear() &&
      yesterday.getMonth() === targetDate.getMonth() &&
      yesterday.getDate() === targetDate.getDate()
    ) {
      return '昨日';
    }
    
    // 今年かどうか
    if (today.getFullYear() === targetDate.getFullYear()) {
      return targetDate.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric',
      });
    }
    
    // それ以外
    return targetDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <XStack
      items="center"
      py="$3"
      px="$4"
      gap="$3"
    >
      <Separator flex={1} />
      <Text
        fontSize="$2"
        color="$color10"
        fontWeight="500"
        bg="$background"
        px="$2"
      >
        {formatDate(date)}
      </Text>
      <Separator flex={1} />
    </XStack>
  );
});