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


