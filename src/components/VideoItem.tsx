import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { VideoOverlay } from './VideoOverlay';
import type { Video, LikeState } from '../models/Video';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoItemProps {
  video: Video;
  index: number;
  isActive: boolean;
  isInPreloadWindow: boolean;
  likeState: LikeState;
  onLike: (videoId: number) => void;
  onUsernamePress: (video: Video) => void;
}

function VideoItemInner({
  video,
  isActive,
  isInPreloadWindow,
  likeState,
  onLike,
  onUsernamePress,
}: VideoItemProps) {
  const [hasError, setHasError] = useState(false);

  // Create player — source is null when outside preload window to free resources
  const player = useVideoPlayer(isInPreloadWindow ? video.videoUrl : null, (p) => {
    p.loop = true;
  });

  // Listen to player status for error handling
  const { status } = useEvent(player, 'statusChange', {
    status: player.status,
  });

  // Play/pause based on active state
  useEffect(() => {
    if (!player) return;
    if (isActive && isInPreloadWindow) {
      player.play();
      setHasError(false);
    } else {
      player.pause();
    }
  }, [isActive, isInPreloadWindow, player]);

  // Track errors
  useEffect(() => {
    if (status === 'error') {
      setHasError(true);
    }
  }, [status]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    if (player) {
      player.replace(video.videoUrl);
      if (isActive) player.play();
    }
  }, [player, video.videoUrl, isActive]);

  const handleLike = useCallback(() => onLike(video.id), [onLike, video.id]);
  const handleUsernamePress = useCallback(() => onUsernamePress(video), [onUsernamePress, video]);

  const showThumbnail = !isInPreloadWindow || status === 'loading' || status === 'idle';

  return (
    <View style={styles.container}>
      {/* Thumbnail — always rendered as base layer, hidden when video is playing */}
      <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} resizeMode="cover" />

      {/* Video player — only mounted when in preload window */}
      {isInPreloadWindow && !hasError && (
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
      )}

      {/* Loading spinner when buffering */}
      {isActive && showThumbnail && !hasError && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Error state */}
      {hasError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>Failed to load video</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay UI */}
      <VideoOverlay
        username={video.user.name}
        caption={`Video ${video.id}`}
        liked={likeState.liked}
        likeCount={likeState.count}
        onLike={handleLike}
        onUsernamePress={handleUsernamePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export const VideoItem = memo(VideoItemInner);
