// src/index.js
const PrometheusMetrics = require("./metrics");
const ExpressMetrics = require("./express");
const FastifyMetrics = require("./fastify");
const ElysiaMetrics = require("./elysia");

module.exports = {
  PrometheusMetrics,
  ExpressMetrics,
  FastifyMetrics,
  // Untuk kemudahan import
  createExpressMetrics: (options) => new ExpressMetrics(options),
  createFastifyMetrics: (options) => new FastifyMetrics(options),
  createElysiaMetrics: (options) => new ElysiaMetrics(options),
};
