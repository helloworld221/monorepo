import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectSchema } from "joi";
import logger from "../utils/logger";

export const validateJoi = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errors = details.map((i) => ({
        message: i.message,
        path: i.path,
        type: i.type,
      }));
      logger.warn({ message: "Validation error", errors });
      res.status(400).json({ errors });
    } else {
      req.body = value;
      next();
    }
  };
};

export const validateExpressValidator = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};
