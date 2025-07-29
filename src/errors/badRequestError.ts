export = {};
const { CustomApiError } = require('@src/errors/customApiError')

const { StatusCodes } = require('http-status-codes')


module.exports = class BadRequestError extends CustomApiError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
    this.name = this.constructor.name

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
