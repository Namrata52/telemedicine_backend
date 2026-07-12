import client from "prom-client";

client.collectDefaultMetrics();

export const register = client.register;

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in milliseconds",

  labelNames: ["method", "route", "status_code"],

  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",

  help: "Total HTTP Requests",

  labelNames: ["method", "route", "status_code"],
});
export const activeRequests = new client.Gauge({
  name: "http_active_requests",
  help: "Current active HTTP requests",
});
export const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total HTTP errors",
  labelNames: ["method", "route", "status_code"],
});
export const prom_version_info = new client.Gauge({
  name: "telemedicine_build_info",
  help: "Build Information",

  labelNames: ["version"],
}).set(
  {
    version: "1.0.0",
  },
  1,
);