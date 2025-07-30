import type { NextFunction, Request, Response } from 'express'
 const errorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json('Route not found');
  return next()
}

module.exports = errorMiddleware
