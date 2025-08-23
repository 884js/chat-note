import { Send } from '@tamagui/lucide-icons';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, XStack } from 'tamagui';

interface MemoInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function MemoInput({
  onSend,
  placeholder = 'メモを入力...',
  isLoading = false,
}: MemoInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage('');
  }, [message, onSend]);

  const canSend = message.trim().length > 0 && !isLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <XStack
        p="$3"
        gap="$2"
        bg="$background"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        items="center"
      >
        <Input
          flex={1}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          disabled={isLoading}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          size="$4"
          borderWidth={1}
          borderColor="$borderColor"
        />

        <Button
          size="$4"
          icon={Send}
          onPress={handleSend}
          disabled={!canSend}
          circular
        />
      </XStack>
    </KeyboardAvoidingView>
  );
}
