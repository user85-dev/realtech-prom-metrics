import PrometheusMetrics from "./metrics";
import ExpressMetrics from "./express";
import FastifyMetrics from "./fastify";
import ElysiaMetrics from "./elysia";

export { PrometheusMetrics, ExpressMetrics, FastifyMetrics, ElysiaMetrics };

export const createExpressMetrics = (options) => new ExpressMetrics(options);
export const createFastifyMetrics = (options) => new FastifyMetrics(options);
export const createElysiaMetrics = (options) => new ElysiaMetrics(options);
