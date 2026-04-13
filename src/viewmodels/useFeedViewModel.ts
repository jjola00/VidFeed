import { useState, useCallback, useRef } from 'react';
import { ViewToken } from 'react-native';
import { PRELOAD_WINDOW } from '../config';
import { useVideoContext } from '../contexts/VideoContext';

export function useFeedViewModel() {
  const { videos, loading, error, likes, toggleLike, retry } = useVideoContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const isInPreloadWindow = useCallback(
    (index: number) => Math.abs(index - currentIndex) <= PRELOAD_WINDOW,
    [currentIndex]
  );

  const isActive = useCallback(
    (index: number) => index === currentIndex,
    [currentIndex]
  );

  const getLikeState = useCallback(
    (videoId: number) =>
      likes[videoId] ?? { liked: false, count: 0 },
    [likes]
  );

  return {
    videos,
    loading,
    error,
    currentIndex,
    isInPreloadWindow,
    isActive,
    getLikeState,
    toggleLike,
    retry,
    onViewableItemsChanged,
    viewabilityConfig,
  };
}
