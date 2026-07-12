import { Router } from "express";
import { register } from "../metrics/metrics.js";

const router = Router();

router.get("/", async (_, res) => {
  res.setHeader("Content-Type", register.contentType);

  res.end(await register.metrics());
});

export default router;
