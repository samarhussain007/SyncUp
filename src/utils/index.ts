export const constructVideoUrl = (videoId: string): string => {
  if (!videoId) {
    throw new Error("Invalid videoId: Video ID cannot be empty.");
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
};
