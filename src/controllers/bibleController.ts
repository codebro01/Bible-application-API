const BibleServices = require('@src/services/bibleServices')
import type { Request, Response, NextFunction } from 'express'
import { version } from 'mongoose'
const { BadRequestError, NotAuthenticatedError } = require('@src/errors')
const safeValidate = require('@src/helpers/zodInputValidator')
const { loginSchema, signUpSchema } = require('@src/zod/zodSchema')
import type { bibleUploadPayloadType, CustomReqType } from '@src/types/global'

const uploadBible = async (req: CustomReqType, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    await BibleServices.uploadBible(file, req.user)
    res.status(200).json({ message: 'done' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
const editBible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body

    if (!data.filter && !data.newData)
      return next(
        new BadRequestError('Filter and new Data payload is missing ')
      )
    const filter: Omit<bibleUploadPayloadType, '_id' | 'user' | 'text'> =
      data.filter
    const newData: Partial<bibleUploadPayloadType> = data.newData

    await BibleServices.editBible(filter, newData )
    res.status(200).json({ message: 'Bible updated Succeesfully' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
const getBible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {book, chapter, verse, version} = req.query

    console.log(req.query)
    if (
      typeof version !== 'string' ||
      typeof book !== 'string' ||
      typeof chapter !== 'string'
    )
      return next(
        new BadRequestError(
          'Please select a version and at least one other filter types '
        )
      )
    const filter: Omit<bibleUploadPayloadType, '_id' | 'user' | 'text' | 'verse'> = {
      book: book.toUpperCase(),
      chapter: Number(chapter),
      version: version.toUpperCase(),
    }
      

    const bible = await BibleServices.getBible(filter)
    res.status(200).json({ data: bible, message: 'Request Successful' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
const deleteBible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
if (!data.filter)
  return next(new BadRequestError('Filter is missing!!! '))
    const filter: Omit<bibleUploadPayloadType, '_id' | 'user' | 'text'> =
      data.filter

    await BibleServices.deleteBible(filter)
    res.status(200).json({ message: 'Bible Deleted Succeesfully' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
const countTotalTranslations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bible = await BibleServices.countTotalTranslations()
    res.status(200).json({ data: bible, message: 'Total Translations counted' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

const countTotalBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bible = await BibleServices.countTotalBooks()
    res.status(200).json({ data: bible, message: 'Total books counted' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
const countTotalUniqueVerses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bible = await BibleServices.countTotalUniqueVerses()
    res.status(200).json({ data: bible, message: 'Total verses counted' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
const textSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const { searchTerm } = req.query

     if (!searchTerm)
       return next(
         new BadRequestError('Filter and new Data payload is missing ')
       )
    const bible = await BibleServices.textSearch(searchTerm)
    res.status(200).json({ data: bible, message: 'Text search successful' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

module.exports = {
  uploadBible,
  editBible,
  getBible,
  deleteBible,
  countTotalTranslations,
  countTotalBooks,
  countTotalUniqueVerses,
  textSearch,
}
