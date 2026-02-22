import Joi from "joi";
import { StatusCodes } from "http-status-codes";

export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    return next();
  };
}


