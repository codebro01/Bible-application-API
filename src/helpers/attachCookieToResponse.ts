const {createJWT} = require('@src/helpers/jwt');
import type { PayloadType } from "@src/types/global";
import type { Request, Response } from "express";

 const attachCookieToResponse = (res:Response , { user }: {user: PayloadType}) => {
 
    try {
      const token = createJWT({ payload: user })
       res.cookie('token', token, {
         httpOnly: true,
         // secure: process.env.NODE_ENV === "production",
         secure: true,
         sameSite: 'none',
         maxAge: 1000 * 60 * 60 * 24, // 24 hrs 
       })
       return token
    } catch (error) {
      console.log(error)
    }
 
}
module.exports = attachCookieToResponse
