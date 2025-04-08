import pino from "pino";
import pinoElastic from "pino-elasticsearch";
import pinoHttp from "pino-http";
import * as uuid from "uuid";

const streamToElastic = pinoElastic({
  index: "node-app-logs",
  node: "http://elasticsearch:9200",
  flushBytes: 1000,
  flushInterval: 1000,
});

const consoleTransport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
  },
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: {
      service: "node-app",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([{ stream: consoleTransport }, { stream: streamToElastic }]),
);

export const httpLogger = pinoHttp({
  logger,
  genReqId: function (req, res) {
    const existingID = req.id ?? req.headers["x-request-id"];
    if (existingID) return existingID;
    const id = uuid.v4();
    res.setHeader("X-Request-Id", id);
    return id;
  },

  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  wrapSerializers: true,

  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return "silent";
    }
    return "info";
  },

  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return "resource not found";
    }
    return `${req.method} completed`;
  },

  customReceivedMessage: function (req, res) {
    return "request received: " + req.method;
  },

  customErrorMessage: function (req, res, err) {
    return "request errored with status code: " + res.statusCode;
  },

  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "timeTaken",
  },
});

export default logger;
