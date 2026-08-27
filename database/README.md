# 🗄️ CineWave Database Layer

This directory contains the central data repository for the CineWave streaming platform.

## Files
- `store.json`: The live persistent JSON database containing movies, TV series, user profiles, subscription plans, watch history, and activity logs.
- `schema.json`: Data schema specifications for the platform models.

## Collections
1. **movies**: Full-length 4K cinema catalogue with video streams, backdrops, ratings, and cast members.
2. **shows**: Episodic series with season breakdowns, episode video streams, and intro time markers.
3. **users**: Account credentials, subscription tiers, and multi-profile configurations.
4. **plans**: Subscription pricing models and resolution capabilities.
5. **continueWatching**: Real-time resume markers per profile.
6. **watchHistory**: Completed and in-progress stream logs.
7. **watchlist**: Saved titles per user profile.
8. **activityLogs**: Event telemetry and platform analytics.
