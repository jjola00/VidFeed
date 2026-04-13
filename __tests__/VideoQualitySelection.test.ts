import { selectBestVideoFile } from '../src/services/PexelsService';
import type { PexelsVideoFile } from '../src/models/Video';

describe('Video Quality Selection', () => {
  it('selects HD over SD and UHD for optimal mobile streaming', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'uhd', file_type: 'video/mp4', width: 3840, height: 2160, fps: 30, link: 'https://uhd.mp4' },
      { id: 2, quality: 'sd', file_type: 'video/mp4', width: 640, height: 360, fps: 30, link: 'https://sd.mp4' },
      { id: 3, quality: 'hd', file_type: 'video/mp4', width: 1920, height: 1080, fps: 30, link: 'https://hd.mp4' },
    ];

    const result = selectBestVideoFile(files);
    expect(result!.quality).toBe('hd');
  });

  it('handles mixed file types and picks correct mp4', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'hd', file_type: 'video/webm', width: 1920, height: 1080, fps: 30, link: 'https://hd.webm' },
      { id: 2, quality: 'sd', file_type: 'video/mp4', width: 640, height: 360, fps: 25, link: 'https://sd.mp4' },
      { id: 3, quality: 'hd', file_type: 'video/mp4', width: 1280, height: 720, fps: 30, link: 'https://hd.mp4' },
    ];

    const result = selectBestVideoFile(files);
    expect(result!.file_type).toBe('video/mp4');
    expect(result!.quality).toBe('hd');
  });

  it('returns the SD file when only non-HD mp4s exist', () => {
    const files: PexelsVideoFile[] = [
      { id: 1, quality: 'hd', file_type: 'video/webm', width: 1920, height: 1080, fps: 30, link: 'https://hd.webm' },
      { id: 2, quality: 'sd', file_type: 'video/mp4', width: 640, height: 360, fps: 25, link: 'https://sd.mp4' },
    ];

    const result = selectBestVideoFile(files);
    expect(result!.quality).toBe('sd');
    expect(result!.link).toBe('https://sd.mp4');
  });

  it('handles real-world Pexels video_files array structure', () => {
    // Typical Pexels API response has multiple resolutions
    const files: PexelsVideoFile[] = [
      { id: 101, quality: 'sd', file_type: 'video/mp4', width: 426, height: 240, fps: 29.97, link: 'https://v1.mp4' },
      { id: 102, quality: 'sd', file_type: 'video/mp4', width: 640, height: 360, fps: 29.97, link: 'https://v2.mp4' },
      { id: 103, quality: 'sd', file_type: 'video/mp4', width: 960, height: 540, fps: 29.97, link: 'https://v3.mp4' },
      { id: 104, quality: 'hd', file_type: 'video/mp4', width: 1280, height: 720, fps: 29.97, link: 'https://v4.mp4' },
      { id: 105, quality: 'hd', file_type: 'video/mp4', width: 1920, height: 1080, fps: 29.97, link: 'https://v5.mp4' },
    ];

    const result = selectBestVideoFile(files);
    // Should pick the first HD mp4 it finds
    expect(result!.quality).toBe('hd');
    expect(result!.id).toBe(104);
  });
});
