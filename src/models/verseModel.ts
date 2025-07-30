import { version } from "mongoose";

const mongoose = require('mongoose')

const verseSchema = new mongoose.Schema({
  book: String,
  chapter: String,
  verse: String,
  text: String,
  user: {
    type: mongoose.types.ObjectId,
    ref: 'User',
  },
  version: String
})
const Verse = mongoose.model('Verse', verseSchema)

module.exports = Verse;
