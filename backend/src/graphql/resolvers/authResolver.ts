import {
  registerUser,
  loginUser,
} from "../../services/authService";
import { GraphQLError } from "graphql";
type RegisterArgs = {
  input: {
    name: string;
    email: string;
    password: string;
    role: "REPORTER" | "AGENT";
  };
};

type LoginArgs = {
  input: {
    email: string;
    password: string;
  };
};

export const authResolver = {
  Mutation: {
    register: async (
      _: unknown,
      args: RegisterArgs
    ) => {
      return registerUser(args.input);
    },

    login: async (_: unknown, args: LoginArgs) => {
  try {
    return await loginUser(args.input);
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }

    throw error;
  }
},
  },
};