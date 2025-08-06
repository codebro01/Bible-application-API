require('dotenv').config()
require('module-alias/register')
const { connectDB } = require('@src/db')
import type { Request, Response } from 'express'
const express = require('express')
const cookieParse = require('cookie-parser')
const app = express()
const PORT = process.env.PORT || 3500
const cors = require('cors')
const customErrorHandler = require('@src/middlewares/errorMiddleware')
const notFoundMiddleware = require('@src/middlewares/notFoundMiddleware')
const {authRouter, bibleRouter} = require('@src/routes')

app.use(
  cors({
    origin: ['http://localhost:3500', 'http://localhost:3000'],
    credentials: true,
    methods: ['POST', 'PATCH', 'DELETE', 'GET'],
  })
)



app.use(express.json())
app.use(cookieParse());
// ! routes

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to church application api')
})
// app.use('/dashboard', )
app.use('/api/v1/auth', authRouter )
app.use('/api/v1/bible', bibleRouter )

app.use(notFoundMiddleware)
app.use(customErrorHandler)

const connection = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log('App connected on PORT: ' + PORT + ' 🚀')
    })
  } catch (error) {
    console.log(error)
  }
}

connection()
