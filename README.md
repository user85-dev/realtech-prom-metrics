# @realtech/prom-metrics

Library reusable untuk setup Prometheus metrics di aplikasi **Express** dan **Fastify**. 

Dibuat agar semua aplikasi Node.js di perusahaan dapat menggunakan konfigurasi monitoring yang sama, konsisten, dan mudah dikelola.

## Fitur

- Support **Express** dan **Fastify**
- Default metrics dari Node.js (CPU, Memory, Event Loop, GC, dll)
- Custom HTTP metrics (`http_requests_total` & `http_request_duration_seconds`)
- High precision timing dengan `process.hrtime.bigint()`
- Configurable app name, prefix, dan environment
- Optimasi bucket untuk Histogram dan GC
- Siap digunakan di GKE + Google Cloud Monitoring

## Instalasi

```bash
npm install @prom-client/prometheus-metrics

How to use
1. Express

const express = require('express');
const { createExpressMetrics } = require('@prom-client/prometheus-metrics');

const app = express();

// Initialisation Prometheus Metrics
const metrics = createExpressMetrics({
  appName: 'api-livechat-api',     // Important - application name
  prefix: 'livechat_',             // Optional
  env: process.env.NODE_ENV || 'development'
});

// Add middleware
app.use(metrics.getMiddleware());

// Endpoint for Prometheus scrape (Important)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.getContentType());
  res.end(await metrics.getMetrics());
});


2. Fastify

const fastify = require('fastify')({ logger: true });
const { createFastifyMetrics } = require('@prom-client/prometheus-metrics');

// Initialisation Prometheus Metrics
const metrics = createFastifyMetrics({
  appName: 'api-livechat-api',
  prefix: 'livechat_'
});

// Register hooks for automatic record metrics
metrics.registerHooks(fastify);

// Route /metrics
fastify.get('/metrics', metrics.getMetricsRoute());


3. Elysia

import Elysia from "elysia";
const ElysiaMetrics = require("./elysia");

const metrics = new ElysiaMetrics({ appName: "nb", env: "production" });

const app = new Elysia()
  .use(metrics.plugin())       // request timing
  .use(metrics.metricsRoute()) // GET /metrics
  .listen(3000);
