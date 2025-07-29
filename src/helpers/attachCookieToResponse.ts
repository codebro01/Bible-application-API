const {createJWT} = require('@src/helpers/jwt');
import type { PayloadType } from "@src/types/global";
import type { Request, Response } from "express";

export const attachCookieToResponse = ({ user }: {user: PayloadType}) => {
 return (req: Request, res: Response) =>{
     const token = createJWT({ payload: user })
     res.cookie('token', token, {
       httpOnly: true,
       // secure: process.env.NODE_ENV === "production",
       secure: true,
       sameSite: 'none',
       maxAge: 1000 * 60 * 60 * 24, // 24 hrs 
     })
     return token
 }
}
