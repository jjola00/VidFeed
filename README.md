# ShortFeed

A TikTok-style vertical video feed built with React Native and Expo. Streams ~200 videos from the Pexels API with smooth full-screen paging, like persistence, and a profile screen.

## Setup

```bash
# Install dependencies
npm install

# Add your Pexels API key
cp .env.example .env
# Edit .env and add your key (get a free one at https://www.pexels.com/api/)

# Start the dev server
npx expo start

# If Expo Go can't connect (phone and laptop on different subnets), use tunnel mode:
npx expo start --tunnel

# Run tests
npm test
```

## Architecture

```
src/
  models/        Video, User, LikeState interfaces (data layer)
  services/      PexelsService (API + parsing), StorageService (AsyncStorage)
  viewmodels/    useFeedViewModel, useProfileViewModel (business logic hooks)
  contexts/      VideoProvider (shared state across screens)
  components/    VideoItem, VideoOverlay, LikeButton, ProfileGrid (UI)

app/
  (tabs)/        Feed + Profile tab screens (Expo Router file-based routing)
  video/[id]     Full-screen video player (opened from profile grid)
```

**Pattern: MVVM**
- **Models** define the shape of data — clean TypeScript interfaces, decoupled from the API response format.
- **Services** handle I/O — network calls (PexelsService) and persistence (StorageService). Pure functions, easily testable.
- **ViewModels** are custom hooks that own business logic — current index tracking, like toggling, preload window calculation. Screens consume them without knowing implementation details.
- **Views** (screens + components) are purely presentational. They receive data and callbacks from viewmodels.

## Performance Decisions

### Video Player Lifecycle (the critical optimization)
The #1 performance concern is managing video players with 200+ videos. The strategy:

1. **FlashList virtualization** — Only ~5-7 items are mounted at any time. Items outside the render window are unmounted, destroying their video players automatically.

2. **Preload window** — Within mounted items, only videos within ±1 index of the current video receive a source URL. Videos outside this window pass `null` to `useVideoPlayer`, so the player exists but holds no resources.

3. **Play/pause control** — Only the currently visible video (index === currentIndex) calls `player.play()`. All others are paused. This means at most 3 players have loaded content, and only 1 is actively decoding.

### Scroll Performance
- `snapToInterval` + `decelerationRate="fast"` for page-by-page snapping
- `viewAreaCoveragePercentThreshold: 50` to detect the active video
- `VideoItem` is wrapped in `React.memo` to prevent re-renders from list-level state changes (likes, currentIndex) propagating to non-affected items
- Like state lookups are done in the render function with stable references — toggling a like on video #5 doesn't re-render video #6

### Thumbnail Layering
Each VideoItem stacks: thumbnail (Image) → VideoView → overlay. The thumbnail is always rendered as the base layer, providing instant visual feedback while the video buffers. No layout shift, no flash of black.

## Tradeoffs & Known Limitations

- **expo-video vs expo-av**: expo-av is deprecated in SDK 54. expo-video has a newer API surface but fewer community examples. Chose correctness over familiarity.
- **FlashList v2**: Removed `estimatedItemSize` (deprecated in v2). FlashList auto-calculates item sizes now.
- **Like counts are seeded deterministically**: Since Pexels doesn't provide engagement data, initial counts are derived from video ID (`(id * 7) % 500`) when videos load. This keeps counts stable across renders and ensures `+1/-1` increments visibly. Once toggled, counts persist to AsyncStorage.
- **Profile shows a fixed subset**: Rather than maintaining per-user video ownership (Pexels videos have different creators), the profile shows a deterministic subset of the feed. A real app would have user authentication and owned content.
- **Audio in Expo Go**: Audio playback may not work inside Expo Go on Android due to sandbox limitations on audio focus. It should work correctly in a production build (EAS Build / TestFlight).
- **Portrait filtering is best-effort**: Pexels' `people` query returns mixed orientations. Portrait videos are sorted first, but some landscape videos will appear.

## What I'd Improve With More Time

- **Pre-buffering**: Use `player.replace()` to eagerly buffer the next video before the user swipes, reducing perceived load time.
- **Gesture-based controls**: Double-tap to like, long-press to pause, horizontal swipe to share.
- **Audio session management**: Proper iOS/Android audio focus handling for background/foreground transitions.
- **Thumbnail caching**: Use `expo-image` (with blurhash) instead of RN Image for faster thumbnail rendering and disk caching.
- **Infinite scroll**: Currently loads 3 pages (~200 videos) upfront. Could implement true infinite pagination with `onEndReached`.
- **Analytics/logging**: Track video watch time, completion rate, engagement metrics.
- **Accessibility**: VoiceOver/TalkBack labels on all interactive elements, reduce motion support.
- **E2E tests**: Detox or Maestro tests for the critical scroll-and-play path.
