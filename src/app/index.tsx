import { YStack, H1, Paragraph, Card, ScrollView } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import { RoomCard } from '@/features/room/components/RoomCard';
import { FAB } from '@/components/ui/FAB';

// サンプルデータ
const sampleRooms = [
  {
    id: '1',
    name: '筋トレメモ',
    description: 'トレーニング記録と目標',
    color: 'room_blue',
    icon: '💪',
    lastMessage: '今日は胸と三頭筋の日。ベンチプレス100kg達成！',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30分前
  },
  {
    id: '2',
    name: 'アイデアノート',
    description: '思いついたことをメモ',
    color: 'room_purple',
    icon: '💡',
    lastMessage: 'アプリのUIデザインについて',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3時間前
  },
  {
    id: '3',
    name: '読書記録',
    description: '読んだ本の感想',
    color: 'room_green',
    icon: '📚',
    lastMessage: '「エンジニアリング組織論」を読了。スクラムについて...',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
  },
];

export default function HomeScreen() {
  const hasRooms = sampleRooms.length > 0;

  return (
    <YStack flex={1} p="$4" bg="$background">
      <YStack flex={1} gap="$4">
        <YStack>
          <H1>チャットメモ</H1>
          <Paragraph size="$3" opacity={0.6}>
            {hasRooms
              ? `${sampleRooms.length}個のルーム`
              : 'ルームを作成してメモを始めましょう'}
          </Paragraph>
        </YStack>

        {hasRooms ? (
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack gap="$2">
              {sampleRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onPress={() => console.log(`Room ${room.id} pressed`)}
                  onLongPress={() =>
                    console.log(`Room ${room.id} long pressed`)
                  }
                />
              ))}
            </YStack>
          </ScrollView>
        ) : (
          <YStack flex={1} justify="center" items="center" gap="$4">
            <Card
              size="$4"
              bordered
              animation="bouncy"
              width={250}
              height={100}
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.875 }}
              p="$4"
            >
              <YStack gap="$2">
                <Paragraph size="$3" opacity={0.9}>
                  ルームがまだありません
                </Paragraph>
                <Paragraph size="$2" opacity={0.7}>
                  新しいルームを作成してください
                </Paragraph>
              </YStack>
            </Card>
          </YStack>
        )}
      </YStack>

      <FAB icon={Plus} />
    </YStack>
  );
}
