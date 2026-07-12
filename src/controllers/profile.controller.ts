import type { Request, Response } from "express";
import { getProfile, updateProfile } from "../services/profile.service.js";

export async function getMyProfile(req: Request, res: Response) {
  const profile = await getProfile(req.user!.id);

  res.json(profile);
}

export async function updateMyProfile(req: Request, res: Response) {
  try {
    const profile = await updateProfile(req.user!.id, req.body);

    res.json(profile);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}
