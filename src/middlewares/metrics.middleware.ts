import type { Request, Response, NextFunction } from "express";

import { activeRequests, httpErrorsTotal, httpRequestDuration, httpRequestsTotal } from "../metrics/metrics.js";
import { v4 as uuid } from "uuid";
import type { TokenPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.requestId = uuid();

  // Add request ID to response headers
  res.setHeader("X-Request-Id", req.requestId);
  activeRequests.inc();
  const start = process.hrtime.bigint();
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const duration = Number(endTime - start) / 1_000_000;
    console.log(`Response Time: ${duration.toFixed(2)} ms`);
    activeRequests.dec();
    const route = req.baseUrl + (req.route?.path ?? req.path);

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({
        method: req.method,
        route,
        status_code: String(res.statusCode),
      });
    }

    end({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });
  });

  next();
}
