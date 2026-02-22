import { StatusCodes } from "http-status-codes";
import {
  registerUser,
  loginUser,
} from "../services/authService.js";
import {
  verifyRefreshToken,
  signAccessToken,
} from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";

const REFRESH_COOKIE_NAME = "refreshToken";

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    return res.status(StatusCodes.CREATED).json({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    setRefreshCookie(res, refreshToken);

    return res.status(StatusCodes.OK).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing refresh token");
    }
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken({
      sub: payload.sub,
      role: payload.role,
    });
    return res.status(StatusCodes.OK).json({ accessToken });
  } catch (err) {
    return next(
      err instanceof ApiError
        ? err
        : new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token"),
    );
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
}


