const User = require('@src/models/userModel')
import notAuthenticatedError from '@src/errors/notAuthenticatedError';
import type { CreateUserPayload } from '@src/types/global';
const BadRequestError = require('@src/errors/badRequestError')
const NotAuthenticatedError = require('@src/errors/notAuthenticatedError')
const NotFoundError = require('@src/errors/notFoundError')

class AuthServices {
  async createUser(payload: CreateUserPayload) {
    const user = await User.create({ ...payload })
    if (!user) {
      throw new Error('User creation failed') // Let controller handle the error
    }
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async loginUser(payload: {email: string, password: string}) {
    const { email, password } = payload

    // 1. Find the user (and explicitly select the password)
    const user = await User.findOne({ email })
    if (!user) {
      return (new NotFoundError('Invalid credentials'))
    }

    // 2. Compare the passwords
    const isMatch = await user.comparePwd(password)
    if (!isMatch) {
      return new NotAuthenticatedError('Invalid credentials')
    }

    // 3. Remove password before returning
    const userObj = user.toObject()
    delete userObj.password

    return userObj
  }
}

module.exports = new AuthServices()
