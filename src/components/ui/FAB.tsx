import { Button, type ButtonProps, Theme } from 'tamagui';
import React from 'react';

interface FABProps extends Omit<ButtonProps, 'position' | 'circular' | 'size'> {
  icon: React.ReactNode;
  bottom?: number;
  right?: number;
  themeName?: string;
}

export function FAB({
  icon,
  bottom = 24,
  right = 24,
  themeName = 'blue',
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
    return <Theme name={themeName as any}>{FabButton}</Theme>;
  }

  return FabButton;
}
