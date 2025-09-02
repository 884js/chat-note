import { Send } from '@tamagui/lucide-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, type TextInput } from 'react-native';
import { Button, ScrollView, TextArea, XStack, YStack } from 'tamagui';
import { ImagePickerButton } from './ImagePickerButton';
import { ImagePreview } from './ImagePreview';

interface MemoInputProps {
  onSend: (content?: string, imageUri?: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export function MemoInput({
  onSend,
  placeholder = 'メモを入力...',
  isLoading = false,
  autoFocus = false,
}: MemoInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textAreaRef = useRef<TextInput>(null);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();

    // テキストか画像のどちらかがあれば送信可能
    if (!trimmedMessage && !selectedImage) return;

    onSend(trimmedMessage || undefined, selectedImage || undefined);
    setMessage('');
    setSelectedImage(null);
  }, [message, selectedImage, onSend]);

  const handleImageSelected = useCallback((imageUri: string) => {
    setSelectedImage(imageUri);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // 自動フォーカス
  useEffect(() => {
    if (autoFocus && textAreaRef.current) {
      // 少し遅延を入れてフォーカスを確実にする
      const timer = setTimeout(() => {
        textAreaRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const canSend =
    (message.trim().length > 0 || selectedImage !== null) && !isLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <YStack bg="$background" borderTopWidth={1} borderTopColor="$color6">
        {/* 選択された画像のプレビュー */}
        {selectedImage && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            p="$3"
            pb="$0"
          >
            <ImagePreview
              imageUri={selectedImage}
              onRemove={handleRemoveImage}
            />
          </ScrollView>
        )}

        {/* 入力エリア */}
        <XStack p="$3" gap="$2" items="flex-end">
          {/* 画像選択ボタン */}
          <ImagePickerButton
            onImageSelected={handleImageSelected}
            disabled={isLoading}
            size="$4"
          />

          {/* テキスト入力 */}
          <TextArea
            ref={textAreaRef}
            flex={1}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            disabled={isLoading}
            borderWidth={1}
            borderColor="$color6"
            minH={36}
            maxH={120}
            fontFamily="$body"
            multiline
            verticalAlign="middle"
          />

          {/* 送信ボタン */}
          <Button
            size="$4"
            icon={<Send size={24} />}
            onPress={handleSend}
            disabled={!canSend}
            circular
          />
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
