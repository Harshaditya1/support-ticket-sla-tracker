import { registerUser } from "../../services/auth/authService";

type RegisterArgs = {
  input: {
    name: string;
    email: string;
    password: string;
    role: "REPORTER" | "AGENT";
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
  },
};