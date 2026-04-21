import PrometheusMetrics from "./metrics";
import type { PrometheusMetricsOptions } from "./metrics";
import type { RequestHandler } from "express";

export default class ExpressMetrics extends PrometheusMetrics {
  constructor(options?: PrometheusMetricsOptions);

  getMiddleware(): RequestHandler;
}
