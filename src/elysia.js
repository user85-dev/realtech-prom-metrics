import PrometheusMetrics from "./metrics";

class ElysiaMetrics extends PrometheusMetrics {
  constructor(options = {}) {
    super(options);
  }

  plugin() {
    const { Elysia } = require("elysia");

    return new Elysia({ name: "prometheus-metrics" })
      .derive(() => ({
        _startTime: process.hrtime.bigint(),
      }))
      .onAfterResponse(({ request, set, _startTime, path }) => {
        if (!_startTime) return;

        const duration = Number(process.hrtime.bigint() - _startTime) / 1e9;

        const route = path || new URL(request.url).pathname || "unknown";
        const method = request.method;
        const statusCode = String(set.status ?? 200);

        this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
        this.httpRequestDuration.observe(
          { method, route, status_code: statusCode },
          duration,
        );
      });
  }

  metricsRoute(path = "/metrics") {
    const { Elysia } = require("elysia");

    return new Elysia().get(path, async ({ set }) => {
      set.headers["Content-Type"] = this.getContentType();
      return await this.getMetrics();
    });
  }
}

export default ElysiaMetrics;
