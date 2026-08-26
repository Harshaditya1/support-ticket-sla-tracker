import { GraphQLError } from "graphql";
import { Context } from "../../context";
import { addComment } from "../../services/commentService";

type AddCommentArgs = {
  input: {
    ticketId: string;
    content: string;
  };
};

export const commentResolver = {
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
        return await addComment(
          args.input,
          context.user.userId
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Ticket not found"
        ) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "TICKET_NOT_FOUND",
            },
          });
        }

        throw error;
      }
    },
  },
};