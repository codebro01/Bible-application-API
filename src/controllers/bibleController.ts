const BibleServices = require('@src/services/bibleServices')
import type { Request, Response, NextFunction } from 'express'
const { BadRequestError, NotAuthenticatedError } = require('@src/errors')
const safeValidate = require('@src/helpers/zodInputValidator')
const { loginSchema, signUpSchema } = require('@src/zod/zodSchema')



const uploadBible = async (req: Request, res:Response, next:NextFunction) => {
    try {
            console.log(req.user)
            const file = req.file;
            console.log("typeof of bibleServices", typeof BibleServices)
            await BibleServices.uploadBible(file, req.user)
        res.status(200).json({message: 'done'})
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

module.exports  = {uploadBible}
