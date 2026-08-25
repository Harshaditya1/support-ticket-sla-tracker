import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: "REPORTER" | "AGENT";
};

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayload;
}