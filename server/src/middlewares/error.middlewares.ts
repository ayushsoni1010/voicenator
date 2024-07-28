import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);

  res.status(500).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;
