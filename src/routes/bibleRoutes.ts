const express = require('express');
const upload = require('@src/config/multer');
const {
  uploadBible,
  editBible,
  getBible,
  deleteBible,
  countTotalTranslations,
  countTotalBooks,
  countTotalUniqueVerses,
  textSearch,
} = require('@src/controllers/bibleController')
const {authMiddleware, RBAC} = require('@src/middlewares/authMiddleware')

const router = express.Router()

router
  .route('/')

  .post(authMiddleware, RBAC(['admin']), upload.single('document'), uploadBible)
  .get(getBible)
  .patch(authMiddleware, RBAC(['admin']), editBible)
  .delete(authMiddleware, RBAC(['admin']), deleteBible)

router.get('/total-translations', authMiddleware, RBAC(['admin']), countTotalTranslations)
router.get('/total-books', authMiddleware, RBAC(['admin']), countTotalBooks)
router.get('/total-verses', authMiddleware, RBAC(['admin']), countTotalUniqueVerses)
router.get('/search', textSearch)



module.exports = router
