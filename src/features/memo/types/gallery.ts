import type { Memo } from './index';

// 画像ギャラリーアイテムの型
export interface GalleryImage {
  id: string;
  uri: string;
  date: Date;
  content?: string;
  memoId: string;
}

// セクション別の画像グループ
export interface GallerySection {
  title: string; // 日付など
  data: GalleryImage[];
}

// ギャラリービューアーのプロパティ
export interface GalleryViewerProps {
  images: GalleryImage[];
  initialIndex: number;
  isVisible: boolean;
  onClose: () => void;
}

// サムネイルのプロパティ
export interface ThumbnailProps {
  image: GalleryImage;
  size: number;
  onPress: () => void;
  index: number;
}

// ギャラリーグリッドのプロパティ
export interface GalleryGridProps {
  images: GalleryImage[];
  onImagePress: (index: number) => void;
  numColumns?: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

// フラット化されたリストアイテムの型
export type FlatListItem =
  | { type: 'header'; title: string; count: number; id: string }
  | { type: 'row'; images: GalleryImage[]; startIndex: number };

// セクションをフラット化してグリッド表示用に変換
export function sectionsToFlatList(
  sections: GallerySection[],
  numColumns: number,
): FlatListItem[] {
  const result: FlatListItem[] = [];
  let globalIndex = 0;

  for (const section of sections) {
    // セクションヘッダーを追加
    result.push({
      type: 'header',
      title: section.title,
      count: section.data.length,
      id: `header-${section.title}`,
    });

    // 画像を行ごとにグループ化
    const rows: GalleryImage[][] = [];
    for (let i = 0; i < section.data.length; i += numColumns) {
      const row = section.data.slice(i, i + numColumns);
      rows.push(row);
    }

    // 各行を追加
    for (const row of rows) {
      result.push({
        type: 'row',
        images: row,
        startIndex: globalIndex,
      });
      globalIndex += row.length;
    }
  }

  return result;
}

// メモから画像ギャラリーアイテムへの変換
export function memoToGalleryImage(memo: Memo): GalleryImage | null {
  if (!memo.imageUri) return null;

  return {
    id: `gallery-${memo.id}`,
    uri: memo.imageUri,
    date: memo.createdAt,
    content: memo.content,
    memoId: memo.id,
  };
}

// メモリストからギャラリーセクションへの変換
export function memosToGallerySections(memos: Memo[]): GallerySection[] {
  const sections = new Map<string, GalleryImage[]>();

  for (const memo of memos) {
    const galleryImage = memoToGalleryImage(memo);
    if (!galleryImage) continue;

    // 日付でグループ化（YYYY-MM-DD形式）
    const dateKey = galleryImage.date.toISOString().split('T')[0];

    if (!sections.has(dateKey)) {
      sections.set(dateKey, []);
    }
    sections.get(dateKey)?.push(galleryImage);
  }

  // セクション配列に変換して日付順にソート
  return Array.from(sections.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // 新しい日付が上
    .map(([date, images]) => ({
      title: formatSectionDate(date),
      data: images,
    }));
}

// セクションタイトル用の日付フォーマット
function formatSectionDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return '今日';
  }
  if (dateString === yesterday.toISOString().split('T')[0]) {
    return '昨日';
  }
  return date.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
  });
}
