import { createServer } from "node:http";
import { createYoga, createSchema } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { join } from "node:path";

import { authResolver } from "./graphql/resolvers/authResolver";
import { ticketResolver } from "./graphql/resolvers/ticketResolver";
import { commentResolver } from "./graphql/resolvers/commentResolver";
import { createContext } from "./context";
import { dashboardResolver } from "./graphql/resolvers/dashboardResolver";
import { userResolver } from "./graphql/resolvers/userResolver";

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
      ticketResolver,
      commentResolver,
      dashboardResolver,
      userResolver,
    ],
  }),

  context: async ({ request }) => {
  return await createContext(request);
},
});

const server = createServer(yoga);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
});