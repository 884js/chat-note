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
      shadowRadius={8}
      shadowColor="$shadowColorFocus"
      shadowOpacity={0.12}
      shadowOffset={{ width: 0, height: 4 }}
      borderWidth={0}
      animation="bouncy"
      pressStyle={{
        scale: 0.94,
        shadowOpacity: 0.06,
      }}
      animateOnly={['transform', 'shadowOpacity']}
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
