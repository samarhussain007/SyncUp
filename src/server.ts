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
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];
const resolvers = {
  Query: {
    books: () => books,
  },
};

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers,
});

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const app = express();
const httpServer = createServer(app);
app.use(bodyParser.json());

// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });

async function startApolloServer(schema: any) {
  const wsServer = new Server({
    server: httpServer,
    path: "/graphql",
  });
  // Passing in an instance of a GraphQLSchema and
  // telling the WebSocketServer to start listening
  const serverCleanup = useServer(
    {
      schema,
      onConnect(ctx: any) {
        // console.log("User is connected to the subscription");
        // console.log("connected", ctx.connectionParams);
        //console.log("connected!", ctx.connectionParams);
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

  // const admin_key = require("crypto").randomBytes(64).toString("hex");
  // console.log("ADMIN KEY", admin_key, "/n");
  // const normal_key = require("crypto").randomBytes(64).toString("hex");
  // console.log("NORMAL KEY", normal_key, "/n");

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
  // getAllRewardConfigs();
  console.log(`🚀 Server ready at http://localhost:3000/graphql`);
}

startApolloServer(schema);
