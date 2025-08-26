/**
 * Gallery configuration constants
 */

// Grid layout
export const GALLERY_CONFIG = {
  DEFAULT_NUM_COLUMNS: 3,
  GRID_SPACING: 2,
  LOADING_THRESHOLD: 0.5,
  CONTENT_PADDING_BOTTOM: 20,
  DEFAULT_PAGE_SIZE: 30,
} as const;

// Animation durations
export const ANIMATION_CONFIG = {
  VIEWER_TRANSITION_DURATION: 300,
  THUMBNAIL_ANIMATION_DURATION: 200,
  SPRING_DAMPING: 15,
  SPRING_STIFFNESS: 100,
} as const;

// Image viewer
export const VIEWER_CONFIG = {
  MAX_ZOOM_SCALE: 3,
  MIN_ZOOM_SCALE: 1,
  DOUBLE_TAP_DELAY: 300,
  IMAGE_HEIGHT_RATIO: 0.7, // 70% of screen height
  OVERLAY_OPACITY: 0.5,
  OVERLAY_ANIMATION_DURATION: 200,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOAD_FAILED: '画像の読み込みに失敗しました',
  NO_IMAGES: '画像がありません',
  NO_IMAGES_DESCRIPTION: '写真を追加してメモを作成しましょう',
  PERMISSION_DENIED: 'カメラまたは写真へのアクセス権限が必要です',
} as const;

// Date formatting
export const DATE_LABELS = {
  TODAY: '今日',
  YESTERDAY: '昨日',
} as const;
