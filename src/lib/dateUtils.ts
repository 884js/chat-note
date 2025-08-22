import {
  format,
  isToday,
  isYesterday,
  isSameYear,
  parseISO,
  isValid,
} from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付文字列をフォーマットして表示用の文字列を返す
 * @param dateString - ISO形式の日付文字列またはDateオブジェクト
 * @returns フォーマットされた日付文字列
 */
export const formatDateForDivider = (dateString: string | Date): string => {
  try {
    // 文字列の場合はDateオブジェクトに変換
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;

    // 無効な日付の場合はエラー処理
    if (!isValid(date)) {
      console.error('Invalid date:', dateString);
      return '日付エラー';
    }

    // 今日の場合
    if (isToday(date)) {
      return '今日';
    }

    // 昨日の場合
    if (isYesterday(date)) {
      return '昨日';
    }

    // 今年の場合（月日のみ表示）
    if (isSameYear(date, new Date())) {
      return format(date, 'M月d日', { locale: ja });
    }

    // それ以外（年月日を表示）
    return format(date, 'yyyy年M月d日', { locale: ja });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '日付エラー';
  }
};

/**
 * 時刻を表示用にフォーマット
 * @param date - Dateオブジェクト
 * @returns フォーマットされた時刻文字列
 */
export const formatTime = (date: Date): string => {
  try {
    if (!isValid(date)) {
      return '--:--';
    }
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Time formatting error:', error);
    return '--:--';
  }
};

/**
 * 日付と時刻を表示用にフォーマット
 * @param date - Dateオブジェクト
 * @returns フォーマットされた日時文字列
 */
export const formatDateTime = (date: Date): string => {
  try {
    if (!isValid(date)) {
      return '日付エラー';
    }

    if (isToday(date)) {
      return `今日 ${format(date, 'HH:mm')}`;
    }

    if (isYesterday(date)) {
      return `昨日 ${format(date, 'HH:mm')}`;
    }

    if (isSameYear(date, new Date())) {
      return format(date, 'M月d日 HH:mm', { locale: ja });
    }

    return format(date, 'yyyy年M月d日 HH:mm', { locale: ja });
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return '日付エラー';
  }
};

/**
 * 相対的な時間表示（例: 5分前、2時間前）
 * @param date - Dateオブジェクト
 * @returns 相対的な時間文字列
 */
export const formatRelativeTime = (date: Date): string => {
  try {
    if (!isValid(date)) {
      return '';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'たった今';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}日前`;
    }

    // 1週間以上前は通常の日付表示
    return formatDateTime(date);
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
};
