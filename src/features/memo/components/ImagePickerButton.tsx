import { Image as ImageIcon } from '@tamagui/lucide-icons';
import * as ImagePicker from 'expo-image-picker';
import { memo, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { Button } from 'tamagui';

interface ImagePickerButtonProps {
  onImageSelected: (imageUri: string) => void;
  disabled?: boolean;
  size?: '$3' | '$4' | '$5';
}

export const ImagePickerButton = memo(function ImagePickerButton({
  onImageSelected,
  disabled = false,
  size = '$4',
}: ImagePickerButtonProps) {
  // 権限の確認とリクエスト
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const cameraRollStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraRollStatus.status !== 'granted') {
        Alert.alert(
          '権限が必要です',
          '写真ライブラリへのアクセス権限が必要です',
        );
        return false;
      }
    }
    return true;
  }, []);

  // 画像ライブラリから選択
  const pickImageFromLibrary = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false, // 編集を無効にして自由な切り抜きを可能に
        quality: 1, // 元の品質を維持
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', '画像の選択に失敗しました');
    }
  }, [requestPermissions, onImageSelected]);

  // カメラから撮影
  const takePhoto = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      if (cameraStatus.status !== 'granted') {
        Alert.alert('権限が必要です', 'カメラへのアクセス権限が必要です');
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // 編集を無効にして自由な切り抜きを可能に
        quality: 1, // 元の品質を維持
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', '写真の撮影に失敗しました');
    }
  }, [onImageSelected]);

  // 画像選択のオプションを表示
  const handlePress = useCallback(() => {
    Alert.alert('画像を選択', '画像の選択方法を選んでください', [
      {
        text: 'カメラで撮影',
        onPress: takePhoto,
      },
      {
        text: 'ライブラリから選択',
        onPress: pickImageFromLibrary,
      },
      {
        text: 'キャンセル',
        style: 'cancel',
      },
    ]);
  }, [takePhoto, pickImageFromLibrary]);

  return (
    <Button
      size={size}
      icon={ImageIcon}
      onPress={handlePress}
      disabled={disabled}
      circular
      chromeless
      pressStyle={{ scale: 0.95, opacity: 0.6 }}
      animation="quick"
    />
  );
});
