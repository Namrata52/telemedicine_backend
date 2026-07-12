import type { Request, Response } from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
} from "../services/payment.service.js";

interface PaymentParams {
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
    const payment = await createPayment({
      consultationId: req.body.consultationId,
      amount: req.body.amount,
      transactionId: req.body.transactionId,
      idempotencyKey,
    });

    // res.status(201).json(payment);
    res.status(payment.created ? 201 : 200).json(payment);
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to create payment",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const payments = await getPayments();

    res.json(payments);
  } catch {
    res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
}

export async function getOne(req: Request<PaymentParams>, res: Response) {
  try {
    const payment = await getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json(payment);
  } catch {
    res.status(500).json({
      message: "Failed to fetch payment",
    });
  }
}
