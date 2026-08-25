import { verifyToken } from "./utils/jwt";

export type AuthUser = {
  userId: string;
  role: "REPORTER" | "AGENT";
};

export type Context = {
  user: AuthUser | null;
};

export async function createContext(
  request: Request
): Promise<Context> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    return {
      user: verifyToken(token),
    };
  } catch {
    return {
      user: null,
    };
  }
}