import type { Request, Response } from "express";
import { createAuditLog, getAuditLogs } from "../services/audit.service.js";

export async function create(req: Request, res: Response) {
  try {
    const log = await createAuditLog(req.body);

    res.status(201).json(log);
  } catch {
    res.status(500).json({
      message: "Failed to create audit log",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const logs = await getAuditLogs();

    res.json(logs);
  } catch {
    res.status(500).json({
      message: "Failed to fetch logs",
    });
  }
}
