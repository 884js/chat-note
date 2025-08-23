import { Search, X } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { Button, Input, XStack } from 'tamagui';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBox = memo(function SearchBox({
  value,
  onChange,
  placeholder = '検索...',
  onClear,
}: SearchBoxProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <XStack
      bg="$color2"
      rounded="$10"
      px="$3"
      py="$2"
      items="center"
      gap="$2"
      borderWidth={1}
      borderColor="$color4"
      animation="quick"
      hoverStyle={{
        borderColor: '$color6',
        bg: '$color3',
      }}
      focusStyle={{
        borderColor: '$primary',
        bg: '$color1',
      }}
    >
      <Search size="$1" color="$color10" />
      <Input
        flex={1}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="$color10"
        bg="transparent"
        borderWidth={0}
        fontSize="$4"
        color="$color12"
        unstyled
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />

      {value.length > 0 && (
        <Button
          size="$2"
          circular
          chromeless
          icon={<X size="$1" />}
          onPress={handleClear}
          pressStyle={{ opacity: 0.5 }}
          animation="quick"
        />
      )}
    </XStack>
  );
});
