import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    parseReqBody: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error(`Proxy error connecting to ${serviceUrl}:`, err.message || err);
      return res.status(502).json({
        message: "Bad Gateway: Target service unavailable",
        error: err.message || "Connection refused"
      });
    }
  });
};
