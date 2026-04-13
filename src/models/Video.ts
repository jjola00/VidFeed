// ─── Pexels API Response Types ───────────────────────────────────────────────

export interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  fps: number;
  link: string;
}

export interface PexelsUser {
  id: number;
  name: string;
  url: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  user: PexelsUser;
  video_files: PexelsVideoFile[];
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
  next_page?: string;
}

// ─── App-Level Models ────────────────────────────────────────────────────────

export interface VideoUser {
  name: string;
  url: string;
}

export interface Video {
  id: number;
  user: VideoUser;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  width: number;
  height: number;
}

export interface LikeState {
  liked: boolean;
  count: number;
}
