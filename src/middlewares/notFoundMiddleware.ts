import type { Request, Response } from 'express'
export const errorMiddleware = (req: Request, res: Response) =>
  res.status(404).json('Route not found')
