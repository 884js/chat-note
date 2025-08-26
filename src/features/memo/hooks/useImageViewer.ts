import { useCallback, useState } from 'react';
import type { GalleryImage } from '../types/gallery';

interface UseImageViewerReturn {
  isVisible: boolean;
  selectedIndex: number | null;
  viewerImages: GalleryImage[];
  openViewer: (index: number, images: GalleryImage[]) => void;
  closeViewer: () => void;
  navigateToImage: (index: number) => void;
}

/**
 * Custom hook for managing image viewer state
 * Handles opening, closing, and navigation of the image viewer
 */
export function useImageViewer(): UseImageViewerReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewerImages, setViewerImages] = useState<GalleryImage[]>([]);

  const openViewer = useCallback((index: number, images: GalleryImage[]) => {
    setSelectedIndex(index);
    setViewerImages(images);
    setIsVisible(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsVisible(false);
    // Reset state after animation completes
    setTimeout(() => {
      setSelectedIndex(null);
      setViewerImages([]);
    }, 300);
  }, []);

  const navigateToImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < viewerImages.length) {
        setSelectedIndex(index);
      }
    },
    [viewerImages.length],
  );

  return {
    isVisible,
    selectedIndex,
    viewerImages,
    openViewer,
    closeViewer,
    navigateToImage,
  };
}
