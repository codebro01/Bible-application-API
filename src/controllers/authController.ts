const UserServices = require('@src/services/authServices')
import type { Request, Response, NextFunction } from 'express'
const { BadRequestError, NotAuthenticatedError } = require('@src/errors')
const createTokenUser = require('@src/helpers/createTokenUser')
const attachCookieToResp = require('@src/helpers/attachCookieToResponse')
const safeValidate = require('@src/helpers/zodInputValidator')
const { loginSchema, signUpSchema } = require('@src/zod/zodSchema')

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { username, email, password } = req.body
    const validatedInputs = safeValidate(signUpSchema, req.body)
    
    if (!validatedInputs.success) {
      console.log(validatedInputs)
      validatedInputs.errors.map(
        (error: { field: string; message: string }) => {
          throw new Error(error.message)
        }
      )
      return
    }
    const user = await UserServices.createUser(validatedInputs.data)
    const tokenUser = createTokenUser(user)
    attachCookieToResp(res, { user: tokenUser })
    res.status(201).json({ message: 'User created' })
  } catch (error) {
    return next(error)
  }
}
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedInputs = safeValidate(loginSchema, req.body)

    if (!validatedInputs.success) {
      validatedInputs.errors.map(
        (error: { field: string; message: string }) => {
          throw new Error(error.message)
        }
      )
      return
    }
    const user = await UserServices.loginUser(validatedInputs.data)

    const tokenUser = createTokenUser(user)
    attachCookieToResp(res, { user: tokenUser })
    res.status(200).json({ message: 'User loggin in' })
  } catch (error) {
    return next(error)
  }
}

module.exports = { signup, login }
