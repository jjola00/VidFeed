import React, { memo, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Video } from '../models/Video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const NUM_COLUMNS = 3;
const TILE_SIZE = (SCREEN_WIDTH - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface ProfileGridProps {
  videos: Video[];
  onVideoPress: (video: Video) => void;
}

function ProfileGridInner({ videos, onVideoPress }: ProfileGridProps) {
  return (
    <View style={styles.grid}>
      {videos.map((video) => (
        <GridTile key={video.id} video={video} onPress={onVideoPress} />
      ))}
    </View>
  );
}

interface GridTileProps {
  video: Video;
  onPress: (video: Video) => void;
}

const GridTile = memo(function GridTile({ video, onPress }: GridTileProps) {
  const handlePress = useCallback(() => onPress(video), [onPress, video]);

  return (
    <TouchableOpacity style={styles.tile} onPress={handlePress} activeOpacity={0.8}>
      <Image source={{ uri: video.thumbnail }} style={styles.tileImage} resizeMode="cover" />
      <View style={styles.tileDuration}>
        <FontAwesome name="play" size={10} color="#fff" />
        <Text style={styles.durationText}>{formatDuration(video.duration)}</Text>
      </View>
    </TouchableOpacity>
  );
});

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 1.4,
    backgroundColor: '#1a1a1a',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileDuration: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export const ProfileGrid = memo(ProfileGridInner);
