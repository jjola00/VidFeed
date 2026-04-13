import { useMemo } from 'react';
import { useVideoContext } from '../contexts/VideoContext';
import type { Video } from '../models/Video';

const PROFILE_VIDEO_COUNT = 18;

export function useProfileViewModel() {
  const { videos, likes, toggleLike, loading } = useVideoContext();

  const profileVideos = useMemo<Video[]>(() => {
    if (videos.length === 0) return [];
    // Pick a deterministic "random" subset for the profile grid
    const step = Math.max(1, Math.floor(videos.length / PROFILE_VIDEO_COUNT));
    const subset: Video[] = [];
    for (let i = 0; i < videos.length && subset.length < PROFILE_VIDEO_COUNT; i += step) {
      subset.push(videos[i]);
    }
    return subset;
  }, [videos]);

  const totalLikes = useMemo(() => {
    return Object.values(likes).reduce((sum, l) => sum + l.count, 0);
  }, [likes]);

  const username = 'ShortFeed User';
  const videoCount = videos.length;

  return {
    username,
    videoCount,
    totalLikes,
    profileVideos,
    likes,
    toggleLike,
    loading,
  };
}
