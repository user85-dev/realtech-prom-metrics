import PrometheusMetrics from "./metrics";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default class FastifyMetrics extends PrometheusMetrics {
  constructor(options?: any);

  registerHooks(fastify: FastifyInstance): void;

  getMetricsRoute(): (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<string>;
}
