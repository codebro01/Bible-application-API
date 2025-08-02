const User = require('@src/models/userModel')
import type { CreateUserPayload } from '@src/types/global';
const {
  NotAuthenticatedError,
  NotFoundError,
  BadRequestError,
} = require('@src/errors')


class AuthServices {
  async createUser(payload: CreateUserPayload) {
    const user = await User.create({ ...payload })
    if (!user) {
      throw new Error('User creation failed') // Let controller handle the error
    }
  
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async loginUser(payload: {username: string, password: string}) {
    const { username, password } = payload


    // 1. Find the user (and explicitly select the password)
    const user = await User.findOne({ username }).select('+password')
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
