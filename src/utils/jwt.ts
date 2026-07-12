import jwt, { type JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
export interface TokenPayload extends BaseJwtPayload {
  id: string;
  role: Role;
}
export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  return decoded as TokenPayload;
}
