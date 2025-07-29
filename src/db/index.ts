import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pgsql_tut',
  password: '@WebStacker623',
  port: 5432,
})
