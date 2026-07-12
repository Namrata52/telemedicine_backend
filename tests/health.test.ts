import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Health API", () => {
  it("should return status 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
  });
});
