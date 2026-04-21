import PrometheusMetrics from "./metrics.js";
import ExpressMetrics from "./express.js";
import FastifyMetrics from "./fastify.js";
import ElysiaMetrics from "./elysia.js";

// Exporting the classes and factory functions for creating instances of the metrics middleware for different web frameworks.
export default {
  PrometheusMetrics,
  ExpressMetrics,
  FastifyMetrics,
  ElysiaMetrics,

  createExpressMetrics: (options) => new ExpressMetrics(options),
  createFastifyMetrics: (options) => new FastifyMetrics(options),
  createElysiaMetrics: (options) => new ElysiaMetrics(options),
};