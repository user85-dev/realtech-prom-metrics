import PrometheusMetrics from "./metrics.js";
import ExpressMetrics from "./express.js";
import FastifyMetrics from "./fastify.js";
import ElysiaMetrics from "./elysia.js";

export {
  PrometheusMetrics,
  ExpressMetrics,
  FastifyMetrics,
  ElysiaMetrics,
};

// Factory functions
export const createExpressMetrics = (options) => new ExpressMetrics(options);
export const createFastifyMetrics = (options) => new FastifyMetrics(options);
export const createElysiaMetrics = (options) => new ElysiaMetrics(options);