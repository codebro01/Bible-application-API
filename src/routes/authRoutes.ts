const { login, signup } = require('@src/controllers/authController')

router.post('/login', login)
router.post('/signup', signup)

module.exports = router
