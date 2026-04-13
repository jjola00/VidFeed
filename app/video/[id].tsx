import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useVideoContext } from '@/src/contexts/VideoContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { videos } = useVideoContext();

  const video = videos.find((v) => String(v.id) === id);
  const videoUrl = video?.videoUrl ?? null;

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.play();
  });

  const handleClose = useCallback(() => router.back(), [router]);

  if (!video) return null;

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />

      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 12 }]}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <FontAwesome name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
