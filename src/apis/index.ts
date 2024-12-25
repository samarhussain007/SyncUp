import { google } from "googleapis";
import { config } from "dotenv";
import { YouTubeSearchResult } from "./type";

config();

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export const searchVideos = async (
  query: string
): Promise<YouTubeSearchResult[]> => {
  try {
    const res = await youtube.search.list({
      part: ["id", "snippet"],
      q: query, // The search query
      maxResults: 10, // Number of results to fetch
      type: ["video"],
    });

    // Type assertion to ensure the response matches the expected structure
    const results = res.data.items as YouTubeSearchResult[];
    return results || [];
  } catch (error: any) {
    console.error("Error while searching videos:", error.message);
    throw new Error(`YouTube API Error: ${error.message}`);
  }
};
