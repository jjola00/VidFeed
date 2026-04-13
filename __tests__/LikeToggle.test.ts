import type { LikeState } from '../src/models/Video';

/**
 * Test the like toggle logic used in VideoContext.
 * Extracted here as a pure function to test the business rule.
 */
function toggleLike(
  likes: Record<number, LikeState>,
  videoId: number,
  defaultCount: number = 100
): Record<number, LikeState> {
  const current = likes[videoId] ?? { liked: false, count: defaultCount };
  return {
    ...likes,
    [videoId]: {
      liked: !current.liked,
      count: current.liked ? current.count - 1 : current.count + 1,
    },
  };
}

describe('Like Toggle Logic', () => {
  it('likes a video that has not been liked before', () => {
    const likes: Record<number, LikeState> = {};
    const result = toggleLike(likes, 1, 50);

    expect(result[1].liked).toBe(true);
    expect(result[1].count).toBe(51);
  });

  it('unlikes a previously liked video', () => {
    const likes: Record<number, LikeState> = {
      1: { liked: true, count: 51 },
    };
    const result = toggleLike(likes, 1);

    expect(result[1].liked).toBe(false);
    expect(result[1].count).toBe(50);
  });

  it('toggling twice returns to original count', () => {
    const likes: Record<number, LikeState> = {};
    const afterLike = toggleLike(likes, 1, 100);
    const afterUnlike = toggleLike(afterLike, 1);

    expect(afterUnlike[1].liked).toBe(false);
    expect(afterUnlike[1].count).toBe(100);
  });

  it('does not affect other videos when toggling', () => {
    const likes: Record<number, LikeState> = {
      1: { liked: true, count: 10 },
      2: { liked: false, count: 20 },
    };
    const result = toggleLike(likes, 1);

    expect(result[1].liked).toBe(false);
    expect(result[2].liked).toBe(false);
    expect(result[2].count).toBe(20);
  });

  it('handles count of zero correctly', () => {
    const likes: Record<number, LikeState> = {
      1: { liked: true, count: 1 },
    };
    const result = toggleLike(likes, 1);

    expect(result[1].liked).toBe(false);
    expect(result[1].count).toBe(0);
  });
});
