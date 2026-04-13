import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress: () => void;
}

function LikeButtonInner({ liked, count, onPress }: LikeButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <FontAwesome name={liked ? 'heart' : 'heart-o'} size={32} color={liked ? '#FF2D55' : '#fff'} />
      <Text style={styles.count}>{formatCount(count)}</Text>
    </TouchableOpacity>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export const LikeButton = memo(LikeButtonInner);
