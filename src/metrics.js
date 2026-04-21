import {
  Registry,
  collectDefaultMetrics,
  Counter,
  Histogram,
} from "prom-client";

class PrometheusMetrics {
  constructor(options = {}) {
    this.prefix = options.prefix || undefined;
    this.appName = options.appName || "unknown-app";
    this.env = options.env || process.env.NODE_ENV || "development";

    this.register = new Registry();

    this.setupDefaultMetrics();
    this.setupCustomMetrics();
    this.setDefaultLabels();
  }

  setupDefaultMetrics() {
    collectDefaultMetrics({
      register: this.register,
      prefix: this.prefix,
      gcDurationBuckets: [
        0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1, 2.5,
      ],
      eventLoopMonitoringPrecision: 10,
    });
  }

  setupCustomMetrics() {
    this.httpRequestsTotal = new Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "route", "status_code"],
      registers: [this.register],
    });

    this.httpRequestDuration = new Histogram({
      name: "http_request_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "route", "status_code"],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [this.register],
    });
  }

  setDefaultLabels() {
    this.register.setDefaultLabels({
      app: this.appName,
      env: this.env,
      version: process.env.APP_VERSION || "unknown",
    });
  }

  async getMetrics() {
    return await this.register.metrics();
  }

  getContentType() {
    return this.register.contentType;
  }
}

export default PrometheusMetrics;
