import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

// Centralized error handling middleware
export default function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message =
    err.message || "Something went wrong. Please try again later.";

  // Log error with context
  if (status >= 500) {
    // Server errors - log with full details
    logger.error("Server error", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      status,
    });
  } else if (status >= 400) {
    // Client errors - log with less detail
    logger.warn("Client error", {
      message: err.message,
      path: req.path,
      method: req.method,
      status,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(status).json({ message });
}


