import PrometheusMetrics from "./metrics";
import ExpressMetrics from "./express";
import FastifyMetrics from "./fastify";
import ElysiaMetrics from "./elysia";

export default {
  PrometheusMetrics,
  ExpressMetrics,
  FastifyMetrics,

  createExpressMetrics: (options) => new ExpressMetrics(options),
  createFastifyMetrics: (options) => new FastifyMetrics(options),
  createElysiaMetrics: (options) => new ElysiaMetrics(options),
};
