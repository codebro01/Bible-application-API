// utils/parseBibleDocx.ts
const mammoth = require('mammoth')
import type { ParsedBibleType, ChapterType, VerseType } from '@src/types/global'
import { version } from 'mongoose'

const parseBibleDocx = async (fileBuffer: Buffer): Promise<ParsedBibleType> => {
  const { value } = await mammoth.extractRawText({ buffer: fileBuffer })
  const result: ParsedBibleType = {
    version: '',
    book: '',
    chapters: [],
  }

  const lines = value
    .split('\n')
    .map((line: string) => line.trim())
    .filter(Boolean)

  let currentChapter: ChapterType | null = null


  lines.forEach((line: string) => {
    const bookMatch = /^([A-Z]+)\s*1$/.exec(line)
    const chapterMatch = /^([A-Z]+)\s+(\d+)$/.exec(line)
    const verseMatch = /^(\d+)\.\s+(.*)/.exec(line)

    if (bookMatch) {
      result.book = bookMatch[1]
      currentChapter = {
        number: 1,
        verses: [],
      }
      result.chapters.push(currentChapter)
    } else if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[2])
      currentChapter = {
        number: chapterNum,
        verses: [],
      }
      result.chapters.push(currentChapter)
    } else if (verseMatch && currentChapter) {
      const [_, verseNum, verseText] = verseMatch
      currentChapter.verses.push({
        number: parseInt(verseNum),
        text: verseText.trim(),
        version: lines[0].split(':')[1].trim()
      })


    }
  })
// console.log('result', result.chapters[0].verses)
  return result
}

module.exports = parseBibleDocx
