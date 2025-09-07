import { Clock, MessageCircle } from '@tamagui/lucide-icons';
import {
  Avatar,
  Card,
  Paragraph,
  Text,
  Theme,
  type ThemeName,
  XStack,
  YStack,
} from 'tamagui';
import { formatRelativeTime } from '../../../lib/dateUtils';
import type { GroupWithLastMemo } from '../types';

interface GroupGridCardProps {
  group: GroupWithLastMemo;
  onPress: () => void;
  onLongPress?: () => void;
}

export function GroupGridCard({
  group,
  onPress,
  onLongPress,
}: GroupGridCardProps) {
  return (
    <Theme name={group.color as ThemeName}>
      <Card
        bordered
        borderColor="$cardBorder"
        animation="bouncy"
        backgroundColor="$cardBackground"
        shadowColor="$shadowColor"
        shadowRadius={3}
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.04}
        p="$3"
        cursor="pointer"
        onPress={onPress}
        onLongPress={onLongPress}
        pressStyle={{
          scale: 0.95,
          shadowOpacity: 0.02,
        }}
        animateOnly={['transform', 'shadowOpacity']}
        height={140}
      >
        <YStack flex={1} gap="$2">
          {/* アバターと時刻 */}
          <XStack justify="space-between" items="center">
            <Avatar circular size="$4" bg="$color5" opacity={0.85}>
              {group.icon ? (
                <Text fontSize="$5">{group.icon}</Text>
              ) : (
                <MessageCircle size={20} color="$color" />
              )}
            </Avatar>

            {group.lastMemoAt && (
              <XStack gap="$0.5" items="center">
                <Clock size={10} opacity={0.4} color="$color11" />
                <Text fontSize="$1" opacity={0.6} color="$color11">
                  {formatRelativeTime(group.lastMemoAt)}
                </Text>
              </XStack>
            )}
          </XStack>

          {/* グループ名 */}
          <Paragraph
            fontWeight="700"
            fontSize="$4"
            color="$color12"
            numberOfLines={1}
          >
            {group.name}
          </Paragraph>

          {/* 説明または最後のメモ */}
          <YStack flex={1} justify="flex-start">
            {group.lastMemo ? (
              <Paragraph
                fontSize="$2"
                opacity={0.8}
                numberOfLines={2}
                color="$color11"
                lineHeight="$1"
              >
                {group.lastMemo}
              </Paragraph>
            ) : group.description ? (
              <Paragraph
                fontSize="$2"
                opacity={0.6}
                numberOfLines={2}
                color="$color11"
                lineHeight="$1"
              >
                {group.description}
              </Paragraph>
            ) : null}
          </YStack>
        </YStack>
      </Card>
    </Theme>
  );
}
