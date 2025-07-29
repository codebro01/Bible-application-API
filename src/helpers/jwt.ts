const jwt = require('jsonwebtoken')
import type { PayloadType } from '@src/types/global'

const createJWT = ({ payload }: { payload: PayloadType }) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' })

const verifyJWT = ({ token }: { token: string }) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

module.exports = {createJWT, verifyJWT}
