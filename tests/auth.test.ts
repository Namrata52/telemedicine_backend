import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Authentication API", () => {
  const uniqueEmail = `user${Date.now()}@test.com`;

  const registerBody = {
    firstName: "John",
    lastName: "Doe",
    email: uniqueEmail,
    password: "Password123",
    role: "PATIENT",
  };

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(registerBody);

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(uniqueEmail);
    expect(res.body.user.role).toBe("PATIENT");
  });

  it("should login successfully", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: uniqueEmail,
      password: "Password123",
    });

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: uniqueEmail,
      password: "WrongPassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid Credentials");
  });
});
