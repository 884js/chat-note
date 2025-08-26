import { memo } from 'react';
import { Text, XStack } from 'tamagui';

interface SectionHeaderProps {
  title: string;
  count: number;
}

export const SectionHeader = memo(function SectionHeader({
  title,
  count,
}: SectionHeaderProps) {
  return (
    <XStack
      bg="$background"
      px="$4"
      py="$2"
      items="center"
      justify="space-between"
      borderBottomWidth={0.5}
      borderBottomColor="$color4"
    >
      <Text fontSize="$4" fontWeight="600" color="$color12">
        {title}
      </Text>
      <Text fontSize="$2" color="$color8">
        {count}枚
      </Text>
    </XStack>
  );
});
