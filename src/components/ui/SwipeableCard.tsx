import type { IconProps } from '@tamagui/helpers-icon';
import { type ReactNode, memo, useCallback } from 'react';
import { Dimensions } from 'react-native';
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
import { type GetThemeValueForKey, Text, XStack, YStack } from 'tamagui';

export interface SwipeAction {
  icon: React.FC<IconProps>;
  text: string;
  color: string;
  backgroundColor: string;
  onAction: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftSwipe?: SwipeAction;
  rightSwipe?: SwipeAction;
  leftSwipeThreshold?: number;
  rightSwipeThreshold?: number;
  hideOnLeftSwipe?: boolean;
  containerPadding?: number;
  containerMarginBottom?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const SwipeableCard = memo(function SwipeableCard({
  children,
  leftSwipe,
  rightSwipe,
  leftSwipeThreshold = SCREEN_WIDTH * 0.35,
  rightSwipeThreshold = SCREEN_WIDTH * 0.25,
  hideOnLeftSwipe = false,
  containerPadding,
  containerMarginBottom,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(1);
  const opacity = useSharedValue(1);

  // 左スワイプアクション実行
  const executeLeftAction = useCallback(() => {
    'worklet';
    if (leftSwipe) {
      runOnJS(leftSwipe.onAction)();
    }
  }, [leftSwipe]);

  // 右スワイプアクション実行
  const executeRightAction = useCallback(() => {
    'worklet';
    if (rightSwipe) {
      runOnJS(rightSwipe.onAction)();
    }
  }, [rightSwipe]);

  // パンジェスチャーの処理
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const shouldLeftAction =
        leftSwipe && e.translationX < -leftSwipeThreshold;
      const shouldRightAction =
        rightSwipe && e.translationX > rightSwipeThreshold;

      if (shouldLeftAction) {
        if (hideOnLeftSwipe) {
          // 左にスワイプして消えるアニメーション
          translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
          opacity.value = withTiming(0, { duration: 300 }, () => {
            executeLeftAction();
          });
        } else {
          // アクション実行後、元に戻す
          translateX.value = withTiming(0, { duration: 200 });
          executeLeftAction();
        }
      } else if (shouldRightAction) {
        // 右スワイプアクション実行後、元に戻す
        translateX.value = withTiming(0, { duration: 200 });
        executeRightAction();
      } else {
        // 閾値未満なら元に戻す
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  // カード本体のアニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      height: itemHeight.value === 1 ? 'auto' : itemHeight.value,
    };
  });

  // 左スワイプ背景のアニメーションスタイル
  const leftBackgroundStyle = useAnimatedStyle(() => {
    if (!leftSwipe) return { opacity: 0 };

    const backgroundColor = interpolateColor(
      translateX.value,
      [-leftSwipeThreshold, 0],
      [leftSwipe.backgroundColor, '#cccccc'],
    );

    return {
      backgroundColor,
      opacity: translateX.value < 0 ? 1 : 0,
    };
  });

  // 右スワイプ背景のアニメーションスタイル
  const rightBackgroundStyle = useAnimatedStyle(() => {
    if (!rightSwipe) return { opacity: 0 };

    const backgroundColor = interpolateColor(
      translateX.value,
      [0, rightSwipeThreshold],
      ['#cccccc', rightSwipe.backgroundColor],
    );

    return {
      backgroundColor,
      opacity: translateX.value > 0 ? 1 : 0,
    };
  });

  // アイコンのアニメーションスタイル
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

  return (
    <GestureHandlerRootView>
      <YStack
        position="relative"
        px={containerPadding}
        mb={containerMarginBottom}
      >
        {/* 左スワイプ時の背景 */}
        {leftSwipe && (
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
                borderRadius: containerPadding ? 12 : 0,
              },
              leftBackgroundStyle,
            ]}
          >
            <Animated.View style={leftIconStyle}>
              <XStack items="center" gap="$2">
                {leftSwipe.icon({
                  size: 24,
                  color: leftSwipe.color as GetThemeValueForKey<'color'>,
                })}
                <Text
                  color={leftSwipe.color as GetThemeValueForKey<'color'>}
                  fontSize="$4"
                  fontWeight="600"
                >
                  {leftSwipe.text}
                </Text>
              </XStack>
            </Animated.View>
          </Animated.View>
        )}

        {/* 右スワイプ時の背景 */}
        {rightSwipe && (
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
                borderRadius: containerPadding ? 12 : 0,
              },
              rightBackgroundStyle,
            ]}
          >
            <Animated.View style={rightIconStyle}>
              <XStack items="center" gap="$2">
                {rightSwipe.icon({
                  size: 24,
                  color: rightSwipe.color as GetThemeValueForKey<'color'>,
                })}
                <Text
                  color={rightSwipe.color as GetThemeValueForKey<'color'>}
                  fontSize="$4"
                  fontWeight="600"
                >
                  {rightSwipe.text}
                </Text>
              </XStack>
            </Animated.View>
          </Animated.View>
        )}

        {/* カード本体 */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>{children}</Animated.View>
        </GestureDetector>
      </YStack>
    </GestureHandlerRootView>
  );
});
