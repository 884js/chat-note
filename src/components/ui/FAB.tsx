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
      bg="$primary"
      shadowRadius={12}
      shadowColor="$shadowColor"
      shadowOpacity={0.25}
      shadowOffset={{ width: 0, height: 4 }}
      pressStyle={{
        scale: 0.95,
        bg: '$primaryDark',
      }}
      hoverStyle={{
        scale: 1.05,
        bg: '$primaryLight',
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
