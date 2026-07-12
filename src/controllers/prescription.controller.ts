import type { Request, Response } from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
} from "../services/prescription.service.js";
import { NotFoundError } from "../errors/NotFoundError.js";

interface PrescriptionParams {
  id: string;
}

export async function create(req: Request, res: Response) {
  try {
    const prescription = await createPrescription({
      consultationId: req.body.consultationId,
      medicines: req.body.medicines,
      instructions: req.body.instructions,
    });

    res.status(201).json(prescription);
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message:
        err instanceof Error ? err.message : "Failed to create prescription",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const prescriptions = await getAllPrescriptions();
    res.json(prescriptions);
  } catch(err) {
    console.error(err)
    res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
}

export async function getOne(req: Request<PrescriptionParams>, res: Response) {
  try {
    const prescription = await getPrescriptionById(req.params.id);

    if (!prescription) {
      // return res.status(404).json({
      //   message: "Prescription not found",
      // });
      return new NotFoundError("Prescription not found");
    }

    res.json(prescription);
  } catch(err) {
    console.error(err)
    res.status(500).json({
      message: "Failed to fetch prescription",
    });
  }
}
