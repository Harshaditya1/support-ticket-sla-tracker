import { GraphQLError } from "graphql";
import {
  createTicket,
  getTickets,
} from "../../services/ticket/ticketService";
import { Context } from "../../context";

type CreateTicketArgs = {
  input: {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  };
};

type TicketFilterArgs = {
  filter?: {
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    assigneeId?: string;
  };
};

export const ticketResolver = {
  Query: {
    tickets: async (
      _: unknown,
      args: TicketFilterArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      return getTickets(args.filter);
    },
  },

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