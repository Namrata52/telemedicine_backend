import type { Request, Response } from "express";
import {
  createConsultation,
  getConsultations,
  getConsultationById,
} from "../services/consultation.service.js";

interface ConsultationParams {
  id: string;
}

export async function create(req: Request, res: Response) {
  try {
    const idempotencyKey = req.header("Idempotency-Key");
    if (!idempotencyKey) {
      return res.status(400).json({
        message: "Idempotency-Key header is required",
      });
    }
    const consultation = await createConsultation({
      patientId: req.user!.id,
      doctorId: req.body.doctorId,
      availabilitySlotId: req.body.availabilitySlotId,
      notes: req.body.notes,
      idempotencyKey,
    });

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        err instanceof Error ? err.message : "Failed to create consultation",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const consultations = await getConsultations();

    res.json(consultations);
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: "Failed to fetch consultations",
    });
  }
}

export async function getOne(req: Request<ConsultationParams>, res: Response) {
  try {
    const consultation = await getConsultationById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found",
      });
    }

    res.json(consultation);
  } catch (err){
    console.log(err)
    res.status(500).json({
      message: "Failed to fetch consultation",
    });
  }
}
