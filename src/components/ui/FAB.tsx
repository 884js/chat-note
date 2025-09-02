import { Button, type ButtonProps, Theme, type ThemeName } from 'tamagui';

interface FABProps extends Omit<ButtonProps, 'position' | 'circular' | 'size'> {
  icon: ButtonProps['icon'];
  bottom?: number;
  right?: number;
  themeName?: ThemeName;
}

export function FAB({
  icon,
  bottom = 24,
  right = 24,
  themeName = 'dark',
  ...props
}: FABProps) {
  const FabButton = (
    <Button
      size="$6"
      circular
      elevate
      icon={icon}
      scaleIcon={1.5}
      position="absolute"
      bg="$buttonPrimary"
      shadowRadius={16}
      shadowColor="$shadowColorFocus"
      shadowOpacity={0.15}
      shadowOffset={{ width: 0, height: 6 }}
      borderWidth={0}
      animation="quick"
      pressStyle={{
        scale: 0.92,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
      }}
      hoverStyle={{
        scale: 1.02,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 8 },
      }}
      {...props}
      style={{
        position: 'absolute',
        bottom,
        right,
        zIndex: 1000,
      }}
    />
  );

  if (themeName) {
    return <Theme name={themeName}>{FabButton}</Theme>;
  }

  return FabButton;
}
