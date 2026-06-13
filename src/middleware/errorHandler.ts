import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/customError";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const error = err instanceof AppError ? err : new AppError("Internal Server Error", 500);
  const response = {
    status: "error",
    message: error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
  };
  res.status(error.statusCode).json(response);
};
