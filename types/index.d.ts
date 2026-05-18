import PrometheusMetrics, { PrometheusMetricsOptions } from "./metrics";
import ExpressMetrics from "./express";
import FastifyMetrics from "./fastify";
import ElysiaMetrics from "./elysia";

export { PrometheusMetrics, ExpressMetrics, FastifyMetrics, ElysiaMetrics };

export const createExpressMetrics = (options: PrometheusMetricsOptions) =>
  new ExpressMetrics(options);
export const createFastifyMetrics = (options: PrometheusMetricsOptions) =>
  new FastifyMetrics(options);
export const createElysiaMetrics = (options: PrometheusMetricsOptions) =>
  new ElysiaMetrics(options);
