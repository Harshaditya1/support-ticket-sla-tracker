import { GraphQLError } from "graphql";
import { createTicket } from "../../services/ticket/ticketService";
import { Context } from "../../context";

type CreateTicketArgs = {
  input: {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  };
};

export const ticketResolver = {
  Mutation: {
    createTicket: async (
      _: unknown,
      args: CreateTicketArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      if (context.user.role !== "REPORTER") {
        throw new GraphQLError("Only reporters can create tickets", {
          extensions: {
            code: "FORBIDDEN",
          },
        });
      }

      return createTicket(args.input, context.user.userId);
    },
  },
};