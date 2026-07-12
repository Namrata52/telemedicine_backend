import type { NextFunction, Request, Response } from "express";
import { verifyToken, type TokenPayload } from "../utils/jwt.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // return res.status(401).json({
    //   message: "Authentication required",
    // });
    return next(new UnauthorizedError("Authentication required"));
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    // return res.status(401).json({
    //   message: "Invalid authorization header",
    // });
    return next(new UnauthorizedError("Invalid authorization header"));
  }

  try {
    req.user = verifyToken(token);

    next();
  } catch {
    // return res.status(401).json({
    //   message: "Invalid or expired token",
    // });
    return next(new UnauthorizedError("Invlaid or expired token"));
  }
}
