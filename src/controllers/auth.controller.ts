import type { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await getCurrentUser(req.user!.id);

    res.json(user);
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
}
