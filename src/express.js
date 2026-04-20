const PrometheusMetrics = require('./metrics');

class ExpressMetrics extends PrometheusMetrics {
  constructor(options = {}) {
    super(options);
  }

  getMiddleware() {
    return (req, res, next) => {
      const start = process.hrtime.bigint();

      res.on('finish', () => {
        const duration = Number(process.hrtime.bigint() - start) / 1e9;
        const route = req.route?.path || req.path || 'unknown';

        this.httpRequestsTotal.inc({
          method: req.method,
          route,
          status_code: res.statusCode.toString()
        });

        this.httpRequestDuration.observe({
          method: req.method,
          route,
          status_code: res.statusCode.toString()
        }, duration);
      });

      next();
    };
  }
}

module.exports = ExpressMetrics;