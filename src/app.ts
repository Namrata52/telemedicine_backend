import express from "express";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import { httpLogger } from "./middlewares/logger.middleware.js";
import { metricsMiddleware } from "./middlewares/metrics.middleware.js";
import metricsRoutes from "./routes/metrics.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

const app = express();

app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(metricsMiddleware);
app.use(httpLogger);
// app.use("/api/v1/", healthRoutes);
app.use("/health", healthRoutes);

// Authentication Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/audit-logs", auditRoutes);
app.use("/metrics", metricsRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
