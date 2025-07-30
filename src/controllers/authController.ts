const UserServices = require('@src/services/authServices')
import type { Request, Response, NextFunction } from 'express'
const BadRequestError = require('@src/errors/badRequestError')

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password)
      return next(new BadRequestError('Please fill all required fields'))
    await UserServices.createUser(req.body)
    res.status(201).json({ message: 'User created' })
  } catch (error) {
    return next(error)
  }
}
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return next(new BadRequestError('Please fill all required fields'))
    await UserServices.createUser(...req.body)
    res.status(201).json({ message: 'User loggin in' })
  } catch (error) {
    return next(error)
  }
}

module.exports = { signup, login }
