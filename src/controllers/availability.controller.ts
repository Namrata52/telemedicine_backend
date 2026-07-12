import type { Request, Response } from "express";
import {
  createAvailabilitySlot,
  getDoctorSlots,
} from "../services/availability.service.js";

interface AvailabilityParams {
  doctorId: string;
}
export async function createSlot(req: Request, res: Response) {
  try {
    const slot = await createAvailabilitySlot({
      doctorId: req.body.doctorId,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    });

    res.status(201).json(slot);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create slot",
    });
  }
}

export async function getSlots(
  req: Request<AvailabilityParams>,
  res: Response,
) {
  try {
    const slots = await getDoctorSlots(req.params.doctorId);

    res.json(slots);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch slots",
    });
  }
}
