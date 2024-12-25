import "graphql-import-node";
import root from "./schema.graphql";
import youtubeApi from "./youtubeApi.graphql";

import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { allResolvers } from "../resolvers";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [root, youtubeApi],
  resolvers: allResolvers,
});

export default schema;
