import { GraphQLError } from "graphql";
import {
  createTicket,
  getTickets,
  getTicketById,
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
type TicketArgs = {
  id: string;
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

  ticket: async (
    _: unknown,
    args: TicketArgs,
    context: Context
  ) => {
    if (!context.user) {
      throw new GraphQLError("Authentication required", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }

    const ticket = await getTicketById(args.id);

    if (!ticket) {
      throw new GraphQLError("Ticket not found", {
        extensions: {
          code: "TICKET_NOT_FOUND",
        },
      });
    }

    return ticket;
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