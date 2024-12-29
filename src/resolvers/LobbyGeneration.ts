import {
  createJam,
  CreateJamInputs,
  getAllAvailableJams,
  getJamByJamCode,
} from "../services/lobbyGeneration";

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
  },
  //   Subscription: {},
};

export default LobbyGenerationResolvers;
