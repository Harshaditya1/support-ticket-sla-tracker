import { GraphQLError } from "graphql";
import { PrismaClient, Role } from "@prisma/client";
import { Context } from "../../context";

const prisma = new PrismaClient();

export const userResolver = {
  Query: {
    me: async (
      _: unknown,
      __: unknown,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      return prisma.user.findUnique({
        where: {
          id: context.user.userId,
        },
      });
    },

    agents: async (
      _: unknown,
      __: unknown,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      return prisma.user.findMany({
        where: {
          role: Role.AGENT,
        },
        orderBy: {
          name: "asc",
        },
      });
    },
  },
};