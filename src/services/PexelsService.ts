import {
  PEXELS_API_BASE,
  PEXELS_API_KEY,
  PEXELS_PER_PAGE,
  PEXELS_QUERY,
  PEXELS_TOTAL_PAGES,
} from '../config';
import type { PexelsResponse, PexelsVideo, PexelsVideoFile, Video } from '../models/Video';

/**
 * Select the best video file from a Pexels video entry.
 * Prefers HD-quality MP4, falls back to SD, then any MP4.
 */
export function selectBestVideoFile(files: PexelsVideoFile[]): PexelsVideoFile | null {
  const mp4Files = files.filter((f) => f.file_type === 'video/mp4');
  if (mp4Files.length === 0) return null;

  const hd = mp4Files.find((f) => f.quality === 'hd');
  if (hd) return hd;

  const sd = mp4Files.find((f) => f.quality === 'sd');
  if (sd) return sd;

  return mp4Files[0];
}

/**
 * Map a raw Pexels video object to our app-level Video model.
 * Returns null if no suitable video file is found.
 */
export function mapPexelsVideo(raw: PexelsVideo): Video | null {
  const bestFile = selectBestVideoFile(raw.video_files);
  if (!bestFile) return null;

  return {
    id: raw.id,
    user: {
      name: raw.user.name,
      url: raw.user.url,
    },
    thumbnail: raw.image,
    videoUrl: bestFile.link,
    duration: raw.duration,
    width: raw.width,
    height: raw.height,
  };
}

/**
 * Fetch a single page of videos from the Pexels API.
 */
export async function fetchVideosPage(page: number): Promise<PexelsResponse> {
  const url = `${PEXELS_API_BASE}?query=${PEXELS_QUERY}&per_page=${PEXELS_PER_PAGE}&page=${page}`;
  const response = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all videos across multiple pages.
 * Portrait-oriented videos (height > width) are prioritized in the returned array.
 */
export async function fetchAllVideos(): Promise<Video[]> {
  const pages = Array.from({ length: PEXELS_TOTAL_PAGES }, (_, i) => i + 1);
  const responses = await Promise.all(pages.map(fetchVideosPage));

  const allVideos: Video[] = [];
  for (const response of responses) {
    for (const raw of response.videos) {
      const video = mapPexelsVideo(raw);
      if (video) allVideos.push(video);
    }
  }

  // Sort portrait-first for a better full-screen experience
  const portrait = allVideos.filter((v) => v.height > v.width);
  const landscape = allVideos.filter((v) => v.height <= v.width);

  return [...portrait, ...landscape];
}
