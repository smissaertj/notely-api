import "dotenv/config";
import db from "./db.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs, resolvers, getUser } from "./schema.js";
import { Note } from "./models/note.js";
import { User } from "./models/user.js";

// Initialize database
const DB_HOST = process.env.DB_HOST;
db.connect( DB_HOST );

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Our httpServer handles incoming requests to our Express app.
const httpServer = http.createServer( app );

// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  plugins: [ ApolloServerPluginDrainHttpServer( { httpServer } ) ],
} );

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors(),
  bodyParser.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware( server, {
    context: async ( { req } ) =>  {
      const userData =  getUser( req.headers.authorization );
      console.log( userData );
      return { userData, Note, User };
    },
  } ),
);

// Modified server startup
await new Promise( ( resolve ) => httpServer.listen( { port: port }, resolve ) );
console.log( `🚀 GraphQL Server ready at http://localhost:${port}/api` );
