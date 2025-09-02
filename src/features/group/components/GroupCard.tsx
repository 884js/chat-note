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

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    color: string;
    icon?: string;
    lastMemo?: string;
    lastMemoAt?: Date;
  };
  onPress: () => void;
}

export function GroupCard({ group, onPress }: GroupCardProps) {
  const handlePress = () => {
    console.log('Group card pressed:', group.id);
    onPress();
  };

  return (
    <Theme name={group.color as ThemeName}>
      <Card
        bordered
        borderColor="$cardBorder"
        animation="quick"
        backgroundColor="$cardBackground"
        p="$4"
        cursor="pointer"
        onPress={handlePress}
        hoverStyle={{
          scale: 0.98,
          shadowOpacity: 0.12,
          borderColor: '$borderColorHover',
        }}
        pressStyle={{
          scale: 0.96,
          shadowOpacity: 0.04,
        }}
      >
          <XStack gap="$3" items="center">
            <Avatar circular size="$5" bg="$color5" opacity={0.85}>
              {group.icon ? (
                <Text fontSize="$6">{group.icon}</Text>
              ) : (
                <MessageCircle size={24} color="$color" />
              )}
            </Avatar>

            <YStack flex={1} gap="$1">
              <XStack justify="space-between" items="center">
                <Paragraph fontWeight="700" fontSize="$5" color="$color12">
                  {group.name}
                </Paragraph>
                {group.lastMemoAt && (
                  <XStack gap="$1" items="center">
                    <Clock size={12} opacity={0.4} color="$color11" />
                    <Text fontSize="$2" opacity={0.6} color="$color11">
                      {formatRelativeTime(group.lastMemoAt)}
                    </Text>
                  </XStack>
                )}
              </XStack>

              {group.description && (
                <Paragraph fontSize="$2" opacity={0.7} numberOfLines={1} color="$color11">
                  {group.description}
                </Paragraph>
              )}

              {group.lastMemo && (
                <Paragraph fontSize="$3" opacity={0.85} numberOfLines={2} color="$color11">
                  {group.lastMemo}
                </Paragraph>
              )}
            </YStack>
          </XStack>
      </Card>
    </Theme>
  );
}
