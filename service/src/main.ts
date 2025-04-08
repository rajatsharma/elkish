import express, { Request, Response, NextFunction } from "express";
import logger, { httpLogger } from "./logger";
import { ErrorResponse, UserResponse } from "./types";
import { ShutdownManager } from "./shutdown";

const app = express();
const port = process.env.PORT || 3000;

app.use(httpLogger);
app.use(express.json());

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  logger.info("Root endpoint accessed");
  res.json({
    message: "Hello from TypeScript Node.js app with ELK stack using Pino!",
  });
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  logger.info("Health check endpoint accessed");
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

// Error endpoint for testing
app.get("/error", (_req: Request, res: Response) => {
  const error = new Error("Test error");
  logger.error({ error }, "Error endpoint accessed - Simulating error");

  const errorResponse: ErrorResponse = {
    error: "Something went wrong!",
    status: 500,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(errorResponse);
});

// Example endpoint with structured logging
app.get("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  logger.info(
    { userId, action: "user_lookup" },
    `Looking up user with ID: ${userId}`,
  );

  const user: UserResponse = {
    userId,
    name: "Example User",
    role: "standard",
  };

  res.json(user);
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // The error is already logged by pino-http when it's caught here

  const errorResponse: ErrorResponse = {
    error: "Internal server error",
    status: 500,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(errorResponse);
});

const server = app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});

new ShutdownManager(server).initialize();
