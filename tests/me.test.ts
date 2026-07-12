import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Current User API", () => {
  const email = `user${Date.now()}@test.com`;
  let token = "";

  it("registers a user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email,
      password: "Password123",
      role: "PATIENT",
    });

    console.log(res.status);
    console.log(res.body);

    token = res.body.token;

    expect(res.status).toBe(201);
  })
})
  