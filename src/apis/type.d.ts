export type YouTubeSearchResult = {
  kind: string; // e.g., "youtube#searchResult"
  etag: string; // e.g., "VH1re38-G9G_RROYWoITYOgAhDU"
  id: {
    kind: string; // e.g., "youtube#video"
    videoId: string; // e.g., "h7MYJghRWt0"
  };
  snippet: {
    publishedAt: string; // ISO date string, e.g., "2021-11-22T16:00:18Z"
    channelId: string; // e.g., "UC8CX0LD98EDXl4UYX1MDCXg"
    title: string; // e.g., "Die For You ft. Grabbitz ..."
    description: string; // Video description
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
    channelTitle: string; // e.g., "VALORANT"
    liveBroadcastContent: string; // e.g., "none"
    publishTime: string; // ISO date string, e.g., "2021-11-22T16:00:18Z"
  };
};

type Thumbnail = {
  url: string; // e.g., "https://i.ytimg.com/vi/h7MYJghRWt0/default.jpg"
  width: number; // e.g., 120
  height: number; // e.g., 90
};
