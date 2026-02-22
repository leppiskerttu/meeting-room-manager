import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Authentication required"),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"),
    );
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return next(
        new ApiError(StatusCodes.FORBIDDEN, "Insufficient permissions"),
      );
    }
    return next();
  };
}


