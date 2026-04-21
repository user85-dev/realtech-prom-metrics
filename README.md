# @realtech/prom-metrics 
It's a library that lets you add Prometheus metrics to our Express, Fastify and Elysia app.

Basically, it makes sure all our Js apps flex the same monitoring setup consistent and easy to manage.

## Usage

```bash
npm install @realtechltd/prom-metrics
```

### Express

```js
const express = require('express');
const { createExpressMetrics } = require('@realtechltd/prom-metrics');

const app = express();

const metrics = createExpressMetrics({
  appName: 'api-livechat-api',     
  prefix: 'livechat_',            
  env: process.env.NODE_ENV || 'development'
});

app.use(metrics.getMiddleware());

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.getContentType());
  res.end(await metrics.getMetrics());
});

```

### Fastify

```js
const fastify = require('fastify')({ logger: true });
const { createFastifyMetrics } = require('@realtechltd/prom-metrics');

const metrics = createFastifyMetrics({
  appName: 'api-livechat-api',
  prefix: 'livechat_'
});

metrics.registerHooks(fastify);

fastify.get('/metrics', metrics.getMetricsRoute());
```


### Elysia

```js
import Elysia from "elysia";
const ElysiaMetrics = require("@realtechltd/prom-metrics");

const metrics = new ElysiaMetrics({ appName: "nb", env: "production" });

const app = new Elysia()
  .use(metrics.plugin())       // request timing
  .use(metrics.metricsRoute()) // GET /metrics
  .listen(3000);

```

[Ref](https://oneuptime.com/blog/post/2026-02-17-how-to-configure-an-npm-repository-in-artifact-registry-for-nodejs-packages/view)
