import PrometheusMetrics from "./metrics";
import ExpressMetrics from "./express";
import FastifyMetrics from "./fastify";
import ElysiaMetrics from "./elysia";

export { PrometheusMetrics, ExpressMetrics, FastifyMetrics, ElysiaMetrics };

export function createExpressMetrics(options?: any): ExpressMetrics;
export function createFastifyMetrics(options?: any): FastifyMetrics;
export function createElysiaMetrics(options?: any): ElysiaMetrics;

declare const _default: {
  PrometheusMetrics: typeof PrometheusMetrics;
  ExpressMetrics: typeof ExpressMetrics;
  FastifyMetrics: typeof FastifyMetrics;

  createExpressMetrics: typeof createExpressMetrics;
  createFastifyMetrics: typeof createFastifyMetrics;
  createElysiaMetrics: typeof createElysiaMetrics;
};

export default _default;
