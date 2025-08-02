const Express = require('express');
const {login, signup} = require('@src/controllers/authController')

const RouterRouter = Express.Router()

RouterRouter.post('/login', login )
RouterRouter.post('/signup', signup );

module.exports = RouterRouter