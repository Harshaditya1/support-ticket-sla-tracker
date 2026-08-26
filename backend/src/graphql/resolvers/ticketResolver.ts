import { GraphQLError } from "graphql";
import {
  createTicket,
  getTickets,
  getTicketById,
  assignTicket,
  changeTicketStatus,
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
  cursor?: string;
  take?: number;
};

type TicketArgs = {
  id: string;
};

type AssignTicketArgs = {
  input: {
    ticketId: string;
    assigneeId: string;
  };
};
type ChangeTicketStatusArgs = {
  input: {
    ticketId: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
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

  return getTickets({
    filter: args.filter,
    cursor: args.cursor,
    take: args.take,
  });
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

    assignTicket: async (
      _: unknown,
      args: AssignTicketArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      

      if (context.user.role !== "AGENT") {
        throw new GraphQLError("Only agents can assign tickets", {
          extensions: {
            code: "FORBIDDEN",
          },
        });
      }

      try {
        return await assignTicket(
          args.input.ticketId,
          args.input.assigneeId
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Ticket not found") {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "TICKET_NOT_FOUND",
              },
            });
          }

          if (error.message === "User not found") {
            throw new GraphQLError(error.message, {
              extensions: {
                code: "USER_NOT_FOUND",
              },
            });
          }
        }

        throw error;
      }
    },
    changeTicketStatus: async (
  _: unknown,
  args: ChangeTicketStatusArgs,
  context: Context
) => {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: {
        code: "UNAUTHORIZED",
      },
    });
  }

  if (context.user.role !== "AGENT") {
    throw new GraphQLError("Only agents can change ticket status", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  try {
    return await changeTicketStatus(
      args.input.ticketId,
      args.input.status
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Ticket not found") {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "TICKET_NOT_FOUND",
          },
        });
      }

      if (error.message === "Invalid status transition") {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "INVALID_STATUS_TRANSITION",
          },
        });
      }
    }

    throw error;
  }
},
  },
};