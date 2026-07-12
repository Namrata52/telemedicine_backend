import { Router } from "express";
import {
  health,
  readiness,
  liveness,
} from "../controllers/health.controller.js";

const router = Router();

router.get("/", health);

router.get("/ready", readiness);

router.get("/live", liveness);

export default router;
