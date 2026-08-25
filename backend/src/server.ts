import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { createSchema } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { join } from "node:path";
import { authResolver } from "./graphql/resolvers/authResolver";
const typeDefs = loadFilesSync(
  join(process.cwd(), "src/graphql/schema/**/*.graphql")
);

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: [
  {
    Query: {
      health: () => "Support Ticket SLA Tracker API is running 🚀",
    },
  },
  authResolver,
],
  }),
});

const server = createServer(yoga);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
});