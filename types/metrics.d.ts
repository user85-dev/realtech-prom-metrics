import { Registry, Counter, Histogram } from "prom-client";

export interface PrometheusMetricsOptions {
  prefix?: string;
  appName?: string;
  env?: string;
}

export default class PrometheusMetrics {
  constructor(options?: PrometheusMetricsOptions);

  prefix: string;
  appName: string;
  env: string;

  register: Registry;

  httpRequestsTotal: Counter<string>;
  httpRequestDuration: Histogram<string>;

  setupDefaultMetrics(): void;
  setupCustomMetrics(): void;
  setDefaultLabels(): void;

  getMetrics(): Promise<string>;
  getContentType(): string;
}
