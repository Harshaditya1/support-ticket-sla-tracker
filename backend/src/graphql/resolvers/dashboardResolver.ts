import { GraphQLError } from "graphql";
import { getDashboardStats } from "../../services/ticket/dashboardService";
import { Context } from "../../context";

export const dashboardResolver = {
  Query: {
    dashboardStats: async (
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

      return getDashboardStats();
    },
  },
};