import { Archive, Edit3 } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { Alert, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';
import type { GroupWithLastMemo } from '../types';
import { GroupCard } from './GroupCard';

interface SwipeableGroupCardProps {
  group: GroupWithLastMemo;
  onPress: () => void;
  onLongPress?: () => void;
  onArchive?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
  onEdit?: (group: GroupWithLastMemo) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD_ARCHIVE = SCREEN_WIDTH * 0.35;
const SWIPE_THRESHOLD_DELETE = SCREEN_WIDTH * 0.9; // 削除を実質無効化（90%スワイプが必要）
const SWIPE_THRESHOLD_EDIT = SCREEN_WIDTH * 0.25;

export const SwipeableGroupCard = memo(function SwipeableGroupCard({
  group,
  onPress,
  onLongPress,
  onArchive,
  onDelete,
  onEdit,
}: SwipeableGroupCardProps) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(1);
  const opacity = useSharedValue(1);

  // アクション実行用のコールバック（UIスレッドから呼び出し可能）
  const executeArchive = useCallback(() => {
    'worklet';
    if (onArchive) {
      runOnJS(onArchive)(group.id);
    }
  }, [group.id, onArchive]);


  const executeEdit = useCallback(() => {
    'worklet';
    if (onEdit) {
      runOnJS(onEdit)(group);
    }
  }, [group, onEdit]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // 横方向の移動が10px以上でジェスチャーを開始
    .failOffsetY([-5, 5]) // 縦方向の移動が5px以上でジェスチャーを失敗させる
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const shouldArchive = e.translationX < -SWIPE_THRESHOLD_ARCHIVE;
      const shouldEdit = e.translationX > SWIPE_THRESHOLD_EDIT;

      if (shouldArchive) {
        // アーカイブアニメーション
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          executeArchive();
        });
      } else if (shouldEdit) {
        // 編集実行後、元に戻す
        translateX.value = withTiming(0, { duration: 200 });
        executeEdit();
      } else {
        // 閾値未満なら元に戻す
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  // グループカード本体のアニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      height: itemHeight.value === 1 ? 'auto' : itemHeight.value,
    };
  });

  // 背景のアニメーションスタイル（左スワイプ）
  const leftBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [-SWIPE_THRESHOLD_ARCHIVE, 0],
      ['#ff9500', '#cccccc'],
    );

    return {
      backgroundColor,
      opacity: translateX.value < 0 ? 1 : 0,
    };
  });

  // 背景のアニメーションスタイル（右スワイプ）
  const rightBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, SWIPE_THRESHOLD_EDIT],
      ['#cccccc', '#007AFF'],
    );

    return {
      backgroundColor,
      opacity: translateX.value > 0 ? 1 : 0,
    };
  });

  // アイコンとテキストのアニメーションスタイル
  const leftIconStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value < 0 ? 1 : 0,
    };
  });

  const rightIconStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value > 0 ? 1 : 0,
    };
  });

  // アーカイブアイコンの表示
  const archiveIconStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value < 0 ? 1 : 0,
    };
  });

  return (
    <GestureHandlerRootView>
      <YStack position="relative">
        {/* 左スワイプ時の背景 */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 20,
              marginBottom: 12, // GroupCardのmbと同じ値
            },
            leftBackgroundStyle,
          ]}
        >
          <Animated.View style={leftIconStyle}>
            <Animated.View style={archiveIconStyle}>
              <XStack items="center" gap="$2">
                <Archive size="$2" color="white" />
                <Text color="white" fontSize="$4" fontWeight="600">
                  アーカイブ
                </Text>
              </XStack>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* 右スワイプ時の背景 */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 20,
              marginBottom: 12, // GroupCardのmbと同じ値
            },
            rightBackgroundStyle,
          ]}
        >
          <Animated.View style={rightIconStyle}>
            <XStack items="center" gap="$2">
              <Edit3 size="$2" color="white" />
              <Text color="white" fontSize="$4" fontWeight="600">
                編集
              </Text>
            </XStack>
          </Animated.View>
        </Animated.View>

        {/* グループカード本体 */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
            <GroupCard
              group={group}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          </Animated.View>
        </GestureDetector>
      </YStack>
    </GestureHandlerRootView>
  );
});
