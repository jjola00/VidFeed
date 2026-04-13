import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ProfileGrid } from '@/src/components/ProfileGrid';
import { useProfileViewModel } from '@/src/viewmodels/useProfileViewModel';
import type { Video } from '@/src/models/Video';

export default function ProfileScreen() {
  const { username, videoCount, totalLikes, profileVideos, loading } = useProfileViewModel();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleVideoPress = useCallback(
    (video: Video) => {
      router.push(`/video/${video.id}`);
    },
    [router]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 }}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={40} color="#666" />
        </View>
        <Text style={styles.username}>@{username}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{videoCount}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{formatCount(totalLikes)}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>
      </View>

      {/* Video Grid */}
      <View style={styles.gridSection}>
        <Text style={styles.sectionTitle}>Videos</Text>
        <ProfileGrid videos={profileVideos} onVideoPress={handleVideoPress} />
      </View>
    </ScrollView>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#333',
  },
  gridSection: {
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
