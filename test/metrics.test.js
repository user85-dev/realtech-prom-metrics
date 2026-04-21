import test from "node:test";
import assert from "node:assert";
import PrometheusMetrics from "../src/metrics.js";

test("PrometheusMetrics", async (t) => {
  let metrics;

  await t.test("setup", () => {
    metrics = new PrometheusMetrics({
      prefix: "test_",
      appName: "test-app",
      env: "test",
    });

    assert.strictEqual(metrics.prefix, "test_");
    assert.strictEqual(metrics.appName, "test-app");
    assert.strictEqual(metrics.env, "test");
    assert.ok(metrics.register);
  });

  await t.test("defaults", () => {
    const m = new PrometheusMetrics();
    assert.strictEqual(m.prefix, undefined);
    assert.strictEqual(m.appName, "unknown-app");
    m.register.clear();
  });

  await t.test("NODE_ENV fallback", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "staging";

    const m = new PrometheusMetrics();
    assert.strictEqual(m.env, "staging");

    m.register.clear();
    process.env.NODE_ENV = original;
  });

  await t.test("custom metrics exist", () => {
    assert.ok(metrics.httpRequestsTotal);
    assert.ok(metrics.httpRequestDuration);
  });

  await t.test("httpRequestsTotal increments correctly", async () => {
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

  await t.test("httpRequestDuration observes values", async () => {
    metrics.httpRequestDuration.observe(
      { method: "POST", route: "/api", status_code: "201" },
      0.042,
    );

    const values = await metrics.httpRequestDuration.get();
    assert.ok(values.values.length > 0);
  });

  await t.test("default labels applied", async () => {
    const output = await metrics.getMetrics();
    assert.ok(output.includes('app="test-app"'));
    assert.ok(output.includes('env="test"'));
  });

  await t.test("getMetrics returns string", async () => {
    const output = await metrics.getMetrics();
    assert.strictEqual(typeof output, "string");
    assert.ok(output.length > 0);
  });

  await t.test("metrics include names", async () => {
    const output = await metrics.getMetrics();
    assert.ok(output.includes("http_requests_total"));
    assert.ok(output.includes("http_request_duration_seconds"));
  });

  await t.test("getContentType", () => {
    const ct = metrics.getContentType();
    assert.match(ct, /text\/plain/);
  });

  await t.test("cleanup", () => {
    metrics.register.clear();
  });
});
