
const mongoose = require('mongoose')

const bibleSchema = new mongoose.Schema({
  book: {
    type: String,
    required: true,
    trim: true,
  },
  chapter: {
    type: Number,
    required: true,
  },
  verse: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  version: {
    type: String,
    required: true,
    trim: true,
  },
})
const Bible = mongoose.model('Bible', bibleSchema)

module.exports = Bible
