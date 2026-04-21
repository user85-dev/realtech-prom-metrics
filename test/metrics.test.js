import assert from "node:assert";
import PrometheusMetrics from "../src/metrics.js";

describe("PrometheusMetrics", () => {
  let metrics;

  beforeEach(() => {
    metrics = new PrometheusMetrics({
      prefix: "test_",
      appName: "test-app",
      env: "test",
    });
  });

  afterEach(() => {
    metrics.register.clear();
  });

  describe("constructor", () => {
    it("uses provided options", () => {
      assert.strictEqual(metrics.prefix, "test_");
      assert.strictEqual(metrics.appName, "test-app");
      assert.strictEqual(metrics.env, "test");
    });

    it("falls back to defaults when no options given", () => {
      const m = new PrometheusMetrics();
      assert.strictEqual(m.prefix, "api_");
      assert.strictEqual(m.appName, "unknown-app");
      m.register.clear();
    });

    it("falls back to NODE_ENV for env", () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = "staging";

      const m = new PrometheusMetrics();
      assert.strictEqual(m.env, "staging");

      m.register.clear();
      process.env.NODE_ENV = original;
    });

    it("creates a new Registry instance", () => {
      assert.ok(metrics.register);
    });
  });

  describe("setupCustomMetrics", () => {
    it("registers httpRequestsTotal counter", () => {
      assert.ok(metrics.httpRequestsTotal);
    });

    it("registers httpRequestDuration histogram", () => {
      assert.ok(metrics.httpRequestDuration);
    });

    it("httpRequestsTotal increments correctly", async () => {
      metrics.httpRequestsTotal.inc({
        method: "GET",
        route: "/",
        status_code: "200",
      });
      metrics.httpRequestsTotal.inc({
        method: "GET",
        route: "/",
        status_code: "200",
      });

      const values = await metrics.httpRequestsTotal.get();
      const val = values.values.find(
        (v) =>
          v.labels.method === "GET" &&
          v.labels.route === "/" &&
          v.labels.status_code === "200",
      );

      assert.strictEqual(val.value, 2);
    });

    it("httpRequestDuration observes values", async () => {
      metrics.httpRequestDuration.observe(
        { method: "POST", route: "/api", status_code: "201" },
        0.042,
      );

      const values = await metrics.httpRequestDuration.get();
      assert.ok(values.values.length > 0);
    });
  });

  describe("setDefaultLabels", () => {
    it("sets app and env labels on the registry", async () => {
      const output = await metrics.getMetrics();
      assert.ok(output.includes('app="test-app"'));
      assert.ok(output.includes('env="test"'));
    });
  });

  describe("getMetrics", () => {
    it("returns a non-empty string", async () => {
      const output = await metrics.getMetrics();
      assert.strictEqual(typeof output, "string");
      assert.ok(output.length > 0);
    });

    it("includes the custom counter metric name", async () => {
      const output = await metrics.getMetrics();
      assert.ok(output.includes("http_requests_total"));
    });

    it("includes the custom histogram metric name", async () => {
      const output = await metrics.getMetrics();
      assert.ok(output.includes("http_request_duration_seconds"));
    });
  });

  describe("getContentType", () => {
    it("returns a valid Prometheus content type string", () => {
      const ct = metrics.getContentType();
      assert.match(ct, /text\/plain/);
    });
  });
});
