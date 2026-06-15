import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/customError';

export const validateBody = (schema: ZodSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err: any) {
    if (err instanceof ZodError) {
      const message = err.issues.map((issue) => {
        const path = Array.isArray(issue.path) && issue.path.length ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
      }).join('; ');
      return next(new AppError(message || 'Invalid request body', 400));
    }
    // Fallback for other errors
    const fallback = err?.message || 'Invalid request body';
    return next(new AppError(fallback, 400));
  }
};

export default validateBody;
