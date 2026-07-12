# 🩺 Telemedicine Backend API

A production-grade backend for a telemedicine platform built with **Node.js, Express.js, TypeScript, Prisma, and PostgreSQL**. The system supports secure authentication, doctor management, consultation booking, payments, audit logging, observability, and production-ready best practices.

> Developed as part of the Amrutam Backend Developer Assignment.

---

# 🚀 Features

## Authentication & Authorization

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Secure password hashing using bcrypt
- Protected routes
- Current logged-in user endpoint (`/me`)
- Rate limiting for authentication endpoints

---

## User & Doctor Management

- User Registration
- User Login
- Profile Management
- Doctor CRUD APIs
- Doctor Search

---

## Availability Management

- Create Availability Slots
- View Available Slots
- Slot Booking
- Prevent Double Booking

---

## Consultation Management

- Book Consultation
- View All Consultations
- View Consultation by ID
- Transaction-based booking using Prisma
- Idempotency support using `Idempotency-Key`

---

## Prescription Management

- Create Prescription
- View Prescription Details

---

## Payment Management

- Record Consultation Payments
- Payment Status Tracking

---

## Audit Logging

Automatically records important system activities:

- User Registration
- Consultation Booking
- Availability Creation
- Payments

---

## Security

- Helmet
- CORS
- Rate Limiting
- Input Validation (Zod)
- JWT Authentication
- RBAC Authorization
- Password Hashing
- Idempotent API Requests

---

## Observability

- Structured Logging using Pino
- Prometheus Metrics
- Health Checks
- Readiness & Liveness Endpoints

---

## API Documentation

Interactive Swagger UI available at:

```
/api-docs
```

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST API |
| TypeScript | Type Safety |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| Zod | Validation |
| bcrypt | Password Hashing |
| Swagger | API Documentation |
| Prometheus | Metrics |
| Pino | Logging |
| Vitest | Testing |
| Supertest | API Testing |
| GitHub Actions | Continuous Integration |

---

# 📁 Project Structure

```text
src
├── config
├── controllers
├── middlewares
├── routes
├── services
├── validators
├── swagger
├── utils
├── errors
├── app.ts
└── server.ts

prisma
├── migrations
└── schema.prisma

tests
├── auth.test.ts
├── health.test.ts
└── me.test.ts

.github
└── workflows
    └── ci.yml
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Namrata52/telemedicine_backend
```

Move into the project

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

# 🔧 Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/telemedicine
JWT_SECRET=your-secret-key
PORT=5000
```

---

# 🗄 Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

(Optional)

Open Prisma Studio

```bash
npx prisma studio
```

---

# ▶️ Running the Application

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Start Production Server

```bash
npm start
```

---

# 🧪 Running Tests

Run all tests

```bash
npm test
```

Watch mode

```bash
npm run test:watch
```

Current test coverage includes:

- Health Endpoints
- User Registration
- User Login
- Invalid Login
- Protected Route Authentication

---

# 🔄 Continuous Integration

GitHub Actions automatically performs:

- Install Dependencies
- Generate Prisma Client
- Run Database Migrations
- Build Project
- Execute Automated Tests

Workflow:

```
.github/workflows/ci.yml
```

---

# 📊 API Endpoints

## Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

## Profile

```
GET /api/v1/profile
PUT /api/v1/profile
```

## Doctors

```
POST /api/v1/doctors
GET /api/v1/doctors
GET /api/v1/doctors/:id
PUT /api/v1/doctors/:id
DELETE /api/v1/doctors/:id
```

## Availability

```
POST /api/v1/availability
GET /api/v1/availability
```

## Consultations

```
POST /api/v1/consultations
GET /api/v1/consultations
GET /api/v1/consultations/:id
```

## Prescriptions

```
POST /api/v1/prescriptions
GET /api/v1/prescriptions
GET /api/v1/prescriptions/:id
```

## Payments

```
POST /api/v1/payments
GET /api/v1/payments
```

## Audit Logs

```
GET /api/v1/audit-logs
```

## Health

```
GET /health
GET /health/live
GET /health/ready
```

## Metrics

```
GET /metrics
```

---

# 🔒 Security Considerations

- JWT Authentication
- Role-Based Access Control
- Input Validation
- Password Hashing
- Idempotent Booking Requests
- Audit Logging
- Rate Limiting
- HTTP Security Headers
- Environment-based Secrets

---

# 📈 Observability

- Structured Request Logging
- Application Metrics
- Health Monitoring
- Readiness Checks
- Liveness Checks

---

# 📌 Future Improvements

- Multi-Factor Authentication (MFA)
- Redis Caching
- Background Job Queue (BullMQ)
- Email Notifications
- Docker & Docker Compose
- Kubernetes Deployment
- Distributed Tracing with OpenTelemetry

---

# 👩‍💻 Author

**Namrata Lilaria**

Backend Developer Assignment – Amrutam
