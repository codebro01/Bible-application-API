import type {PayloadType} from '@src/types/global'
 const tokenUser = (user: PayloadType) => {
  return {
    username: user.username,
    email: user.email,
    role: user.role,
    id: user.id,
  }
}

module.exports = tokenUser
