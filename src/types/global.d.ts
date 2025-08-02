import type { Response, Request } from 'express'

export type PayloadType = {
  username: string
  email: string
  role: string
  id: string
}

export type CreateUserPayload = {
  username: string
  email: string
  password: string
  role?: string[]
  verified?: boolean
}

export type bibleUploadPayloadType = {
  _id: string
  text: string
  user: string
  book: string
  chapter: number
  verse: number
  version: string
}

export interface VerseType {
  number: number
  text: string
}

export interface ChapterType {
  number: number
  verses: Verse[]
}

export interface ParsedBibleType {
  book: string
  chapters: Chapter[]
  version: string
}

export type BufferedDocFile = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export type BibleUploadResponseFromServicesType = {
  book: string
}

export interface CustomReqType extends Request {
  user: PayloadType
}
