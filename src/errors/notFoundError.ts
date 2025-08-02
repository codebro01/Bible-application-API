const CustomApiErro = require('@src/errors/customApiError')


module.exports = class NotFoundError extends CustomApiErro {
  constructor(message: string) {
    super(message)
    this.statusCode = 404
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
