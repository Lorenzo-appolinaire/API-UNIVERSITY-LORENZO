// app.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ApolloServer, gql } from "apollo-server";
import fs from "fs";
import resolvers from "./graphql/resolvers"
// Read the GraphQL schema file
const typeDefs = fs.readFileSync("src/graphql/schema.graphql", "utf-8");

// Import resolvers
// const resolvers = require("./graphql/resolvers");

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Set up middleware to parse JSON requests
app.use(express.json());

// Define a simple route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript!");
});

// Start the server
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Create an Apollo server
const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
});

server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
