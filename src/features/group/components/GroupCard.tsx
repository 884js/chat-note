import { Clock, MessageCircle } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';
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
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Theme name={group.color as ThemeName}>
        <Card
          bordered
          borderColor="$color6"
          animation="quick"
          p="$4"
          cursor="pointer"
        >
          <XStack gap="$3" items="center">
            <Avatar circular size="$5" bg="$color5" opacity={0.7}>
              {group.icon ? (
                <Text fontSize="$6">{group.icon}</Text>
              ) : (
                <MessageCircle size={24} color="$color" />
              )}
            </Avatar>

            <YStack flex={1} gap="$1">
              <XStack justify="space-between" items="center">
                <Paragraph fontWeight="600" fontSize="$5">
                  {group.name}
                </Paragraph>
                {group.lastMemoAt && (
                  <XStack gap="$1" items="center">
                    <Clock size={12} opacity={0.5} />
                    <Text fontSize="$2" opacity={0.5}>
                      {formatRelativeTime(group.lastMemoAt)}
                    </Text>
                  </XStack>
                )}
              </XStack>

              {group.description && (
                <Paragraph fontSize="$2" opacity={0.6} numberOfLines={1}>
                  {group.description}
                </Paragraph>
              )}

              {group.lastMemo && (
                <Paragraph fontSize="$3" opacity={0.8} numberOfLines={1}>
                  {group.lastMemo}
                </Paragraph>
              )}
            </YStack>
          </XStack>
        </Card>
      </Theme>
    </TouchableOpacity>
  );
}
