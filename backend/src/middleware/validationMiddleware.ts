import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../types';

export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const response: ApiResponse = {
          success: false,
          error: 'Validation failed',
          data: errorMessages,
        };

        res.status(400).json(response);
        return;
      }

      next(error);
    }
  };
};

// Validate specific fields
export const validateBody = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const response: ApiResponse = {
          success: false,
          error: 'Validation failed',
          data: errorMessages,
        };

        res.status(400).json(response);
        return;
      }

      next(error);
    }
  };
};
