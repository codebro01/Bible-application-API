const express = require('express');
const upload = require('@src/config/multer');
const { uploadBible } = require('@src/controllers/bibleController');
const {authMiddleware, RBAC} = require('@src/middlewares/authMiddleware')

const router = express.Router()

router
  .route('/')

  .post(authMiddleware, RBAC(['admin']), upload.single('document'), uploadBible)


module.exports = router
