const multer = require('multer');
import type { Request } from "express";
import type { FileFilterCallback }  from  'multer';



const storage = multer.memoryStorage();




const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only .doc and .docx files are allowed!'))
  }
}

const upload = multer({ storage, fileFilter });

module.exports  = upload
