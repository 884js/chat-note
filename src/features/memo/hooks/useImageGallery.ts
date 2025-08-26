import {
  getImageCountByGroupId,
  getImageMemosByGroupId,
} from '@/lib/database/repositories/memoRepository';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Memo } from '../types';
import type { GalleryImage } from '../types/gallery';
import { memoToGalleryImage } from '../types/gallery';

// Constants
const DEFAULT_PAGE_SIZE = 30;

// State type
interface ImageGalleryState {
  memos: Memo[];
  images: GalleryImage[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  totalCount: number;
  error: Error | null;
  offset: number;
}

// Action types
type ImageGalleryAction =
  | { type: 'FETCH_START'; isRefresh: boolean }
  | {
      type: 'FETCH_SUCCESS';
      memos: Memo[];
      images: GalleryImage[];
      totalCount: number;
      isRefresh: boolean;
    }
  | { type: 'FETCH_ERROR'; error: Error }
  | { type: 'SET_HAS_MORE'; hasMore: boolean };

// Initial state
const initialState: ImageGalleryState = {
  memos: [],
  images: [],
  isLoading: true,
  isRefreshing: false,
  hasMore: true,
  totalCount: 0,
  error: null,
  offset: 0,
};

// Reducer
function imageGalleryReducer(
  state: ImageGalleryState,
  action: ImageGalleryAction,
): ImageGalleryState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: !action.isRefresh && state.memos.length === 0,
        isRefreshing: action.isRefresh,
        error: null,
      };

    case 'FETCH_SUCCESS': {
      if (action.isRefresh) {
        return {
          ...state,
          memos: action.memos,
          images: action.images,
          totalCount: action.totalCount,
          offset: action.images.length,
          hasMore: action.images.length < action.totalCount,
          isLoading: false,
          isRefreshing: false,
        };
      }
      return {
        ...state,
        memos: [...state.memos, ...action.memos],
        images: [...state.images, ...action.images],
        totalCount: action.totalCount,
        offset: state.offset + action.images.length,
        hasMore: state.offset + action.images.length < action.totalCount,
        isLoading: false,
        isRefreshing: false,
      };
    }

    case 'FETCH_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
        isRefreshing: false,
      };

    case 'SET_HAS_MORE':
      return {
        ...state,
        hasMore: action.hasMore,
      };

    default:
      return state;
  }
}

// Hook props
interface UseImageGalleryProps {
  groupId: string;
  pageSize?: number;
}

// Main hook
export function useImageGallery({
  groupId,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseImageGalleryProps) {
  const [state, dispatch] = useReducer(imageGalleryReducer, initialState);
  const loadingRef = useRef(false);

  // Fetch images function
  const fetchImages = useCallback(
    async (isRefresh = false) => {
      // Prevent duplicate requests
      if (loadingRef.current) return;
      if (!isRefresh && !state.hasMore) return;

      loadingRef.current = true;
      const offset = isRefresh ? 0 : state.offset;

      dispatch({ type: 'FETCH_START', isRefresh });

      try {
        // Fetch memos with images
        const fetchedMemos = await getImageMemosByGroupId(
          groupId,
          pageSize,
          offset,
        );

        // Convert to GalleryImage format
        const galleryImages = fetchedMemos
          .map(memoToGalleryImage)
          .filter((img): img is GalleryImage => img !== null);

        // Get total count
        const totalCount = await getImageCountByGroupId(groupId);

        dispatch({
          type: 'FETCH_SUCCESS',
          memos: fetchedMemos,
          images: galleryImages,
          totalCount,
          isRefresh,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_ERROR',
          error: error as Error,
        });
      } finally {
        loadingRef.current = false;
      }
    },
    [groupId, pageSize, state.hasMore, state.offset],
  );

  // Initial load
  useEffect(() => {
    // Reset state and fetch when groupId changes
    loadingRef.current = false;
    dispatch({ type: 'FETCH_START', isRefresh: true });

    getImageMemosByGroupId(groupId, pageSize, 0)
      .then(async (fetchedMemos) => {
        const galleryImages = fetchedMemos
          .map(memoToGalleryImage)
          .filter((img): img is GalleryImage => img !== null);

        const totalCount = await getImageCountByGroupId(groupId);

        dispatch({
          type: 'FETCH_SUCCESS',
          memos: fetchedMemos,
          images: galleryImages,
          totalCount,
          isRefresh: true,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'FETCH_ERROR',
          error: error as Error,
        });
      });
  }, [groupId, pageSize]);

  // Refresh function
  const refresh = useCallback(() => {
    dispatch({ type: 'SET_HAS_MORE', hasMore: true });
    return fetchImages(true);
  }, [fetchImages]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!state.hasMore || loadingRef.current) return;
    return fetchImages(false);
  }, [state.hasMore, fetchImages]);

  return {
    memos: state.memos,
    images: state.images,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    error: state.error,
    refresh,
    loadMore,
  };
}
