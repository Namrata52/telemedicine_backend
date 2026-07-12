import type { Request, Response } from "express";
import type { SearchDoctorInput } from "../services/doctor.service.js";

import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  searchDoctors,
} from "../services/doctor.service.js";

interface DoctorParams {
  id: string;
}

export async function create(req: Request, res: Response) {
  try {
    const doctor = await createDoctor(req.user!.id, req.body);

    res.status(201).json(doctor);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  const doctors = await getAllDoctors();

  res.json(doctors);
}

export async function getOne(req: Request<DoctorParams>, res: Response) {
  try {
    const doctor = await getDoctorById(req.params.id);

    res.json(doctor);
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const doctor = await updateDoctor(req.user!.id, req.body);

    res.json(doctor);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function searchDoctorsController(req: Request, res: Response) {
  try {
    const filters: SearchDoctorInput = {};

    if (req.query.specialization) {
      filters.specialization = req.query.specialization as string;
    }

    if (req.query.qualification) {
      filters.qualification = req.query.qualification as string;
    }

    if (req.query.minExperience) {
      filters.minExperience = Number(req.query.minExperience);
    }

    if (req.query.maxFee) {
      filters.maxFee = Number(req.query.maxFee);
    }

    const doctors = await searchDoctors(filters);

    res.json(doctors);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Unable to search doctors",
    });
  }
}