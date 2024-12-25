import { query } from "express";
import { getListofVideos } from "../services/ytServices";
import { CODES } from "../constants";

const YoutubeResolvers = {
  Query: {
    getListOfVideos: async (
      _: any,
      { input }: { input: { query: string } },
      { auth }: { auth: string }
    ) => {
      try {
        // Extract the query from input
        const { query } = input;

        // // Ensure auth token is provided
        // if (!auth) {
        //   return {
        //     code: CODES.unauthorized,
        //     message: "Authorization token is missing",
        //     data: null,
        //   };
        // }

        // Call the service to get the list of videos
        const data = await getListofVideos(query);

        // Return success response
        return {
          code: CODES.success,
          message: "These are the list of videos",
          data,
        };
      } catch (error: any) {
        console.error("Error in getListOfVideos resolver:", error);

        // Return error response
        return {
          code: CODES.internalServerError,
          message: "An error occurred while fetching the list of videos",
          data: null,
        };
      }
    },
  },
  // Mutation: {},
};

export default YoutubeResolvers;
