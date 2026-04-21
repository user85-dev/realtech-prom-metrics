import PrometheusMetrics from "./metrics.js";
import ExpressMetrics from "./express.js";
import FastifyMetrics from "./fastify.js";
import ElysiaMetrics from "./elysia.js";

// Exporting the metrics classes and factory functions for creating instances with options

export default {
  PrometheusMetrics,
  ExpressMetrics,
  FastifyMetrics,
  ElysiaMetrics,

  createExpressMetrics: (options) => new ExpressMetrics(options),
  createFastifyMetrics: (options) => new FastifyMetrics(options),
  createElysiaMetrics: (options) => new ElysiaMetrics(options),
};
