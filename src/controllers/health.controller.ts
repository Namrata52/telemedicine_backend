import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import os from "os";

export async function health(req: Request, res: Response) {
  res.json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date(),
    memory: process.memoryUsage(),
    cpuCount: os.cpus().length,
    platform: process.platform,
    nodeVersion: process.version,
  });
}

export async function readiness(req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "READY",
    });
  } catch {
    res.status(503).json({
      status: "NOT_READY",
    });
  }
}

export function liveness(req: Request, res: Response) {
  res.json({
    status: "ALIVE",
  });
}
