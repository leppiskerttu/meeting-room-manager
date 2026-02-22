import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

// Basic security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// HTTP request logging with morgan -> winston
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};
app.use(morgan("combined", { stream: morganStream }));

app.use(express.json());
app.use(cookieParser());

// Healthcheck
app.get("/api/health", (req, res) => {
  res.status(StatusCodes.OK).json({ status: "ok" });
});

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: "Resource not found", path: req.originalUrl });
});

// Centralized error handler
app.use(errorHandler);

export default app;


