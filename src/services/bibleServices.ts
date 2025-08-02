import type {
  bibleUploadPayloadType,
  BufferedDocFile,
  PayloadType,
} from '@src/types/global'
import { text } from 'express'
import { number } from 'zod'
const Bible = require('@src/models/bibleModel')
const ParseBibleDocx = require('@src/helpers/parsedBibleDocx')

type BufferedVerseType = {
  number: number
  text: string
}
type BufferedChapterType = {
  number: number
  verses: BufferedVerseType[]
}

class BibleServices {
  uploadBible = async (
    payload: BufferedDocFile,
    user: PayloadType
  ): Promise<bibleUploadPayloadType[]> => {
    console.log(payload)
    const parsedBibleDocx = await ParseBibleDocx(payload.buffer)
    const biblePatchments = []
    const bookTitle = parsedBibleDocx.book

    for (const chapter of parsedBibleDocx.chapters) {
      const chapterNumber = chapter.number

      for (const verse of chapter.verses) {
        const upsertPromise = Bible.findOneAndUpdate(
          {
            book: bookTitle.toUpperCase(),
            chapter: Number(chapterNumber),
            verse: Number(verse.number),
            version: verse.version.toUpperCase(), // use this if version matters
          },
          {
            $set: {
              text: verse.text,
              user: user.id, // optional: per-user verses
            },
          },
          {
            new: true,
            upsert: true,
          }
        )

        biblePatchments.push(upsertPromise)
      }
    }

    const uploadedBible = await Promise.all(biblePatchments)

    if (!uploadedBible) throw new Error('Bible insertion failed')
    // console.log(uploadedBible)
    return uploadedBible
  }

  editTranslations = async (
    filter: Omit<bibleUploadPayloadType, '_id' | 'user' | 'text'>,
    newData: {
      text?: string
      chapter?: number
      verse?: number
      version?: string
    }
  ): Promise<bibleUploadPayloadType> => {
    const updateBible = await Bible.findOneAndUpdate(
      {
        ...filter,
      },
      {
        $set: {
          text: newData.text,
          verse: newData.verse,
          chapter: newData.chapter,
          version: newData.version,
        },
      },
      { new: true, runValidators: true }
    )

    return updateBible
  }

  countTotalTranslations = async (): Promise<number> => {
    const uniqueVersions = await Bible.distinct('version')

    return uniqueVersions.length
  }
  countTotalBooks = async (): Promise<number> => {
    const uniqueVersions = await Bible.distinct('book')

    return uniqueVersions.length
  }

  countTotalUniqueVerses = async (): Promise<number> => {
    const result = await Bible.aggregate([
      {
        $group: {
          _id: {
            book: '$book',
            chapter: '$chapter',
            verse: '$verse',
          },
        },
      },
      {
        $count: 'totalUniqueVerses',
      },
    ])

    return result[0]?.totalUniqueVerses || 0
  }
}
const bibleServices = new BibleServices()
module.exports = bibleServices
