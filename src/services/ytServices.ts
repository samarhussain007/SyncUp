import { searchVideos } from "../apis";
import { YouTubeSearchResult } from "../apis/type";
import { constructVideoUrl } from "../utils";
import { SearchResultOT } from "./type";

export const getListofVideos = async (
  query: string
): Promise<SearchResultOT[]> => {
  try {
    const data = await searchVideos(query);
    if (!data) {
      throw new Error("There is no data");
    }
    const formattedData = searchFormatting(data);
    return formattedData;
  } catch (err) {
    throw err;
  }
};

const searchFormatting = (data: YouTubeSearchResult[]): SearchResultOT[] => {
  const result = data.map((el: YouTubeSearchResult) => {
    const videoUrl = constructVideoUrl(el.id.videoId);
    return {
      title: el.snippet.title,
      thumbnail: el.snippet.thumbnails.default,
      videoUrl,
    };
  });
  return result;
};
