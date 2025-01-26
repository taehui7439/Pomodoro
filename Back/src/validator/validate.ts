import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "../models/http-error";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new HttpError(errorMessage, 400));
  }
  next();
};
