import logger from "./logger";
import * as http from "node:http";

export class ShutdownManager {
  server: http.Server;
  constructor(server: http.Server) {
    this.server = server;
  }

  private shutdown(signal: String) {
    logger.info(`${signal} received - shutting down gracefully`);
    this.server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  }

  initialize() {
    process.on("uncaughtException", (err: Error) => {
      logger.fatal({ err }, "Uncaught exception detected");
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      logger.fatal({ reason }, "Unhandled promise rejection");
      process.exit(1);
    });

    process.on("SIGTERM", () => this.shutdown("SIGTERM"));
    process.on("SIGINT", () => this.shutdown("SIGINT"));
  }
}
