import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

const sendError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Handling Mongoose CastError (Invalid ID)
  if (error.name === "CastError") {
    const message = `Invalid ${error.path}: ${error.value}`;
    error = new AppError(message, 400);
  }

  // Handling Mongoose Validation Error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    error = new AppError(message, 400);
  }

  if (!(error instanceof AppError)) {
    if (error instanceof AppError) sendError(error, res);
    else
      sendError(
        new AppError(
          error.message || "Something went wrong",
          error.statusCode || 500,
        ),
        res,
      );
    return;
  }

  sendError(error, res);
};
