// const CustomApiError = require('@src/errors/customApiError')

// const { StatusCodes } = require('http-status-codes')

module.exports = class NotAuthenticatedError extends CustomApiError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
