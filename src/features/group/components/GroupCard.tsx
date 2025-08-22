import {
  Card,
  XStack,
  YStack,
  Paragraph,
  Avatar,
  Text,
  Theme,
  type ThemeName,
} from 'tamagui';
import { MessageCircle, Clock } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';

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
  onLongPress?: () => void;
}

export function GroupCard({ group, onPress, onLongPress }: GroupCardProps) {
  console.log('GroupCard rendered:', group.id, {
    onPress: !!onPress,
    onLongPress: !!onLongPress,
  });

  const handlePress = () => {
    console.log('Group card pressed:', group.id);
    onPress();
  };

  const handleLongPress = () => {
    console.log('Group card long pressed:', group.id);
    onLongPress?.();
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (days === 1) {
      return '昨日';
    }
    if (days < 7) {
      return `${days}日前`;
    }
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <Theme name={group.color as ThemeName}>
        <Card bordered animation="quick" mb="$3" p="$4" cursor="pointer">
          <XStack gap="$3" items="center">
            <Avatar circular size="$5" bg="$color5" opacity={0.2}>
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
                      {formatTime(group.lastMemoAt)}
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
