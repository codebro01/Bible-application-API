import type {PayloadType} from '@src/types/global';


interface extendedPayloadType extends PayloadType {
  _id: number
}
 const tokenUser = (user: extendedPayloadType) => {
   return {
     username: user.username,
     email: user.email,
     role: user.role,
     id: user._id,
   }
 }

module.exports = tokenUser
