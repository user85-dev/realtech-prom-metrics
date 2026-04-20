const PrometheusMetrics = require("../src/metrics");

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
      expect(metrics.prefix).toBe("test_");
      expect(metrics.appName).toBe("test-app");
      expect(metrics.env).toBe("test");
    });

    it("falls back to defaults when no options given", () => {
      const m = new PrometheusMetrics();
      expect(m.prefix).toBe("api_");
      expect(m.appName).toBe("unknown-app");
      m.register.clear();
    });

    it("falls back to NODE_ENV for env", () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = "staging";
      const m = new PrometheusMetrics();
      expect(m.env).toBe("staging");
      m.register.clear();
      process.env.NODE_ENV = original;
    });

    it("creates a new Registry instance", () => {
      expect(metrics.register).toBeDefined();
    });
  });

  describe("setupCustomMetrics", () => {
    it("registers httpRequestsTotal counter", () => {
      expect(metrics.httpRequestsTotal).toBeDefined();
    });

    it("registers httpRequestDuration histogram", () => {
      expect(metrics.httpRequestDuration).toBeDefined();
    });

    it("httpRequestsTotal increments correctly", () => {
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
      const values = metrics.httpRequestsTotal.get();
      const val = values.values.find(
        (v) =>
          v.labels.method === "GET" &&
          v.labels.route === "/" &&
          v.labels.status_code === "200",
      );
      expect(val.value).toBe(2);
    });

    it("httpRequestDuration observes values", () => {
      metrics.httpRequestDuration.observe(
        { method: "POST", route: "/api", status_code: "201" },
        0.042,
      );
      const values = metrics.httpRequestDuration.get();
      expect(values.values.length).toBeGreaterThan(0);
    });
  });

  describe("setDefaultLabels", () => {
    it("sets app and env labels on the registry", async () => {
      const output = await metrics.getMetrics();
      expect(output).toContain('app="test-app"');
      expect(output).toContain('env="test"');
    });
  });

  describe("getMetrics", () => {
    it("returns a non-empty string", async () => {
      const output = await metrics.getMetrics();
      expect(typeof output).toBe("string");
      expect(output.length).toBeGreaterThan(0);
    });

    it("includes the custom counter metric name", async () => {
      const output = await metrics.getMetrics();
      expect(output).toContain("http_requests_total");
    });

    it("includes the custom histogram metric name", async () => {
      const output = await metrics.getMetrics();
      expect(output).toContain("http_request_duration_seconds");
    });
  });

  describe("getContentType", () => {
    it("returns a valid Prometheus content type string", () => {
      const ct = metrics.getContentType();
      expect(ct).toMatch(/text\/plain/);
    });
  });
});
