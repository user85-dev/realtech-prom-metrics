import PrometheusMetrics from "./metrics";

class FastifyMetrics extends PrometheusMetrics {
  constructor(options = {}) {
    super(options);
  }

  registerHooks(fastify) {
    fastify.decorateRequest("startTime", null);

    fastify.addHook("onRequest", async (request, reply) => {
      request.startTime = process.hrtime.bigint();
    });

    fastify.addHook("onResponse", async (request, reply) => {
      if (!request.startTime) return;

      const duration =
        Number(process.hrtime.bigint() - request.startTime) / 1e9;
      const route = request.routerPath || request.url || "unknown";

      this.httpRequestsTotal.inc({
        method: request.method,
        route,
        status_code: reply.statusCode.toString(),
      });

      this.httpRequestDuration.observe(
        {
          method: request.method,
          route,
          status_code: reply.statusCode.toString(),
        },
        duration,
      );
    });
  }

  getMetricsRoute() {
    return async (request, reply) => {
      reply.header("Content-Type", this.getContentType());
      return await this.getMetrics();
    };
  }
}

export default FastifyMetrics;
