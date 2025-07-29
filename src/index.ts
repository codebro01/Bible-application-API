
require('dotenv').config()
const { connectDB } =  require("@src/db");
import type {Request, Response} from 'express'
const express =  require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const cors = require('cors');
const customErrorHandler = require('@src/middlewares/errorMiddleware');
const notFoundMiddleware = require('@src/middlewares/notFoundMiddleware');




app.use(cors({
  origin: ['http://localhost:3500'],
  credentials: true,
  methods: ['POST', 'PATCH', 'DELETE', 'GET']
}));




// ! routes 

app.get('/',(req: Request, res: Response) => {
  res.send('Welcome to church application api')
})
// app.use('/dashboard', )
// app.use('/', )


app.use(notFoundMiddleware)
app.use(customErrorHandler)




const connection = async () => {
  try {
    await connectDB();
  
    app.listen(PORT, () => {
      console.log('App connected on PORT: ' + PORT + ' 🚀')
    })
  } catch (error) {
    console.log(error)
  }
}

connection();