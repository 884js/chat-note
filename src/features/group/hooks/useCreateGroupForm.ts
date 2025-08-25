import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useGroups } from './useGroups';

export interface GroupFormData {
  name: string;
  description: string;
}

export interface GroupFormErrors {
  name?: string;
}

export function useCreateGroupForm() {
  const router = useRouter();
  const { createGroup } = useGroups();

  // フォーム状態
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<GroupFormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  // フィールド更新関数
  const updateField = useCallback(
    <K extends keyof GroupFormData>(field: K, value: GroupFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // nameフィールドが更新されたらエラーをクリア
      if (field === 'name' && errors.name) {
        setErrors({});
      }
    },
    [errors.name],
  );

  // バリデーション
  const validateForm = useCallback(() => {
    const newErrors: GroupFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'グループ名を入力してください';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'グループ名は50文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name]);

  // グループ作成処理
  const handleCreate = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      // ランダムなカラーとアイコンを選択
      const colors = [
        'blue',
        'purple',
        'green',
        'orange',
        'pink',
        'red',
        'yellow',
        'gray',
      ] as const;
      const icons = [
        '📝',
        '📔',
        '💡',
        '📚',
        '💼',
        '🏠',
        '✨',
        '🌟',
        '📌',
        '🎯',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];

      await createGroup({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: randomColor,
        icon: randomIcon,
      });

      router.push('/');
    } catch (error) {
      Alert.alert('エラー', 'グループの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  }, [formData, validateForm, createGroup, router]);

  // キャンセル処理
  const handleCancel = useCallback(() => {
    if (formData.name || formData.description) {
      Alert.alert('確認', '入力内容が破棄されますが、よろしいですか？', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '破棄',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  }, [formData.name, formData.description, router]);

  // フォームが送信可能かどうか
  const canSubmit = formData.name.trim().length > 0 && !isCreating;

  return {
    formData,
    errors,
    isCreating,
    canSubmit,
    updateField,
    handleCreate,
    handleCancel,
  };
}
