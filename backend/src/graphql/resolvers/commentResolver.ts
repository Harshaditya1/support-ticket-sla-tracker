import { GraphQLError } from "graphql";

import { Context } from "../../context";

import {
  getComments,
  addComment,
} from "../../services/comment/commentService";

type CommentsArgs = {
  ticketId: string;
};

type AddCommentArgs = {
  input: {
    ticketId: string;
    content: string;
  };
};

export const commentResolver = {
  Query: {
    comments: async (
      _: unknown,
      args: CommentsArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      return getComments(args.ticketId);
    },
  },

  Mutation: {
    addComment: async (
      _: unknown,
      args: AddCommentArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      try {
        return addComment(
          args.input.ticketId,
          context.user.userId,
          args.input.content
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
        }

        throw error;
      }
    },
  },
};