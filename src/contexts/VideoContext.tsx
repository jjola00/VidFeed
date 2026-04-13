import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Video, LikeState } from '../models/Video';
import { fetchAllVideos } from '../services/PexelsService';
import { loadLikes, saveLikes } from '../services/StorageService';

interface VideoContextValue {
  videos: Video[];
  loading: boolean;
  error: string | null;
  likes: Record<number, LikeState>;
  toggleLike: (videoId: number) => void;
  retry: () => void;
}

const VideoContext = createContext<VideoContextValue | null>(null);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<number, LikeState>>({});
  const likesRef = useRef(likes);
  likesRef.current = likes;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedVideos, savedLikes] = await Promise.all([
        fetchAllVideos(),
        loadLikes(),
      ]);
      setVideos(fetchedVideos);
      // Seed like counts for videos that don't have persisted likes yet
      const seededLikes: Record<number, LikeState> = {};
      for (const v of fetchedVideos) {
        seededLikes[v.id] = savedLikes[v.id] ?? {
          liked: false,
          count: (v.id * 7) % 500, // Deterministic "random" count based on video ID
        };
      }
      setLikes(seededLikes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleLike = useCallback((videoId: number) => {
    setLikes((prev) => {
      const current = prev[videoId] ?? { liked: false, count: 0 };
      const updated = {
        ...prev,
        [videoId]: {
          liked: !current.liked,
          count: current.liked ? current.count - 1 : current.count + 1,
        },
      };
      // Persist asynchronously — don't block UI
      saveLikes(updated);
      return updated;
    });
  }, []);

  return (
    <VideoContext.Provider value={{ videos, loading, error, likes, toggleLike, retry: loadData }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext(): VideoContextValue {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideoContext must be used within VideoProvider');
  return ctx;
}
