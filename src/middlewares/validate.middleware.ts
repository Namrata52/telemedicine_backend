import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export function validate(schema: ZodType, source: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === "body" ? req.body : req.query;

    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    if (source === "body") {
      req.body = result.data;
    }

    // Don't assign req.query

    next();
  };
}
