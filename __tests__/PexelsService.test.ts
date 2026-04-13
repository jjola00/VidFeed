import { selectBestVideoFile, mapPexelsVideo } from '../src/services/PexelsService';
import type { PexelsVideo, PexelsVideoFile } from '../src/models/Video';

describe('selectBestVideoFile', () => {
  it('prefers HD quality mp4', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'sd', file_type: 'video/mp4', width: 640, height: 360, fps: 30, link: 'https://sd.mp4' },
      { id: 2, quality: 'hd', file_type: 'video/mp4', width: 1280, height: 720, fps: 30, link: 'https://hd.mp4' },
      { id: 3, quality: 'uhd', file_type: 'video/mp4', width: 3840, height: 2160, fps: 30, link: 'https://uhd.mp4' },
    ];

    const result = selectBestVideoFile(files);
    expect(result).not.toBeNull();
    expect(result!.quality).toBe('hd');
    expect(result!.link).toBe('https://hd.mp4');
  });

  it('falls back to SD when HD is unavailable', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'sd', file_type: 'video/mp4', width: 640, height: 360, fps: 30, link: 'https://sd.mp4' },
      { id: 2, quality: 'uhd', file_type: 'video/mp4', width: 3840, height: 2160, fps: 30, link: 'https://uhd.mp4' },
    ];

    const result = selectBestVideoFile(files);
    expect(result).not.toBeNull();
    expect(result!.quality).toBe('sd');
  });

  it('falls back to any mp4 when HD and SD are unavailable', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'uhd', file_type: 'video/mp4', width: 3840, height: 2160, fps: 30, link: 'https://uhd.mp4' },
    ];

    const result = selectBestVideoFile(files);
    expect(result).not.toBeNull();
    expect(result!.link).toBe('https://uhd.mp4');
  });

  it('filters out non-mp4 files', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'hd', file_type: 'video/webm', width: 1280, height: 720, fps: 30, link: 'https://hd.webm' },
    ];

    const result = selectBestVideoFile(files);
    expect(result).toBeNull();
  });

  it('returns null for empty array', () => {
    expect(selectBestVideoFile([])).toBeNull();
  });
});

describe('mapPexelsVideo', () => {
  const mockPexelsVideo: PexelsVideo = {
    id: 12345,
    width: 1080,
    height: 1920,
    duration: 30,
    image: 'https://images.pexels.com/thumb.jpg',
    user: {
      id: 1,
      name: 'Test User',
      url: 'https://pexels.com/@testuser',
    },
    video_files: [
      { id: 1, quality: 'sd', file_type: 'video/mp4', width: 540, height: 960, fps: 25, link: 'https://sd.mp4' },
      { id: 2, quality: 'hd', file_type: 'video/mp4', width: 1080, height: 1920, fps: 30, link: 'https://hd.mp4' },
    ],
  };

  it('correctly maps Pexels API response to Video model', () => {
    const video = mapPexelsVideo(mockPexelsVideo);

    expect(video).not.toBeNull();
    expect(video!.id).toBe(12345);
    expect(video!.user.name).toBe('Test User');
    expect(video!.user.url).toBe('https://pexels.com/@testuser');
    expect(video!.thumbnail).toBe('https://images.pexels.com/thumb.jpg');
    expect(video!.videoUrl).toBe('https://hd.mp4');
    expect(video!.duration).toBe(30);
    expect(video!.width).toBe(1080);
    expect(video!.height).toBe(1920);
  });

  it('returns null when no suitable video file exists', () => {
    const noMp4Video: PexelsVideo = {
      ...mockPexelsVideo,
      video_files: [
        { id: 1, quality: 'hd', file_type: 'video/webm', width: 1080, height: 1920, fps: 30, link: 'https://hd.webm' },
      ],
    };

    const video = mapPexelsVideo(noMp4Video);
    expect(video).toBeNull();
  });

  it('handles video with only SD quality', () => {
    const sdOnlyVideo: PexelsVideo = {
      ...mockPexelsVideo,
      video_files: [
        { id: 1, quality: 'sd', file_type: 'video/mp4', width: 540, height: 960, fps: 25, link: 'https://sd.mp4' },
      ],
    };

    const video = mapPexelsVideo(sdOnlyVideo);
    expect(video).not.toBeNull();
    expect(video!.videoUrl).toBe('https://sd.mp4');
  });
});
