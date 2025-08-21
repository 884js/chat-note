import { Card, XStack, YStack, Paragraph, Avatar, Text, Theme } from 'tamagui';
import { MessageCircle, Clock } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description?: string;
    color: string;
    icon?: string;
    lastMessage?: string;
    lastMessageAt?: Date;
  };
  onPress: () => void;
  onLongPress?: () => void;
}

export function RoomCard({ room, onPress, onLongPress }: RoomCardProps) {
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
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <Theme name={room.color as any}>
        <Card
          bordered
          animation="quick"
          hoverStyle={{ scale: 0.98 }}
          pressStyle={{ scale: 0.95 }}
          mb="$3"
          p="$4"
        >
          <XStack gap="$3" items="center">
            <Avatar circular size="$5" bg="$color5" opacity={0.2}>
              {room.icon ? (
                <Text fontSize="$6">{room.icon}</Text>
              ) : (
                <MessageCircle size={24} color="$color" />
              )}
            </Avatar>

            <YStack flex={1} gap="$1">
              <XStack justify="space-between" items="center">
                <Paragraph fontWeight="600" fontSize="$5">
                  {room.name}
                </Paragraph>
                {room.lastMessageAt && (
                  <XStack gap="$1" items="center">
                    <Clock size={12} opacity={0.5} />
                    <Text fontSize="$2" opacity={0.5}>
                      {formatTime(room.lastMessageAt)}
                    </Text>
                  </XStack>
                )}
              </XStack>

              {room.description && (
                <Paragraph fontSize="$2" opacity={0.6} numberOfLines={1}>
                  {room.description}
                </Paragraph>
              )}

              {room.lastMessage && (
                <Paragraph fontSize="$3" opacity={0.8} numberOfLines={1}>
                  {room.lastMessage}
                </Paragraph>
              )}
            </YStack>
          </XStack>
        </Card>
      </Theme>
    </TouchableOpacity>
  );
}
