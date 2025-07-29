require('dotenv').config()
const { nanoid } = require('nanoid')

const { pool } = require('@src/db/index')

type UserType = {
  id: string
  username: string
  email: string
  password: string
}

console.log(process.env.PG_URI)

const createUser = async ({ username, email, password }: Omit<UserType, 'id'>): Promise<UserType> => {
  const result = await pool.query(
    `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [username, email, password]
  )

  // Explicitly cast the row to your UserType
  return result.rows[0] as UserType
}

const getAllUsers = async (): Promise<UserType[]> => {
  const getUsers = await pool.query('SELECT * from users')
  return getUsers.rows as UserType[]
}

const run = async () => {
  try {
    const newUser = await createUser({
      username: 'codebro',
      email: 'codebro@abc.com',
      password: '123456'
    })

    console.log('Created user:', newUser)
  } catch (err) {
    console.error('Error creating user:', err)
  }
}
run()
// getAllUsers().then((user) => console.log(user))

const id = nanoid()

console.log(id)
