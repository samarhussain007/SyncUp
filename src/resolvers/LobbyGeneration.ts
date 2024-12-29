import { subscribe } from "diagnostics_channel";
import {
  createJam,
  CreateJamInputs,
  getAllAvailableJams,
  getJamByJamCode,
} from "../services/lobbyGeneration";
import { pubsub } from "../redis";
const JAM_UPDATE_EVENT = "JAM_UPDATE_EVENT";

const LobbyGenerationResolvers = {
  Query: {
    getAllAvailableJams: async () => {
      const jams = await getAllAvailableJams();
      console.log(jams);
      return jams;
    },
    getSpecificJam: async (
      _: any,
      {
        input,
      }: {
        input: {
          jamCode: string;
        };
      },
      { auth }: { auth: string }
    ) => {
      const jam = await getJamByJamCode(input.jamCode);
      return jam;
    },
  },
  Mutation: {
    createJam: async (
      _: any,
      { createJamInputs }: { createJamInputs: CreateJamInputs },
      { auth }: { auth: string }
    ) => {
      const result = await createJam(createJamInputs);
      console.log(result);
      return result;
    },
    updateJam: async (
      _: any,
      {
        jamCode,
        newStatus,
      }: {
        jamCode: string;
        newStatus: string;
      }
    ) => {
      // Simulating an update to the jam. In a real application, you'd update your database here.
      const updatedJam = {
        jamCode,
        status: newStatus, // new status for the jam
      };

      // Publish to the corresponding jamCode channel
      pubsub.publish(`${JAM_UPDATE_EVENT}:${jamCode}`, {
        onJamUpdate: updatedJam,
      });

      // Return the updated jam object
      return updatedJam;
    },
  },
  Subscription: {
    onJamUpdate: {
      subscribe: (root: any, args: { jamCode: string }, context: any) => {
        const { jamCode } = args;

        // Directly subscribe to the jam update event based on the jamCode
        console.log("Listening to updates for jamCode:", jamCode);

        return pubsub.asyncIterator(`${JAM_UPDATE_EVENT}:${jamCode}`);
      },
    },
  },
};

export default LobbyGenerationResolvers;
