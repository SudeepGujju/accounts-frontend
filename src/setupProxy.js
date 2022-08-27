const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:8000',
      target: 'http://15.207.95.226:80',
      changeOrigin: true
    })
  );
};