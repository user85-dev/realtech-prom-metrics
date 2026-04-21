import PrometheusMetrics from "./metrics";
import type { PrometheusMetricsOptions } from "./metrics";
import type { Elysia } from "elysia";

export default class ElysiaMetrics extends PrometheusMetrics {
  constructor(options?: PrometheusMetricsOptions);

  plugin(): Elysia;

  metricsRoute(path?: string): Elysia;
}
