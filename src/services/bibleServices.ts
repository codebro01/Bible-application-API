import type {
  bibleUploadPayloadType,
  BufferedDocFile,
  PayloadType,
} from '@src/types/global'
import { text } from 'express'
import { version } from 'mongoose'
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

  editBible = async (
    filter: Omit<bibleUploadPayloadType, '_id' | 'user' | 'text'>,
    newData: Partial<bibleUploadPayloadType>
  ): Promise<bibleUploadPayloadType> => {
    // console.log('filters first', filter)
    // const {version, chapter, verse, book} = filter
    let updateBasket: Partial<bibleUploadPayloadType> = {}

    if (typeof newData.book === 'string') updateBasket.book = newData.book
    if (typeof newData.chapter === 'number')
      updateBasket.chapter = newData.chapter
    if (typeof newData.version === 'string')
      updateBasket.version = newData.version
    if (typeof newData.text === 'string') updateBasket.text = newData.text
    const updateBible = await Bible.findOneAndUpdate(
      {
        version: filter.version.toUpperCase(),
        chapter: filter.chapter,
        book: filter.book.toUpperCase(),
        verse: filter.verse,
      },
        updateBasket,
      { new: true, runValidators: true }
    )
 

    return updateBible
  }

  getBible = async (
    filter: Partial<bibleUploadPayloadType>
  ): Promise<Promise<bibleUploadPayloadType>[]> => {
    const basket: Partial<bibleUploadPayloadType> = { version: filter.version }

    if (filter.book) basket.book = filter.book
    if (filter.chapter && filter.chapter !== 0)
      basket.chapter = Number(filter.chapter)
    if (filter.verse) basket.verse = Number(filter.verse)

    const bible = await Bible.find(basket).sort('verse')
    return bible
  }

  deleteBible = async (
    filter: Partial<bibleUploadPayloadType>
  ): Promise<string> => {
    const basket: Partial<bibleUploadPayloadType> = { version: filter.version }

    if (filter.book) basket.book = filter.book
    if (filter.chapter) basket.chapter = Number(filter.chapter)
    if (filter.verse) basket.verse = Number(filter.verse)
    const deleteBible = await Bible.deleteMany(basket)
    return 'Bible Deleted'
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
  textSearch = async (
    searchTerm: string
  ): Promise<Promise<bibleUploadPayloadType>[]> => {
    const results = await Bible.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)

    return results
  }
}
const bibleServices = new BibleServices()
module.exports = bibleServices
