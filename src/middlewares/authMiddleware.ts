const { verifyJWT, createJWT } = require('@src/helpers/jwt.js')
const { NotAuthenticatedError, BadRequestError } = require('@src/errors/index')
import type { Response, Request, NextFunction } from 'express'
import type { PayloadType } from '@src/types/global';


interface CustomReqType extends Request {
    user: PayloadType
}

const authMiddleware = (
  req: CustomReqType,
  res: Response,
  next: NextFunction
) => {
  const { token } = req?.cookies
  console.log(req.headers)
  if (!token)
    return next(new NotAuthenticatedError('No Token provided', 'UNAUTHORIZED'))

  try {
    const decoded = verifyJWT({ token })

    if (!decoded)
      return next(
        new NotAuthenticatedError('Invalid Token provided', 'UNAUTHORIZED')
      )
    const { username, email, role, id } = decoded
    req.user = { username, email, role, id }
    return next()
  } catch (err) {
    return next(
      new NotAuthenticatedError(
        'An error occured identifying user, please try loggin in again!!! ',
        'UNAUTHORIZED'
      )
    )
  }
}

const RBAC = (requiredRole: string[]) => {
  return (req: CustomReqType, res: Response, next: NextFunction) => {
    const user = req.user as PayloadType
    if (!user || !user.role || user.role.length < 1) {
      return next(
        new NotAuthenticatedError('User is not permitted to enter here!!!!!')
      )
    }

    // Ensure requiredRole is an array
    //   if (!Array.isArray(requiredRole)) {
    //     requiredRole = [requiredRole]
    //   }

    // Check if user has at least one required permission
    const hasRole = requiredRole.some((role) => user.role.includes(role))

    if (!hasRole) {
      return next(
        new NotAuthenticatedError(
          'User does not have the required permission to access this route',
          {
            extensions: { code: 'FORBIDDEN', status: 403 },
          }
        )
      )
    }

    next()
  }
}

module.exports = { RBAC, authMiddleware }
