// The ApolloServer constructor requires two parameters: your schema

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createServer } from "http";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import { useServer } from "graphql-ws/lib/use/ws";
import WebSocket, { Server } from "ws";
import cors from "cors";
import { GraphQLSchema } from "graphql";
import compression from "compression";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "graphql-tools";
import { searchVideos } from "./apis";
import resolvers from "./resolvers";
import schema from "./schema";
import { createJam } from "./services/lobbyGeneration";

const app = express();
const httpServer = createServer(app);
app.use(bodyParser.json());

// definition and your set of resolvers.

async function startApolloServer(schema: any) {
  const wsServer = new Server({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      onConnect(ctx: any) {
        return ctx.connectionParams;
      },
      async onDisconnect() {},
      async onClose() {},

      context: () => {
        // Returning an object here will add that information to our
        // GraphQL context, which all of our resolvers have access to.
      },
    },

    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    compression(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let auth = req?.headers?.authorization?.split(" ")[1];

        return {
          auth,
        };
      },
    })
  );
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, async () => {
      // DB connect console log
      // await sequelize
      //   .authenticate()
      //   .then(() => {
      //     console.log("DB connection success");
      //   })
      //   .catch((e) => {
      //     console.log("TT :", e);
      //   });
      resolve();
    })
  );

  console.log(`🚀 Server ready at http://localhost:3000/graphql`);
}

startApolloServer(schema);
