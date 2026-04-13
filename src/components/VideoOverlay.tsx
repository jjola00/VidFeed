import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LikeButton } from './LikeButton';

interface VideoOverlayProps {
  username: string;
  caption: string;
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onUsernamePress: () => void;
}

function VideoOverlayInner({
  username,
  caption,
  liked,
  likeCount,
  onLike,
  onUsernamePress,
}: VideoOverlayProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Right side action buttons */}
      <View style={styles.rightActions}>
        <LikeButton liked={liked} count={likeCount} onPress={onLike} />

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <FontAwesome name="comment-o" size={30} color="#fff" />
          <Text style={styles.actionText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <FontAwesome name="share" size={28} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <TouchableOpacity onPress={onUsernamePress} activeOpacity={0.7}>
          <Text style={styles.username}>@{username}</Text>
        </TouchableOpacity>
        {caption ? <Text style={styles.caption} numberOfLines={2}>{caption}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomInfo: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingRight: 80,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export const VideoOverlay = memo(VideoOverlayInner);
