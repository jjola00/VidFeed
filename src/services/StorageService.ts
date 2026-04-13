import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LikeState } from '../models/Video';

const LIKES_KEY = '@shortfeed_likes';

/**
 * Load all persisted like states from AsyncStorage.
 */
export async function loadLikes(): Promise<Record<number, LikeState>> {
  try {
    const json = await AsyncStorage.getItem(LIKES_KEY);
    if (!json) return {};
    return JSON.parse(json);
  } catch {
    return {};
  }
}

/**
 * Persist all like states to AsyncStorage.
 */
export async function saveLikes(likes: Record<number, LikeState>): Promise<void> {
  try {
    await AsyncStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  } catch {
    // Silently fail — non-critical persistence
  }
}
