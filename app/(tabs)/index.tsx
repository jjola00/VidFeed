import React, { useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { VideoItem } from '@/src/components/VideoItem';
import { useFeedViewModel } from '@/src/viewmodels/useFeedViewModel';
import type { Video } from '@/src/models/Video';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const {
    videos,
    loading,
    error,
    isInPreloadWindow,
    isActive,
    getLikeState,
    toggleLike,
    retry,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useFeedViewModel();

  const router = useRouter();

  const handleUsernamePress = useCallback(
    (_video: Video) => {
      router.push('/(tabs)/profile');
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Video; index: number }) => (
      <VideoItem
        video={item}
        index={index}
        isActive={isActive(index)}
        isInPreloadWindow={isInPreloadWindow(index)}
        likeState={getLikeState(item.id)}
        onLike={toggleLike}
        onUsernamePress={handleUsernamePress}
      />
    ),
    [isActive, isInPreloadWindow, getLikeState, toggleLike, handleUsernamePress]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

function keyExtractor(item: Video) {
  return String(item.id);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 24,
  },
  loadingText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorDetail: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FF2D55',
    borderRadius: 24,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
