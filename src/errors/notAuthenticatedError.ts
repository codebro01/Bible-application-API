const CustomApiErr = require('@src/errors/customApiError')

module.exports = class NotAuthenticatedError extends CustomApiErr {
  constructor(message: string) {
    super(message)
    this.statusCode = 401
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
