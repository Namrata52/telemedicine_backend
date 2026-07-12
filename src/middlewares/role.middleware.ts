import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";

export function authorize(...roles: Role[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      // return res.status(401).json({
      //   message: "Authentication required",
      // });
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!roles.includes(req.user.role as Role)) {
      // return res.status(403).json({
      //   message: "Forbidden",
      // });
      return next(
            new ForbiddenError("You are not authorized to access this resource")
          );
    }

    next();
  };
}